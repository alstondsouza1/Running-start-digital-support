import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  if (isLoggedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Admin</Typography>
        <Typography>Welcome! Admin tools coming soon. WIP</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#aee68d",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 320,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#006225",
              "&:hover": {
                backgroundColor: "#D14900",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
