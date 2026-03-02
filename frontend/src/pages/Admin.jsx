import { useMemo, useState } from "react";
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

export default function Admin() {
  const [activeTab, setActiveTab] = useState(0);

  const { groupedCurrent, groupedProspective } = useMemo(() => {
    const adminCurrentQuestions = adaptQuestions(
      currentStudentsQuestions,
      "current"
    );

    const adminProspectiveQuestions = adaptQuestions(
      prospectiveStudentsQuestions,
      "prospective"
    );

    return {
      groupedCurrent: groupByType(adminCurrentQuestions),
      groupedProspective: groupByType(adminProspectiveQuestions),
    };
  }, []);

  const activeGrouped =
    activeTab === 0 ? groupedCurrent : groupedProspective;

  const activeCategories =
    activeTab === 0 ? categorySets.current : categorySets.prospective;

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

                <TableBody>
                  {questions.length > 0 ? (
                    questions.map((q) => (
                      <TableRow key={q.id ?? `${cat.id}-${q.question}`}>
                        <TableCell>{q.question}</TableCell>
                        <TableCell align="center">{q.type}</TableCell>
                      </TableRow>
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
              </Table>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
}