import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SkipLink from "./components/SkipLink";
import AccessibilityBar from "./components/AccessibilityBar";

import Home from "./pages/Home";
import CurrentStudent from "./pages/CurrentStudent";
import ProspectiveStudent from "./pages/ProspectiveStudent";
import Admin from "./pages/Admin";
import AdminLogin from "./components/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AccessibilityStatement from "./pages/AccessibilityStatement";

const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function getPageTitle(pathname) {
  const titles = {
    "/": "Home",
    "/current-student": "Current Running Start Students",
    "/future-student": "Future Running Start Students",
    "/admin-login": "Admin Login",
    "/admin": "Admin Dashboard",
    "/accessibility": "Accessibility Statement",
  };

  return titles[pathname] || "Page Not Found";
}

function RouteAnnouncer() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} | Running Start Digital Portal`;
  }, [pageTitle]);

  return (
    <Box aria-live="polite" aria-atomic="true" sx={srOnlyStyles}>
      {pageTitle} page loaded
    </Box>
  );
}

export default function App() {
  return (
    <>
      <CssBaseline />
      <SkipLink />
      <RouteAnnouncer />
      <AccessibilityBar />
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, sm: 80 } }} />

        <Box
          component="main"
          id="main-content"
          role="main"
          tabIndex={-1}
          sx={{
            flex: "1 0 auto",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/current-student" element={<CurrentStudent />} />
            <Route path="/future-student" element={<ProspectiveStudent />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/accessibility" element={<AccessibilityStatement />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <Footer />
      </Box>

      <Analytics />
    </>
  );
}
