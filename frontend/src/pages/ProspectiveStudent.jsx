import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

export default function ProspectiveStudent() {
  return (
    <StudentFAQPage
      title="Future Running Start Students"
      description="Explore general program information, enrollment steps, class options, and important policies for Running Start students."
      categories={categorySets.prospective}
      questions={prospectiveStudentsQuestions}
    />
  );
}
