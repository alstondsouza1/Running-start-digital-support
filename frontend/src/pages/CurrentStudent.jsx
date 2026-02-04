import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import Categories from "../components/Categories";
import { categorySets } from "../data/categories";

export default function CurrentStudent() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const selectedCategory = useMemo(() => {
    return categorySets.current.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const handleSelectCategory = (id) => {
    // toggle (click same card again to close)
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Current Running Start Students
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Explore fee waiver/book loan info, class planning, deadlines, and campus resources.
      </Typography>

      <Categories
        categories={categorySets.current}
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