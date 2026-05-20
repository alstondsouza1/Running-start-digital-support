import { Box, CircularProgress, Typography } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute() {
  const { adminInfo, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          px: 2,
          textAlign: "center",
        }}
      >
        <CircularProgress aria-hidden="true" />
        <Typography>Checking admin access...</Typography>
      </Box>
    );
  }

  if (!adminInfo) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}