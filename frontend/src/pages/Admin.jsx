import { useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

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

  // Persist login across refresh
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // prevents issues if this ever runs in a non-browser environment (tests)
    if (typeof window === "undefined") return false;
    return localStorage.getItem("adminLoggedIn") === "true";
  });

  function handleSubmit(e) {
    e.preventDefault();

    // replace with real auth later
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true"); // ✅ IMPORTANT (was missing in your version)
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
    setUsername("");
    setPassword("");
    setError("");
  }

  // Compute grouped questions once per render (only depends on source data)
  const { groupedCurrent, groupedProspective } = useMemo(() => {
    const adminCurrentQuestions = adaptQuestions(currentStudentsQuestions, "current");
    const adminProspectiveQuestions = adaptQuestions(
      prospectiveStudentsQuestions,
      "prospective"
    );

    return {
      groupedCurrent: groupByType(adminCurrentQuestions),
      groupedProspective: groupByType(adminProspectiveQuestions),
    };
  }, []);

  // =========================
  // ADMIN DASHBOARD
  // =========================
  if (isLoggedIn) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header row with Logout */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography variant="h4">Admin Dashboard</Typography>

          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              backgroundColor: "#006225",
              "&:hover": { backgroundColor: "#D14900" },
            }}
          >
            Logout
          </Button>
        </Box>

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
              <Paper
                key={q.id ?? `${cat.id}-${q.question}`}
                sx={{ p: 2, mt: 1 }}
              >
                {q.question}
              </Paper>
            ))}

            {(groupedCurrent[cat.id] || []).length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                No questions mapped to this category yet.
              </Typography>
            )}
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
              <Paper
                key={q.id ?? `${cat.id}-${q.question}`}
                sx={{ p: 2, mt: 1 }}
              >
                {q.question}
              </Paper>
            ))}

            {(groupedProspective[cat.id] || []).length === 0 && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                No questions mapped to this category yet.
              </Typography>
            )}
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
              "&:hover": { backgroundColor: "#D14900" },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
