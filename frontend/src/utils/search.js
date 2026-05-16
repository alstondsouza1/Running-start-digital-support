export function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function tokenize(query) {
  return normalize(query).split(" ").filter(Boolean);
}

export function scoreText(text, query) {
  const haystack = normalize(text);
  const tokens = tokenize(query);

  if (tokens.length === 0) return 0;

  return tokens.reduce((score, token) => {
    return haystack.includes(token) ? score + 1 : score;
  }, 0);
}
