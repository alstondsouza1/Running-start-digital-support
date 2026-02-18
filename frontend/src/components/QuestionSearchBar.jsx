import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function QuestionSearchBar({
  value,
  onChange,
  placeholder = 'Try: "deadline", "ctclink", "ENGL", "book"',
}) {
  const showClear = value.trim().length > 0;

  return (
    <TextField
      fullWidth
      label="Search FAQs"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      sx={{ mb: 3, maxWidth: 980 }}
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
    />
  );
}
