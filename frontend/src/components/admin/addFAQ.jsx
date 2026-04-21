import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  FormHelperText,
} from "@mui/material";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AddFaqForm({
  initialData = null,
  mode = "add",
  onSuccess,
  onCancel,
}) {
  const token = localStorage.getItem("token");

  const emptyForm = {
    audience: "",
    type: "",
    question: "",
    answer: {
      intro: "",
      bullets: [{ text: "", url: "" }],
    },
  };

  const [formData, setFormData] = useState(emptyForm);
  const [allCategories, setAllCategories] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const data = await res.json();
        setAllCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      const audience = initialData.audience || "";
      const type = initialData.type || "";
      setFormData({
        audience,
        type,
        question: initialData.question || "",
        answer: {
          intro: initialData.answer?.intro || "",
          bullets:
            initialData.answer?.bullets?.length > 0
              ? initialData.answer.bullets.map((b) => ({
                  text: b.text || "",
                  url: b.url || "",
                }))
              : [{ text: "", url: "" }],
        },
      });
    } else {
      setFormData(emptyForm);
    }

    setFormError("");
    setFormSuccess("");
  }, [initialData]);

  const categoriesForAudience = formData.audience
    ? allCategories[formData.audience] ?? []
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("");
    setFormSuccess("");

    if (name === "intro") {
      setFormData((prev) => ({
        ...prev,
        answer: { ...prev.answer, intro: value },
      }));
      return;
    }

    if (name === "audience") {
      setFormData((prev) => ({ ...prev, audience: value, type: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletChange = (index, field, value) => {
    setFormError("");
    setFormSuccess("");

    setFormData((prev) => {
      const bullets = [...prev.answer.bullets];
      bullets[index] = { ...bullets[index], [field]: value };
      return { ...prev, answer: { ...prev.answer, bullets } };
    });
  };

  const addBullet = () => {
    setFormData((prev) => ({
      ...prev,
      answer: {
        ...prev.answer,
        bullets: [...prev.answer.bullets, { text: "", url: "" }],
      },
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
    setFormError("");
    setFormSuccess("");

    if (!token) {
      setFormError("You are not logged in. Please login as admin first.");
      return;
    }

    const cleanedBullets = formData.answer.bullets
      .filter((b) => b.text.trim().length > 0)
      .map((b) => ({
        text: b.text.trim(),
        ...(b.url?.trim() ? { url: b.url.trim() } : {}),
      }));

    if (!formData.audience.trim()) {
      setFormError("Please select an audience.");
      return;
    }

    if (!formData.type.trim()) {
      setFormError("Please select a category.");
      return;
    }

    if (!formData.question.trim()) {
      setFormError("Please enter a question.");
      return;
    }

    if (cleanedBullets.length === 0) {
      setFormError("Please add at least one bullet point before submitting.");
      return;
    }

    const payload = {
      ...formData,
      question: formData.question.trim(),
      answer: {
        ...(formData.answer.intro?.trim()
          ? { intro: formData.answer.intro.trim() }
          : {}),
        bullets: cleanedBullets,
      },
    };

    try {
      const url =
        mode === "edit" && initialData?.id
          ? `${API_BASE}/faq/${initialData.id}`
          : `${API_BASE}/addFAQ`;

      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || "Request failed");
      }

      setFormSuccess(
        mode === "edit" ? "FAQ updated successfully." : "FAQ added successfully."
      );

      if (!initialData) {
        setFormData(emptyForm);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
      setFormError(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="faq-form-heading"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography id="faq-form-heading" variant="h5">
        {mode === "edit" ? "Edit FAQ" : "Add FAQ"}
      </Typography>

      {formError && (
        <Alert severity="error" role="alert">
          {formError}
        </Alert>
      )}

      {formSuccess && (
        <Alert severity="success" role="status">
          {formSuccess}
        </Alert>
      )}

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
        select
        name="type"
        label="Category (Type)"
        value={formData.type}
        onChange={handleChange}
        required
        disabled={!formData.audience}
        helperText={!formData.audience ? "Select an audience first" : undefined}
      >
        <MenuItem value="">Select a category</MenuItem>
        {categoriesForAudience.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

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

      <Box component="fieldset" sx={{ border: "1px solid #d0d0d0", borderRadius: 2, p: 2 }}>
        <Typography component="legend" variant="h6" sx={{ px: 1 }}>
          Bullet Points
        </Typography>

        <FormHelperText sx={{ mb: 2 }}>
          Add at least one bullet point. URLs are optional.
        </FormHelperText>

        {formData.answer.bullets.map((bullet, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 2fr auto" },
              gap: 1,
              mb: 2,
            }}
          >
            <TextField
              label={`Bullet ${index + 1} text`}
              value={bullet.text}
              onChange={(e) => handleBulletChange(index, "text", e.target.value)}
            />
            <TextField
              label={`Bullet ${index + 1} URL (optional)`}
              value={bullet.url}
              onChange={(e) => handleBulletChange(index, "url", e.target.value)}
            />
            <Button
              type="button"
              onClick={() => removeBullet(index)}
              disabled={formData.answer.bullets.length === 1}
            >
              Remove
            </Button>
          </Box>
        ))}

        <Button type="button" onClick={addBullet}>
          Add Bullet
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#006225", "&:hover": { backgroundColor: "#004d1a" } }}
        >
          {mode === "edit" ? "Update FAQ" : "Submit FAQ"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}