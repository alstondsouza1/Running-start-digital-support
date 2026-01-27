import * as React from "react";
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />

      {/* Fixed NavBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Running Start Digital
          </Typography>
          <Button color="inherit">HOME</Button>
          <Button color="inherit">CURENT STUDENT</Button>
          <Button color="inherit">NEW STUDENT</Button>
          <Button color="inherit">ADMIN</Button>
        </Toolbar>
      </AppBar>

      {/* Full-screen content */}
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          pt: "64px", 
        }}
      >
        <Typography variant="h3" gutterBottom>
          Running Start Digital Support Portal
        </Typography>
        <Typography variant="h6">
          Project setup in progress.
        </Typography>
      </Box>
    </>
  );
}

export default App;
