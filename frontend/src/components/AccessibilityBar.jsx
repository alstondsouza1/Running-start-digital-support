import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const MIN_ZOOM = 90;
const MAX_ZOOM = 140;
const ZOOM_STEP = 10;
const DEFAULT_POSITION = { x: 16, y: 120 };

function getSavedPosition() {
  const savedPosition = localStorage.getItem("accessibilityPosition");

  if (!savedPosition) return DEFAULT_POSITION;

  try {
    const parsed = JSON.parse(savedPosition);
    const hasValidCoordinates =
      Number.isFinite(parsed?.x) && Number.isFinite(parsed?.y);

    return hasValidCoordinates ? parsed : DEFAULT_POSITION;
  } catch {
    return DEFAULT_POSITION;
  }
}

function getSavedZoom() {
  const savedZoom = Number(localStorage.getItem("accessibilityZoom"));

  if (!Number.isFinite(savedZoom)) return 100;

  return Math.min(Math.max(savedZoom, MIN_ZOOM), MAX_ZOOM);
}

export default function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(getSavedPosition);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(getSavedZoom);
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true"
  );
  const [readableFont, setReadableFont] = useState(
    localStorage.getItem("readableFont") === "true"
  );
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accessibility-scale",
      zoom / 100
    );
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

      const widgetWidth = open ? 360 : 320;
      const widgetHeight = open ? 390 : 56;

      const nextPosition = {
        x: Math.max(
          8,
          Math.min(e.clientX - dragOffset.x, window.innerWidth - widgetWidth)
        ),
        y: Math.max(
          8,
          Math.min(e.clientY - dragOffset.y, window.innerHeight - widgetHeight)
        ),
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
  }, [dragging, dragOffset, open]);

  function startDragging(e) {
    if (e.target.closest("button")) return;

    setDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }

  function readPage() {
    if (!("speechSynthesis" in window)) {
      alert("Read aloud is not supported in this browser.");
      return;
    }

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const main = document.getElementById("main-content");
    const text = main?.innerText || document.body.innerText || "";

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

    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
    document.documentElement.style.setProperty("--accessibility-scale", 1);
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
        width: open ? { xs: "calc(100vw - 32px)", sm: 360 } : 320,
        maxWidth: "calc(100vw - 16px)",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
        border: "1px solid #d0d0d0",
        backgroundColor: "white",
      }}
    >
      <Box
        onMouseDown={startDragging}
        sx={{
          backgroundColor: "#ffffff",
          color: "#222",
          px: 1.5,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          borderBottom: open ? "1px solid #dddddd" : "none",
        }}
      >
        <DragIndicatorIcon sx={{ color: "#006225" }} aria-hidden="true" />

        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>
            Accessibility
          </Typography>

          {!open && (
            <Typography variant="body2" color="text.secondary">
              Translate, text size, contrast
            </Typography>
          )}
        </Box>

        <Tooltip title={open ? "Close tools" : "Open tools"}>
          <IconButton
            size="small"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close accessibility tools" : "Open accessibility tools"}
            sx={{
              color: "#006225",
              border: "1px solid #006225",
              "&:hover": {
                backgroundColor: "#eef7ef",
              },
            }}
          >
            {open ? <CloseIcon /> : <AccessibilityNewIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 2 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Select Language
          </Typography>

          <Box
            id="google_translate_element"
            aria-label="Language translation selector"
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Text Size
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
              }
              disabled={zoom <= MIN_ZOOM}
              sx={smallButtonSx}
            >
              A-
            </Button>

            <Typography
              aria-live="polite"
              sx={{ minWidth: 60, textAlign: "center" }}
            >
              {zoom}%
            </Typography>

            <Button
              variant="outlined"
              onClick={() =>
                setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
              }
              disabled={zoom >= MAX_ZOOM}
              sx={smallButtonSx}
            >
              A+
            </Button>
          </Stack>

          <Stack spacing={1}>
            <Button
              fullWidth
              variant={readableFont ? "contained" : "outlined"}
              startIcon={<TextFieldsIcon />}
              onClick={() => setReadableFont((prev) => !prev)}
              sx={buttonSx}
            >
              {readableFont ? "Readable Font On" : "Readable Font"}
            </Button>

            <Button
              fullWidth
              variant={highContrast ? "contained" : "outlined"}
              startIcon={<ContrastIcon />}
              onClick={() => setHighContrast((prev) => !prev)}
              sx={buttonSx}
            >
              {highContrast ? "High Contrast On" : "High Contrast"}
            </Button>

            <Button
              fullWidth
              variant={isReading ? "contained" : "outlined"}
              startIcon={<RecordVoiceOverIcon />}
              onClick={readPage}
              sx={buttonSx}
            >
              {isReading ? "Stop Reading" : "Read Page Aloud"}
            </Button>

            <Button
              fullWidth
              variant="text"
              startIcon={<RestartAltIcon />}
              onClick={resetSettings}
              sx={{
                color: "#006225",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Reset Settings
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}

const smallButtonSx = {
  borderColor: "#006225",
  color: "#006225",
  textTransform: "none",
  "&:hover": {
    borderColor: "#004d1a",
    backgroundColor: "#eef7ef",
  },
};

const buttonSx = {
  borderRadius: 1,
  fontWeight: 700,
  borderColor: "#006225",
  color: "#006225",
  textTransform: "none",
  "&.MuiButton-contained": {
    backgroundColor: "#006225",
    color: "white",
  },
  "&:hover": {
    borderColor: "#004d1a",
    backgroundColor: "#eef7ef",
  },
  "&.MuiButton-contained:hover": {
    backgroundColor: "#004d1a",
  },
};