import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

// partner data (unchanged)
import { currentStudentsQuestions } from "../data/currentStudent";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

// category config (unchanged)
import { categorySets } from "../data/categories.js";

// adapter (your file)
import { adaptQuestions } from "../data/flexQuestions.js";

function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("adminLoggedIn") === "true";
});


  function handleSubmit(e) {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================
  if (isLoggedIn) {
    const adminCurrentQuestions = adaptQuestions(
      currentStudentsQuestions,
      "current"
    );

    const adminProspectiveQuestions = adaptQuestions(
      prospectiveStudentsQuestions,
      "prospective"
    );

    const groupedCurrent = groupByType(adminCurrentQuestions);
    const groupedProspective = groupByType(adminProspectiveQuestions);

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* ================= CURRENT STUDENTS ================= */}
        <Typography variant="h5" sx={{ mt: 3 }}>
          Current Students
        </Typography>

        {categorySets.current.map((cat) => (
          <Box key={cat.id} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {cat.name}
            </Typography>

            {(groupedCurrent[cat.id] || []).map((q) => (
              <Paper key={q.id} sx={{ p: 2, mt: 1 }}>
                {q.question}
              </Paper>
            ))}
          </Box>
        ))}

        {/* ================= PROSPECTIVE STUDENTS ================= */}
        <Typography variant="h5" sx={{ mt: 5 }}>
          Prospective Students
        </Typography>

        {categorySets.prospective.map((cat) => (
          <Box key={cat.id} sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {cat.name}
            </Typography>

            {(groupedProspective[cat.id] || []).map((q) => (
              <Paper key={q.id} sx={{ p: 2, mt: 1 }}>
                {q.question}
              </Paper>
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================
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
