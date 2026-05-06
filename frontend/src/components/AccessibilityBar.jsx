import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
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
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(
    Number(localStorage.getItem("accessibilityZoom")) || 100
  );

  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true"
  );

  const [readableFont, setReadableFont] = useState(
    localStorage.getItem("readableFont") === "true"
  );

  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    const savedPosition = localStorage.getItem("accessibilityPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;

      const nextPosition = {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      };

      setPosition(nextPosition);
      localStorage.setItem("accessibilityPosition", JSON.stringify(nextPosition));
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const startDragging = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

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
    setPosition({ x: 20, y: 100 });

    window.speechSynthesis?.cancel();

    localStorage.removeItem("accessibilityZoom");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("readableFont");
    localStorage.removeItem("accessibilityPosition");

    document.documentElement.style.setProperty("--accessibility-scale", 1);
    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
  };

  return (
    <Paper
      role="region"
      aria-label="Accessibility and translation tools"
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        width: open ? { xs: 320, sm: 390 } : "auto",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 6,
        border: "1px solid #d0d0d0",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#006225",
          color: "white",
          px: 1,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={startDragging}
      >
        <DragIndicatorIcon aria-hidden="true" />

        <Typography fontWeight={700} sx={{ flexGrow: 1 }}>
          Accessibility
        </Typography>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          aria-label={open ? "Close accessibility tools" : "Open accessibility tools"}
          sx={{ color: "white" }}
        >
          <AccessibilityNewIcon />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Translate Page
            </Typography>
            <Box id="google_translate_element" aria-label="Language translation selector" />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Text Size: {zoom}%
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button fullWidth variant="outlined" onClick={zoomOut} disabled={zoom <= MIN_ZOOM}>
              A-
            </Button>
            <Button fullWidth variant="outlined" onClick={zoomIn} disabled={zoom >= MAX_ZOOM}>
              A+
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Button
              variant={readableFont ? "contained" : "outlined"}
              startIcon={<TextFieldsIcon />}
              onClick={() => setReadableFont((prev) => !prev)}
            >
              {readableFont ? "Readable Font On" : "Readable Font"}
            </Button>

            <Button
              variant={highContrast ? "contained" : "outlined"}
              startIcon={<ContrastIcon />}
              onClick={() => setHighContrast((prev) => !prev)}
            >
              {highContrast ? "High Contrast On" : "High Contrast"}
            </Button>

            <Button
              variant={isReading ? "contained" : "outlined"}
              startIcon={<RecordVoiceOverIcon />}
              onClick={readPage}
            >
              {isReading ? "Stop Reading" : "Read Page"}
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

          <Typography color="text.secondary" sx={{ fontSize: "0.8rem", mt: 1.5 }}>
            Drag the green header to move this tool.
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
}