import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import Categories from "./Categories";
import { matchesQuery, normalize } from "../utils/search";

function answerToText(answer) {
  if (!answer) return "";
  const intro = answer.intro ? String(answer.intro) : "";
  const bullets = Array.isArray(answer.bullets)
    ? answer.bullets.map((b) => b?.text ?? "").join(" ")
    : "";
  return `${intro} ${bullets}`.trim();
}

function categoryById(categories, id) {
  return categories.find((c) => c.id === id) || null;
}

export default function StudentFAQPage({
  title,
  description,
  categories = [],
  questions = [],
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const isSearching = normalize(searchTerm).length > 0;

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const questionsForCategory = useMemo(() => {
    if (!selectedCategoryId) return [];
    return questions.filter((q) => q.type === selectedCategoryId);
  }, [questions, selectedCategoryId]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];

    return questions.filter((q) => {
      const cat = categoryById(categories, q.type);

      const blob = [
        q.question,
        answerToText(q.answer),
        cat?.name,
        cat?.description,
      ]
        .filter(Boolean)
        .join(" | ");

      return matchesQuery(blob, searchTerm);
    });
  }, [categories, questions, isSearching, searchTerm]);

  const handleSelectCategory = (id) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  const renderAccordion = (item) => (
    <Accordion
      key={`${item.type}-${item.question}`}
      disableGutters
      sx={{
        "&:before": { display: "none" },
        boxShadow: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <AccordionSummary
        expandIcon={<span aria-hidden="true">▼</span>}
        sx={{ "& .MuiAccordionSummary-content": { my: 1 } }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography fontWeight={600}>{item.question}</Typography>

          {/* show category label in search mode */}
          {isSearching && (
            <Box>
              <Chip
                size="small"
                label={categoryById(categories, item.type)?.name ?? item.type}
              />
            </Box>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        {item.answer?.intro && (
          <Typography sx={{ mb: 1 }}>{item.answer.intro}</Typography>
        )}

        {item.answer?.bullets?.length > 0 && (
          <List dense disablePadding sx={{ pl: 2 }}>
            {item.answer.bullets.map((bullet, i) => (
              <ListItem
                key={`${item.question}-${i}`}
                component="li"
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  py: 0.25,
                }}
              >
                <ListItemText
                  primary={
                    bullet.url ? (
                      <MuiLink
                        href={bullet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {bullet.text}
                      </MuiLink>
                    ) : (
                      bullet.text
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
      <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>

        {description && (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}

        {/* Search bar ALWAYS visible */}
        <TextField
          fullWidth
          label="Search FAQs"
          placeholder='Try: "deadline", "ctclink", "ENGL", "book"'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3, maxWidth: 980 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm.trim().length > 0 && (
                  <IconButton
                    aria-label="Clear search"
                    onClick={() => setSearchTerm("")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        {/* SEARCH MODE: only results */}
        {isSearching ? (
          <Box
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 1,
              textAlign: "left",
              maxWidth: 980,
              mx: "auto",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Search Results ({searchResults.length})
            </Typography>

            {searchResults.length === 0 ? (
              <Typography color="text.secondary">
                No results found. Try different keywords (ex: “deadline”, “book”, “ENGL”, “ctclink”).
              </Typography>
            ) : (
              searchResults.map(renderAccordion)
            )}
          </Box>
        ) : (
          <>
            {/* CATEGORY MODE */}
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Browse Categories:
            </Typography>

            <Categories
              categories={categories}
              selectedId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />

            {/* Show questions ONLY when category selected */}
            {selectedCategory ? (
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: "white",
                  borderRadius: 2,
                  boxShadow: 1,
                  textAlign: "left",
                  maxWidth: 980,
                  mx: "auto",
                }}
              >
                <Typography variant="h5" sx={{ mb: 0.5 }} fontWeight={700}>
                  {selectedCategory.name}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {selectedCategory.description}
                </Typography>

                {questionsForCategory.length === 0 ? (
                  <Typography color="text.secondary">
                    No questions in this category yet.
                  </Typography>
                ) : (
                  questionsForCategory.map(renderAccordion)
                )}
              </Box>
            ) : (
              <Typography
                color="text.secondary"
                sx={{ mt: 3, textAlign: "center" }}
              >
                Select a category to view questions.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
