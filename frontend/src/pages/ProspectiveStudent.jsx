import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Categories from "../components/Categories";
import { categorySets } from "../data/categories";

export default function ProspectiveStudent() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const selectedCategory = useMemo(() => {
    return categorySets.prospective.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const handleSelectCategory = (id) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Prospective Students & Parents
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Learn about eligibility, enrollment, and classes.
      </Typography>

      <Categories
        categories={categorySets.prospective}
        selectedId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {selectedCategory && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            textAlign: "left",
            maxWidth: 1000,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            {selectedCategory.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {selectedCategory.description}
          </Typography>

          <Typography>
            Content coming soon. (This is where FAQs for this category will go.)
          </Typography>
        </Box>
      )}
    </Box>
  );
}