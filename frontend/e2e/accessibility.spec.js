import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const categories = {
  current: [
    {
      id: "campus-resources",
      audience: "current",
      name: "Campus Resources",
      description: "Support services and offices",
    },
  ],
  future: [
    {
      id: "enrollment",
      audience: "future",
      name: "Enrollment",
      description: "Application and enrollment steps",
    },
  ],
};

const faqs = {
  current: [
    {
      id: 1,
      audience: "current",
      type: "campus-resources",
      question: "Where can I find campus resources?",
      answer: { bullets: [{ text: "Use the official campus directory." }] },
    },
  ],
  future: [
    {
      id: 2,
      audience: "future",
      type: "enrollment",
      question: "How do I begin enrollment?",
      answer: { bullets: [{ text: "Review the official enrollment steps." }] },
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route("https://translate.google.com/**", (route) => route.abort());
  await page.route("**/api/categories", (route) =>
    route.fulfill({ json: categories })
  );
  await page.route("**/api/getFAQS?audience=*", (route) => {
    const audience = new URL(route.request().url()).searchParams.get("audience");
    return route.fulfill({ json: faqs[audience] || [] });
  });
});

for (const route of ["/", "/current-student", "/future-student", "/accessibility"]) {
  test(`${route} has no automatically detectable WCAG A or AA violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator("main").waitFor();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
