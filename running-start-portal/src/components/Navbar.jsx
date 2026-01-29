import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar>
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