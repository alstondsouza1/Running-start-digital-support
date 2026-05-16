import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";

import { API_BASE } from "../utils/api.js";

export default function CurrentStudent() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [faqRes, categoryRes] = await Promise.all([
          fetch(`${API_BASE}/getFAQS?audience=current`),
          fetch(`${API_BASE}/categories`),
        ]);

        const [faqData, categoryData] = await Promise.all([
          faqRes.json(),
          categoryRes.json(),
        ]);

        if (!faqRes.ok) {
          throw new Error(faqData.error || "Failed to load current student FAQs.");
        }

        if (!categoryRes.ok) {
          throw new Error(categoryData.error || "Failed to load categories.");
        }

        setQuestions(faqData);
        setCategories(categoryData.current || []);
      } catch (err) {
        console.error("Failed to load current student page:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
      categories={categories}
      questions={questions}
    />
  );
}