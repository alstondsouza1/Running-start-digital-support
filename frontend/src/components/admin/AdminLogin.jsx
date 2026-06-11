import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { ADMIN_SESSION_MESSAGE_KEY, apiUrl } from "../../utils/api";
import { trackLoginAttempt, trackLoginSuccess } from "../../utils/analytics";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const sessionMessage = localStorage.getItem(ADMIN_SESSION_MESSAGE_KEY);

    if (sessionMessage) {
      setError(sessionMessage);
      localStorage.removeItem(ADMIN_SESSION_MESSAGE_KEY);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    // Analytics: admin login attempt (no credentials captured).
    trackLoginAttempt();

    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      login(data.token);
      // Analytics: successful admin login.
      trackLoginSuccess();
      setMessage("Login successful. Redirecting...");

      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="section"
      aria-labelledby="admin-login-heading"
      sx={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7f5",
        px: 2,
        py: 6,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          borderTop: "5px solid #006225",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 1.5,
              borderRadius: "50%",
              backgroundColor: "#eaf6ed",
              color: "#006225",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            <LockOutlinedIcon />
          </Box>

          <Typography
            id="admin-login-heading"
            variant="h5"
            component="h1"
            fontWeight={800}
          >
            Admin Login
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Sign in to manage Running Start FAQ content.
          </Typography>
        </Box>

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
          disabled={loading}
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
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 2.5,
            py: 1.2,
            backgroundColor: "#006225",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#004d1a",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Login"
          )}
        </Button>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Admin access is restricted to authorized users.
        </Typography>
      </Paper>
    </Box>
  );
}
