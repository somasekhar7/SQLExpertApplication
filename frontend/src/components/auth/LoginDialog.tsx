import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GoogleLogin } from "@react-oauth/google"; // ✅ Correct Google Component
import { googleLogin, loginUser } from "@/store/slices/authSlice";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onForgotPassword?: () => void;
}

export const LoginDialog = ({
  open,
  onOpenChange,
  onForgotPassword,
}: LoginDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  // 🔹 Local Email/Password Login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginUser(email, password));

    setTimeout(() => {
      onOpenChange(false);
      setEmail("");
      setPassword("");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 bg-background border border-border">
        <div className="space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-3xl font-bold text-foreground">
              Sign In
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Welcome back! Continue your SQL journey
            </p>
          </DialogHeader>

          {/* ---------------------------------------- */}
          {/*  GOOGLE LOGIN BUTTON (WORKING)           */}
          {/* ---------------------------------------- */}

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const idToken = credentialResponse.credential;

                if (typeof idToken !== "string") {
                  toast.error("Google did not return ID token");
                  return;
                }

                dispatch(googleLogin(idToken)); // Send to backend
                onOpenChange(false);
              }}
              onError={() => toast.error("Google Login Failed")}
              useOneTap={false}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* ---------------------------------------- */}
          {/*  EMAIL/PASSWORD LOGIN FORM               */}
          {/* ---------------------------------------- */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="h-11 border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="h-11 pr-10 border-border focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary-dark transition-colors shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onForgotPassword?.();
                }}
                className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors font-medium"
              >
                Forgot password?
              </button>

              <div className="text-xs text-muted-foreground bg-muted px-4 py-2 rounded-md">
                Demo: john@example.com / password123
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
