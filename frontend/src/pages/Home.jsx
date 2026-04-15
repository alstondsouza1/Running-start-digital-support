import { Box, Card, CardContent, Typography, CardActionArea } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link as RouterLink } from "react-router-dom";
import QuickLinksPanel from "../components/QuickLinksPanel";

export default function Home() {
  const cardStyles = {
    width: "100%",
    maxWidth: 360,
    minHeight: { xs: 250, sm: 280 },
    borderRadius: 2,
    border: "2px solid transparent",
    transition: "all 0.25s ease",
    boxShadow: 2,
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
        py: { xs: 4, sm: 5 },
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        sx={{
          textAlign: "center",
          fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
        }}
      >
        Welcome to Green River College
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          textAlign: "center",
          maxWidth: 760,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          px: { xs: 1, sm: 0 },
        }}
      >
        Choose whether you are a current or future Running Start student to quickly
        find FAQs, support information, and important next steps.
      </Typography>

      <Box sx={{ mt: 1 }}>
        <QuickLinksPanel />
      </Box>

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
        <Card sx={cardStyles}>
          <CardActionArea
            component={RouterLink}
            to="/current-student"
            aria-label="Go to Current Student FAQ page"
            sx={{
              minHeight: { xs: 250, sm: 280 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ px: 3 }}>
              <SchoolIcon sx={{ fontSize: 70, color: "#2c882b" }} />
              <Typography variant="h5" sx={{ mt: 2 }} fontWeight={700}>
                Current Student
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                Fee waivers, class planning, dates and deadlines, and campus resources
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={cardStyles}>
          <CardActionArea
            component={RouterLink}
            to="/future-student"
            aria-label="Go to Future Student FAQ page"
            sx={{
              minHeight: { xs: 250, sm: 280 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <CardContent sx={{ px: 3 }}>
              <PersonAddIcon sx={{ fontSize: 70, color: "#2c882b" }} />
              <Typography variant="h5" sx={{ mt: 2 }} fontWeight={700}>
                Future Student
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                General questions, enrollment, classes, and other important policies
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}