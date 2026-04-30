import { Card, CardContent, Typography, Box, CardActionArea } from "@mui/material";

export default function Categories({ categories, onSelectCategory, selectedId }) {
  const clickable = Boolean(onSelectCategory);

  const handleSelect = (id) => {
    if (onSelectCategory) onSelectCategory(id);
  };

  return (
    <Box
      component="section"
      aria-labelledby="faq-category-heading"
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Box
        role="list"
        sx={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gap: { xs: 2, sm: 3 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;

          return (
            <Box role="listitem" key={cat.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  border: isSelected
                    ? "2px solid #2c882b"
                    : "1px solid rgba(0,0,0,0.12)",
                  boxShadow: isSelected ? 4 : 1,
                  minHeight: { xs: 120, sm: 140 },
                }}
              >
                <CardActionArea
                  onClick={() => handleSelect(cat.id)}
                  disabled={!clickable}
                  aria-pressed={clickable ? isSelected : undefined}
                  aria-label={`${isSelected ? "Selected category" : "Open category"} ${cat.name}`}
                  sx={{
                    height: "100%",
                    alignItems: "stretch",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": clickable
                      ? { transform: "translateY(-2px)" }
                      : {},
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      px: { xs: 2, sm: 3 },
                      py: { xs: 2, sm: 2.5 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 1,
                      textAlign: "left",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        lineHeight: 1.2,
                        fontSize: { xs: "1rem", sm: "1.15rem" },
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cat.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.35,
                        fontSize: { xs: "0.92rem", sm: "0.95rem" },
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cat.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}