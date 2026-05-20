// Track FAQ question click
export function trackQuestionClick({
  question,
  categoryId,
  categoryName,
  source,
}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "question_click", {
    question_text: question,
    category_id: categoryId,
    category_name: categoryName,
    source,
  });
}

// Track FAQ search
export function trackFaqSearch({ searchTerm, resultCount }) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "faq_search", {
    search_term: searchTerm,
    result_count: resultCount,
  });
}

// Track category click
export function trackCategoryClick({
  categoryId,
  categoryName,
  audience,
}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "category_click", {
    category_id: categoryId,
    category_name: categoryName,
    audience,
  });
}