import Categories from "../components/Categories";
import { categorySets } from "../data/categories";
import { useNavigate } from "react-router-dom";

export default function CurrentStudent() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Current Running Start Students</h2>
      <p>Find answers to common questions below.</p>

      <Categories
        categories={categorySets.current}
        onSelectCategory={(id) => navigate(`/current/${id}`)}
      />
    </div>
  );
}