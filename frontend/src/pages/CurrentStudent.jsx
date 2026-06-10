import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { loadStudentData } from "../utils/studentData";

export default function CurrentStudent() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadStudentData("current");
        setQuestions(data.questions);
        setCategories(data.categories);
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
      audience="current"
      categories={categories}
      questions={questions}
    />
  );
}
