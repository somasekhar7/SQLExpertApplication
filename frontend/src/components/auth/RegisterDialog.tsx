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
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/hooks";
import { signupUser, googleLogin } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterDialog = ({ open, onOpenChange }: RegisterDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    await dispatch(signupUser(name, email, password, confirmPassword));

    toast.success("Account created successfully!");
    setIsLoading(false);

    onOpenChange(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 bg-background border border-border">
        <div className="space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-3xl font-bold text-foreground">
              Create Account
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Start mastering SQL today
            </p>
          </DialogHeader>

          {/* ---------------------------------------- */}
          {/*   GOOGLE SIGNUP BUTTON (CORRECT VERSION)  */}
          {/* ---------------------------------------- */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const idToken = credentialResponse.credential;

                if (!idToken) {
                  toast.error("Google did not return ID token");
                  return;
                }

                dispatch(googleLogin(idToken));
                toast.success("Signed up with Google!");
                onOpenChange(false);
              }}
              onError={() => toast.error("Google Signup Failed")}
              useOneTap={false}
            />
          </div>

          <div className="relative my-4">
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
          {/*              EMAIL SIGNUP FORM            */}
          {/* ---------------------------------------- */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  className="h-11 border-border focus-visible:ring-primary"
                />
              </div>

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
                    placeholder="At least 6 characters"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                    className="h-11 pr-10 border-border focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
