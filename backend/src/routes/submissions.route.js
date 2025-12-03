import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  runSQL,
  submitSQL,
  getMySubmission,
  getSolvedSlugs,
} from "../controllers/submission.controller.js";

const router = Router();
router.post("/run", runSQL);
router.post("/submit", protectRoute, submitSQL);
router.get("/:slug", protectRoute, getMySubmission);
router.get("/solved", protectRoute, getSolvedSlugs);
export default router;
