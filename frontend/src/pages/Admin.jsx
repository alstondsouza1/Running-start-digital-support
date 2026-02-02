import { useState } from "react";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  if (isLoggedIn) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Admin</h2>
        <p>Welcome! Admin tools coming soon.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 320,
          padding: 24,
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
