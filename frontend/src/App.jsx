import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, Toolbar } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CurrentStudent from "./pages/CurrentStudent";
import NewStudent from "./pages/NewStudent";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CssBaseline />

      <Navbar />
      <Toolbar /> {/* offsets fixed AppBar height */}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, backgroundColor: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/current-student" element={<CurrentStudent />} />
          <Route path="/new-student" element={<NewStudent />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}
