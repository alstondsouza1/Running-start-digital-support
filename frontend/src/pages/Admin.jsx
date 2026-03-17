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

import fetchCategories from "../utils/fetchCategories.js";
import AddFaqForm from "../components/admin/addFAQ.jsx";
import { useAuth } from "../context/AuthenticateContext";

const API_BASE = import.meta.env.VITE_API_BASE;

function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

function SortableCard({ question, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
      sx={{
        p: 1,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        ...style,
      }}
    >
      <Box {...attributes} {...listeners} sx={{ flex: 1, cursor: "grab" }}>
        <Typography>{question.question}</Typography>
      </Box>

      <Typography color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
        {question.type}
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(question)}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onDelete(question.id)}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

export default function Admin() {
  const { isAdmin, login, logout } = useAuth();

  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedFuture, setGroupedFuture] = useState({});
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [editingFaq, setEditingFaq] = useState(null);

  const [categories, setCategories] = useState({ current: [], future: [] });

  const activeCategories = useMemo(
    () => (activeTab === 0 ? categories.current : categories.future),
    [activeTab, categories]
  );

  const activeGrouped = useMemo(
    () => (activeTab === 0 ? groupedCurrent : groupedFuture),
    [activeTab, groupedCurrent, groupedFuture]
  );

  async function loadFaqs() {
    setLoadingFaqs(true);
    setFetchError("");

    const data = await fetchCategories(API_BASE);
    setCategories(data)

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

    const loadCategories = async () => {
      try {
        const data = await fetchCategories(API_BASE);
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
    loadFaqs();
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
    setEditingFaq(null);
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this FAQ?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/faq/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Delete failed");
      }

      alert("FAQ deleted successfully");
      loadFaqs();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  }

  async function saveOrderToBackend(type, reorderedList) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return false;
    }

    try {
      const audience = activeTab === 0 ? "current" : "future";
      const orderedIds = reorderedList.map((item) => item.id);

      const res = await fetch(`${API_BASE}/faq/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          audience,
          type,
          orderedIds,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to save order");
      }

      return true;
    } catch (err) {
      alert(err.message || "Failed to save order");
      return false;
    }
  }

  async function handleDragEnd(event, catId) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const currentGroups = activeTab === 0 ? groupedCurrent : groupedFuture;
    const list = currentGroups[catId] || [];

    const oldIndex = list.findIndex((q) => String(q.id) === String(active.id));
    const newIndex = list.findIndex((q) => String(q.id) === String(over.id));

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(list, oldIndex, newIndex);

    if (activeTab === 0) {
      setGroupedCurrent((prev) => ({
        ...prev,
        [catId]: reordered,
      }));
    } else {
      setGroupedFuture((prev) => ({
        ...prev,
        [catId]: reordered,
      }));
    }

    const success = await saveOrderToBackend(catId, reordered);

    if (!success) {
      loadFaqs();
    }
  }

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, maxWidth: 520, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin Login
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
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

  if (view === "addFaq") {
    return (
      <Box sx={{ p: 3 }}>
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
        >
          <Button
            variant="text"
            onClick={() => {
              setView("dashboard");
              setEditingFaq(null);
            }}
            sx={{ color: "#006225" }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <AddFaqForm
            initialData={editingFaq}
            mode={editingFaq ? "edit" : "add"}
            onSuccess={() => {
              setEditingFaq(null);
              setView("dashboard");
              loadFaqs();
            }}
            onCancel={() => {
              setEditingFaq(null);
              setView("dashboard");
            }}
          />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}
      >
        <Typography variant="h4">Admin Dashboard</Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setEditingFaq(null);
              setView("addFaq");
            }}
            sx={{ backgroundColor: "#006225", "&:hover": { backgroundColor: "#004d1a" } }}
          >
            + Add FAQ
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} centered sx={{ mt: 1 }}>
        <Tab label="Current Students" />
        <Tab label="Future Students" />
      </Tabs>

      {loadingFaqs && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#006225" }} />
        </Box>
      )}

      {fetchError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {fetchError}
        </Typography>
      )}

      {!loadingFaqs &&
        !fetchError &&
        activeCategories.map((catKey) => {
          const questions = activeGrouped[catKey] || [];
          const ids = questions.map((q) => q.id);

          return (
            <Box key={catKey}
                sx={{ 
                  mt: 4, 
                  maxWidth: "1500px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}>
              <Typography variant="h6" gutterBottom>
                {catKey}
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
                  maxWidth: "1500px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <Typography>Question</Typography>
                <Typography>Type</Typography>
              </Box>

              <Paper sx={{ p: 2, mt: 1 }}>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={(evt) => handleDragEnd(evt, catKey)}
                >
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {questions.length > 0 ? (
                        questions.map((q) => (
                          <SortableCard
                            key={q.id}
                            question={q}
                            onEdit={(faq) => {
                              setEditingFaq(faq);
                              setView("addFaq");
                            }}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <Typography color="text.secondary">
                          No questions mapped to this category yet.
                        </Typography>
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