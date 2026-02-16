import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "green",
        color: "white",
        textAlign: "center",
        py: 2,
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Running Start Digital. All rights reserved.
        {" "}Contact us!
      </Typography>
      
      <Typography variant="body2">
        253-288-3380 •
        {" "}runningstart@greenriver.edu •
        {" "}(Do not include ID# or file attachments) •
        {" "}Student Affairs & Success Center – SA 135
      </Typography>
    </Box>
  );
}
