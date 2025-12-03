// controllers/submission.controller.js
import Question from "../models/question.model.js";
import Submission from "../models/submission.model.js";
import {
  isQuerySafe,
  normalizeRows,
  sortRowsForCompare,
  runInIsolatedSQLite,
} from "../config/sqlSandbox.js";
import User from "../models/user.model.js";

// Fallback points based on difficulty if q.points is not set
const DIFFICULTY_POINTS = {
  Easy: 10,
  Medium: 15,
  Hard: 20,
};

// ---------------------- RUN SQL (no auth required) ----------------------
// POST /api/submissions/run
export const runSQL = async (req, res) => {
  try {
    const { slug, userSQL } = req.body;
    if (!slug || !userSQL) {
      return res.status(400).json({ message: "slug and userSQL are required" });
    }

    const q = await Question.findOne({ slug }).lean();
    if (!q) return res.status(404).json({ message: "Question not found" });

    const mode = q.mode || "read";

    // validate SQL based on the question mode (read / write / etc.)
    if (!isQuerySafe(userSQL, mode)) {
      return res.status(400).json({
        message:
          mode === "read"
            ? "Disallowed SQL in Run. Use a single SELECT/WITH query."
            : "Disallowed SQL for this mode. Certain engine-level commands are blocked.",
      });
    }

    const { rows } = runInIsolatedSQLite({
      setupSQL: q.setupSQL,
      userSQL,
      maxRows: 1000,
    });

    const normalized = normalizeRows(rows || []);

    return res.json({
      success: true,
      columns: normalized[0] ? Object.keys(normalized[0]) : [],
      rows: normalized,
    });
  } catch (e) {
    // We keep success=false but HTTP 200 so the frontend can show SQL errors nicely
    return res.status(200).json({ success: false, error: e.message });
  }
};

// ---------------------- GET MY SUBMISSION ----------------------
// GET /api/submissions/:slug
export const getMySubmission = async (req, res) => {
  const { slug } = req.params;
  const sub = await Submission.findOne({ user: req.user._id, slug }).lean();
  res.json(sub || null);
};

// ---------------------- UPSERT SUBMISSION (helper) ----------------------
async function upsertSubmission({
  userId,
  q,
  lastSQL,
  status,
  cases,
  pointsAwarded,
}) {
  const now = new Date();

  const existing = await Submission.findOne({
    user: userId,
    slug: q.slug,
  });

  if (!existing) {
    // First time they ever submit for this question
    const doc = await Submission.create({
      user: userId,
      question: q._id,
      slug: q.slug,
      lastSQL,
      acceptedSQL: status === "passed" ? lastSQL : "",
      status,
      cases,
      pointsAwarded: status === "passed" ? pointsAwarded : 0,
      passedAt: status === "passed" ? now : null,
      attempts: 1,
    });

    return doc.toObject();
  } else {
    // Update existing submission
    existing.lastSQL = lastSQL;
    existing.status = status;
    existing.cases = cases;
    existing.attempts += 1;

    if (status === "passed") {
      // Always keep the most recent PASSED solution
      existing.acceptedSQL = lastSQL;
      existing.passedAt = now;

      // Caller ensures pointsAwarded > 0 only on FIRST AC
      if (pointsAwarded > 0) {
        existing.pointsAwarded += pointsAwarded;
      }
    }

    await existing.save();
    return existing.toObject();
  }
}

// ---------------------- SUBMIT SQL (graded) ----------------------
// POST /api/submissions/submit
export const submitSQL = async (req, res) => {
  try {
    const { slug, userSQL } = req.body;
    if (!slug || !userSQL) {
      return res.status(400).json({ message: "slug and userSQL are required" });
    }

    // must be logged in
    if (!req.user?._id) {
      return res.status(401).json({ message: "Login required to submit." });
    }

    const q = await Question.findOne({ slug }).lean();
    if (!q) return res.status(404).json({ message: "Question not found" });

    const mode = q.mode || "read";

    if (!isQuerySafe(userSQL, mode)) {
      return res.status(400).json({
        message:
          mode === "read"
            ? "Disallowed SQL. Use a single SELECT/WITH query."
            : "Disallowed SQL. Certain engine-level commands are blocked.",
      });
    }

    let allPassed = true;
    const caseResults = [];

    for (const tc of q.testCases) {
      const setup = tc.setupSQL || q.setupSQL;
      const checkType = tc.checkType || "final_table";

      let rows = [];
      let error = null;

      try {
        const dbResult = runInIsolatedSQLite({
          setupSQL: setup,
          userSQL, // run user's SQL against this test case DB
          maxRows: tc.maxRows || 1000,
        });
        rows = normalizeRows(dbResult.rows || []);
      } catch (err) {
        error = err;
      }

      let passed = false;

      if (checkType === "error") {
        // We expect an error
        if (!error) {
          passed = false;
        } else if (tc.expectedError) {
          passed = error.message.includes(tc.expectedError);
        } else {
          passed = true;
        }
      } else if (error) {
        // Unexpected error for any non-error test
        allPassed = false;
        caseResults.push({
          name: tc.name || "Case",
          passed: false,
          error: error.message,
          expectedSample: [],
          gotSample: [],
          diffCount: 0,
        });
        continue;
      } else if (
        checkType === "rows_count" &&
        typeof tc.expectedRowsCount === "number"
      ) {
        passed = rows.length === tc.expectedRowsCount;
      } else {
        // default: final_table check
        const expected = normalizeRows(tc.expectedRows || []);
        if (tc.ordered) {
          passed = JSON.stringify(rows) === JSON.stringify(expected);
        } else {
          passed =
            JSON.stringify(sortRowsForCompare(rows)) ===
            JSON.stringify(sortRowsForCompare(expected));
        }
      }

      if (!passed) allPassed = false;

      caseResults.push({
        name: tc.name || "Case",
        passed,
        error: error ? error.message : null,
        expectedSample: (tc.expectedRows || []).slice(0, 5),
        gotSample: rows.slice(0, 5),
        diffCount: Math.abs(
          (rows?.length || 0) - ((tc.expectedRows || [])?.length || 0)
        ),
      });
    }

    //  Scoring & user activity
    let pointsAwarded = 0;
    if (allPassed) {
      const basePoints = Number.isFinite(q.points)
        ? q.points
        : DIFFICULTY_POINTS[q.difficulty] || 0;

      const existing = await Submission.findOne({
        user: req.user._id,
        slug,
      });

      const alreadyPassed = !!existing?.acceptedSQL;

      if (!alreadyPassed && basePoints > 0) {
        pointsAwarded = basePoints;

        const user = await User.findById(req.user._id);
        // assuming you have these instance methods on User
        user.addActivity(q.title, basePoints, q.difficulty);
        user.updateStreak();
        await user.save();
      }
    }

    const submission = await upsertSubmission({
      userId: req.user._id,
      q,
      lastSQL: userSQL,
      status: allPassed ? "passed" : "failed",
      cases: caseResults,
      pointsAwarded: allPassed ? pointsAwarded : 0,
    });

    return res.status(200).json({
      status: allPassed ? "passed" : "failed",
      cases: caseResults,
      submission,
    });
  } catch (e) {
    console.error("submit error:", e);
    return res
      .status(500)
      .json({ status: "error", error: e.message, cases: [] });
  }
};

export const getSolvedSlugs = async (req, res) => {
  const subs = await Submission.find({
    user: req.user._id,
    acceptedSQL: { $ne: "" },
  }).select("slug");

  res.json({ slugs: subs.map((s) => s.slug) });
};
