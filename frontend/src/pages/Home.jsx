import { Box, Card, CardContent, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cardStyles = {
    width: 260,
    height: 300,
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
        gap: 3,
        px: 3,
      }}
    >
      {/* Header */}
      <Typography variant="h4" fontWeight={600}>
        Welcome to Green River College
      </Typography>

      <Typography color="text.secondary">
        Choose an option below to find answers and resources
      </Typography>

      {/* Cards */}
      <Box sx={{ display: "flex", gap: 4, mt: 3, flexWrap: "wrap" }}>
        {/* Current Student */}
        <Card sx={cardStyles} onClick={() => navigate("/current-student")}>
          <CardContent sx={{ textAlign: "center" }}>
            <SchoolIcon sx={{ fontSize: 70, color: "#2c882b" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Current Student
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enrollment, classes, records, and support
            </Typography>
          </CardContent>
        </Card>

        {/* Future Student */}
        <Card sx={cardStyles} onClick={() => navigate("/prospective-student")}>
          <CardContent sx={{ textAlign: "center" }}>
            <PersonAddIcon sx={{ fontSize: 70, color: "#2c882b" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Future Student
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Eligibility, registration, and next steps
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
