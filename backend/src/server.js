import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import questionsRoutes from "./routes/questions.route.js";
import submissionsRoutes from "./routes/submissions.route.js";
import ticketRoutes from "./routes/ticket.route.js";

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ quiet: true });

// Middleware to parse JSON bodies
app.use(express.json({ limit: "15mb" })); // allows you to parse the body of the request.
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);
app.set("trust proxy", 1);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/tickets", ticketRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
