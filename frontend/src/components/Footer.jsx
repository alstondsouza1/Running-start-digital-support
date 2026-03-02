import { Box, Typography } from "@mui/material";

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
      <Typography variant="body2" sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
        © {new Date().getFullYear()} Running Start Digital. All rights reserved. Contact us!
      </Typography>

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
    </Box>
  );
}