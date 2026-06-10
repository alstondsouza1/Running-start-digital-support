import { apiUrl } from "./api";

const CACHE_TTL_MS = 60_000;
const cache = new Map();

function getCached(key, loader) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.createdAt < CACHE_TTL_MS) {
    return cached.promise;
  }

  const promise = loader().catch((error) => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, { createdAt: now, promise });
  return promise;
}

async function fetchJson(path, fallbackMessage) {
  const response = await fetch(apiUrl(path));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || fallbackMessage);
  }

  return data;
}

function loadCategories() {
  return getCached("categories", () =>
    fetchJson("/categories", "Failed to load categories.")
  );
}

function loadFaqs(audience) {
  return getCached(`faqs:${audience}`, () =>
    fetchJson(
      `/getFAQS?audience=${audience}`,
      `Failed to load ${audience} student FAQs.`
    )
  );
}

export async function loadStudentData(audience) {
  const [questions, categoryData] = await Promise.all([
    loadFaqs(audience),
    loadCategories(),
  ]);

  return {
    questions,
    categories: categoryData[audience] || [],
  };
}

export function prefetchStudentData() {
  void Promise.all([
    loadStudentData("current"),
    loadStudentData("future"),
  ]).catch(() => {
    // Page-level loading will show any API error if the user navigates there.
  });
}
