import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "green",
        color: "white",
        textAlign: "center",
        py: { xs: 2, sm: 2.5 },
        px: { xs: 2, sm: 3 },
        mt: "auto",
      }}
    >
      {/* Main Footer Text */}
      <Typography
        variant="body2"
        sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
      >
        © {new Date().getFullYear()} Running Start Digital. All rights reserved. Contact us!
      </Typography>

      {/* Contact Info */}
      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
          opacity: 0.95,
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        253-288-3380 • runningstart@greenriver.edu • (Do not include ID# or file attachments) •
        Student Affairs & Success Center – SA 135
      </Typography>

      {/* Link to Green River */}
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
        }}
      >
        <Link
          href="https://www.greenriver.edu"
          target="_blank"
          rel="noopener noreferrer"
          underline="always"
          color="inherit"
        >
          Visit Green River College
        </Link>
      </Typography>

      {/* DISCLAIMER */}
      <Box
        sx={{
          mt: 2,
          fontSize: "0.75rem",
          opacity: 0.8,
          lineHeight: 1.4,
        }}
      >
        <Typography variant="body2">
          This website was created by students as part of a course project. Content does not represent official Green River College positions.
        </Typography>

        <Typography variant="body2" sx={{ mt: 0.5 }}>
          This is a student capstone project and is not an official Green River College website.
        </Typography>
      </Box>
    </Box>
  );
}