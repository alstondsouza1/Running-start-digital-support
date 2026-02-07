import StudentFAQPage from "../components/StudentFAQPage";
import { categorySets } from "../data/categories";

export default function CurrentStudent() {
  return (
    <StudentFAQPage
      title="Current Running Start Students"
      description="Explore fee waiver/book loan info, class planning, deadlines, and campus resources."
      categories={categorySets.current}
    />
  );
}