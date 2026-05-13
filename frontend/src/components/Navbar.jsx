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
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/GRC_Logo_White.png";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { adminInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { label: "Home", to: "/" },
    { label: "Current Student", to: "/current-student" },
    { label: "Future Student", to: "/future-student" },
    ...(adminInfo
      ? [
          { label: "Admin", to: "/admin" },
          { label: "Logout", action: handleLogout },
        ]
      : [{ label: "Login", to: "/admin-login" }]),
  ];

  const navButtonStyle = {
    color: "white",
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": { color: "#BBD416" },
    },
    "&:focus-visible": {
      outline: "3px solid #ffffff",
      outlineOffset: "2px",
    },
  };

  const toggleDrawer = (value) => setOpen(value);

  const DrawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 2 }}>
        <img src={Logo} alt="" aria-hidden="true" style={{ height: 40 }} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={700}>Running Start Digital Portal</Typography>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.8 }}>
            Student Capstone Project
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ py: 1 }} aria-label="Mobile navigation">
        {links.map((item, index) => {
          const active = item.to ? location.pathname === item.to : false;
          const isLogin = item.label === "Login";

          return (
            <ListItemButton
              key={index}
              component={item.to ? NavLink : "button"}
              to={item.to}
              onClick={item.action}
              selected={active}
              aria-current={active ? "page" : undefined}
              sx={{
                px: 2,
                ...(isLogin && {
                  backgroundColor: "#ffffff",
                  color: "#006225",
                  fontWeight: 700,
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      backgroundColor: "#f3f3f3",
                    },
                  },
                }),
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
    <AppBar component="header" position="fixed" sx={{ backgroundColor: "green" }}>
      <Toolbar
        sx={{
          gap: { xs: 1, sm: 1.5 },
          minHeight: { xs: 72, sm: 80 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-navigation-drawer"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <a
          href="https://www.greenriver.edu/students/academics/running-start/index.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit the official Green River Running Start website in a new tab"
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <img
            src={Logo}
            alt="Green River College Running Start"
            style={{
              height: isMobile ? 34 : 46,
              marginRight: isMobile ? 8 : 12,
              transition: "filter 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!canHover) return;
              e.currentTarget.style.filter =
                "brightness(0) saturate(100%) invert(31%) sepia(84%) saturate(5931%) hue-rotate(3deg) brightness(95%) contrast(100%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          />
        </a>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              textDecoration: "none",
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.1,
              color: "white",
              display: "inline-block",
              "@media (hover: hover) and (pointer: fine)": {
                "&:hover": { color: "#d14900" },
              },
            }}
          >
            Running Start Digital Portal
          </Typography>

          {!isMobile && (
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.85, lineHeight: 1 }}>
              Student Capstone Project
            </Typography>
          )}
        </Box>

        {!isMobile && (
          <Box component="nav" aria-label="Primary navigation" sx={{ display: "flex", gap: 0.5 }}>
            {links.map((item, index) => {
              const isLogin = item.label === "Login";
              const isActive = item.to ? location.pathname === item.to : false;

              return item.to ? (
                <Button
                  key={index}
                  component={NavLink}
                  to={item.to}
                  aria-current={isActive ? "page" : undefined}
                  variant={isLogin ? "contained" : "text"}
                  sx={
                    isLogin
                      ? {
                          backgroundColor: "#ffffff",
                          color: "#006225",
                          fontWeight: 700,
                          "@media (hover: hover) and (pointer: fine)": {
                            "&:hover": {
                              backgroundColor: "#f3f3f3",
                              color: "#004d1a",
                            },
                          },
                        }
                      : {
                          ...navButtonStyle,
                          ...(isActive && {
                            border: "2px solid white",
                            borderRadius: "12px",
                          }),
                        }
                  }
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={index}
                  onClick={item.action}
                  color="inherit"
                  aria-label="Log out of admin session"
                  sx={navButtonStyle}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        )}

        <Drawer
          anchor="left"
          open={open}
          onClose={() => toggleDrawer(false)}
          PaperProps={{
            id: "mobile-navigation-drawer",
            "aria-label": "Mobile navigation drawer",
          }}
        >
          {DrawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}