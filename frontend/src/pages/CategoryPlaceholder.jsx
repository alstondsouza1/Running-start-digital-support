import { useParams, Link } from "react-router-dom";

export default function CategoryPlaceholder() {
  const { audience, category } = useParams();

  const audienceLabel =
    audience === "current"
      ? "Current Running Start Students"
      : "Prospective Students & Parents";

  const title = category
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div style={{ padding: 24 }}>
      <h2>{title}</h2>
      <p>{audienceLabel}</p>
      <p>Content coming soon.</p>

      <div style={{ marginTop: 16 }}>
        <Link to={audience === "current" ? "/current-student" : "/prospective-student"}>
          ← Back to categories
        </Link>
      </div>
    </div>
  );
}