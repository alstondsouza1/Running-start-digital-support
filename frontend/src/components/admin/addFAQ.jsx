import { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { useAuth } from "../../context/AuthenticateContext";

const API_BASE = import.meta.env.VITE_API_BASE || "https://runningstart-backend.onrender.com/api";

export default function AddFaqForm() {
  const { adminInfo } = useAuth();
  const token = localStorage.getItem("token"); // simplest for now

  const [formData, setFormData] = useState({
    audience: "",
    type: "",
    question: "",
    answer: {
      intro: "",
      bullets: [{ text: "", url: "" }],
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "intro") {
      setFormData((prev) => ({
        ...prev,
        answer: { ...prev.answer, intro: value },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletChange = (index, field, value) => {
    setFormData((prev) => {
      const bullets = [...prev.answer.bullets];
      bullets[index] = { ...bullets[index], [field]: value };
      return { ...prev, answer: { ...prev.answer, bullets } };
    });
  };

  const addBullet = () => {
    setFormData((prev) => ({
      ...prev,
      answer: { ...prev.answer, bullets: [...prev.answer.bullets, { text: "", url: "" }] },
    }));
  };

  const removeBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      answer: {
        ...prev.answer,
        bullets: prev.answer.bullets.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You are not logged in. Please login as admin first.");
      return;
    }

    // clean bullets (remove empty url fields)
    const payload = {
      ...formData,
      answer: {
        ...formData.answer,
        bullets: formData.answer.bullets
          .filter((b) => b.text.trim().length > 0)
          .map((b) => ({
            text: b.text.trim(),
            ...(b.url?.trim() ? { url: b.url.trim() } : {}),
          })),
        ...(formData.answer.intro?.trim() ? { intro: formData.answer.intro.trim() } : {}),
      },
    };

    try {
      const response = await fetch(`${API_BASE}/addFAQ`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to add FAQ");
      }

      alert("FAQ added successfully!");

      setFormData({
        audience: "",
        type: "",
        question: "",
        answer: { intro: "", bullets: [{ text: "", url: "" }] },
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">Add FAQ</Typography>

      <TextField
        select
        name="audience"
        label="Audience"
        value={formData.audience}
        onChange={handleChange}
        required
      >
        <MenuItem value="">Select Audience</MenuItem>
        <MenuItem value="current">Current</MenuItem>
        <MenuItem value="future">Future</MenuItem>
      </TextField>

      <TextField
        name="type"
        label="Type (must match category id)"
        placeholder='Example: "dates-deadlines" or "general"'
        value={formData.type}
        onChange={handleChange}
        required
      />

      <TextField
        name="question"
        label="Question"
        value={formData.question}
        onChange={handleChange}
        required
      />

      <TextField
        name="intro"
        label="Intro (optional)"
        value={formData.answer.intro}
        onChange={handleChange}
        multiline
        minRows={2}
      />

      <Typography variant="h6">Bullet Points</Typography>

      {formData.answer.bullets.map((bullet, index) => (
        <Box key={index} sx={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 1 }}>
          <TextField
            label={`Bullet ${index + 1} text`}
            value={bullet.text}
            onChange={(e) => handleBulletChange(index, "text", e.target.value)}
            required
          />
          <TextField
            label="URL (optional)"
            value={bullet.url}
            onChange={(e) => handleBulletChange(index, "url", e.target.value)}
          />
          <Button type="button" onClick={() => removeBullet(index)} disabled={formData.answer.bullets.length === 1}>
            Remove
          </Button>
        </Box>
      ))}

      <Button type="button" onClick={addBullet}>
        Add Bullet
      </Button>

      <Button type="submit" variant="contained" sx={{ backgroundColor: "#006225", "&:hover": { backgroundColor: "#004d1a" } }}>
        Submit FAQ
      </Button>
    </Box>
  );
}