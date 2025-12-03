import { Router } from "express";
import {
  listQuestions,
  getQuestion,
  getSolution,
} from "../controllers/questions.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { getAIHelp } from "../controllers/ai.controller.js";

const router = Router();

router.get("/list-questions", listQuestions);
router.post("/:slug/ai-help", protectRoute, getAIHelp);

router.get("/:slug", getQuestion);
router.get("/:slug/solution", protectRoute, getSolution);

export default router;
