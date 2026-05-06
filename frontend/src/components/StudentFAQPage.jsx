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
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Link
} from "@mui/material";

import Categories from "./Categories";
import QuestionSearchBar from "./QuestionSearchBar";
import { normalize, tokenize, scoreText } from "../utils/search";
import normalizeUrl from "../utils/normalizeURL.js";
import { trackQuestionClick } from "../utils/analytics";

function escapeRegExp(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const sourceText = String(text ?? "");
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return sourceText;
  }

  const regex = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const chunks = sourceText.split(regex);

  return chunks.map((chunk, index) => {
    const isMatch = tokens.some(
      (token) => chunk.toLowerCase() === token.toLowerCase()
    );

    if (isMatch) {
      return (
        <Box
          key={index}
          component="mark"
          sx={{
            backgroundColor: "rgba(187, 212, 22, 0.35)",
            px: 0.3,
            borderRadius: 0.5,
          }}
        >
          {chunk}
        </Box>
      );
    }

    return <span key={index}>{chunk}</span>;
  });
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
          scoreText(questionBlob, searchTerm) * 3 +
          scoreText(restBlob, searchTerm);

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

  const handleAccordionChange = (item) => (_event, expanded) => {
    if (!expanded) return;

    const cat = categoryById(categories, item.type);

    trackQuestionClick({
      question: item.question,
      categoryId: item.type,
      categoryName: cat?.name ?? item.type,
      source: isSearching ? "search" : "browse",
    });
  };

  const renderAccordion = (item, idx) => {
    const key = getAccordionKey(item, idx);
    const summaryId = `${key}-summary`;
    const detailsId = `${key}-details`;
    const categoryName = categoryById(categories, item.type)?.name ?? item.type;

    return (
      <Accordion
        key={key}
        disableGutters
        onChange={handleAccordionChange(item)}
        sx={{
          "&:before": { display: "none" },
          boxShadow: 0,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <AccordionSummary
          id={summaryId}
          aria-controls={detailsId}
          expandIcon={<span aria-hidden="true">▼</span>}
          sx={{ "& .MuiAccordionSummary-content": { my: 1 } }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Typography component="h3" fontWeight={600}>
              {isSearching ? highlightText(item.question, searchTerm) : item.question}
            </Typography>

            {isSearching && (
              <Box>
                <Chip
                  size="small"
                  label={categoryName}
                  aria-label={`Category ${categoryName}`}
                />
              </Box>
            )}
          </Box>
        </AccordionSummary>

        <AccordionDetails
          id={detailsId}
          role="region"
          aria-labelledby={summaryId}
          sx={{ pt: 0 }}
        >
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
                  key={`${key}-bullet-${i}`}
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
                          aria-label={`${bullet.text} opens in a new tab`}
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
  };

  return (
    <Box
      component="section"
      aria-labelledby="faq-page-title"
      sx={{ width: "100%", px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}
    >
      <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>
        <Typography
          id="faq-page-title"
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
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
          aria-atomic="true"
        >
          {isSearching
            ? `${searchResults.length} search results found`
            : selectedCategory
            ? `${questionsForCategory.length} questions in ${selectedCategory.name}`
            : "Select a category to view questions"}
        </Box>

        {isSearching ? (
          <Box
            component="section"
            aria-labelledby="search-results-heading"
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
            <Typography
              id="search-results-heading"
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Search Results ({searchResults.length})
            </Typography>

            {searchResults.length === 0 ? (
              <Typography color="text.secondary">
                No results found. Try different keywords like “deadline”, “book”,
                “ENGL”, or “ctcLink”.
              </Typography>
            ) : (
              searchResults.map((item, idx) => renderAccordion(item, idx))
            )}
          </Box>
        ) : (
          <>
            <Typography id="faq-category-heading" fontWeight={700} sx={{ mb: 2 }}>
              Browse Categories
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Select a category card to view related frequently asked questions.
            </Typography>

            <Categories
              categories={categories}
              selectedId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />

            {selectedCategory ? (
              <Box
                component="section"
                aria-labelledby="selected-category-heading"
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
                <Typography
                  id="selected-category-heading"
                  variant="h5"
                  sx={{ mb: 0.5 }}
                  fontWeight={700}
                >
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

      <Box
        sx={{
          mt: 6,
          p: 3,
          backgroundColor: "#f9fafb",
          borderRadius: 2,
          textAlign: "center",
          maxWidth: 800,
          mx: "auto",
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Need more help?
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          If you couldn’t find your answer, reach out to the Running Start office
          during normal hours or use the virtual lobby when available.
        </Typography>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 12px" }}>
            <TableBody>
              <TableRow>
                
                {/* Virtual Lobby */}
                <TableCell
                  sx={{
                    verticalAlign: "top",
                    width: 220,
                    border: "none",
                    backgroundColor: "#f9fafb",
                    borderRadius: "12px",
                    p: 2,
                    textAlign: "center", 
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Virtual Lobby
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <Link
                      href="https://zoom.us/j/92758435873?pwd=M2Z2cHQ5MWdVZm9WdHA2UEN3K3Mzdz09"
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      Zoom Virtual Lobby
                    </Link>
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Mon–Thu:</strong> 2:00 PM – 4:30 PM <br />
                    <strong>Fri:</strong> 2:00 PM – 4:00 PM
                  </Typography>
                </TableCell>

                {/* Hours */}
                <TableCell
                  sx={{
                    verticalAlign: "top",
                    width: 220,
                    border: "none",
                    backgroundColor: "#e5e7e4",
                    borderRadius: "12px",
                    p: 2,
                    textAlign: "center", 
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Hours
                  </Typography>

                  <Typography variant="body2">
                    <strong>Mon–Thu:</strong> 8:00 AM – 5:00 PM <br />
                    <strong>Fri: </strong>9:30 AM – 4:30 PM <br />
                    <strong>Visit:</strong> Student Affairs & Success Center (SA 135)
                  </Typography>
                </TableCell>

                {/* Contact */}
                <TableCell
                  sx={{
                    verticalAlign: "top",
                    width: 220,
                    border: "none",
                    backgroundColor: "#f9fafb",
                    borderRadius: "12px",
                    p: 2,
                    textAlign: "center", 
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Contact
                  </Typography>

                  <Typography variant="body2">
                    <strong>Phone:</strong> 253-288-3380 <br />
                    <strong>Email:</strong>{" "}
                    <Link
                      href="mailto:runningstart@greenriver.edu"
                      underline="hover"
                    >
                      runningstart@greenriver.edu
                    </Link>
                  </Typography>
                </TableCell>

              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}