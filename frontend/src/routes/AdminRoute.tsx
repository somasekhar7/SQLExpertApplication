import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks";

export default function AdminRoute() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
