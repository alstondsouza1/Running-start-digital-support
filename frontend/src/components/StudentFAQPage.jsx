import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Categories from "./Categories";
import QuestionSearchBar from "./QuestionSearchBar";
import NeedMoreHelp from "./NeedMoreHelp";
import { normalize, tokenize, scoreText } from "../utils/search";
import normalizeUrl from "../utils/normalizeURL.js";
import {
  trackQuestionClick,
  trackFaqSearch,
  trackCategoryClick,
} from "../utils/analytics";

function escapeRegExp(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const sourceText = String(text ?? "");
  const tokens = tokenize(query);

  if (tokens.length === 0) return sourceText;

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

function getCategoryById(categories, id) {
  return categories.find((category) => category.id === id) || null;
}

export default function StudentFAQPage({
  title,
  description,
  audience = "",
  categories = [],
  questions = [],
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(false);
  const questionsSectionRef = useRef(null);

  const isSearching = normalize(searchTerm).length > 0;

  const selectedCategory = useMemo(
    () => getCategoryById(categories, selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const visibleQuestions = useMemo(() => {
    let baseQuestions = questions;

    if (selectedCategoryId) {
      baseQuestions = baseQuestions.filter(
        (question) => question.type === selectedCategoryId
      );
    }

    if (!isSearching) {
      return baseQuestions;
    }

    return baseQuestions
      .map((question) => {
        const category = getCategoryById(categories, question.type);
        const searchableText = [
          question.question,
          answerToText(question.answer),
          category?.name,
          category?.description,
        ].join(" ");

        return {
          ...question,
          searchScore: scoreText(searchableText, searchTerm),
        };
      })
      .filter((question) => question.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore);
  }, [categories, isSearching, questions, searchTerm, selectedCategoryId]);

  useEffect(() => {
    if (!isSearching) return;

    const timeoutId = window.setTimeout(() => {
      trackFaqSearch({
        searchTerm,
        resultCount: visibleQuestions.length,
      });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [isSearching, searchTerm, visibleQuestions.length]);

  function handleCategorySelect(categoryId) {
    const nextCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    const category = getCategoryById(categories, categoryId);

    setSelectedCategoryId(nextCategoryId);
    setExpandedId(false);

    if (nextCategoryId && category) {
      trackCategoryClick({
        categoryId: category.id,
        categoryName: category.name,
        audience,
      });

      window.setTimeout(() => {
        questionsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  function handleAccordionChange(question, category) {
    return (_event, isExpanded) => {
      setExpandedId(isExpanded ? question.id : false);

      if (isExpanded) {
        trackQuestionClick({
          question: question.question,
          categoryId: question.type,
          categoryName: category?.name || "Unknown category",
          source: isSearching ? "search" : "category",
        });
      }
    };
  }

  function clearSearch() {
    setSearchTerm("");
  }

  const resultMessage = isSearching
    ? `${visibleQuestions.length} FAQ result${
        visibleQuestions.length === 1 ? "" : "s"
      } found for ${searchTerm}.`
    : selectedCategory
      ? `${visibleQuestions.length} FAQ question${
          visibleQuestions.length === 1 ? "" : "s"
        } shown in ${selectedCategory.name}.`
      : "Choose a category or search to view FAQ questions.";

  return (
    <Box
      component="section"
      aria-labelledby="student-faq-page-title"
      sx={{
        px: { xs: 1.5, sm: 3 },
        py: { xs: 3, sm: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", textAlign: "center" }}>
        <Typography
          id="student-faq-page-title"
          variant="h3"
          component="h1"
          fontWeight={700}
          sx={{
            fontSize: { xs: "1.85rem", sm: "2.6rem", md: "3rem" },
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1.5,
            mb: 4,
            mx: "auto",
            maxWidth: 760,
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          {description}
        </Typography>
      </Box>

      <QuestionSearchBar value={searchTerm} onChange={setSearchTerm} />

      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          maxWidth: 980,
          mx: "auto",
          mb: 2,
          color: "text.secondary",
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2">{resultMessage}</Typography>

        <Stack direction="row" spacing={1}>
          {isSearching && (
            <Button size="small" variant="outlined" onClick={clearSearch}>
              Clear Search
            </Button>
          )}
        </Stack>
      </Box>

      {!isSearching && (
        <Categories
          categories={categories}
          selectedId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
        />
      )}

      <Box
        ref={questionsSectionRef}
        component="section"
        aria-labelledby="faq-results-heading"
        sx={{
          maxWidth: 980,
          mx: "auto",
          mt: { xs: 3, sm: 4 },
          scrollMarginTop: { xs: 88, sm: 96 },
        }}
      >
        <Typography id="faq-results-heading" variant="h4" component="h2" gutterBottom>
          {isSearching
            ? "Search Results"
            : selectedCategory
              ? selectedCategory.name
              : "FAQ Questions"}
        </Typography>

        {!selectedCategory && !isSearching && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Select a category above or use the search bar to find answers.
          </Typography>
        )}

        {(selectedCategory || isSearching) && visibleQuestions.length === 0 && (
          <Box
            role="status"
            sx={{
              mt: 2,
              p: 2,
              border: "1px dashed #cfcfcf",
              borderRadius: 1,
              backgroundColor: "#ffffff",
            }}
          >
            <Typography color="text.secondary" sx={{ mb: isSearching ? 1 : 0 }}>
              No FAQ results found
              {isSearching ? ` for "${searchTerm}".` : "."} Try another keyword
              or choose a different category.
            </Typography>

            {isSearching && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button size="small" variant="outlined" onClick={clearSearch}>
                  Clear Search
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  component={MuiLink}
                  href="mailto:runningstart@greenriver.edu"
                  sx={{
                    textDecoration: "none",
                    backgroundColor: "#006225",
                    "&:hover": { backgroundColor: "#004d1a" },
                  }}
                >
                  Email Running Start
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  component={MuiLink}
                  href="tel:2532883380"
                  sx={{ textDecoration: "none" }}
                >
                  Call Office
                </Button>
              </Stack>
            )}
          </Box>
        )}

        {(selectedCategory || isSearching) &&
          visibleQuestions.map((question) => {
            const category = getCategoryById(categories, question.type);
            const answer = question.answer || {};
            const bullets = Array.isArray(answer.bullets) ? answer.bullets : [];
            const panelId = `faq-panel-${question.id}`;
            const headerId = `faq-header-${question.id}`;

            return (
              <Accordion
                key={question.id}
                expanded={expandedId === question.id}
                onChange={handleAccordionChange(question, category)}
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={panelId}
                  id={headerId}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography component="h3" fontWeight={700}>
                      {highlightText(question.question, searchTerm)}
                    </Typography>

                    {category && (
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                        <Chip
                          label={category.name}
                          size="small"
                          sx={{
                            backgroundColor: "#eef7ef",
                            color: "#006225",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    )}
                  </Box>
                </AccordionSummary>

                <AccordionDetails id={panelId} aria-labelledby={headerId}>
                  {answer.intro && (
                    <Typography sx={{ mb: 1.5 }}>
                      {highlightText(answer.intro, searchTerm)}
                    </Typography>
                  )}

                  {bullets.length > 0 ? (
                    <Box
                      component="ul"
                      sx={{
                        pl: 3,
                        mt: 1,
                        mb: 0,
                      }}
                    >
                      {bullets.map((bullet, index) => {
                        const href = bullet.url ? normalizeUrl(bullet.url) : "";

                        return (
                          <Box
                            component="li"
                            key={`${question.id}-${index}`}
                            sx={{
                              mb: 1,
                              lineHeight: 1.6,
                            }}
                          >
                            {href ? (
                              <MuiLink
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${bullet.text} opens in a new tab`}
                              >
                                {highlightText(bullet.text, searchTerm)}
                              </MuiLink>
                            ) : (
                              highlightText(bullet.text, searchTerm)
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Content coming soon.
                    </Typography>
                  )}

                </AccordionDetails>
              </Accordion>
            );
          })}
      </Box>

      <NeedMoreHelp />
    </Box>
  );
}
