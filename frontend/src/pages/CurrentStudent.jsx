import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CurrentStudent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/getFAQS?audience=current`);

        if (!res.ok) {
          throw new Error("Failed to load current student FAQs.");
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load current student FAQs:", err);
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
        Loading current student FAQs...
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
      title="Current Running Start Students"
      description="Find information on fee waivers, class planning, enrollment deadlines, and available campus resources."
      categories={categorySets.current}
      questions={questions}
    />
  );
}