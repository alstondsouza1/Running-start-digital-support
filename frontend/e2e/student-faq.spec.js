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
      id: "classes",
      audience: "future",
      name: "Classes",
      description: "Course options and transfer information",
    },
  ],
};

const faqs = {
  current: [
    {
      id: 1,
      audience: "current",
      type: "campus-resources",
      question: "Where can I study on campus?",
      answer: {
        bullets: [{ text: "Visit the Holman Library." }],
      },
    },
  ],
  future: [
    {
      id: 2,
      audience: "future",
      type: "classes",
      question: "Can students take online classes?",
      answer: {
        bullets: [{ text: "Online classes may be available." }],
      },
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

test("navigates from home and filters current FAQs by category", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /current student faq page/i }).click();

  await expect(
    page.getByRole("heading", { name: "Current Running Start Students" })
  ).toBeVisible();

  await page
    .getByRole("button", { name: /open category campus resources/i })
    .click();

  await expect(
    page.getByRole("button", { name: /where can i study on campus/i })
  ).toBeVisible();
});

test("searches future FAQs and opens an answer", async ({ page }) => {
  await page.goto("/future-student");
  await page.getByRole("searchbox", { name: /search faqs/i }).fill("online");

  const question = page.getByRole("button", {
    name: /can students take online classes/i,
  });
  await expect(question).toBeVisible();
  await question.click();

  await expect(page.getByText("Online classes may be available.")).toBeVisible();
});
