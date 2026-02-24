import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthenticateContext";

export const ProtectedRoute = () => {
    const { adminInfo, isLoading } = useAuth();

    if (isLoading) {
        return null; 
    }

    if (!adminInfo) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};