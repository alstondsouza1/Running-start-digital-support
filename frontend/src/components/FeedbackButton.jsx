import { Button } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";

export default function FeedbackButton() {
  return (
    <Button
      component="a"
      href="https://docs.google.com/forms/d/e/1FAIpQLScN1mQvZYCjWOsUCj7B-RyMK16dd6ad2I51pHDZ0cWk2_6v9Q/viewform?usp=dialog"
      target="_blank"
      rel="noopener noreferrer"
      variant="outlined"
      size="small"
      startIcon={<FeedbackIcon />}
      sx={{
        position: "fixed",
        top: 92,
        left: 16,
        zIndex: 1100,
        display: { xs: "none", md: "inline-flex" },
        backgroundColor: "white",
        color: "#2c882b",
        borderColor: "#2c882b",
        textTransform: "none",
        fontWeight: 600,
        "&:hover": {
          backgroundColor: "#f0f8f0",
          borderColor: "#1a5e1a",
        },
      }}
      aria-label="Give feedback about this site"
    >
      Please provide feedback
    </Button>
  );
}
