import { useCallback, useEffect, useRef, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MotionPhotosOffIcon from "@mui/icons-material/MotionPhotosOff";
import TranslateIcon from "@mui/icons-material/Translate";

const MIN_ZOOM = 90;
const MAX_ZOOM = 140;
const ZOOM_STEP = 10;
const DEFAULT_POSITION = { x: 16, y: 120 };
const MOBILE_DEFAULT_POSITION = { x: 12, y: 86 };
const EDGE_GAP = 8;

function clearGoogleTranslateCookies() {
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
}

function getInitialPosition() {
  const savedPosition = localStorage.getItem("accessibilityPosition");

  if (savedPosition) {
    try {
      return JSON.parse(savedPosition);
    } catch {
      localStorage.removeItem("accessibilityPosition");
    }
  }

  return window.matchMedia("(max-width:599.95px)").matches
    ? MOBILE_DEFAULT_POSITION
    : DEFAULT_POSITION;
}

export default function AccessibilityBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const toolbarRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(getInitialPosition);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(
    Number(localStorage.getItem("accessibilityZoom")) || 100
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true"
  );
  const [readableFont, setReadableFont] = useState(
    localStorage.getItem("readableFont") === "true"
  );
  const [reducedMotion, setReducedMotion] = useState(
    localStorage.getItem("reducedMotion") === "true"
  );
  const [isReading, setIsReading] = useState(false);

  const getToolbarSize = useCallback((isOpen) => {
    const bounds = toolbarRef.current?.getBoundingClientRect();

    return {
      width: bounds?.width || Math.min(isOpen ? 340 : 260, window.innerWidth - 24),
      height: bounds?.height || (isOpen ? 520 : 64),
    };
  }, []);

  const clampPosition = useCallback(
    (nextPosition, isOpen) => {
      const { width, height } = getToolbarSize(isOpen);
      const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP);
      const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP);

      return {
        x: Math.max(EDGE_GAP, Math.min(nextPosition.x, maxX)),
        y: Math.max(EDGE_GAP, Math.min(nextPosition.y, maxY)),
      };
    },
    [getToolbarSize]
  );

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
    document.body.classList.toggle("reduced-motion-mode", reducedMotion);
    localStorage.setItem("reducedMotion", String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    function initGoogleTranslate() {
      const container = document.getElementById("google_translate_element");

      if (!container) return;
      if (container.childElementCount > 0) return;
      if (!window.google?.translate?.TranslateElement) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    }

    window.googleTranslateElementInit = initGoogleTranslate;

    if (window.google?.translate?.TranslateElement) {
      initGoogleTranslate();
      return;
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => {
        console.error("Google Translate script failed to load.");
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    function handlePointerMove(e) {
      if (!dragging) return;

      const nextPosition = clampPosition(
        {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        },
        open
      );

      setPosition(nextPosition);
      localStorage.setItem("accessibilityPosition", JSON.stringify(nextPosition));
    }

    function handlePointerUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [clampPosition, dragging, dragOffset, open]);

  useEffect(() => {
    function handleResize() {
      setPosition((currentPosition) => {
        const nextPosition = clampPosition(currentPosition, open);
        localStorage.setItem(
          "accessibilityPosition",
          JSON.stringify(nextPosition)
        );
        return nextPosition;
      });
    }

    const frameId = window.requestAnimationFrame(handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [clampPosition, open]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function startDragging(e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest("button")) return;
    if (e.target.closest("select")) return;
    if (e.target.closest("a")) return;

    e.preventDefault();
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

  function resetTranslation() {
    clearGoogleTranslateCookies();
    window.location.reload();
  }

  function resetSettings() {
    setZoom(100);
    setHighContrast(false);
    setReadableFont(false);
    setReducedMotion(false);
    setIsReading(false);
    setPosition(isMobile ? MOBILE_DEFAULT_POSITION : DEFAULT_POSITION);

    window.speechSynthesis?.cancel();

    localStorage.removeItem("accessibilityZoom");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("readableFont");
    localStorage.removeItem("reducedMotion");
    localStorage.removeItem("accessibilityPosition");

    document.body.classList.remove("high-contrast-mode");
    document.body.classList.remove("readable-font-mode");
    document.body.classList.remove("reduced-motion-mode");

    document.documentElement.style.setProperty("--accessibility-scale", 1);
  }

  return (
    <Paper
      ref={toolbarRef}
      role="region"
      aria-label="Accessibility and translation tools"
      sx={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        width: open
          ? { xs: "min(340px, calc(100vw - 24px))", sm: 340 }
          : { xs: "min(260px, calc(100vw - 24px))", sm: 260 },
        maxWidth: "calc(100vw - 24px)",
        maxHeight: open ? "calc(100vh - 110px)" : "auto",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.22)",
        border: "1px solid #d0d0d0",
        backgroundColor: "white",
      }}
    >
      <Box
        onPointerDown={startDragging}
        sx={{
          backgroundColor: "#ffffff",
          color: "#222",
          px: 1.5,
          py: 1.2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          borderBottom: open ? "1px solid #dddddd" : "none",
        }}
      >
        <DragIndicatorIcon sx={{ color: "#006225" }} aria-hidden="true" />

        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
            Accessibility
          </Typography>

          {!open && (
            <Typography variant="caption" color="text.secondary">
              Translate • Text • Contrast
            </Typography>
          )}
        </Box>

        <Tooltip title={open ? "Close tools" : "Open tools"}>
          <IconButton
            size="small"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={
              open ? "Close accessibility tools" : "Open accessibility tools"
            }
            sx={{
              color: "#006225",
              border: "1px solid #006225",
              width: 38,
              height: 38,
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
        <Box
          sx={{
            p: 2,
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <TranslateIcon sx={{ color: "#006225" }} aria-hidden="true" />
            <Typography fontWeight={800}>Translate Page</Typography>
          </Box>

          <Box
            id="google_translate_element"
            aria-label="Language translation selector"
            sx={{ mb: 1 }}
          />

          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={resetTranslation}
            sx={resetButtonSx}
          >
            Back to Original Language
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5, lineHeight: 1.4 }}
          >
            Translations are machine-generated. Please confirm important details
            with the official Running Start office.
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Text Size
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Button
              variant="outlined"
              aria-label="Decrease text size"
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
              sx={{ minWidth: 54, textAlign: "center" }}
            >
              {zoom}%
            </Typography>

            <Button
              variant="outlined"
              aria-label="Increase text size"
              onClick={() =>
                setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
              }
              disabled={zoom >= MAX_ZOOM}
              sx={smallButtonSx}
            >
              A+
            </Button>
          </Stack>

          <Stack spacing={0.9}>
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
              variant={reducedMotion ? "contained" : "outlined"}
              startIcon={<MotionPhotosOffIcon />}
              onClick={() => setReducedMotion((prev) => !prev)}
              sx={buttonSx}
            >
              {reducedMotion ? "Reduced Motion On" : "Reduce Motion"}
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
          </Stack>

          <Button
            fullWidth
            variant="text"
            startIcon={<RestartAltIcon />}
            onClick={resetSettings}
            sx={{
              mt: 1.5,
              color: "#006225",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Reset Accessibility Settings
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
}

const resetButtonSx = {
  borderColor: "#006225",
  color: "#006225",
  textTransform: "none",
  fontWeight: 700,
  mb: 1.5,
  "&:hover": {
    borderColor: "#004d1a",
    backgroundColor: "#eef7ef",
  },
};

const smallButtonSx = {
  borderColor: "#006225",
  color: "#006225",
  textTransform: "none",
  minHeight: 42,
  flex: 1,
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
  minHeight: 42,
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
