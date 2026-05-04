import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

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

  const [isReading, setIsReading] = useState(false);

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

  const readPage = () => {
    if (!("speechSynthesis" in window)) {
      alert("Your browser does not support read aloud.");
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const main = document.getElementById("main-content");
    const text = main?.innerText || "";

    if (!text.trim()) return;

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1;

    speech.onend = () => setIsReading(false);
    speech.onerror = () => setIsReading(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    setIsReading(true);
  };

  const resetSettings = () => {
    setZoom(100);
    setHighContrast(false);
    setReadableFont(false);
    setIsReading(false);

    window.speechSynthesis?.cancel();

    localStorage.removeItem("accessibilityZoom");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("readableFont");

    document.documentElement.style.setProperty("--accessibility-scale", 1);
    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
  };

  return (
    <Box
      component="section"
      aria-label="Accessibility and translation tools"
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #d0d0d0",
        px: { xs: 1, sm: 2 },
        py: 1,
        position: "relative",
        zIndex: 2000,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            minWidth: { xs: "100%", sm: 220 },
          }}
        >
          <Box id="google_translate_element" aria-label="Language translation selector" />
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button size="small" variant="outlined" onClick={() => setOpen((prev) => !prev)}>
            Accessibility Tools
          </Button>

          <Button size="small" variant="outlined" onClick={zoomOut} disabled={zoom <= MIN_ZOOM}>
            A-
          </Button>

          <Button size="small" variant="outlined" onClick={zoomIn} disabled={zoom >= MAX_ZOOM}>
            A+
          </Button>

          <Button
            size="small"
            variant={highContrast ? "contained" : "outlined"}
            onClick={() => setHighContrast((prev) => !prev)}
          >
            Contrast
          </Button>
        </Stack>
      </Box>

      <Collapse in={open}>
        <Divider sx={{ my: 1.5 }} />

        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Text Size: {zoom}%
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button fullWidth variant="outlined" onClick={zoomOut} disabled={zoom <= MIN_ZOOM}>
                Zoom Out
              </Button>

              <Button fullWidth variant="contained" onClick={zoomIn} disabled={zoom >= MAX_ZOOM}>
                Zoom In
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Reading Support
            </Typography>

            <Stack spacing={1}>
              <Button
                variant={readableFont ? "contained" : "outlined"}
                startIcon={<TextFieldsIcon />}
                onClick={() => setReadableFont((prev) => !prev)}
              >
                {readableFont ? "Readable Font On" : "Readable Font"}
              </Button>

              <Button
                variant={isReading ? "contained" : "outlined"}
                startIcon={<RecordVoiceOverIcon />}
                onClick={readPage}
              >
                {isReading ? "Stop Reading" : "Read Page"}
              </Button>
            </Stack>
          </Box>

          <Box>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Display Options
            </Typography>

            <Stack spacing={1}>
              <Button
                variant={highContrast ? "contained" : "outlined"}
                startIcon={<ContrastIcon />}
                onClick={() => setHighContrast((prev) => !prev)}
              >
                {highContrast ? "High Contrast On" : "High Contrast"}
              </Button>

              <Button
                color="error"
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetSettings}
              >
                Reset Settings
              </Button>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1200, mx: "auto", pt: 1 }}>
          <Typography
            color="text.secondary"
            sx={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 1 }}
          >
            <TranslateIcon fontSize="small" />
            Translation uses Google Translate. It may load more reliably after deployment than on localhost.
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
}