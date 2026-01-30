import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Categories({ categories, onSelectCategory }) {
  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {categories.map((cat) => (
        <Grid item xs={12} sm={6} md={3} key={cat.id}>
          <Card
            sx={{ cursor: "pointer", height: "100%" }}
            onClick={() => onSelectCategory(cat.id)}
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
      ))}
    </Grid>
  );
}