import Question from "../models/question.model.js";
import Submission from "../models/submission.model.js";

// GET /api/questions/list-questions?difficulty=&category=&tag=
export const listQuestions = async (req, res) => {
  try {
    const { difficulty, category, tag } = req.query;

    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const docs = await Question.find(filter)
      .select("title slug difficulty category tags createdAt points mode")
      .sort({ difficulty: 1, createdAt: 1 })
      .lean();

    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/questions/:slug
export const getQuestion = async (req, res) => {
  try {
    const { slug } = req.params;

    const q = await Question.findOne({ slug }).lean();
    if (!q) return res.status(404).json({ message: "Question not found" });

    // Do not leak solve/test/DDL info to frontend
    const { solutionSQL, testCases, ...publicDoc } = q;

    const tcMeta = (testCases || []).map((tc) => ({
      name: tc.name,
      ordered: tc.ordered,
      maxRows: tc.maxRows,
      checkType: tc.checkType || "final_table",
    }));

    let savedSQL = "";
    if (req.user?._id) {
      const sub = await Submission.findOne({
        user: req.user._id,
        slug,
      }).lean();

      if (sub?.lastSQL) savedSQL = sub.lastSQL;
    }

    res.json({
      ...publicDoc,
      testCases: tcMeta,
      savedSQL,
      // send mode + schemaPreview to help frontend/editor
      setupSQL: q.setupSQL,
      mode: publicDoc.mode,
      schemaPreview: publicDoc.schemaPreview,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET /api/questions/:slug/solution
export const getSolution = async (req, res) => {
  try {
    const { slug } = req.params;

    const q = await Question.findOne({ slug })
      .select("title slug difficulty category solutionSQL")
      .lean();

    if (!q) return res.status(404).json({ message: "Question not found" });

    res.json({
      slug: q.slug,
      title: q.title,
      difficulty: q.difficulty,
      category: q.category,
      solutionSQL: q.solutionSQL,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
