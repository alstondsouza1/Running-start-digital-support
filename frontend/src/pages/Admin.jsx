import { useState, useEffect } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper
} from "@mui/material";

// partner data
import { currentStudentsQuestions } from "../data/currentStudent";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

// category config
import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";

import { categorySets } from "../data/categories.js";
import AddFaqForm from "../components/admin/addFAQ.jsx";

// adapter
import { adaptQuestions } from "../data/flexQuestions.js";
// TODO: Replace in a env file with production 
const API_BASE = "http://localhost:5000/api";

// Group questions by type/category
function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

// Draggable Card Component
function SortableCard({ question }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
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
        ...style
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
  const [activeTab, setActiveTab] = useState(0);
  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedProspective, setGroupedProspective] = useState({});

  // Initialize questions from data
  useEffect(() => {
    const adminCurrentQuestions = adaptQuestions(
      currentStudentsQuestions,
      "current"
    );

    const adminProspectiveQuestions = adaptQuestions(
      prospectiveStudentsQuestions,
      "prospective"
    );

    setGroupedCurrent(groupByType(adminCurrentQuestions));
    setGroupedProspective(groupByType(adminProspectiveQuestions));
  }, []);

  const activeGrouped = activeTab === 0 ? groupedCurrent : groupedProspective;
  const activeCategories = activeTab === 0 ? categorySets.current : categorySets.prospective;

  // Update order on drag end
  function handleDragEnd(event, catId) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const setter = activeTab === 0 ? setGroupedCurrent : setGroupedProspective;

    setter((prev) => {
      const updated = { ...prev };
      const oldIndex = updated[catId].findIndex((q) => q.id === active.id);
      const newIndex = updated[catId].findIndex((q) => q.id === over.id);

      updated[catId] = arrayMove(updated[catId], oldIndex, newIndex);
      return updated;
    });
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Admin Dashboard</Typography>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        sx={{ mt: 3 }}
      >
        <Tab label="Current Students" />
        <Tab label="Prospective Students" />
      </Tabs>

      {/* Category Sections */}
      {activeCategories.map((cat) => {
        const questions = activeGrouped[cat.id] || [];

        return (
          <Box key={cat.id} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {cat.name}
            </Typography>
            {/* Header Row */}
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
                mt: 2
              }}
            >
              <Typography>Question</Typography>
              <Typography>Type</Typography>
            </Box>

            <Paper sx={{ p: 2, mt: 1 }}>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, cat.id)}
              >
                <SortableContext
                  items={questions.map((q) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {questions.length > 0 ? (
                      questions.map((q) => <SortableCard key={q.id} question={q} />)
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