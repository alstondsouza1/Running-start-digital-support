export function trackQuestionClick({ question, categoryId, categoryName, source }) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "question_click", {
    question_text: question,
    category_id: categoryId,
    category_name: categoryName,
    source,
  });
}