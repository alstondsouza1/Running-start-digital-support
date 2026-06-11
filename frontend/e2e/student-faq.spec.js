import { expect, test } from "@playwright/test";
import { Buffer } from "node:buffer";

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
        bullets: [
          {
            text: "Visit the Holman Library.",
            url: "https://holmanlibrary.greenriver.edu/",
          },
        ],
      },
    },
    {
      id: 3,
      audience: "current",
      type: "campus-resources",
      question: "Where is the Running Start office?",
      answer: {
        bullets: [{ text: "Check the official campus directory." }],
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
  await page.setViewportSize({ width: 390, height: 844 });
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/future-student");
  await page.getByRole("searchbox", { name: /search faqs/i }).fill("online");

  const question = page.getByRole("button", {
    name: /can students take online classes/i,
  });
  await expect(question).toBeVisible();
  await question.click();

  await expect(page.getByText("Online classes may be available.")).toBeVisible();
});

test("keeps FAQ content readable in mobile high contrast mode", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/current-student");

  await page
    .getByRole("button", { name: /open accessibility tools/i })
    .click();
  await page.getByRole("button", { name: /^high contrast$/i }).click();
  await page
    .getByRole("button", { name: /close accessibility tools/i })
    .click();
  await page
    .getByRole("button", { name: /open category campus resources/i })
    .click();

  const question = page.getByRole("button", {
    name: /where can i study on campus/i,
  });
  await expect(question).toBeVisible();
  await question.click();

  const questionColor = await question
    .locator(".MuiTypography-root")
    .evaluate((element) => getComputedStyle(element).color);
  const linkColor = await page
    .getByRole("link", { name: /visit the holman library/i })
    .evaluate((element) => getComputedStyle(element).color);

  expect(questionColor).toBe("rgb(255, 255, 255)");
  expect(linkColor).toBe("rgb(255, 255, 0)");
});

test("keeps the admin dashboard header and content separated on mobile", async ({
  page,
}) => {
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  ).toString("base64url");
  const token = `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${payload}.test`;

  await page.addInitScript((adminToken) => {
    localStorage.setItem("token", adminToken);
  }, token);
  await page.route("**/api/admin/faq?audience=*", (route) => {
    const audience = new URL(route.request().url()).searchParams.get("audience");
    return route.fulfill({ json: faqs[audience] || [] });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin");

  const heading = page.getByRole("heading", { name: /admin dashboard/i });
  const firstSummary = page.getByText("Current Student FAQs", { exact: true });
  const manageButton = page.getByRole("button", {
    name: /manage categories/i,
  });
  const addButton = page.getByRole("button", { name: /add faq/i });

  await expect(heading).toBeVisible();
  await expect(firstSummary).toBeVisible();
  await expect(manageButton).toBeVisible();
  await expect(addButton).toBeVisible();

  const headingBox = await heading.boundingBox();
  const summaryBox = await firstSummary.boundingBox();
  expect(summaryBox.y).toBeGreaterThan(headingBox.y + headingBox.height);

  for (const button of [manageButton, addButton]) {
    const box = await button.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
});

test("allows an admin to reorder FAQs with the keyboard", async ({ page }) => {
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  ).toString("base64url");
  const token = `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${payload}.test`;
  let orderedIds = [];

  await page.addInitScript((adminToken) => {
    localStorage.setItem("token", adminToken);
  }, token);
  await page.route("**/api/admin/faq?audience=*", (route) => {
    const audience = new URL(route.request().url()).searchParams.get("audience");
    return route.fulfill({ json: faqs[audience] || [] });
  });
  await page.route("**/api/faq/order", async (route) => {
    orderedIds = route.request().postDataJSON().orderedIds;
    return route.fulfill({ json: { ok: true } });
  });

  await page.goto("/admin");

  const moveDownButton = page.getByRole("button", {
    name: /move question down: where can i study on campus/i,
  });
  await moveDownButton.focus();
  await page.keyboard.press("Enter");

  await expect
    .poll(() => orderedIds)
    .toEqual([3, 1]);
  await expect(page.getByText(/faq order updated successfully/i)).toBeVisible();
});
