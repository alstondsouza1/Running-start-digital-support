export function normalize(value) {
    return String(value ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }
  
  export function tokenize(query) {
    return normalize(query).split(" ").filter(Boolean);
  }
  
  /**
   * True if *all* query tokens appear somewhere in the text
   * (simple AND search)
   */
  export function matchesQuery(text, query) {
    const haystack = normalize(text);
    const tokens = tokenize(query);
    if (tokens.length === 0) return true;
  
    return tokens.every((t) => haystack.includes(t));
  }
  