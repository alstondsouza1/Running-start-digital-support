import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/GRC_Logo_WHITE.png";

export default function Navbar() {
  const hoverColor = "#BBD416";

  const navButtonStyle = {
    "&:hover": {
      color: hoverColor,
    },
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar>
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ height: 50, marginRight: 16, transition: "filter 0.3s", cursor: "pointer", }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter =
                "brightness(0) saturate(100%) invert(31%) sepia(84%) saturate(5931%) hue-rotate(3deg) brightness(95%) contrast(100%)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          />
        </Link>

        {/* Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Running Start Digital
        </Typography>

        {/* Nav Links */}
        <Button component={Link} to="/" color="inherit" sx={navButtonStyle}>
          Home
        </Button>

        <Button component={Link} to="/current-student" color="inherit" sx={navButtonStyle}>
          Current Student
        </Button>

        <Button component={Link} to="/new-student" color="inherit" sx={navButtonStyle}>
          New Student
        </Button>

        <Button component={Link} to="/admin" color="inherit" sx={navButtonStyle}>
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}
