import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthenticateContext";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token);
      setMessage("Login successful! Redirecting to admin dashboard.");
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <Box
      component="section"
      aria-labelledby="admin-login-heading"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f1ffe9",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography id="admin-login-heading" variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>

        <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
          Sign in to manage FAQ content.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} role="alert">
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }} role="status">
            {message}
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#006225",
            "&:hover": {
              backgroundColor: "#004d1a",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}