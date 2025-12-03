import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchProfile, logoutUser } from "@/store/slices/authSlice";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AIAnswer from "./pages/AIAnswer";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔑 Verify token validity on app load
  useEffect(() => {
    const verifySession = async () => {
      try {
        await dispatch(fetchProfile());
      } catch {
        dispatch(logoutUser());
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, [dispatch]);

  if (checkingAuth) {
    // 🌀 Show loader while verifying
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="animate-pulse text-lg font-medium">Checking session...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problem/:slug" element={<Problem />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/ai/:slug" element={<AIAnswer />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
