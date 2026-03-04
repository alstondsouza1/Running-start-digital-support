import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { categorySets } from "../data/categories.js";
import AddFaqForm from "../components/admin/addFAQ.jsx";
import { useAuth } from "../context/AuthenticateContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

function SortableCard({ question }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        p: 1,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...style,
      }}
    >
      <Typography sx={{ flex: 1 }}>{question.question}</Typography>
      <Typography color="text.secondary" sx={{ ml: 2, whiteSpace: "nowrap" }}>
        {question.type}
      </Typography>
    </Paper>
  );
}

export default function Admin() {
  const { isAdmin, login, logout } = useAuth();

  const [view, setView] = useState("dashboard"); // dashboard | addFaq
  const [activeTab, setActiveTab] = useState(0); // 0=current, 1=future

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedFuture, setGroupedFuture] = useState({});
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const activeCategories = useMemo(
    () => (activeTab === 0 ? categorySets.current : categorySets.prospective),
    [activeTab]
  );

  const activeGrouped = useMemo(
    () => (activeTab === 0 ? groupedCurrent : groupedFuture),
    [activeTab, groupedCurrent, groupedFuture]
  );

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

      // Ensure every item has a stable id for DnD
      const currentWithIds = currentData.map((q) => ({
        ...q,
        id: q.id ?? `current-${q.type}-${q.question}`,
      }));

      const futureWithIds = futureData.map((q) => ({
        ...q,
        id: q.id ?? `future-${q.type}-${q.question}`,
      }));

      setGroupedCurrent(groupByType(currentWithIds));
      setGroupedFuture(groupByType(futureWithIds));
    } catch (err) {
      setFetchError(err?.message || "Unknown error");
    } finally {
      setLoadingFaqs(false);
    }
  }

  useEffect(() => {
    if (!isAdmin) return;
    loadFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (!data?.token) {
        throw new Error("Missing token from server");
      }

      login(data.token);
      setUsername("");
      setPassword("");
    } catch (err) {
      setAuthError(err?.message || "Login failed");
    }
  }

  function handleLogout() {
    logout();
    setView("dashboard");
  }

  function handleDragEnd(event, catId) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const setter = activeTab === 0 ? setGroupedCurrent : setGroupedFuture;

    setter((prev) => {
      const updated = { ...prev };
      const list = updated[catId] || [];
      const oldIndex = list.findIndex((q) => String(q.id) === String(active.id));
      const newIndex = list.findIndex((q) => String(q.id) === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return prev;

      updated[catId] = arrayMove(list, oldIndex, newIndex);
      return updated;
    });
  }

  // -------------------------
  // Not logged in -> Login UI
  // -------------------------
  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, maxWidth: 520, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin Login
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />

            {authError && <Typography color="error">{authError}</Typography>}

            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#006225", "&:hover": { backgroundColor: "#004d1a" } }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // -------------------------
  // Logged in -> Add FAQ view
  // -------------------------
  if (view === "addFaq") {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Button variant="text" onClick={() => setView("dashboard")} sx={{ color: "#006225" }}>
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ backgroundColor: "#888", "&:hover": { backgroundColor: "#D14900" } }}
          >
            Logout
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <AddFaqForm />
        </Paper>
      </Box>
    );
  }

  // -------------------------
  // Logged in -> Dashboard
  // -------------------------
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Typography variant="h4">Admin Dashboard</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setView("addFaq")}
            sx={{ backgroundColor: "#006225", "&:hover": { backgroundColor: "#004d1a" } }}
          >
            + Add FAQ
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ backgroundColor: "#888", "&:hover": { backgroundColor: "#D14900" } }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered sx={{ mt: 1 }}>
        <Tab label="Current Students" />
        <Tab label="Prospective Students" />
      </Tabs>

      {loadingFaqs && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#006225" }} />
        </Box>
      )}

      {fetchError && <Typography color="error" sx={{ mt: 2 }}>{fetchError}</Typography>}

      {!loadingFaqs &&
        !fetchError &&
        activeCategories.map((cat) => {
          const questions = activeGrouped[cat.id] || [];
          const ids = questions.map((q) => q.id);

          return (
            <Box key={cat.id} sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                {cat.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  fontWeight: "bold",
                  borderBottom: 1,
                  borderColor: "divider",
                  mt: 2,
                }}
              >
                <Typography>Question</Typography>
                <Typography>Type</Typography>
              </Box>

              <Paper sx={{ p: 2, mt: 1 }}>
                <DndContext collisionDetection={closestCenter} onDragEnd={(evt) => handleDragEnd(evt, cat.id)}>
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {questions.length > 0 ? (
                        questions.map((q) => <SortableCard key={q.id} question={q} />)
                      ) : (
                        <Typography color="text.secondary">No questions mapped to this category yet.</Typography>
                      )}
                    </Box>
                  </SortableContext>
                </DndContext>
              </Paper>
            </Box>
          );
        })}
    </Box>
  );
}