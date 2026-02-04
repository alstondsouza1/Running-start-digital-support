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
} from "@mui/material";

import Categories from "../components/Categories";
import { categorySets } from "../data/categories";
import { prospectiveStudentsQuestions } from "../data/prospectiveStudent";

export default function ProspectiveStudent() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const selectedCategory = useMemo(() => {
    return categorySets.prospective.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const questionsForCategory = useMemo(() => {
    return prospectiveStudentsQuestions.filter((q) => q.type === selectedCategoryId);
  }, [selectedCategoryId]);

  const handleSelectCategory = (id) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Future Running Start Students
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Learn how to get started, understand costs, and explore life as a Running Start student.
      </Typography>

      <Categories
        categories={categorySets.prospective}
        selectedId={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
      />

      {selectedCategory && (
        <Box
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            textAlign: "left",
            maxWidth: 1000,
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            {selectedCategory.name}
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {selectedCategory.description}
          </Typography>

          {questionsForCategory.length === 0 && (
            <Typography color="text.secondary">
              No questions in this category yet.
            </Typography>
          )}

          {questionsForCategory.map((item) => (
            <Accordion
              key={item.question}
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
                <Typography fontWeight={500}>{item.question}</Typography>
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
          ))}
        </Box>
      )}
    </Box>
  );
}
