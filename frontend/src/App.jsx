import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Toolbar } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <Navbar />

      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Toolbar />

        <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/current-student" element={<CurrentStudent />} />
            <Route path="/prospective-student" element={<ProspectiveStudent />} />

            <Route path="/admin-login" element={<AdminLogin />} />

            {/* protected admin route */}
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