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
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

const MIN_ZOOM = 90;
const MAX_ZOOM = 140;
const ZOOM_STEP = 10;
const DEFAULT_POSITION = { x: 24, y: 160 };

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(DEFAULT_POSITION);
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
      try {
        setPosition(JSON.parse(savedPosition));
      } catch {
        setPosition(DEFAULT_POSITION);
      }
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
    function handleMouseMove(e) {
      if (!dragging) return;

      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 60;

      const nextPosition = {
        x: Math.max(8, Math.min(e.clientX - offset.x, maxX)),
        y: Math.max(88, Math.min(e.clientY - offset.y, maxY)),
      };

      setPosition(nextPosition);
      localStorage.setItem("accessibilityPosition", JSON.stringify(nextPosition));
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  function startDragging(e) {
    if (e.target.closest("button")) return;

    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }

  function zoomIn() {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }

  function zoomOut() {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }

  function readPage() {
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
  }

  function resetSettings() {
    setZoom(100);
    setHighContrast(false);
    setReadableFont(false);
    setIsReading(false);
    setPosition(DEFAULT_POSITION);

    window.speechSynthesis?.cancel();

    localStorage.removeItem("accessibilityZoom");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("readableFont");
    localStorage.removeItem("accessibilityPosition");

    document.documentElement.style.setProperty("--accessibility-scale", 1);
    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
  }

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
        maxWidth: "calc(100vw - 16px)",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 6,
        border: "1px solid #d0d0d0",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        onMouseDown={startDragging}
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
      >
        <DragIndicatorIcon aria-hidden="true" />

        <Typography fontWeight={700} sx={{ flexGrow: 1 }}>
          Accessibility
        </Typography>

        <IconButton
          size="small"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close accessibility tools" : "Open accessibility tools"}
          sx={{ color: "white" }}
        >
          <AccessibilityNewIcon />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Translate Page
          </Typography>

          <Box
            id="google_translate_element"
            aria-label="Language translation selector"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 1.5 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Text Size: {zoom}%
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
            >
              A-
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
            >
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