// controllers/ai.controller.js
import OpenAI from "openai";
import Question from "../models/question.model.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIHelp(req, res) {
  try {
    const { slug } = req.params;
    const { question: userQuestion } = req.body || {};

    const q = await Question.findOne({ slug }).lean();
    if (!q) return res.status(404).json({ message: "Question not found" });

    const askText = userQuestion || "Explain this question.";

    // STRICT JSON prompt
    const systemPrompt = `
You are an expert SQL instructor and you ALWAYS respond in valid JSON.
No Markdown. No backticks. No text outside the JSON object.

Your JSON MUST follow this exact structure:

{
  "title": "",
  "explanation": "",
  "steps": "",
  "sampleSQL": "",
  "notes": ""
}

Rules:
- "explanation": A clear, simple explanation of what the question wants. Beginner-friendly.
- "steps": A numbered list (as plain text) explaining the thought process, not the SQL itself.
- "sampleSQL": A valid SQLite-compatible SQL query that solves the problem. Do NOT reveal the official solution from the database unless the user directly asks for the official solution.
- "notes": Additional helpful small tips (optional), like mistakes to avoid.
- Do NOT invent extra tables. Only use the setupSQL schema.
- Do NOT include markdown formatting.
- Output only the JSON object, nothing else.
`;

    const userPrompt = `
Question Title: ${q.title}
Difficulty: ${q.difficulty}
Category: ${q.category}
Description: ${q.description}

Table Schema (from setupSQL):
${q.setupSQL}

Hints:
${q.hints?.join("\n") || "(none)"}

User asked: ${askText}
`;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const json = completion.choices[0].message;

    return res.json(JSON.parse(json.content));
  } catch (err) {
    console.error("AI Help Error:", err);
    return res.status(500).json({
      message: "AI help failed",
      error: err.message,
    });
  }
}
