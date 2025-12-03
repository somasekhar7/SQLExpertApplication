import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "@/api/axiosInstance";
import axios, { AxiosError } from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();

  // 🔥 Backend-required fields
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------
  // REAL BACKEND CALL
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !tempPassword || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post(
        "/auth/reset-password",
        {
          email,
          tempPassword,
          newPassword: password,
          confirmPassword,
        },
        { withCredentials: true }
      );

      toast.success("Password reset successfully! Please login.");
      navigate("/");
    } catch (error) {
      let message = "Failed to reset password";

      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string; error?: string }>;
        message =
          err.response?.data?.message || err.response?.data?.error || message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50 dark:shadow-glow">
        <CardHeader className="space-y-3 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="w-fit -ml-2 mb-2 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter the temporary password sent to your email and choose a new
            password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-2 border-border focus-visible:border-primary"
                disabled={isLoading}
              />
            </div>

            {/* TEMPORARY PASSWORD FIELD */}
            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-semibold">
                Temporary Password
              </Label>
              <Input
                id="token"
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter temporary password from email"
                disabled={isLoading}
                className="h-11 border-2 border-border focus-visible:border-primary"
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="h-11 pr-10 border-2 border-border focus-visible:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className="h-11 pr-10 border-2 border-border focus-visible:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
