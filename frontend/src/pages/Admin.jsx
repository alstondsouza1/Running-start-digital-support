import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";

import { categorySets } from "../data/categories.js";
import AddFaqForm from "../components/admin/addFAQ.jsx";

// TODO: Replace in a env file with production 
const API_BASE = "http://localhost:5000/api";

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
  const [view, setView] = useState("dashboard");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("adminLoggedIn") === "true";
  });

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedProspective, setGroupedProspective] = useState({});
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadFaqs() {
      setLoadingFaqs(true);
      setFetchError("");
      try {
        const [currentRes, futureRes] = await Promise.all([
          fetch(`${API_BASE}/getFAQS?audience=current`),
          fetch(`${API_BASE}/getFAQS?audience=future`),
        ]);

        if (!currentRes.ok || !futureRes.ok) {
          throw new Error("Failed to load FAQs from server");
        }

        const [currentData, futureData] = await Promise.all([
          currentRes.json(),
          futureRes.json(),
        ]);

        setGroupedCurrent(groupByType(currentData));
        setGroupedProspective(groupByType(futureData));
        console.log(groupedCurrent);
        console.log(groupedProspective);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingFaqs(false);
      }
    }

    loadFaqs();
    // may need to add groupedCurrent and groupPerspective to depenency array
  }, [isLoggedIn]);

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

  // =========================
  // ADMIN DASHBOARD
  // =========================
  if (isLoggedIn && view === "addFaq") {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          variant="text"
          onClick={() => setView("dashboard")}
          sx={{ mb: 2, color: "#006225" }}
        >
          Back to Dashboard
        </Button>
        <Paper sx={{ p: 3 }}>
          <AddFaqForm />
        </Paper>
      </Box>
    );
  }

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

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setView("addFaq")}
              sx={{
                backgroundColor: "#006225",
                "&:hover": { backgroundColor: "#004d1a" },
              }}
            >
              + Add FAQ
            </Button>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#888",
                "&:hover": { backgroundColor: "#D14900" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Loading */}
        {loadingFaqs && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#006225" }} />
          </Box>
        )}

        {/* Error */}
        {fetchError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {fetchError}
          </Typography>
        )}

        {/* FAQ Lists */}
        {!loadingFaqs && !fetchError && (
          <>
            {/* Current Students */}
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

            {/* ===== PROSPECTIVE STUDENTS ===== */}
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
          </>
        )}
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
