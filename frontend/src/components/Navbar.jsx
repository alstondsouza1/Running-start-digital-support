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
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Logo from "../assets/GRC_Logo_White.png";
import { useAuth } from "../context/AuthenticateContext";

export default function Navbar() {
  const { adminInfo, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
    "&:hover": { color: "#BBD416" },
    "&:focus-visible": {
      outline: "3px solid #ffffff",
      outlineOffset: "2px",
    },
  };

  const toggleDrawer = (value) => setOpen(value);

  const DrawerContent = (
    <Box sx={{ width: 280 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 2 }}>
        <img src={Logo} alt="Green River College logo" style={{ height: 40 }} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={700}>Running Start Digital Portal</Typography>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.8 }}>
            Student Capstone Project
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ py: 1 }}>
        {links.map((item, index) => {
          const active = item.to ? location.pathname === item.to : false;
          const isLogin = item.label === "Login";

          return (
            <ListItemButton
              key={index}
              component={item.to ? Link : "button"}
              to={item.to}
              onClick={item.action}
              selected={active}
              sx={{
                px: 2,
                ...(isLogin && {
                  backgroundColor: "green",
                  color: "white",
                  "&:hover": { backgroundColor: "#d14900", color: "white" },
                }),
                "&.Mui-selected": { backgroundColor: "rgba(44,136,43,0.12)" },
                "&.Mui-selected:hover": { backgroundColor: "rgba(44,136,43,0.18)" },
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
      <Toolbar sx={{ gap: 1.5 }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}

        <a
          href="https://www.greenriver.edu/students/academics/running-start/index.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={Logo}
            alt="Green River College Running Start"
            style={{
              height: 46,
              marginRight: 12,
              transition: "filter 0.3s",
              cursor: "pointer",
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
              fontSize: { xs: "1rem", sm: "1.1rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.1,
              color: "white",
              "&:hover": { color: "#d14900" },
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
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {links.map((item, index) =>
              item.to ? (
                <Button
                  key={index}
                  component={Link}
                  to={item.to}
                  variant={item.label === "Login" ? "contained" : "text"}
                  sx={
                    item.label === "Login"
                      ? {
                          backgroundColor: "green",
                          color: "white",
                          "&:hover": {
                            color: "white",
                            backgroundColor: "#d14900",
                          },
                        }
                      : navButtonStyle
                  }
                >
                  {item.label}
                </Button>
              ) : (
                <Button key={index} onClick={item.action} color="inherit" sx={navButtonStyle}>
                  {item.label}
                </Button>
              )
            )}
          </Box>
        )}

        <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
          {DrawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}