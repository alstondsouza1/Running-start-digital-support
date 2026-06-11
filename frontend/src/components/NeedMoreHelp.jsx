import {
    Box,
    Button,
    Card,
    CardContent,
    Link,
    Stack,
    Typography,
  } from "@mui/material";
import { trackSupportClick } from "../utils/analytics";
  
  import VideocamIcon from "@mui/icons-material/Videocam";
  import EmailIcon from "@mui/icons-material/Email";
  import PhoneIcon from "@mui/icons-material/Phone";
  
  export default function NeedMoreHelp() {
    return (
      <Card
        component="section"
        aria-labelledby="need-more-help-heading"
        sx={{
          mt: 4,
          mx: "auto",
          maxWidth: 900,
          borderRadius: 2.5,
          boxShadow: "none",
          border: "1px solid #dddddd",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            id="need-more-help-heading"
            variant="h5"
            fontWeight={700}
            sx={{
              mb: 1,
              color: "#006225",
            }}
          >
            Need more help?
          </Typography>
  
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Contact the Running Start office if you still need help.
          </Typography>
  
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <SupportBox
              icon={<VideocamIcon />}
              title="Virtual Lobby"
              text="Mon–Thu: 2:00 PM – 4:30 PM"
              subText="Fri: 2:00 PM – 4:00 PM"
              buttonText="Join Zoom"
              href="https://zoom.us/j/92758435873?pwd=M2Z2cHQ5MWdVZm9WdHA2UEN3K3Mzdz09"
              supportType="virtual_lobby"
            />
  
            <SupportBox
              icon={<EmailIcon />}
              title="Email"
              text="runningstart@greenriver.edu"
              subText="Questions or documents"
              buttonText="Send Email"
              href="mailto:runningstart@greenriver.edu"
              supportType="email"
            />
  
            <SupportBox
              icon={<PhoneIcon />}
              title="Phone"
              text="253-288-3380"
              subText="During office hours"
              buttonText="Call Office"
              href="tel:2532883380"
              supportType="phone"
            />
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  function SupportBox({
    icon,
    title,
    text,
    subText,
    buttonText,
    href,
    supportType,
  }) {
    const isExternal = href.startsWith("http");

    function handleClick() {
      // Analytics: support/help contact click.
      trackSupportClick({ type: supportType });
    }

    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid #e5e5e5",
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Stack spacing={1}>
          <Box sx={{ color: "#006225" }}>
            {icon}
          </Box>
  
          <Typography fontWeight={700}>
            {title}
          </Typography>
  
          <Typography variant="body2">
            {text}
          </Typography>
  
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subText}
          </Typography>
  
          <Button
            component={Link}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={handleClick}
            variant="text"
            sx={{
              justifyContent: "flex-start",
              px: 0,
              minWidth: 0,
              color: "#006225",
              textTransform: "none",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            {buttonText}
          </Button>
        </Stack>
      </Box>
    );
  }
