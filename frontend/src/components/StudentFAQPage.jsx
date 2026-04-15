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
  Chip,
} from "@mui/material";

import Categories from "./Categories";
import QuestionSearchBar from "./QuestionSearchBar";
import { normalize, scoreText } from "../utils/search";
import normalizeUrl from "../utils/normalizeURL.js";

function escapeRegExp(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const q = (query || "").trim();
  if (!q) return text;

  const parts = q.split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (parts.length === 0) return text;

  const regex = new RegExp(`(${parts.join("|")})`, "gi");
  const chunks = String(text ?? "").split(regex);

  return chunks.map((chunk, i) =>
    regex.test(chunk) ? (
      <Box
        key={i}
        component="mark"
        sx={{
          backgroundColor: "rgba(187, 212, 22, 0.35)",
          px: 0.3,
          borderRadius: 0.5,
        }}
      >
        {chunk}
      </Box>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

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

    return questions
      .map((q, index) => {
        const cat = categoryById(categories, q.type);

        const questionBlob = q.question ?? "";
        const restBlob = [answerToText(q.answer), cat?.name, cat?.description]
          .filter(Boolean)
          .join(" | ");

        const score =
          scoreText(questionBlob, searchTerm) * 3 + scoreText(restBlob, searchTerm);

        return { q, score, index };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.q);
  }, [categories, questions, isSearching, searchTerm]);

  const handleSelectCategory = (id) => {
    setSearchTerm("");
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleSearchChange = (value) => {
    setSelectedCategoryId(null);
    setSearchTerm(value);
  };

  const getAccordionKey = (item, fallbackIndex) =>
    item.id ?? `${item.type}-${normalize(item.question)}-${fallbackIndex}`;

  const renderAccordion = (item, idx) => (
    <Accordion
      key={getAccordionKey(item, idx)}
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
          <Typography fontWeight={600}>
            {isSearching ? highlightText(item.question, searchTerm) : item.question}
          </Typography>

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
          <Typography sx={{ mb: 1 }}>
            {isSearching
              ? highlightText(item.answer.intro, searchTerm)
              : item.answer.intro}
          </Typography>
        )}

        {item.answer?.bullets?.length > 0 && (
          <List dense disablePadding sx={{ pl: 2 }}>
            {item.answer.bullets.map((bullet, i) => (
              <ListItem
                key={`${getAccordionKey(item, idx)}-bullet-${i}`}
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
                        href={normalizeUrl(bullet.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isSearching
                          ? highlightText(bullet.text, searchTerm)
                          : bullet.text}
                      </MuiLink>
                    ) : isSearching ? (
                      highlightText(bullet.text, searchTerm)
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
        <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>

        {description && (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}

        <QuestionSearchBar value={searchTerm} onChange={handleSearchChange} />

        <Box
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
          }}
          aria-live="polite"
        >
          {isSearching
            ? `${searchResults.length} search results found`
            : selectedCategory
            ? `${questionsForCategory.length} questions in ${selectedCategory.name}`
            : "Select a category to view questions"}
        </Box>

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
                No results found. Try different keywords like “deadline”, “book”, “ENGL”, or “ctcLink”.
              </Typography>
            ) : (
              searchResults.map((item, idx) => renderAccordion(item, idx))
            )}
          </Box>
        ) : (
          <>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Browse Categories:
            </Typography>

            <Categories
              categories={categories}
              selectedId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />

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
                  questionsForCategory.map((item, idx) =>
                    renderAccordion(item, idx)
                  )
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