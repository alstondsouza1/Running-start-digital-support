import { Box, Card, CardContent, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const cardStyles = {
  width: 240,
  height: 280,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  border: "4px solid transparent",
  transition: "border-color 0.25s ease, transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    borderColor: "#D14900",
    boxShadow: 6,
    transform: "scale(1.04)",
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
      <Typography variant="h4" gutterBottom>
        Welcome to Green River College!
      </Typography>

      <Typography variant="h6" gutterBottom>
        Are you a current or future student?
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Current Student */}
        <Card
          sx={cardStyles}
          onClick={() => navigate("/current-student")}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <SchoolIcon sx={{ fontSize: 80 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Current Student
            </Typography>
          </CardContent>
        </Card>

        {/* Future Student */}
        <Card
          sx={cardStyles}
          onClick={() => navigate("/new-student")}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <PersonAddIcon sx={{ fontSize: 80 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Future Student
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
  