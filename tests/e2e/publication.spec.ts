import { expect, test, type APIRequestContext } from "@playwright/test";

async function databaseAvailable(request: APIRequestContext) {
  try {
    const response = await request.get("/api/health", { timeout: 5000 });
    return response.ok();
  } catch {
    return false;
  }
}

test("a public reader can load the homepage", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "PUBLIUS" })).toBeVisible();
  await expect(
    page.locator("header").getByText("The view from inside.", { exact: true }),
  ).toBeVisible();
});

test("homepage newsletter section is centered", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const newsletter = page.locator("#newsletter");
  await expect(
    newsletter.getByRole("heading", { name: "Read the view from inside." }),
  ).toBeVisible();

  const positions = await newsletter
    .locator("h2, form")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          center: rect.left + rect.width / 2,
          width: rect.width,
        };
      }),
    );
  const viewportCenter = (await page.viewportSize())!.width / 2;

  for (const position of positions) {
    expect(Math.abs(position.center - viewportCenter)).toBeLessThan(6);
    expect(position.width).toBeGreaterThan(200);
  }
});

test("the latest published article is the automatic lead", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const lead = page.getByLabel("Featured Publius article");
  await expect(
    lead.getByRole("heading", {
      name: "Our Customer-Service Metrics Punish Employees for Solving Difficult Problems",
    }),
  ).toBeVisible();
});

test("article cards align image blocks within a row", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const recentSection = page.locator(
    'section[aria-labelledby="recent-heading"]',
  );
  await expect(
    recentSection.getByRole("link", { name: "Recent Articles" }),
  ).toHaveAttribute("href", "/latest");
  await expect(recentSection.getByRole("link", { name: "Latest" })).toHaveCount(
    0,
  );

  const sections = [
    'section[aria-labelledby="recent-heading"]',
    'section[aria-labelledby="inside-work-heading"]',
  ];

  for (const section of sections) {
    const measurements = await page
      .locator(`${section} article`)
      .evaluateAll((articles) =>
        articles.slice(0, 3).map((article) => {
          const title = article.querySelector("h2")?.getBoundingClientRect();
          const subtitle = article
            .querySelector("[data-article-subtitle]")
            ?.getBoundingClientRect();
          const image = article
            .querySelector("[data-article-image]")
            ?.getBoundingClientRect();

          return {
            imageBottom: image?.bottom,
            imageTop: image?.top,
            subtitleTop: subtitle?.top,
            titleTop: title?.top,
          };
        }),
      );

    expect(measurements).toHaveLength(3);
    for (const key of [
      "titleTop",
      "subtitleTop",
      "imageTop",
      "imageBottom",
    ] as const) {
      const values = measurements.map((measurement) => measurement[key] || 0);
      expect(Math.max(...values) - Math.min(...values)).toBeLessThan(2);
    }
  }
});

test("a reader can open an article", async ({ page }) => {
  await page.goto(
    "/articles/customer-service-metrics-punish-solving-difficult-problems",
    { waitUntil: "domcontentloaded" },
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Customer-Service Metrics",
  );
});

test("anonymous occupational byline and verification note render correctly", async ({
  page,
}) => {
  await page.goto(
    "/articles/customer-service-metrics-punish-solving-difficult-problems",
    { waitUntil: "domcontentloaded" },
  );
  await expect(
    page.locator("header").getByText("By a customer-support specialist"),
  ).toBeVisible();
  await expect(page.getByText("About the author")).toBeVisible();
});

test("topic pages show published articles", async ({ page }) => {
  await page.goto("/topics/work-and-management", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page
      .locator("main")
      .getByRole("heading", { name: "Work and Management", level: 1 }),
  ).toBeVisible();
  await expect(
    page.locator("main").getByText("Promotion System Rewards Visibility"),
  ).toBeVisible();
});

test("Inside Work shows eligible published pieces", async ({ page }) => {
  await page.goto("/inside-work", { waitUntil: "domcontentloaded" });
  await expect(
    page
      .locator("main")
      .getByRole("heading", { name: "Inside Work", level: 1 }),
  ).toBeVisible();
  await expect(
    page.locator("main").getByText("Hospital Staffing Dashboard"),
  ).toBeVisible();
});

test("search never returns drafts or protected data", async ({ page }) => {
  await page.goto("/search?q=verify", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByText("What It Means to Verify an Employee"),
  ).toHaveCount(0);
  await expect(page.getByText("SOURCE-0017")).toHaveCount(0);
});

