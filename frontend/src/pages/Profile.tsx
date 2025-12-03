// src/pages/Profile.tsx

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, EyeOff, Camera, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axiosInstance";
import axios, { AxiosError } from "axios";
import {
  fetchProfile,
  authSuccess,
  User,
  Achievement,
} from "@/store/slices/authSlice";

// Webcam
import Webcam from "react-webcam";

// ------------------- Backend Response Types -------------------

interface RecentActivity {
  title: string;
  pointsEarned: number;
  difficulty?: string;
  solvedAt: string;
}

interface Streak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

// ------------------- Component -------------------

const Profile = () => {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Editing controls
  const [isEditing, setIsEditing] = useState(false);

  // Name editing (split for UI)
  const [firstName, setFirstName] = useState(
    user?.fullName?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    user?.fullName?.split(" ").slice(1).join(" ") || ""
  );

  // File input reference (for upload)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Webcam UI
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Password form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ------------------- On Load -------------------

  useEffect(() => {
    if (!isAuthenticated) return navigate("/");
    dispatch(fetchProfile());
  }, [isAuthenticated, navigate, dispatch]);

  // ------------------- Error Helper -------------------

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const e = error as AxiosError<ApiErrorResponse>;
      return (
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Unexpected server error"
      );
    }
    return "Unknown error";
  };

  // ------------------- Upload From Device -------------------

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profileImage", file); // MUST match multer.single("profileImage")

      const res = await api.put<UpdateProfileResponse>(
        "/user/update-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(authSuccess(res.data.user));
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ------------------- Capture From Webcam -------------------

  const captureFromWebcam = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      // Convert base64 → file
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "webcam.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.put<UpdateProfileResponse>(
        "/user/update-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(authSuccess(res.data.user));
      toast.success("Photo captured & uploaded!");
      setShowWebcam(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ------------------- Save Profile Info -------------------

  const handleSaveProfile = async () => {
    const fullName = `${firstName} ${lastName}`.trim();

    if (!fullName) return toast.error("Name cannot be empty");

    try {
      const res = await api.put<UpdateProfileResponse>(
        "/user/update-profile",
        { fullName },
        { withCredentials: true }
      );

      dispatch(authSuccess(res.data.user));
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ------------------- Change Password -------------------

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("Fill all fields");

    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match");

    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      await api.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        { withCredentials: true }
      );

      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // ------------------- Backend Stats -------------------

  const problemsSolved = user?.problemsSolved ?? 0;
  const points = user?.points ?? 0;
  const streak = user?.streak?.current ?? 0;
  const longestStreak = user?.streak?.longest ?? 0;
  const ps = user?.progressStats;
  const achievements = user?.achievements ?? [];
  const recentActivities = user?.recentActivity ?? [];

  // ------------------- UI -------------------

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* ---------------- LEFT COLUMN ---------------- */}

          <div className="space-y-6 md:col-span-2">
            {/* Profile Header */}

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    {/* Avatar */}
                    <div className="relative group">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.profileImage} />
                        <AvatarFallback>
                          {user?.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Hidden input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleDeviceUpload}
                      />

                      {/* Hover options */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                        {/* Upload */}
                        <Camera
                          className="text-white cursor-pointer"
                          onClick={openFilePicker}
                        />

                        {/* Webcam */}
                        <RefreshCcw
                          className="text-white cursor-pointer"
                          onClick={() => setShowWebcam(true)}
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="mr-1 h-4" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ---------------- Webcam Modal ---------------- */}

            {showWebcam && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl space-y-4 w-[400px]">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="rounded-lg"
                  />

                  <div className="flex justify-between">
                    <Button onClick={captureFromWebcam}>Capture</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowWebcam(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{problemsSolved}</div>
                  <p className="text-sm text-muted-foreground">Solved</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{streak}</div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{points}</div>
                  <p className="text-sm text-muted-foreground">Points</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{longestStreak}</div>
                  <p className="text-sm text-muted-foreground">Longest</p>
                </CardContent>
              </Card>
            </div>

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={firstName}
                      disabled={!isEditing}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={lastName}
                      disabled={!isEditing}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user?.email} disabled />
                </div>

                {isEditing && <Button onClick={handleSaveProfile}>Save</Button>}
              </CardContent>
            </Card>

            {/* Password Reset */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <Label>Current Password</Label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                      />
                      <Eye
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      />
                    </div>
                  </div>

                  {/* New + Confirm */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>New Password</Label>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Confirm Password</Label>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.length ? (
                  recentActivities.map((a, i) => (
                    <div key={i} className="flex justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(a.solvedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>+{a.pointsEarned}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No activity yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ---------------- RIGHT COLUMN ---------------- */}

          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Easy</span>
                    <span>
                      {ps?.easySolved}/{ps?.totalEasy}
                    </span>
                  </div>
                  <Progress
                    value={ps ? (ps.easySolved / ps.totalEasy) * 100 : 0}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Medium</span>
                    <span>
                      {ps?.mediumSolved}/{ps?.totalMedium}
                    </span>
                  </div>
                  <Progress
                    value={ps ? (ps.mediumSolved / ps.totalMedium) * 100 : 0}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Hard</span>
                    <span>
                      {ps?.hardSolved}/{ps?.totalHard}
                    </span>
                  </div>
                  <Progress
                    value={ps ? (ps.hardSolved / ps.totalHard) * 100 : 0}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((a: Achievement) => (
                    <div
                      key={a.id}
                      className={`p-4 border rounded-xl flex flex-col items-center ${
                        !a.unlocked ? "opacity-50" : ""
                      }`}
                    >
                      <div className="text-2xl">🏆</div>
                      <p className="text-xs font-medium mt-2">{a.name}</p>
                      {!a.unlocked && (
                        <p className="text-xs text-muted-foreground">Locked</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card>
              <CardHeader>
                <CardTitle>Streak</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold">{streak}</div>
                <p className="text-muted-foreground">day streak</p>

                <div className="flex justify-center gap-2 mt-4">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-md flex items-center justify-center text-xs ${
                        i < streak
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
