import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import {
  User as UserIcon,
  Code,
  BookOpen,
  LogOut,
  Settings,
  MessageCircle,
  UserCircle,
  Shield,
} from "lucide-react";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <header className="border-b-2 border-primary/20 bg-gradient-to-r from-background via-card to-background backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container flex h-16 items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary/50">
                <Code className="h-4 w-4 text-primary-foreground group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                SQLExpert
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Button
              variant="ghost"
              className={`${
                location.pathname === "/"
                  ? "text-foreground font-semibold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              } transition-all duration-300 hover:scale-105`}
              onClick={() => navigate("/")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>
            <Button
              variant="ghost"
              className={`${
                location.pathname === "/problems"
                  ? "text-foreground font-semibold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              } transition-all duration-300 hover:scale-105`}
              onClick={() => navigate("/problems")}
            >
              Problems
            </Button>
            <Button
              variant="ghost"
              className={`${
                location.pathname === "/contact"
                  ? "text-foreground font-semibold border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              } transition-all duration-300 hover:scale-105`}
              onClick={() => navigate("/contact")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
            {isAuthenticated && user?.role === "admin" && (
              <Button
                variant="ghost"
                className={`${
                  location.pathname === "/admin"
                    ? "text-foreground font-semibold border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                } transition-all duration-300 hover:scale-105`}
                onClick={() => navigate("/admin")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 font-semibold"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-primary-foreground border-0 shadow-lg hover:shadow-[0_0_20px_rgba(77,144,254,0.5)] transition-all duration-300 hover:scale-110 font-semibold group"
                  onClick={() => setRegisterOpen(true)}
                >
                  <UserIcon className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onForgotPassword={() => setForgotPasswordOpen(true)}
      />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </>
  );
}
