import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthenticateContext";

export default function ProtectedRoute() {
  const { adminInfo, isLoading } = useAuth();

  if (isLoading) return null;

  if (!adminInfo) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}