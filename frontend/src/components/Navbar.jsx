import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/GRC_Logo_WHITE.png";

export default function Navbar() {
  const hoverColor = "#BBD416";

  const navButtonSx = {
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
      color: hoverColor,
      backgroundColor: "transparent",
    },
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          aria-label="Home"
          sx={{
            display: "flex",
            alignItems: "center",
            mr: 2,
            "& img": {
              height: 50,
              display: "block",
              transition: "filter 0.2s ease",
            },
            "&:hover img": {
              filter: "brightness(1.15)",
            },
          }}
        >
          <img src={Logo} alt="Green River College logo" />
        </Box>

        {/* Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Running Start Digital
        </Typography>

        {/* Nav Links */}
        <Button component={NavLink} to="/" end color="inherit" sx={navButtonSx}>
          Home
        </Button>

        <Button
          component={NavLink}
          to="/current-student"
          color="inherit"
          sx={navButtonSx}
        >
          Current Student
        </Button>

        <Button
          component={NavLink}
          to="/prospective-student"
          color="inherit"
          sx={navButtonSx}
        >
          Prospective Student
        </Button>

        <Button component={NavLink} to="/admin" color="inherit" sx={navButtonSx}>
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}
