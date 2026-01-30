import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../assets/GRC_Logo_WHITE.png";

export default function Navbar() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar>
        <Link to="/">
          <img src={Logo} alt="Logo" style={{ height: 50, marginRight: 16, transition: "filter 0.3s" }} 
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0) saturate(100%) invert(31%) sepia(84%) saturate(5931%) hue-rotate(3deg) brightness(95%) contrast(100%)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}
          />
        </Link>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Running Start Digital
        </Typography>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        <Button color="inherit" component={Link} to="/current-student">
          Current Student
        </Button>

        <Button color="inherit" component={Link} to="/new-student">
          New Student
        </Button>

        <Button color="inherit" component={Link} to="/admin">
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}