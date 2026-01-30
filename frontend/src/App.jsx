import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CurrentStudent from "./pages/CurrentStudent";
import NewStudent from "./pages/NewStudent";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Navbar />

      {/* Page content below the fixed navbar */}
      <Box sx={{ pt: "64px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/current-student" element={<CurrentStudent />} />
          <Route path="/new-student" element={<NewStudent />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
}
