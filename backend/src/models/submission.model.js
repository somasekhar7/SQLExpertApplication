// models/submission.model.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      index: true,
      required: true,
    },
    slug: { type: String, index: true }, // denormalized for quick lookup
    lastSQL: { type: String, default: "" }, // latest attempt (for restoring editor)
    acceptedSQL: { type: String, default: "" }, // latest AC solution
    status: {
      type: String,
      enum: ["passed", "failed", "error"],
      required: true,
    },
    cases: { type: [Object], default: [] }, // judge details
    pointsAwarded: { type: Number, default: 0 }, // total points for this question
    passedAt: { type: Date },
    attempts: { type: Number, default: 1 },
  },
  { timestamps: true }
);

SubmissionSchema.index({ user: 1, slug: 1 }, { unique: true, sparse: true }); // one record per user/question

export default mongoose.model("Submission", SubmissionSchema);
