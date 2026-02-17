// src/data/adaptQuestions.js

export function adaptQuestions(rawQuestions, groupKey) {
  return rawQuestions.map((q, index) => ({
    // admin-only metadata
    id: `${groupKey}-${q.type}-${index}`,
    order: index,
    active: true,

    // original partner data (unchanged)
    type: q.type,
    question: q.question,
    answer: q.answer,
  }));
}
