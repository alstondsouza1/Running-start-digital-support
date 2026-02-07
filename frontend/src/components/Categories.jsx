import { Card, CardContent, Typography, Box } from "@mui/material";

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

  // one place to control exact size
  const CARD_WIDTH = 420;  
  const CARD_HEIGHT = 140;  
  const GAP = 24;           

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center", 
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: `${GAP}px`,
          justifyContent: "center",
          // 2 columns on desktop, 1 column on mobile
          gridTemplateColumns: {
            xs: "1fr",
            sm: `${CARD_WIDTH}px ${CARD_WIDTH}px`,
          },
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;

          return (
            <Card
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              onKeyDown={(e) => handleKeyDown(e, cat.id)}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              sx={{
                cursor: clickable ? "pointer" : "default",
                width: { xs: "100%", sm: `${CARD_WIDTH}px` },
                height: `${CARD_HEIGHT}px`,
                borderRadius: 2,
                border: isSelected
                  ? "2px solid #2c882b"
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
              <CardContent
                sx={{
                  height: "100%",
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    lineHeight: 1.2,
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
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {cat.description}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
