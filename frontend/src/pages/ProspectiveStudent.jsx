import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

export default function ProspectiveStudent() {
  return (
    <StudentFAQPage
      title="Future Running Start Students"
      description="Learn how to get started, understand costs, and explore life as a Running Start student."
      categories={categorySets.prospective}
      questions={prospectiveStudentsQuestions}
    />
  );
}
