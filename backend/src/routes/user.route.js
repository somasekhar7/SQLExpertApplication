import express from "express";
import {
  addProblemActivity,
  getProfile,
  updateProfile,
  leaderboard,
  getProgressStats,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Record problem completion (protected route)
router.post("/add-activity", protectRoute, addProblemActivity);
router.get("/profile", protectRoute, getProfile);
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profileImage"),
  updateProfile
);
router.get("/leaderboard", leaderboard);
router.get("/progress", protectRoute, getProgressStats);

export default router;
