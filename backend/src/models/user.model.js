import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, minlength: 6 },
    googleId: { type: String, default: null },
    profileImage: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // 🧠 Streak tracking
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },

    // 🎯 Points and activity
    points: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 },
    recentActivity: [
      {
        title: String,
        pointsEarned: Number,
        difficulty: String,
        solvedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// --- Password hash ---
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (!this.password) {
      // no password set (Google user) → skip hashing
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// --- Update streak ---
userSchema.methods.updateStreak = function () {
  const today = new Date();
  const lastActive = this.streak.lastActiveDate;
  if (!lastActive) this.streak.current = 1;
  else {
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) this.streak.current += 1;
    else if (diffDays > 1) this.streak.current = 1;
  }
  if (this.streak.current > this.streak.longest)
    this.streak.longest = this.streak.current;

  this.streak.lastActiveDate = today;
};

// --- Log a problem completion ---
userSchema.methods.addActivity = function (title, pointsEarned, difficulty) {
  this.recentActivity.unshift({
    title,
    pointsEarned,
    difficulty,
    solvedAt: new Date(),
  });
  if (this.recentActivity.length > 10) this.recentActivity.pop(); // keep last 10 only
  this.points += pointsEarned;
  this.problemsSolved += 1;
};

userSchema.methods.getAchievements = function () {
  return [
    {
      id: "first-solve",
      name: "First Solve",
      description: "Solve your first problem",
      unlocked: this.problemsSolved >= 1,
    },
    {
      id: "sql-apprentice",
      name: "Solve 10 problems",
      description: "Solve 10 total problems",
      unlocked: this.problemsSolved >= 10,
    },
    {
      id: "sql-pro",
      name: "Solve 50 problems",
      description: "Solve 50 problems",
      unlocked: this.problemsSolved >= 50,
    },
    {
      id: "streak-3",
      name: "3-day streak",
      description: "Maintain a 3-day streak",
      unlocked: this.streak.longest >= 3,
    },
    {
      id: "streak-7",
      name: "7-day streak",
      description: "Maintain a 7-day streak",
      unlocked: this.streak.longest >= 7,
    },
    {
      id: "points-100",
      name: "Earn 100 points",
      description: "Earn 100 points",
      unlocked: this.points >= 100,
    },
  ];
};

const User = mongoose.model("User", userSchema);
export default User;
