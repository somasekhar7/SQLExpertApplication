import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    responderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    responderName: String,
    message: { type: String, required: true },
    respondedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },

    category: {
      type: String,
      enum: ["Technical Issue", "Feature Request", "Billing", "Other"],
      default: "Other",
    },

    subject: { type: String, required: true },
    description: { type: String, required: true },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },

    responses: [responseSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
