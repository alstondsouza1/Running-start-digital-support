import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://runningstart-backend.onrender.com/api";

export default function ProspectiveStudent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/getFAQS?audience=future`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load future student FAQs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;

  return (
    <StudentFAQPage
      title="Future Running Start Students"
      description="Explore general program information, enrollment steps, class options, and important policies for Running Start students."
      categories={categorySets.prospective}
      questions={questions}
    />
  );
}