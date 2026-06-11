import { useCallback, useEffect, useMemo, useState } from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import AddFaqForm from "../components/admin/addFAQ.jsx";
import AddCategoryForm from "../components/admin/addCategory.jsx";
import { useAuth } from "../context/useAuth";
import { apiUrl, handleAuthErrorResponse } from "../utils/api";
import { trackAdminAccess } from "../utils/analytics";

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

function faqCountLabel(count, includeInstruction = false) {
  const base = `Showing ${count} matching FAQ${count === 1 ? "" : "s"}.`;
  if (!includeInstruction) return base;
  return `${base} Clear search before dragging to reorder.`;
}

function sanitizeConfirmText(text) {
  return String(text || "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function getAllFaqs(groupedCurrent, groupedFuture) {
  return [
    ...Object.values(groupedCurrent).flat(),
    ...Object.values(groupedFuture).flat(),
  ];
}

function SortableCard({
  question,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}) {
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
        aria-label={`Reorder question: ${question.question}`}
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
        {question.is_published === false ? "Hidden" : "Published"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <IconButton
          size="small"
          onClick={onMoveUp}
          disabled={disableMoveUp}
          aria-label={`Move question up: ${question.question}`}
        >
          <KeyboardArrowUpIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={onMoveDown}
          disabled={disableMoveDown}
          aria-label={`Move question down: ${question.question}`}
        >
          <KeyboardArrowDownIcon />
        </IconButton>

        <Button size="small" variant="outlined" onClick={() => onEdit(question)}>
          Edit
        </Button>

        <Button
          size="small"
          variant="outlined"
          onClick={() => onToggleVisibility(question)}
        >
          {question.is_published === false ? "Publish" : "Hide"}
        </Button>

        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onDelete(question.id, question.question)}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

function SortableCategoryCard({
  category,
  audience,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  disableMoveUp,
  disableMoveDown,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category.id,
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
        aria-describedby="category-drag-help-text"
        aria-label={`Reorder category: ${category.name}`}
        sx={{ flex: 1, cursor: "grab", minWidth: 0 }}
      >
        <Typography sx={{ wordBreak: "break-word", fontWeight: 600 }}>
          {category.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {category.id}
        </Typography>
      </Box>

      <Typography
        color="text.secondary"
        sx={{
          flex: 1,
          wordBreak: "break-word",
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        {category.description || "—"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <IconButton
          size="small"
          onClick={onMoveUp}
          disabled={disableMoveUp}
          aria-label={`Move category up: ${category.name}`}
        >
          <KeyboardArrowUpIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={onMoveDown}
          disabled={disableMoveDown}
          aria-label={`Move category down: ${category.name}`}
        >
          <KeyboardArrowDownIcon />
        </IconButton>

        <Button
          size="small"
          variant="outlined"
          onClick={() => onEdit({ ...category, audience })}
        >
          Edit
        </Button>

        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onDelete(audience, category.id)}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const sortingSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedFuture, setGroupedFuture] = useState({});
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [editingFaq, setEditingFaq] = useState(null);

  const [categories, setCategories] = useState({ current: [], future: [] });
  const [editingCategory, setEditingCategory] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Analytics: reaching the protected Admin dashboard.
  useEffect(() => {
    trackAdminAccess();
  }, []);

  const activeCategories = useMemo(
    () => (activeTab === 0 ? categories.current : categories.future) ?? [],
    [activeTab, categories]
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

  const categoryTotal = useMemo(
    () => (categories.current?.length || 0) + (categories.future?.length || 0),
    [categories]
  );

  const allFaqs = useMemo(
    () => getAllFaqs(groupedCurrent, groupedFuture),
    [groupedCurrent, groupedFuture]
  );

  const lastUpdated = useMemo(() => {
    const timestamps = allFaqs
      .map((faq) => new Date(faq.updated_at || faq.created_at).getTime())
      .filter((time) => !Number.isNaN(time));

    if (timestamps.length === 0) return "No updates yet";

    return new Date(Math.max(...timestamps)).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [allFaqs]);

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

  const showMessage = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      severity,
      message,
    });
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/categories"));
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load categories");
      }

      setCategories({
        current: Array.isArray(data.current) ? data.current : [],
        future: Array.isArray(data.future) ? data.future : [],
      });
    } catch (err) {
      showMessage(err?.message || "Failed to load categories", "error");
    }
  }, [showMessage]);

  const loadFaqs = useCallback(async () => {
    setLoadingFaqs(true);
    setFetchError("");
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        throw new Error("Please login again.");
      }

      const [currentRes, futureRes] = await Promise.all([
        fetch(apiUrl("/admin/faq?audience=current"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(apiUrl("/admin/faq?audience=future"), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!currentRes.ok || !futureRes.ok) {
        handleAuthErrorResponse(!currentRes.ok ? currentRes : futureRes);
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
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    loadFaqs();
    loadCategories();
  }, [isAdmin, loadFaqs, loadCategories]);

  async function handleDelete(id, questionText) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete this FAQ?\n\n"${sanitizeConfirmText(
        questionText
      )}"`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(apiUrl(`/faq/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        handleAuthErrorResponse(res);
        throw new Error(data?.error || data?.message || "Delete failed");
      }

      showMessage("FAQ deleted successfully.", "success");
      loadFaqs();
    } catch (err) {
      showMessage(err.message || "Delete failed.", "error");
    }
  }

  async function handleToggleVisibility(question) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
      return;
    }

    const nextPublished = question.is_published === false;

    try {
      const res = await fetch(apiUrl(`/faq/${question.id}/visibility`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_published: nextPublished }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        handleAuthErrorResponse(res);
        throw new Error(data?.error || "Failed to update visibility");
      }

      showMessage(
        nextPublished
          ? "FAQ is now visible to students."
          : "FAQ is now hidden from students.",
        "success"
      );
      loadFaqs();
    } catch (err) {
      showMessage(err.message || "Failed to update visibility.", "error");
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

      const res = await fetch(apiUrl("/faq/order"), {
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
        handleAuthErrorResponse(res);
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

  async function handleFaqMove(catId, questionId, direction) {
    if (searchTerm.trim()) {
      showMessage("Clear search before reordering FAQs.", "info");
      return;
    }

    const currentGroups = activeTab === 0 ? groupedCurrent : groupedFuture;
    const list = currentGroups[catId] || [];
    const oldIndex = list.findIndex(
      (question) => String(question.id) === String(questionId)
    );
    const newIndex = oldIndex + direction;

    if (oldIndex < 0 || newIndex < 0 || newIndex >= list.length) return;

    const reordered = arrayMove(list, oldIndex, newIndex);

    if (activeTab === 0) {
      setGroupedCurrent((prev) => ({ ...prev, [catId]: reordered }));
    } else {
      setGroupedFuture((prev) => ({ ...prev, [catId]: reordered }));
    }

    const success = await saveOrderToBackend(catId, reordered);
    if (!success) loadFaqs();
  }

  async function saveCategoryOrderToBackend(audience, reorderedList) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
      return false;
    }

    try {
      const orderedIds = reorderedList.map((cat) => cat.id);

      const res = await fetch(apiUrl("/categories/order"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          audience,
          orderedIds,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        handleAuthErrorResponse(res);
        throw new Error(data?.error || "Failed to save category order");
      }

      showMessage("Category order updated successfully.", "success");
      return true;
    } catch (err) {
      showMessage(err.message || "Failed to save category order.", "error");
      return false;
    }
  }

  async function handleCategoryDragEnd(event, audience) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const list = categories[audience] || [];

    const oldIndex = list.findIndex((cat) => String(cat.id) === String(active.id));
    const newIndex = list.findIndex((cat) => String(cat.id) === String(over.id));

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(list, oldIndex, newIndex);

    setCategories((prev) => ({
      ...prev,
      [audience]: reordered,
    }));

    const success = await saveCategoryOrderToBackend(audience, reordered);

    if (!success) {
      loadCategories();
    }
  }

  async function handleCategoryMove(audience, categoryId, direction) {
    const list = categories[audience] || [];
    const oldIndex = list.findIndex(
      (category) => String(category.id) === String(categoryId)
    );
    const newIndex = oldIndex + direction;

    if (oldIndex < 0 || newIndex < 0 || newIndex >= list.length) return;

    const reordered = arrayMove(list, oldIndex, newIndex);
    setCategories((prev) => ({ ...prev, [audience]: reordered }));

    const success = await saveCategoryOrderToBackend(audience, reordered);
    if (!success) loadCategories();
  }

  async function handleDeleteCategory(audience, id) {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login again.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category? You can only delete it if there are no FAQs inside it."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(apiUrl(`/categories/${audience}/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        handleAuthErrorResponse(res);
        throw new Error(data?.error || "Delete failed");
      }

      showMessage("Category deleted successfully.", "success");
      loadCategories();
      loadFaqs();
    } catch (err) {
      showMessage(err.message || "Delete failed.", "error");
    }
  }

  if (view === "addCategory") {
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
              setView("manageCategories");
              setEditingCategory(null);
            }}
            sx={{ color: "#006225" }}
          >
            Back to Categories
          </Button>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <AddCategoryForm
            initialData={editingCategory}
            mode={editingCategory ? "edit" : "add"}
            onSuccess={() => {
              setEditingCategory(null);
              setView("manageCategories");
              showMessage(
                editingCategory
                  ? "Category updated successfully."
                  : "Category added successfully.",
                "success"
              );
              loadCategories();
            }}
            onCancel={() => {
              setEditingCategory(null);
              setView("manageCategories");
            }}
          />
        </Paper>
      </Box>
    );
  }

  if (view === "manageCategories") {
    return (
      <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #d7d7d7",
            borderRadius: 2.5,
            boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
            maxWidth: "1200px",
            mx: "auto",
            mb: 3,
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 1.5, sm: 2 },
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
                  fontSize: { xs: "1.7rem", sm: "2.125rem" },
                }}
              >
                Manage Categories
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                Drag categories to control the order students see them.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1.25,
                flexWrap: "wrap",
                width: { xs: "100%", sm: "auto" },
                "& .MuiButton-root": {
                  flex: { xs: "1 1 150px", sm: "0 0 auto" },
                },
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setView("dashboard")}
                sx={{
                  borderColor: "#006225",
                  color: "#006225",
                  "&:hover": { borderColor: "#004d1a", color: "#004d1a" },
                }}
              >
                Back to Dashboard
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setEditingCategory(null);
                  setView("addCategory");
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
                + Add Category
              </Button>
            </Box>
          </Box>
        </Box>

        {["current", "future"].map((audience) => (
          <Box
            key={audience}
            sx={{ mt: 3, maxWidth: "1200px", mx: "auto", width: "100%" }}
          >
            <Typography variant="h6" gutterBottom>
              {audience === "current" ? "Current Students" : "Future Students"}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 1 }}>
              Drag categories to reorder them, or use the arrow buttons.
            </Typography>

            <Typography
              id="category-drag-help-text"
              color="text.secondary"
              variant="body2"
              sx={{ mb: 1 }}
            >
              Keyboard users can focus the Move up or Move down button and
              press Enter or Space.
            </Typography>

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
              <Typography>Category Name</Typography>
              <Typography>Description</Typography>
            </Box>

            <Paper
              sx={{
                p: { xs: 1.25, sm: 2 },
                mt: 1,
                overflow: "hidden",
                borderRadius: 2.5,
              }}
            >
              <DndContext
                sensors={sortingSensors}
                collisionDetection={closestCenter}
                onDragEnd={(evt) => handleCategoryDragEnd(evt, audience)}
              >
                <SortableContext
                  items={(categories[audience] || []).map((cat) => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {(categories[audience] || []).length === 0 ? (
                      <Typography color="text.secondary">
                        No categories yet.
                      </Typography>
                    ) : (
                      (categories[audience] || []).map((cat, index, list) => (
                        <SortableCategoryCard
                          key={cat.id}
                          category={cat}
                          audience={audience}
                          onMoveUp={() =>
                            handleCategoryMove(audience, cat.id, -1)
                          }
                          onMoveDown={() =>
                            handleCategoryMove(audience, cat.id, 1)
                          }
                          disableMoveUp={index === 0}
                          disableMoveDown={index === list.length - 1}
                          onEdit={(categoryToEdit) => {
                            setEditingCategory(categoryToEdit);
                            setView("addCategory");
                          }}
                          onDelete={handleDeleteCategory}
                        />
                      ))
                    )}
                  </Box>
                </SortableContext>
              </DndContext>
            </Paper>
          </Box>
        ))}

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
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #d7d7d7",
          borderRadius: 2.5,
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
          maxWidth: "1200px",
          mx: "auto",
          mb: 3,
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 },
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
                fontSize: { xs: "1.7rem", sm: "2.125rem" },
              }}
            >
              Admin Dashboard
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              Manage FAQs and student support content.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              "& .MuiButton-root": {
                flex: { xs: "1 1 150px", sm: "0 0 auto" },
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setView("manageCategories")}
              sx={{
                borderColor: "#006225",
                color: "#006225",
                "&:hover": { borderColor: "#004d1a", color: "#004d1a" },
              }}
            >
              Manage Categories
            </Button>

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
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          mt: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {currentTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Student FAQs
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {futureTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Future Student FAQs
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {categoryTotal}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Categories
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            {lastUpdated}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last Updated
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 3 }}>
        <TextField
          fullWidth
          label="Search FAQs"
          placeholder="Search by question, category, or answer text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          helperText={
            searchTerm.trim()
              ? faqCountLabel(visibleTotal, true)
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
                  aria-label="Clear search"
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
          onChange={(_event, value) => setActiveTab(value)}
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
        Drag questions to reorder them within each category, or use each
        question's Move up and Move down buttons. Keyboard users can focus a
        move button and press Enter or Space. Edit and Delete buttons are
        available on each item.
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
          const allQuestions = activeGrouped[cat.id] || [];
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
                {cat.name} ({allQuestions.length})
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

              <Paper
                sx={{
                  p: { xs: 1.25, sm: 2 },
                  mt: 1,
                  overflow: "hidden",
                  borderRadius: 2.5,
                }}
              >
                <DndContext
                  sensors={sortingSensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(evt) => handleDragEnd(evt, cat.id)}
                >
                  <SortableContext
                    items={ids}
                    strategy={verticalListSortingStrategy}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {questions.length > 0 ? (
                        questions.map((q, index) => (
                          <SortableCard
                            key={q.id}
                            question={q}
                            onMoveUp={() => handleFaqMove(cat.id, q.id, -1)}
                            onMoveDown={() => handleFaqMove(cat.id, q.id, 1)}
                            disableMoveUp={index === 0}
                            disableMoveDown={index === questions.length - 1}
                            onEdit={(faq) => {
                              setEditingFaq(faq);
                              setView("addFaq");
                            }}
                            onDelete={handleDelete}
                            onToggleVisibility={handleToggleVisibility}
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
