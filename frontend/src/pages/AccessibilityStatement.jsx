import { Box, Link, Paper, Typography } from "@mui/material";

export default function AccessibilityStatement() {
  return (
    <Box
      component="section"
      aria-labelledby="accessibility-statement-title"
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 5 },
      }}
    >
      <Paper
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2.5, sm: 4 },
          borderRadius: 1,
        }}
      >
        <Typography
          id="accessibility-statement-title"
          variant="h3"
          component="h1"
          fontWeight={800}
          sx={{ fontSize: { xs: "2rem", sm: "2.6rem" }, mb: 2 }}
        >
          Accessibility Statement
        </Typography>

        <Typography sx={{ mb: 2 }}>
          The Running Start Digital Support Portal was built to help current
          and future Running Start students access FAQ information in a clear,
          responsive, and keyboard-friendly format.
        </Typography>

        <Typography variant="h5" component="h2" fontWeight={700} sx={{ mt: 3 }}>
          Accessibility Features
        </Typography>

        <Box component="ul" sx={{ pl: 3, lineHeight: 1.7 }}>
          <li>Skip link support for keyboard users.</li>
          <li>Visible keyboard focus indicators.</li>
          <li>Responsive layouts for mobile, tablet, and desktop.</li>
          <li>Search result status messages for assistive technology.</li>
          <li>High contrast mode.</li>
          <li>Readable font mode.</li>
          <li>Text size controls.</li>
          <li>Reduced motion mode.</li>
          <li>Read aloud support where browser speech synthesis is available.</li>
          <li>Google Translate support where the external script is available.</li>
          <li>Keyboard and touch movement for the accessibility toolbar.</li>
        </Box>

        <Typography variant="h5" component="h2" fontWeight={700} sx={{ mt: 3 }}>
          Known Limitations
        </Typography>

        <Box component="ul" sx={{ pl: 3, lineHeight: 1.7 }}>
          <li>Google Translate depends on an external Google script.</li>
          <li>Read aloud behavior depends on browser and operating system support.</li>
          <li>Admin drag-and-drop ordering may be easier with a mouse or touch device.</li>
          <li>Full automated accessibility testing is not yet part of the build pipeline.</li>
        </Box>

        <Typography variant="h5" component="h2" fontWeight={700} sx={{ mt: 3 }}>
          Contact
        </Typography>

        <Typography>
          If any part of this portal is difficult to access, contact the Running
          Start office at{" "}
          <Link href="mailto:runningstart@greenriver.edu">
            runningstart@greenriver.edu
          </Link>{" "}
          or <Link href="tel:2532883380">253-288-3380</Link>.
        </Typography>
      </Paper>
    </Box>
  );
}
