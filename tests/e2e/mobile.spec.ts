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
  await expect(recentCard.locator("[data-article-image]")).toBeVisible();

  const titleBox = await recentCard.locator("h2").boundingBox();
  const imageBox = await recentCard
    .locator("[data-article-image]")
    .boundingBox();

  expect(titleBox).not.toBeNull();
  expect(imageBox).not.toBeNull();
  expect(imageBox!.x).toBeGreaterThan(titleBox!.x);
  expect(imageBox!.width).toBeGreaterThanOrEqual(96);
  expect(imageBox!.width).toBeLessThanOrEqual(124);
});
