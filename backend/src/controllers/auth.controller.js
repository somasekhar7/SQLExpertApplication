import { redis } from "../config/redis.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../config/sendEmail.js";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const isProduction = process.env.NODE_ENV === "production";

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ fullName, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      streak: user.streak,
      role: user.role,
      points: user.points,
      problemsSolved: user.problemsSolved,
    });
  } catch (err) {
    console.log("Signup error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Update streak
    user.updateStreak();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      streak: user.streak,
      role: user.role,
      points: user.points,
      problemsSolved: user.problemsSolved,
    });
  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------- GOOGLE LOGIN WITH DEBUG LOGS ----------
export const googleAuth = async (req, res) => {
  try {
    console.log("🔥 [BACKEND] Incoming Google login request body:", req.body);
    console.log("🔥 [BACKEND] typeof req.body:", typeof req.body);
    console.log("🔥 [BACKEND] typeof req.body.token:", typeof req.body?.token);

    const { token } = req.body;

    console.log("📥 [BACKEND] Extracted token:", token);

    if (!token) {
      console.error("❌ [BACKEND] ERROR: token is missing");
      return res.status(400).json({ message: "Google token missing" });
    }

    if (typeof token !== "string") {
      console.error(
        "❌ [BACKEND] ERROR: token is not a string. Received:",
        token
      );
      return res.status(400).json({ message: "Invalid Google token format" });
    }

    console.log("🔍 [BACKEND] Verifying ID token with Google...");

    // Verify the token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log("✅ [BACKEND] Google verification successful");

    // Extract user information from Google payload
    const payload = ticket.getPayload();

    console.log("📦 [BACKEND] Google Payload:", payload);

    const {
      sub: googleId,
      name: fullName,
      email,
      picture: profileImage,
    } = payload;

    if (!email) {
      console.error("❌ [BACKEND] ERROR: Google email missing from payload");
      return res.status(400).json({ message: "Google account has no email" });
    }

    console.log("🔎 [BACKEND] Searching for existing user:", email);

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      console.log("🆕 [BACKEND] No user found — creating new Google user");

      user = await User.create({
        googleId,
        fullName,
        email,
        profileImage,
        password: null,
      });
    } else if (!user.googleId) {
      console.log("🔗 [BACKEND] Existing user found — linking Google account");
      user.googleId = googleId;
      user.profileImage = profileImage;
      await user.save();
    } else {
      console.log("👤 [BACKEND] Existing Google user logging in");
    }

    // Update streak
    user.updateStreak();
    await user.save();

    console.log("🔥 [BACKEND] Generating tokens");

    // Generate new tokens and store refresh token in Redis
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    console.log("🚀 [BACKEND] Login success — sending user data");

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      streak: user.streak,
      role: user.role,
      points: user.points,
      problemsSolved: user.problemsSolved,
    });
  } catch (err) {
    console.error("❌ [BACKEND] Google Auth Error (message):", err.message);
    console.error("❌ [BACKEND] Google Auth FULL ERROR OBJECT:", err);

    res.status(401).json({
      message: "Invalid Google token",
      error: err.message,
    });
  }
};

// ---------- LOGOUT ----------
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------- REFRESH TOKEN ----------
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    console.log("Refresh error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------- FORGOT PASSWORD ----------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex"); // e.g. "9f3a1b2c"
    const hashed = await bcrypt.hash(tempPassword, 10);

    // Store token and expiration (10 minutes validity)
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send email
    const subject = "SQL Expert - Temporary Password Reset";
    const html = `
      <div style="font-family: Arial; line-height: 1.5;">
        <h3>Hi ${user.fullName},</h3>
        <p>You requested to reset your password.</p>
        <p>Your temporary password is:</p>
        <h2 style="color:#007bff;">${tempPassword}</h2>
        <p>This password is valid for <strong>10 minutes</strong>.</p>
        <p>Please use it to reset your password on SQL Expert.</p>
        <p>– The SQL Expert Team</p>
      </div>
    `;

    await sendEmail({ to: user.email, subject, html });

    res.json({ message: "Temporary password sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async (req, res) => {
  try {
    const { email, tempPassword, newPassword, confirmPassword } = req.body;

    if (!email || !tempPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() }, // check token not expired
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const isMatch = await bcrypt.compare(tempPassword, user.resetPasswordToken);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid temporary password" });

    // Update to new password
    user.password = newPassword;
    user.markModified("password"); // <-- guarantees hashing!

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