test("submission form offers anonymity without assuming it", async ({
  page,
}) => {
  await page.goto("/submit", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Do you need to stay anonymous?")).toBeVisible();
  await expect(page.locator("form fieldset").first()).toContainText(
    "Do you need to stay anonymous?",
  );
  await expect(page.locator("form fieldset").nth(1)).toContainText(
    "Submission type",
  );
  await expect(page.locator('input[name="needsAnonymity"]').nth(0)).toHaveValue(
    "yes",
  );
  await expect(page.locator('input[name="needsAnonymity"]').nth(1)).toHaveValue(
    "no",
  );
  await expect(page.getByLabel("Pseudonym")).toHaveCount(0);
  await expect(page.getByLabel("Additional context")).toBeVisible();
  await expect(page.getByLabel("What should readers understand?")).toHaveCount(
    0,
  );
  await expect(page.getByLabel("What did you personally observe?")).toHaveCount(
    0,
  );
  await expect(
    page.getByLabel("Why is this in the public interest?"),
  ).toHaveCount(0);

  await page.getByRole("radio", { name: "Yes" }).click();
  await expect(page.getByLabel("Pseudonym")).toBeVisible();
  await expect(
    page.getByText(
      "You do not have to give us your name, but you will have to provide some type of evidence of occupation, depending on circumstances.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "If you wish, your real name may replace the pseudonym at a later date.",
    ),
  ).toBeVisible();

  await page.getByRole("radio", { name: "No" }).click();
  await expect(page.getByLabel("Pseudonym")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Submit your query or draft" }),
  ).toBeVisible();
});

test("principal public pages load", async ({ page }) => {
  test.setTimeout(120000);

  for (const path of [
    "/about",
    "/editorial-standards",
    "/anonymous-sources",
    "/source-protection",
    "/corrections",
    "/conflicts",
    "/contact",
    "/privacy",
    "/terms",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
  }
});

test.describe("database-backed workflow", () => {
  test.beforeEach(async ({ request }) => {
    test.skip(
      !(await databaseAvailable(request)),
      "Database is not running or seeded.",
    );
  });

  test("a visitor can subscribe to the newsletter and duplicate email is graceful", async ({
    page,
  }) => {
    const email = `reader-${Date.now()}@example.test`;
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator('input[type="email"]').first().fill(email);
    await page.getByRole("button", { name: "Subscribe" }).first().click();
    await expect(page.getByText(/Thank you|already/i)).toBeVisible();
    await page.getByRole("button", { name: "Subscribe" }).first().click();
    await expect(page.getByText(/already|Thank you/i)).toBeVisible();
  });

  test("a visitor can submit the Submit form", async ({ page }) => {
    await page.goto("/submit", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Pitch an article").check();
    await page.getByRole("radio", { name: "No" }).check();
    await page
      .getByLabel("Personal email")
      .fill(`source-${Date.now()}@example.test`);
    await page.getByLabel("Current or former role").selectOption("current");
    await page
      .getByLabel("Organization or institution")
      .fill("Fictional agency");
    await page.getByLabel("General role").fill("service worker");
    await page
      .getByLabel("Additional context")
      .fill(
        "Readers should understand that the queue metric misses important work and that I saw cases delayed by a status code mismatch.",
      );
    await page.getByLabel("Evidence availability").selectOption("describe");
    await page.getByLabel(/workplace-managed device/).check();
    await page.getByLabel(/personal information/).check();
    await page.getByLabel(/cannot promise absolute anonymity/).check();
    await page
      .getByRole("button", { name: "Submit your query or draft" })
      .click();
    await expect(page).toHaveURL(/\/submit\/confirmation\?ref=PUB-/);
  });

  test("published RSS, sitemap, and robots routes respond", async ({
    request,
  }) => {
    await expect((await request.get("/rss.xml")).ok()).toBe(true);
    await expect((await request.get("/sitemap.xml")).ok()).toBe(true);
    const robots = await request.get("/robots.txt");
    await expect(robots.ok()).toBe(true);
    await expect(await robots.text()).toContain("Disallow: /admin");
  });

  test("public visitor cannot retrieve a draft through the public article URL", async ({
    request,
  }) => {
    const response = await request.get(
      "/articles/what-it-means-to-verify-an-employees-account",
    );
    expect(response.status()).toBeGreaterThanOrEqual(404);
  });

  test("normal editor cannot access protected source identities anonymously", async ({
    request,
  }) => {
    const response = await request.get("/api/protected-sources");
    expect([401, 403]).toContain(response.status());
  });

  test("protected files cannot be opened through an unauthenticated URL", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/protected-source-files/file/missing.pdf",
    );
    expect([401, 403, 404]).toContain(response.status());
  });

  test("a correction appears on the article page", async ({ page }) => {
    await page.goto("/articles/how-anonymous-sourcing-works-at-publius", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByText("Corrections and updates")).toBeVisible();
  });
});
