import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { apiUrl, handleAuthErrorResponse } from "../../utils/api";

function createEmptyForm() {
  return { audience: "", name: "", description: "" };
}

export default function AddCategoryForm({
  initialData = null,
  mode = "add",
  onSuccess,
  onCancel,
}) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(createEmptyForm());
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        audience: initialData.audience || "",
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData(createEmptyForm());
    }

    setFormError("");
    setFormSuccess("");
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("");
    setFormSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!token) {
      setFormError("You are not logged in. Please login as admin first.");
      return;
    }

    if (!formData.audience.trim()) {
      setFormError("Please select an audience.");
      return;
    }

    if (!formData.name.trim()) {
      setFormError("Please enter a category name.");
      return;
    }

    const payload = {
      audience: formData.audience.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      setIsSaving(true);

      const url =
        mode === "edit" && initialData?.id
          ? apiUrl(`/categories/${initialData.audience}/${initialData.id}`)
          : apiUrl("/categories");

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
        mode === "edit"
          ? "Category updated successfully."
          : "Category added successfully."
      );

      if (!initialData) {
        setFormData(createEmptyForm());
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="category-form-heading"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography id="category-form-heading" variant="h5">
        {mode === "edit" ? "Edit Category" : "Add Category"}
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
        disabled={mode === "edit" || isSaving}
        helperText={mode === "edit" ? "Audience cannot be changed" : undefined}
      >
        <MenuItem value="">Select Audience</MenuItem>
        <MenuItem value="current">Current</MenuItem>
        <MenuItem value="future">Future</MenuItem>
      </TextField>

      <TextField
        name="name"
        label="Category Name"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={isSaving}
      />

      <TextField
        name="description"
        label="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        multiline
        minRows={2}
        disabled={isSaving}
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSaving}
          sx={{
            backgroundColor: "#006225",
            "&:hover": { backgroundColor: "#004d1a" },
          }}
        >
          {isSaving
            ? mode === "edit"
              ? "Updating..."
              : "Saving..."
            : mode === "edit"
            ? "Update Category"
            : "Submit Category"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
}
