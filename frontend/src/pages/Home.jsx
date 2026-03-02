import { Box, Card, CardContent, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cardStyles = {
    width: "100%",
    maxWidth: 360,
    minHeight: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 2,
    border: "2px solid transparent",
    transition: "all 0.25s ease",
    "&:hover": {
      borderColor: "#2c882b",
      boxShadow: 6,
      transform: "translateY(-4px)",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Typography variant="h4" fontWeight={700} sx={{ textAlign: "center" }}>
        Welcome to Green River College
      </Typography>

      <Typography color="text.secondary" sx={{ textAlign: "center", maxWidth: 700 }}>
        Choose an option below to find answers and resources
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: { xs: 2, sm: 3 },
          mt: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Card sx={cardStyles} onClick={() => navigate("/current-student")}>
          <CardContent sx={{ textAlign: "center", px: 3 }}>
            <SchoolIcon sx={{ fontSize: 70, color: "#2c882b" }} />
            <Typography variant="h6" sx={{ mt: 2 }} fontWeight={700}>
              Current Student
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Fee waivers & book loans, class planning, dates & deadlines, and campus resources
            </Typography>
          </CardContent>
        </Card>

        <Card sx={cardStyles} onClick={() => navigate("/prospective-student")}>
          <CardContent sx={{ textAlign: "center", px: 3 }}>
            <PersonAddIcon sx={{ fontSize: 70, color: "#2c882b" }} />
            <Typography variant="h6" sx={{ mt: 2 }} fontWeight={700}>
              Future Student
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              General questions, enrollment, classes, and other (FERPA + moving districts)
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}