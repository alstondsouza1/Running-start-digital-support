import Categories from "../components/Categories";
import { categorySets } from "../data/categories";
import { useNavigate } from "react-router-dom";

export default function ProspectiveStudent() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Prospective Students & Parents</h2>
      <p>Learn about eligibility, enrollment, and classes.</p>

      <Categories
        categories={categorySets.prospective}
        onSelectCategory={(id) => navigate(`/prospective/${id}`)}
      />
    </div>
  );
}