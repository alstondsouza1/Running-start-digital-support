import Categories from "../components/Categories";
import { categorySets } from "../data/categories";

export default function CurrentStudent() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Current Running Start Students</h2>
      <p>Find answers to common questions below.</p>

      <Categories categories={categorySets.current} />
    </div>
  );
}