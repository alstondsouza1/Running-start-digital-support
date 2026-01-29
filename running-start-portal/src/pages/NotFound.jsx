import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Page not found</h2>
      <Link to="/">Go back Home</Link>
    </div>
  );
}