import { describe, expect, it } from "vitest";

import { selectHomepageLead, selectInsideWork } from "@/lib/homepage";
import {
  readingTime,
  renderPublicByline,
  selectRelatedArticles,
  shouldRenderVerificationPanel,
} from "@/lib/editorial";
import { lexicalFromParagraphs, sanitizeRichText } from "@/lib/richText";
import { slugify, uniqueSlug } from "@/lib/slug";

describe("editorial utilities", () => {
  it("generates clean slugs", () => {
    expect(slugify("Our Customer-Service Metrics Punish Employees")).toBe(
      "our-customer-service-metrics-punish-employees",
    );
  });

  it("generates unique slugs", async () => {
    const existing = [{ id: "1", slug: "example" }];
    const slug = await uniqueSlug({
      base: "Example",
      collection: "articles",
      payload: {
        find: async ({ where }) => ({
          docs: existing.filter(
            (doc) => doc.slug === (where.slug as { equals: string }).equals,
          ),
        }),
      },
    });

    expect(slug).toBe("example-2");
  });

  it("calculates reading time from rich text", () => {
    const body = lexicalFromParagraphs(["one two three", "four five six"]);
    expect(readingTime(body, 3)).toBe(2);
  });

  it("renders occupational anonymous bylines without using Anonymous alone", () => {
    expect(
      renderPublicByline(
        {
          authorshipType: "verified-anonymous",
          displayName: "a current federal contractor",
        },
        "verified-anonymous",
      ),
    ).toBe("By a current federal contractor");
  });

  it("renders verification panels for anonymous or explicitly verified articles", () => {
    expect(
      shouldRenderVerificationPanel({
        authorshipType: "verified-anonymous",
        id: "1",
        verificationIndicators: ["identity-verified"],
      }),
    ).toBe(true);
  });

  it("selects related articles by topic and tags", () => {
    const current = {
      id: "1",
      primaryTopic: { id: "topic-a" },
      relatedArticles: [],
      tags: [{ id: "tag-a" }],
    };
    const related = selectRelatedArticles(current, [
      { id: "2", primaryTopic: { id: "topic-a" }, tags: [] },
      { id: "3", primaryTopic: { id: "topic-b" }, tags: [{ id: "tag-a" }] },
    ]);

    expect(related.map((article) => article.id)).toEqual(["2", "3"]);
  });

  it("uses curated homepage lead before automatic lead", () => {
    const automatic = { id: "automatic", publicHeadline: "Automatic" };
    const curated = { id: "curated", publicHeadline: "Curated" };
    expect(
      selectHomepageLead({ curatedLeadArticle: curated, leadMode: "curated" }, [
        automatic,
      ]),
    ).toBe(curated);
  });

  it("selects inside work articles automatically when no override is present", () => {
    const articles = [
      { format: "expert-analysis", id: "1" },
      { format: "inside-work", id: "2" },
      { format: "inside-work", id: "3" },
    ];
    expect(selectInsideWork({}, articles).map((article) => article.id)).toEqual(
      ["2", "3"],
    );
  });

  it("sanitizes unsupported rich text nodes", () => {
    const sanitized = sanitizeRichText({
      root: {
        children: [{ type: "paragraph" }, { type: "script", text: "alert(1)" }],
        type: "root",
      },
    }) as { root: { children: Array<{ type: string }> } };

    expect(sanitized.root.children.map((node) => node.type)).toEqual([
      "paragraph",
    ]);
  });
});
