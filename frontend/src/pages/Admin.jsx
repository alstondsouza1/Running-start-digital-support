import { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";

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
  const { groupedCurrent, groupedProspective } = useMemo(() => {
    const adminCurrentQuestions = adaptQuestions(currentStudentsQuestions, "current");
    const adminProspectiveQuestions = adaptQuestions(prospectiveStudentsQuestions, "prospective");

    return {
      groupedCurrent: groupByType(adminCurrentQuestions),
      groupedProspective: groupByType(adminProspectiveQuestions),
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Admin Dashboard</Typography>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Current Students
      </Typography>

      {categorySets.current.map((cat) => (
        <Box key={cat.id} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {cat.name}
          </Typography>

          {(groupedCurrent[cat.id] || []).map((q) => (
            <Paper key={q.id ?? `${cat.id}-${q.question}`} sx={{ p: 2, mt: 1 }}>
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

      <Typography variant="h5" sx={{ mt: 5 }}>
        Prospective Students
      </Typography>

      {categorySets.prospective.map((cat) => (
        <Box key={cat.id} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {cat.name}
          </Typography>

          {(groupedProspective[cat.id] || []).map((q) => (
            <Paper key={q.id ?? `${cat.id}-${q.question}`} sx={{ p: 2, mt: 1 }}>
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