// controllers/user.controller.js
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Question from "../models/question.model.js";
import Submission from "../models/submission.model.js";

// ---------- PROFILE ----------
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      streak: user.streak,
      role: user.role,
      points: user.points,
      problemsSolved: user.problemsSolved,
      recentActivity: user.recentActivity,
      achievements: user.getAchievements(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, email } = req.body;
    let profileImageUrl = null;

    // Check if a file is uploaded
    if (req.file) {
      // Convert buffer → base64 → Cloudinary
      const b64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "sql-master-profiles",
      });

      profileImageUrl = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName || undefined,
        email: email || undefined,
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        streak: updatedUser.streak,
        points: updatedUser.points,
        problemsSolved: updatedUser.problemsSolved,
        recentActivity: updatedUser.recentActivity,
      },
    });
  } catch (error) {
    console.log("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- ADD PROBLEM ACTIVITY ----------
export const addProblemActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { problemTitle, points } = req.body;

    user.addActivity(problemTitle, points);
    user.updateStreak();
    await user.save();

    res.json({
      message: "Problem recorded successfully",
      streak: user.streak,
      points: user.points,
      recentActivity: user.recentActivity,
    });
  } catch (error) {
    console.log("Error recording activity:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- LEADERBOARD ----------
export const leaderboard = async (_req, res) => {
  try {
    const top = await User.find()
      .select("fullName profileImage points problemsSolved")
      .sort({ points: -1, createdAt: 1 })
      .limit(20)
      .lean();

    res.json({ items: top });
  } catch (error) {
    console.log("Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------- Progress Stats ----------
export const getProgressStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalEasy = await Question.countDocuments({ difficulty: "Easy" });
    const totalMedium = await Question.countDocuments({ difficulty: "Medium" });
    const totalHard = await Question.countDocuments({ difficulty: "Hard" });

    const solvedSubs = await Submission.find({
      user: userId,
      status: "passed",
    }).populate("question", "difficulty");

    const counts = { Easy: 0, Medium: 0, Hard: 0 };

    solvedSubs.forEach((s) => {
      counts[s.question.difficulty]++;
    });

    res.json({
      easySolved: counts.Easy,
      mediumSolved: counts.Medium,
      hardSolved: counts.Hard,
      totalEasy,
      totalMedium,
      totalHard,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
