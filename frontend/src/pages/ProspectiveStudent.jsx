import Categories from "../components/Categories";
import { categorySets } from "../data/categories";

export default function ProspectiveStudent() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Prospective Students & Parents</h2>
      <p>Learn about eligibility, enrollment, and classes.</p>

      <Categories categories={categorySets.prospective} />
    </div>
  );
}