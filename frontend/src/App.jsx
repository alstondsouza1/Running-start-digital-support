import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Toolbar } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SkipLink from "./components/SkipLink";

import Home from "./pages/Home";
import CurrentStudent from "./pages/CurrentStudent";
import ProspectiveStudent from "./pages/ProspectiveStudent";
import Admin from "./pages/Admin";
import AdminLogin from "./components/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <CssBaseline />
      <SkipLink />
      <Navbar />

      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Toolbar />

        <Box
          component="main"
          id="main-content"
          role="main"
          tabIndex={-1}
          sx={{ flexGrow: 1, backgroundColor: "#f5f5f5" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/current-student" element={<CurrentStudent />} />
            <Route path="/future-student" element={<ProspectiveStudent />} />

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </>
  );
}