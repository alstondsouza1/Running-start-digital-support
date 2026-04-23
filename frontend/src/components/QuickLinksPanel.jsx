import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";

const studentLinks = [
  { label: "My Green River", href: "https://my.greenriver.edu/" },
  { label: "ctcLink", href: "https://gateway.ctclink.us/" },
  { label: "Canvas", href: "https://greenriver.instructure.com/" },
  { label: "Navigate 360", href: "https://www.greenriver.edu/campus/campus-resources/navigate/index.html" },
  { label: "Student Email", href: "https://outlook.office.com/" },
  { label: "Student Email Help", href: "https://www.greenriver.edu/students/online-services/student-email.html" },
  { label: "Student Remote Access", href: "https://www.greenriver.edu/students/academics/it-student-resources/remote-access/index.html" },
  { label: "Holman Library", href: "https://holmanlibrary.greenriver.edu/" },
  { label: "GRC Virtual Assistance", href: "https://www.greenriver.edu/students/online-services/va.html" },
  { label: "Campus Directory", href: "https://tools.greenriver.edu/staff/" },
];

const staffLinks = [
  {
    label: "Faculty & Staff Portal",
    href: "https://greenriveredu.sharepoint.com/sites/GatorNet/SitePages/Faculty-and-Staff-Portal.aspx",
  },
  { label: "Employee Email", href: "https://outlook.office.com/" },
  { label: "Employee Remote Access", href: "https://client.wvd.microsoft.com/arm/webclient/index.html" },
];

function QuickLinkItem({ label, href }) {
  return (
    <ListItemButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        px: 0,
        py: 0.75,
        borderRadius: 1,
        alignItems: "flex-start",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.04)",
        },
      }}
      aria-label={`${label} opens in a new tab`}
    >
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontWeight: 700,
          fontSize: { xs: "0.98rem", sm: "1rem" },
          sx: {
            color: "white",
            textTransform: "uppercase",
          },
        }}
      />
      <LaunchIcon
        sx={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "1rem",
          mt: "4px",
          ml: 1,
        }}
        aria-hidden="true"
      />
    </ListItemButton>
  );
}

export default function QuickLinksPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open ? "true" : "false"}
        sx={{
          backgroundColor: "#006225",
          color: "white",
          px: 2.25,
          py: 1,
          fontWeight: 700,
          borderRadius: 2,
          textTransform: "none",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#004d1a",
          },
        }}
      >
        Quick Links
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "88vw", sm: 380 },
            maxWidth: 420,
            background: "linear-gradient(180deg, #1f2730 0%, #151b22 100%)",
            color: "white",
            px: 3,
            py: 2.5,
          },
          role: "dialog",
          "aria-labelledby": "quick-links-heading",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              id="quick-links-heading"
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Quick Links
            </Typography>

            <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.8)" }}>
              Helpful student and staff resources from Green River College.
            </Typography>

            <Box
              sx={{
                mt: 1,
                width: 60,
                height: 3,
                borderRadius: 999,
                backgroundColor: "#d14900",
              }}
            />
          </Box>

          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close quick links panel"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mt: "-4px",
              mr: "-8px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          Student Resources
        </Typography>
        <List disablePadding sx={{ mb: 2 }} aria-label="Student resource links">
          {studentLinks.map((link) => (
            <QuickLinkItem key={link.label} {...link} />
          ))}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          Staff Resources
        </Typography>
        <List disablePadding aria-label="Staff resource links">
          {staffLinks.map((link) => (
            <QuickLinkItem key={link.label} {...link} />
          ))}
        </List>
      </Drawer>
    </>
  );
}