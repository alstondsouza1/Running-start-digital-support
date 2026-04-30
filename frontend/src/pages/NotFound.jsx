import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Page not found
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        The page you are looking for does not exist or may have been moved.
      </Typography>

      <Button component={Link} to="/" variant="contained" sx={{ backgroundColor: "#006225" }}>
        Go back home
      </Button>
    </Box>
  );
}