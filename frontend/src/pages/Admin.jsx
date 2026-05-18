import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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
import { useAuth } from "../context/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE;

function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

function answerText(answer) {
  if (!answer) return "";

  const intro = answer.intro || "";
  const bullets = Array.isArray(answer.bullets)
    ? answer.bullets.map((bullet) => bullet?.text || "").join(" ")
    : "";

  return `${intro} ${bullets}`.toLowerCase();
}

function matchesSearch(question, searchTerm) {
  const term = searchTerm.trim().toLowerCase();

  if (!term) return true;

  return (
    String(question.question || "").toLowerCase().includes(term) ||
    String(question.type || "").toLowerCase().includes(term) ||
    answerText(question.answer).includes(term)
  );
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
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        gap: 1.5,
        overflow: "hidden",
        ...style,
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        aria-describedby="drag-help-text"
        aria-label={`Drag to reorder question: ${question.question}`}
        sx={{ flex: 1, cursor: "grab", minWidth: 0 }}
      >
        <Typography sx={{ wordBreak: "break-word", fontWeight: 600 }}>
          {question.question}
        </Typography>
      </Box>

      <Typography
        color="text.secondary"
        sx={{
          whiteSpace: { xs: "normal", md: "nowrap" },
          wordBreak: "break-word",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {question.type}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <Button size="small" variant="outlined" onClick={() => onEdit(question)}>
          Edit
        </Button>

        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onDelete(question)}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

export default function Admin() {
  const { isAdmin } = useAuth();

  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedFuture, setGroupedFuture] = useState({});
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [editingFaq, setEditingFaq] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const activeCategories = useMemo(
    () => (activeTab === 0 ? categorySets.current : categorySets.future),
    [activeTab]
  );

  const activeGrouped = useMemo(
    () => (activeTab === 0 ? groupedCurrent : groupedFuture),
    [activeTab, groupedCurrent, groupedFuture]
  );

  const currentTotal = useMemo(
    () =>
      Object.values(groupedCurrent).reduce(
        (total, list) => total + list.length,
        0
      ),
    [groupedCurrent]
  );

  const futureTotal = useMemo(
    () =>
      Object.values(groupedFuture).reduce(
        (total, list) => total + list.length,
        0
      ),
    [groupedFuture]
  );

  const filteredGrouped = useMemo(() => {
    const result = {};

    for (const category of activeCategories) {
      const questions = activeGrouped[category.id] || [];
      result[category.id] = questions.filter((question) =>
        matchesSearch(question, searchTerm)
      );
    }

    return result;
  }, [activeCategories, activeGrouped, searchTerm]);

  const visibleTotal = useMemo(
    () =>
      Object.values(filteredGrouped).reduce(
        (total, list) => total + list.length,
        0
      ),
    [filteredGrouped]
  );

  function showMessage(message, severity = "success") {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  }

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
  }, [isAdmin]);

  async function handleDelete(question) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete this FAQ?\n\n"${question.question}"`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/faq/${question.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Delete failed");
      }

      showMessage("FAQ deleted successfully.", "success");
      loadFaqs();
    } catch (err) {
      showMessage(err.message || "Delete failed.", "error");
    }
  }

  async function saveOrderToBackend(type, reorderedList) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
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

      showMessage("FAQ order updated successfully.", "success");
      return true;
    } catch (err) {
      showMessage(err.message || "Failed to save order.", "error");
      return false;
    }
  }

  async function handleDragEnd(event, catId) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (searchTerm.trim()) {
      showMessage("Clear search before reordering FAQs.", "info");
      return;
    }

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

  if (view === "addFaq") {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
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

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <AddFaqForm
            initialData={editingFaq}
            mode={editingFaq ? "edit" : "add"}
            onSuccess={() => {
              const message = editingFaq
                ? "FAQ updated successfully."
                : "FAQ added successfully.";

              setEditingFaq(null);
              setView("dashboard");
              showMessage(message, "success");
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
    <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 12, sm: 13 } }}>
      <Box
        sx={{
          position: "fixed",
          top: { xs: 56, sm: 64 },
          left: 0,
          right: 0,
          zIndex: 3000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #d7d7d7",
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: "'Chiron GoRound TC', sans-serif",
                fontWeight: 700,
                color: "#222",
                lineHeight: 1.1,
              }}
            >
              Admin Dashboard
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              Manage FAQs and student support content.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => {
              setEditingFaq(null);
              setView("addFaq");
            }}
            sx={{
              backgroundColor: "#006225",
              color: "white",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: 1.5,
              px: 2.5,
              py: 1,
              boxShadow: "0 2px 5px rgba(0,0,0,0.14)",
              "&:hover": {
                backgroundColor: "#004d1a",
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              },
            }}
          >
            + Add FAQ
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mt: 5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700}>
            {currentTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Student FAQs
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700}>
            {futureTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Future Student FAQs
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700}>
            {currentTotal + futureTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total FAQs
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 3 }}>
        <TextField
          fullWidth
          label="Search admin FAQs"
          placeholder="Search by question, category, or answer text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          helperText={
            searchTerm.trim()
              ? `Showing ${visibleTotal} matching FAQ${
                  visibleTotal === 1 ? "" : "s"
                }. Clear search before dragging to reorder.`
              : "Search helps you quickly find FAQs before editing or deleting."
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon aria-hidden="true" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear admin FAQ search"
                  onClick={() => setSearchTerm("")}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          centered
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`Current Students (${currentTotal})`} />
          <Tab label={`Future Students (${futureTotal})`} />
        </Tabs>
      </Box>

      <Typography
        id="drag-help-text"
        color="text.secondary"
        sx={{ mt: 2, mb: 1, textAlign: "center" }}
      >
        Drag and drop questions to reorder them within each category. Edit and
        Delete buttons are available on each item.
      </Typography>

      {loadingFaqs && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#006225" }} />
        </Box>
      )}

      {fetchError && (
        <Alert severity="error" sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
          {fetchError}
        </Alert>
      )}

      {!loadingFaqs &&
        !fetchError &&
        activeCategories.map((cat) => {
          const originalQuestions = activeGrouped[cat.id] || [];
          const questions = filteredGrouped[cat.id] || [];
          const ids = questions.map((q) => q.id);

          return (
            <Box
              key={cat.id}
              sx={{
                mt: 4,
                maxWidth: "1200px",
                mx: "auto",
                width: "100%",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {cat.name} ({originalQuestions.length})
              </Typography>

              {cat.description && (
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {cat.description}
                </Typography>
              )}

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
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

              <Paper sx={{ p: { xs: 1.25, sm: 2 }, mt: 1, overflow: "hidden" }}>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={(evt) => handleDragEnd(evt, cat.id)}
                >
                  <SortableContext
                    items={ids}
                    strategy={verticalListSortingStrategy}
                  >
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
                        <Box
                          sx={{
                            p: 2,
                            border: "1px dashed #cfcfcf",
                            borderRadius: 1,
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <Typography color="text.secondary">
                            {searchTerm.trim()
                              ? "No matching FAQs in this category."
                              : "No questions mapped to this category yet."}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </SortableContext>
                </DndContext>
              </Paper>
            </Box>
          );
        })}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}