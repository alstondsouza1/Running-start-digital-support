import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProspectiveStudent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/getFAQS?audience=future`);

        if (!res.ok) {
          throw new Error("Failed to load future student FAQs.");
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load future student FAQs:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px" }} role="status" aria-live="polite">
        Loading future student FAQs...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }} role="alert">
        {error}
      </div>
    );
  }

  return (
    <StudentFAQPage
      title="Future Running Start Students"
      description="Explore general program information, enrollment steps, class options, and important policies for Running Start students."
      categories={categorySets.future}
      questions={questions}
    />
  );
}