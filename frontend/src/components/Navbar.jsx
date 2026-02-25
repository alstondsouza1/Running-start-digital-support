import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/GRC_Logo_White.png";

export default function Navbar() {
  const hoverColor = "#BBD416";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md and smaller => drawer
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const links = [
    { label: "Home", to: "/" },
    { label: "Current Student", to: "/current-student" },
    { label: "Future Student", to: "/prospective-student" },
    { label: "Admin", to: "/admin" },
  ];

  const navButtonStyle = {
    "&:hover": { color: hoverColor },
  };

  const toggleDrawer = (value) => setOpen(value);

  const DrawerContent = (
    <Box sx={{ width: 280 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 2 }}>
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
        <Typography fontWeight={700}>Running Start Digital</Typography>
      </Box>

      <Divider />

      <List sx={{ py: 1 }}>
        {links.map((item) => {
          const active = location.pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              sx={{
                px: 2,
                "&.Mui-selected": {
                  backgroundColor: "rgba(44,136,43,0.12)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(44,136,43,0.18)",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar sx={{ gap: 1.5 }}>
        {/* Mobile menu icon */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              height: 46,
              marginRight: 12,
              transition: "filter 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter =
                "brightness(0) saturate(100%) invert(31%) sepia(84%) saturate(5931%) hue-rotate(3deg) brightness(95%) contrast(100%)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          />
        </Link>

        {/* Title (shrinks on mobile) */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Running Start Digital
        </Typography>

        {/* Desktop nav buttons */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {links.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                color="inherit"
                sx={navButtonStyle}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Drawer */}
        <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
          {DrawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}