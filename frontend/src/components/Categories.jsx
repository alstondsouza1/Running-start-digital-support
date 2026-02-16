import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Categories({ categories, onSelectCategory, selectedId }) {
  const clickable = Boolean(onSelectCategory);

  const handleSelect = (id) => {
    if (onSelectCategory) onSelectCategory(id);
  };

  const handleKeyDown = (e, id) => {
    if (!clickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id);
    }
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;

        return (
          <Grid item xs={12} sm={6} md={3} key={cat.id}>
            <Card
              onClick={() => handleSelect(cat.id)}
              onKeyDown={(e) => handleKeyDown(e, cat.id)}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              sx={{
                cursor: clickable ? "pointer" : "default",
                height: "100%",
                border: isSelected
                  ? "2px solid green"
                  : "1px solid rgba(0,0,0,0.12)",
                boxShadow: isSelected ? 4 : 1,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": clickable
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow: isSelected ? 6 : 3,
                    }
                  : {},
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {cat.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
