import "dotenv/config.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Question from "../models/question.model.js";

const dataDir = path.join(process.cwd(), "src", "data");

// --- FIX: Minimal schema extractor ---
function extractSchemaFromSetupSQL(sql) {
  const lines = sql.split("\n");
  const result = [];

  for (let line of lines) {
    line = line.trim();
    if (line.toUpperCase().startsWith("CREATE TABLE")) {
      const parts = line.split(/\s+/);
      const tableName = parts[2].replace(/[\(\);]/g, "");
      result.push(`Table: ${tableName}`);
    }
  }
  return result;
}

function flattenQuestionsFromFile(content) {
  if (Array.isArray(content)) return content;

  const result = [];
  for (const [category, arr] of Object.entries(content)) {
    if (!Array.isArray(arr)) continue;
    for (const q of arr) {
      result.push({
        ...q,
        category: q.category || category,
      });
    }
  }
  return result;
}

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    const files = process.argv[2]
      ? [process.argv[2]]
      : fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(dataDir, file), "utf-8");
      const content = JSON.parse(raw);
      const questions = flattenQuestionsFromFile(content);

      for (const q of questions) {
        if (!q.slug) q.slug = q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (!q.schemaPreview?.length) {
          q.schemaPreview = extractSchemaFromSetupSQL(q.setupSQL || "");
        }

        await Question.findOneAndUpdate({ slug: q.slug }, q, { upsert: true });

        console.log(`✅ Upserted: ${q.title}`);
      }
    }

    console.log("🎉 Seeding done.");
  } catch (e) {
    console.error("❌ Seeding failed:", e);
  } finally {
    await mongoose.disconnect();
  }
}

seedAll();
