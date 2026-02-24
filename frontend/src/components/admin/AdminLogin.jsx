import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage("Login successful!");
      console.log("Server response:", data);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1ffe9",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 350,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}

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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}