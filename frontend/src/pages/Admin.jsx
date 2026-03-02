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
import { categorySets } from "../data/categories.js";

// adapter
import { adaptQuestions } from "../data/flexQuestions.js";

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