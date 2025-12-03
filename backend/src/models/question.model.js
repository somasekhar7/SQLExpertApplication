import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Case" },
    setupSQL: { type: String }, // optional override (else use root setupSQL)

    // For normal SELECT problems
    expectedRows: { type: [mongoose.Schema.Types.Mixed], default: [] },

    ordered: { type: Boolean, default: false },
    maxRows: { type: Number, default: 1000 },

    // NEW: advanced features
    checkType: {
      type: String,
      enum: ["final_table", "error", "rows_count", "statement"],
      default: "final_table",
    },
    table: { type: String }, // e.g. "employees" – which table to read
    expectedError: { type: String }, // for trigger/transaction error cases
    expectedRowsCount: { type: Number },
    userSQL: { type: String }, // SQL to run AFTER student SQL (e.g. insert to fire trigger)
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      index: true,
      required: true,
    },
    category: { type: String, default: "General", index: true },
    tags: { type: [String], default: [] },

    description: { type: String, required: true },
    hints: { type: [String], default: [] },
    schemaPreview: { type: [String], default: [] },

    setupSQL: { type: String, required: true },
    solutionSQL: { type: String }, // never sent to client
    testCases: { type: [TestCaseSchema], required: true },

    // NEW: whether user is supposed to write only SELECT or can write DDL/DML
    mode: {
      type: String,
      enum: ["read", "write"],
      default: "read",
    },

    points: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
