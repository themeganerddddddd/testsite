import { expect, test } from "@playwright/test";

test("mobile homepage uses a compact newspaper story list", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only layout check.");

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Independent workplace reporting")).toBeVisible();
  await expect(page.getByRole("link", { name: "PUBLIUS" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const recentCard = page
    .locator('section[aria-labelledby="recent-heading"] article')
    .first();
  await expect(recentCard.locator("h2")).toBeVisible();
  await expect(recentCard.locator("[data-article-image]")).toBeHidden();

  await expect(
    page
      .locator('section[aria-labelledby="topics-heading"]')
      .getByRole("link", { name: /Explore by topic/ }),
  ).toHaveAttribute("href", "/topics");
  const visibleTopicLinks = await page
    .locator('section[aria-labelledby="topics-heading"]')
    .locator('a[href^="/topics/"]')
    .evaluateAll(
      (links) =>
        links.filter((link) => {
          const rect = link.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length,
    );
  expect(visibleTopicLinks).toBe(0);

  const insideWorkImages = await page
    .locator('section[aria-labelledby="inside-work-heading"] article')
    .evaluateAll((articles) =>
      articles.map((article) => {
        const image = article.querySelector("[data-article-image]");
        const rect = image?.getBoundingClientRect();

        return Boolean(rect && rect.width > 0 && rect.height > 0);
      }),
    );
  expect(insideWorkImages.filter(Boolean)).toHaveLength(1);
  expect(insideWorkImages[0]).toBe(true);

  const firstInsideCard = page
    .locator('section[aria-labelledby="inside-work-heading"] article')
    .first();
  const titleBox = await firstInsideCard.locator("h2").boundingBox();
  const imageBox = await firstInsideCard
    .locator("[data-article-image]")
    .boundingBox();

  expect(titleBox).not.toBeNull();
  expect(imageBox).not.toBeNull();
  expect(imageBox!.x).toBeGreaterThan(titleBox!.x);
  expect(imageBox!.width).toBeGreaterThanOrEqual(96);
  expect(imageBox!.width).toBeLessThanOrEqual(124);
});
