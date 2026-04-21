import { IconButton, InputAdornment, TextField, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function QuestionSearchBar({
  value,
  onChange,
  placeholder = 'Try: "deadline", "ctclink", "ENGL", "book"',
}) {
  const showClear = value.trim().length > 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 980,
        mx: "auto",
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        label="Search FAQs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputProps={{
          "aria-describedby": "faq-search-help",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {showClear && (
                <IconButton
                  aria-label="Clear search"
                  onClick={() => onChange("")}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        helperText="Search by keywords like deadline, class, fee waiver, or enrollment."
        FormHelperTextProps={{
          id: "faq-search-help",
        }}
      />
    </Box>
  );
}