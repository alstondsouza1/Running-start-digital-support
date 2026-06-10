import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { loadStudentData } from "../utils/studentData";

export default function ProspectiveStudent() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadStudentData("future");
        setQuestions(data.questions);
        setCategories(data.categories);
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
