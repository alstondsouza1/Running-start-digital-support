import { describe, expect, it } from "vitest";
import { normalize, scoreText, tokenize } from "./search";

describe("FAQ search utilities", () => {
  it("normalizes whitespace and letter case", () => {
    expect(normalize("  Fee   WAIVER ")).toBe("fee waiver");
  });

  it("tokenizes a multi-word query", () => {
    expect(tokenize("class deadline")).toEqual(["class", "deadline"]);
  });

  it("scores each matching query token", () => {
    expect(scoreText("Class enrollment deadline", "class deadline")).toBe(2);
    expect(scoreText("Class enrollment deadline", "book loan")).toBe(0);
  });
});
