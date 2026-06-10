import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  FormHelperText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiUrl, handleAuthErrorResponse } from "../../utils/api";

function createEmptyForm() {
  return {
    audience: "",
    type: "",
    question: "",
    answer: {
      intro: "",
      bullets: [{ text: "", url: "" }],
    },
  };
}

export default function AddFaqForm({
  initialData = null,
  mode = "add",
  onSuccess,
  onCancel,
}) {
  const token = localStorage.getItem("token");
  const errorRef = useRef(null);

  const [formData, setFormData] = useState(createEmptyForm());
  const [allCategories, setAllCategories] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    if (formError) {
      errorRef.current?.focus();
    }
  }, [formError]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(apiUrl("/categories"));
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load categories.");
        }

        setAllCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setFormError("Failed to load categories. Please refresh and try again.");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        audience: initialData.audience || "",
        type: initialData.type || "",
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
      setFormData(createEmptyForm());
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

      return {
        ...prev,
        answer: {
          ...prev.answer,
          bullets,
        },
      };
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
      audience: formData.audience.trim(),
      type: formData.type.trim(),
      question: formData.question.trim(),
      ...(initialData?.id && typeof initialData.is_published === "boolean"
        ? { is_published: initialData.is_published }
        : {}),
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
          ? apiUrl(`/faq/${initialData.id}`)
          : apiUrl("/addFAQ");

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
        handleAuthErrorResponse(response);
        throw new Error(data.error || data.message || "Request failed");
      }

      setFormSuccess(
        mode === "edit" ? "FAQ updated successfully." : "FAQ added successfully."
      );

      if (!initialData) {
        setFormData(createEmptyForm());
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
        <Alert
          ref={errorRef}
          severity="error"
          role="alert"
          tabIndex={-1}
        >
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
        {Object.keys(allCategories).map((audience) => (
          <MenuItem key={audience} value={audience}>
            {audience === "current" ? "Current" : "Future"}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        name="type"
        label="Category"
        value={formData.type}
        onChange={handleChange}
        required
        disabled={!formData.audience}
        helperText={!formData.audience ? "Select an audience first" : undefined}
      >
        <MenuItem value="">Select a category</MenuItem>
        {categoriesForAudience.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
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

      <Box
        component="fieldset"
        sx={{ border: "1px solid #d0d0d0", borderRadius: 2, p: 2 }}
      >
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
              onChange={(e) =>
                handleBulletChange(index, "text", e.target.value)
              }
            />

            <TextField
              label={`Bullet ${index + 1} URL (optional)`}
              value={bullet.url}
              onChange={(e) =>
                handleBulletChange(index, "url", e.target.value)
              }
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

      <Box
        component="section"
        aria-labelledby="faq-preview-heading"
        sx={{
          border: "1px solid #d0d0d0",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography id="faq-preview-heading" variant="h6" sx={{ mb: 1 }}>
          Student Preview
        </Typography>

        <Accordion defaultExpanded disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={700}>
              {formData.question.trim() || "Question preview"}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {formData.answer.intro.trim() && (
              <Typography sx={{ mb: 1.5 }}>{formData.answer.intro}</Typography>
            )}

            <Box component="ul" sx={{ pl: 3, my: 0 }}>
              {formData.answer.bullets
                .filter((bullet) => bullet.text.trim())
                .map((bullet, index) => (
                  <Box component="li" key={index} sx={{ mb: 1 }}>
                    {bullet.text}
                    {bullet.url.trim() && (
                      <Typography
                        component="span"
                        color="text.secondary"
                        sx={{ display: "block", fontSize: "0.9rem" }}
                      >
                        {bullet.url}
                      </Typography>
                    )}
                  </Box>
                ))}
            </Box>

            {!formData.answer.intro.trim() &&
              formData.answer.bullets.every((bullet) => !bullet.text.trim()) && (
                <Typography color="text.secondary">
                  Add a question and bullet points to preview the student view.
                </Typography>
              )}
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#006225",
            "&:hover": { backgroundColor: "#004d1a" },
          }}
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
