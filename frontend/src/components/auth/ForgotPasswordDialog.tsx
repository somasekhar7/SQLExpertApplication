import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/api/axiosInstance";
import axios, { AxiosError } from "axios"; // 🔥 CHANGED HERE (added AxiosError)

// ------------------------------------------
// Backend error response type
// ------------------------------------------
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog = ({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------------------------------
  // 🔥 CHANGED: Now using real backend + fully typed error handler
  // -----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);

      // 🔥 REAL BACKEND CALL
      await api.post("/auth/forgot-password", { email });

      toast.success("Temporary password sent! Redirecting...");

      // Close dialog
      onOpenChange(false);
      setEmail("");

      // Navigate after slight delay
      setTimeout(() => navigate("/reset-password"), 800);
    } catch (error) {
      // ---------------------------------------
      // 🔥 CHANGED: Replaced "any" with proper error type
      // ---------------------------------------
      let message = "Error sending reset link";

      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorResponse>;
        message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Server error";
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-8 bg-background border border-border">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your email, and we'll send you a temporary password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              className="h-11 border-border focus-visible:ring-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary-dark transition-colors font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
