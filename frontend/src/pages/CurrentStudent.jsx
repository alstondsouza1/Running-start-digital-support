import { useEffect, useState } from "react";
import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

const API_BASE =
  import.meta.env.VITE_API_BASE;

export default function CurrentStudent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/getFAQS?audience=current`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Failed to load current student FAQs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;

  return (
    <StudentFAQPage
      title="Current Running Start Students"
      description="Find information on fee waivers, class planning, enrollment deadlines, and available campus resources."
      categories={categorySets.current}
      questions={questions}
    />
  );
}