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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";

// partner data
import { currentStudentsQuestions } from "../data/currentStudent";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

// category config
import { categorySets } from "../data/categories.js";

// adapter
import { adaptQuestions } from "../data/flexQuestions.js";

function groupByType(questions) {
  return questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {});
}

function SortableRow({ question }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TableCell>{question.question}</TableCell>
      <TableCell align="center">{question.type}</TableCell>
    </TableRow>
  );
}
export default function Admin() {
  const [activeTab, setActiveTab] = useState(0);

  const [groupedCurrent, setGroupedCurrent] = useState({});
  const [groupedProspective, setGroupedProspective] = useState({});

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

  const activeGrouped =
    activeTab === 0 ? groupedCurrent : groupedProspective;

  const activeCategories =
    activeTab === 0 ? categorySets.current : categorySets.prospective;

  function handleDragEnd(event, catId) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const setter =
    activeTab === 0 ? setGroupedCurrent : setGroupedProspective;

  setter((prev) => {
    const updated = { ...prev };

    const oldIndex = updated[catId].findIndex(
      (q) => q.id === active.id
    );

    const newIndex = updated[catId].findIndex(
      (q) => q.id === over.id
    );

    updated[catId] = arrayMove(
      updated[catId],
      oldIndex,
      newIndex
    );

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

            <Paper sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "70%" }}>Question</TableCell>
                    <TableCell align="center" sx={{ width: "30%" }}>Type</TableCell>
                  </TableRow>
                </TableHead>

               <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, cat.id)}
                  >
                    <SortableContext
                      items={questions.map((q) => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <TableBody>
                        {questions.length > 0 ? (
                          questions.map((q) => (
                            <SortableRow key={q.id} question={q} />
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>
                              <Typography color="text.secondary">
                                No questions mapped to this category yet.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </SortableContext>
                </DndContext>
              </Table>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
}