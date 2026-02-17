import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";
import { currentStudentsQuestions } from "../data/currentStudent";

export default function CurrentStudent() {
  return (
    <StudentFAQPage
      title="Current Running Start Students"
      description="Find information on fee waivers, class planning, enrollment deadlines, and available campus resources."
      categories={categorySets.current}
      questions={currentStudentsQuestions}
    />
  );
}
