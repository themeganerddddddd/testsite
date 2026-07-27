import type { PublicArticleLike } from "@/lib/editorial";

export type HomepageSettingsLike = {
  curatedLeadArticle?: PublicArticleLike | number | string | null;
  essentialReading?: Array<PublicArticleLike | number | string> | null;
  insideWorkOverrides?: Array<PublicArticleLike | number | string> | null;
  leadMode?: "automatic" | "curated" | string | null;
  secondaryArticleOverrides?: Array<PublicArticleLike | number | string> | null;
};

function isArticle(
  value: PublicArticleLike | number | string | null | undefined,
): value is PublicArticleLike {
  return typeof value === "object" && value !== null && "id" in value;
}

export function selectHomepageLead(
  settings: HomepageSettingsLike | null | undefined,
  articles: PublicArticleLike[],
): PublicArticleLike | null {
  if (
    settings?.leadMode === "curated" &&
    isArticle(settings.curatedLeadArticle)
  ) {
    return settings.curatedLeadArticle;
  }

  return articles[0] || null;
}

export function selectRecentArticles(
  lead: PublicArticleLike | null,
  settings: HomepageSettingsLike | null | undefined,
  articles: PublicArticleLike[],
): PublicArticleLike[] {
  const overrides = (settings?.secondaryArticleOverrides || []).filter(
    isArticle,
  );
  if (overrides.length > 0) {
    return overrides.filter((article) => article.id !== lead?.id).slice(0, 3);
  }

  return articles.filter((article) => article.id !== lead?.id).slice(0, 3);
}

export function selectInsideWork(
  settings: HomepageSettingsLike | null | undefined,
  articles: PublicArticleLike[],
): PublicArticleLike[] {
  const overrides = (settings?.insideWorkOverrides || []).filter(isArticle);
  if (overrides.length > 0) {
    return overrides.slice(0, 3);
  }

  return articles
    .filter((article) => article.format === "inside-work")
    .slice(0, 3);
}

export function selectEssentialReading(
  settings: HomepageSettingsLike | null | undefined,
): PublicArticleLike[] {
  return (settings?.essentialReading || []).filter(isArticle).slice(0, 6);
}
