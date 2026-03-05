import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

function transformFaqs(faqs) {
  return faqs.map((faq) => {
    const answer = faq.answer || {};
    return {
      ...faq,
      answer: {
        intro: answer.text || "",
        bullets: (answer.bullets || []).map((b) =>
          typeof b === "string" ? { text: b } : b
        ),
      },
    };
  });
}

export default function ProspectiveStudent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(`${API_BASE}/getFAQS?audience=future`);
        if (!res.ok) throw new Error("Failed to load questions");
        const data = await res.json();
        setQuestions(transformFaqs(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress sx={{ color: "#006225" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <StudentFAQPage
      title="Future Running Start Students"
      description="Explore general program information, enrollment steps, class options, and important policies for Running Start students."
      categories={categorySets.prospective}
      questions={questions}
    />
  );
}
