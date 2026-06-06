import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { apiUrl } from "../utils/api";

export default function ProspectiveStudent() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [faqRes, categoryRes] = await Promise.all([
          fetch(apiUrl("/getFAQS?audience=future")),
          fetch(apiUrl("/categories")),
        ]);

        const [faqData, categoryData] = await Promise.all([
          faqRes.json(),
          categoryRes.json(),
        ]);

        if (!faqRes.ok) {
          throw new Error(faqData.error || "Failed to load future student FAQs.");
        }

        if (!categoryRes.ok) {
          throw new Error(categoryData.error || "Failed to load categories.");
        }

        setQuestions(faqData);
        setCategories(categoryData.future || []);
      } catch (err) {
        console.error("Failed to load future student page:", err);
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
      audience="future"
      categories={categories}
      questions={questions}
    />
  );
}
