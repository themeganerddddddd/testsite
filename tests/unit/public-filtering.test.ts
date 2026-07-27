import { describe, expect, it } from "vitest";

import { publishedDemoArticles } from "@/lib/demoData";

describe("public content filtering", () => {
  it("excludes draft demonstration articles from public lists", () => {
    expect(
      publishedDemoArticles.some((article) => article._status !== "published"),
    ).toBe(false);
    expect(
      publishedDemoArticles.some(
        (article) =>
          article.slug === "what-it-means-to-verify-an-employees-account",
      ),
    ).toBe(false);
  });

  it("does not include protected source-like records in public demo articles", () => {
    const serialized = JSON.stringify(publishedDemoArticles);
    expect(serialized).not.toContain("SOURCE-0017");
    expect(serialized).not.toContain("Jordan Ellis");
  });
});
