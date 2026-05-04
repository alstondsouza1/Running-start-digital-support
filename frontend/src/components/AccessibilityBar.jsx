import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TranslateIcon from "@mui/icons-material/Translate";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";

const MIN_ZOOM = 90;
const MAX_ZOOM = 140;
const ZOOM_STEP = 10;

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);

  const [zoom, setZoom] = useState(() => {
    return Number(localStorage.getItem("accessibilityZoom")) || 100;
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("highContrast") === "true";
  });

  const [readableFont, setReadableFont] = useState(() => {
    return localStorage.getItem("readableFont") === "true";
  });

  useEffect(() => {
    const scale = zoom / 100;
    document.documentElement.style.setProperty("--accessibility-scale", scale);
    localStorage.setItem("accessibilityZoom", String(zoom));
  }, [zoom]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast-mode", highContrast);
    localStorage.setItem("highContrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.toggle("readable-font-mode", readableFont);
    localStorage.setItem("readableFont", String(readableFont));
  }, [readableFont]);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = function () {
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "en,es,ar,hi,zh-CN,ko,vi,fr,de,ja,pa,tl,so,ru,uk",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const resetSettings = () => {
    setZoom(100);
    setHighContrast(false);
    setReadableFont(false);

    localStorage.removeItem("accessibilityZoom");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("readableFont");

    document.documentElement.style.setProperty("--accessibility-scale", 1);
    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open accessibility tools"
        aria-expanded={open ? "true" : "false"}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 9999,
          width: 64,
          height: 64,
          backgroundColor: "#006225",
          color: "white",
          boxShadow: 5,
          "&:hover": {
            backgroundColor: "#004d1a",
          },
          "&:focus-visible": {
            outline: "3px solid #d14900",
            outlineOffset: "3px",
          },
        }}
      >
        <AccessibilityNewIcon fontSize="large" />
      </IconButton>

      {open && (
        <Paper
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
          sx={{
            position: "fixed",
            right: 24,
            bottom: 100,
            zIndex: 9999,
            width: { xs: "90vw", sm: 390 },
            maxWidth: 420,
            p: 3,
            borderRadius: 3,
            boxShadow: 8,
            backgroundColor: "white",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography id="accessibility-title" variant="h5" fontWeight={700}>
                Accessibility Tools
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Adjust text size, contrast, font, and translation.
              </Typography>
            </Box>

            <IconButton onClick={() => setOpen(false)} aria-label="Close tools">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Text Size: {zoom}%
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RemoveIcon />}
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
            >
              Zoom Out
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              sx={{
                backgroundColor: "#006225",
                "&:hover": { backgroundColor: "#004d1a" },
              }}
            >
              Zoom In
            </Button>
          </Stack>

          <Button
            fullWidth
            variant={readableFont ? "contained" : "outlined"}
            startIcon={<TextFieldsIcon />}
            onClick={() => setReadableFont((prev) => !prev)}
            sx={{ mb: 1.5 }}
          >
            {readableFont ? "Readable Font On" : "Turn On Readable Font"}
          </Button>

          <Button
            fullWidth
            variant={highContrast ? "contained" : "outlined"}
            startIcon={<ContrastIcon />}
            onClick={() => setHighContrast((prev) => !prev)}
            sx={{ mb: 2 }}
          >
            {highContrast ? "High Contrast On" : "Turn On High Contrast"}
          </Button>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              mb: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography
              fontWeight={700}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <TranslateIcon fontSize="small" />
              Translate Page
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 1, fontSize: "0.9rem" }}>
              Select a language from the dropdown.
            </Typography>

            <div id="google_translate_element" />
          </Box>

          <Button
            fullWidth
            color="error"
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={resetSettings}
          >
            Reset Settings
          </Button>
        </Paper>
      )}
    </>
  );
}