import { richTextToPlainText } from "@/lib/richText";

export type PublicBylineLike = {
  authorshipType?: string | null;
  displayName?: string | null;
  shortBiography?: string | null;
  verificationWording?: string | null;
};

export type PublicMediaLike = {
  altText?: string | null;
  url?: string | null;
};

export type PublicArticleLike = {
  additionalTopics?: Array<
    | { id: number | string; name?: string | null; slug?: string | null }
    | number
    | string
  > | null;
  authorshipType?: string | null;
  body?: unknown;
  correctionRecords?: Array<{
    date?: string | null;
    materialChange?: boolean | null;
    text?: string | null;
    type?: string | null;
  }> | null;
  employerResponseContent?: string | null;
  employerResponseDate?: string | null;
  employerResponseStatus?: string | null;
  evidenceNote?: string | null;
  format?: string | null;
  heroImage?: PublicMediaLike | number | string | null;
  heroImageCaption?: string | null;
  heroImageCredit?: string | null;
  id: number | string;
  insideWorkEligible?: boolean | null;
  publicationDate?: string | null;
  publicByline?: PublicBylineLike | number | string | null;
  publicHeadline?: string | null;
  relatedArticles?: Array<PublicArticleLike | number | string> | null;
  scheduledPublicationDate?: string | null;
  seo?: {
    description?: string | null;
    title?: string | null;
  } | null;
  slug?: string | null;
  subtitle?: string | null;
  tags?: Array<
    | { id: number | string; name?: string | null; slug?: string | null }
    | number
    | string
  > | null;
  primaryTopic?:
    | { id: number | string; name?: string | null; slug?: string | null }
    | number
    | string
    | null;
  updatedAt?: string | null;
  updatedDate?: string | null;
  verificationIndicators?: string[] | null;
  verificationStatement?: string | null;
};

export function formatLabel(format?: string | null): string {
  return (format || "reported-essay")
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function readingTime(value: unknown, wordsPerMinute = 230): number {
  const text = typeof value === "string" ? value : richTextToPlainText(value);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function renderPublicByline(
  byline: PublicBylineLike | number | string | null | undefined,
  authorshipType?: string | null,
): string {
  if (!byline || typeof byline === "number" || typeof byline === "string") {
    return "By a verified Publius contributor";
  }

  const displayName = byline.displayName?.trim();

  if (!displayName) {
    return "By a verified Publius contributor";
  }

  if (
    authorshipType === "verified-anonymous" ||
    byline.authorshipType === "verified-anonymous"
  ) {
    return displayName.toLowerCase().startsWith("by ")
      ? displayName
      : `By ${displayName}`;
  }

  return displayName.toLowerCase().startsWith("by ")
    ? displayName
    : `By ${displayName}`;
}

export function shouldRenderVerificationPanel(
  article: PublicArticleLike,
): boolean {
  return (
    article.authorshipType === "verified-anonymous" ||
    Boolean(article.verificationStatement) ||
    Boolean(article.verificationIndicators?.length)
  );
}

export function selectRelatedArticles(
  article: PublicArticleLike,
  candidates: PublicArticleLike[],
  limit = 3,
): PublicArticleLike[] {
  const manual = (article.relatedArticles || []).filter(
    (item): item is PublicArticleLike =>
      typeof item === "object" && item !== null,
  );

  if (manual.length >= limit) {
    return manual.slice(0, limit);
  }

  const primaryTopic =
    typeof article.primaryTopic === "object" && article.primaryTopic
      ? article.primaryTopic.id
      : article.primaryTopic;
  const tagIds = new Set(
    (article.tags || []).map((tag) => (typeof tag === "object" ? tag.id : tag)),
  );

  const automatic = candidates
    .filter((candidate) => candidate.id !== article.id)
    .map((candidate) => {
      const candidateTopic =
        typeof candidate.primaryTopic === "object" && candidate.primaryTopic
          ? candidate.primaryTopic.id
          : candidate.primaryTopic;
      const candidateTagIds = (candidate.tags || []).map((tag) =>
        typeof tag === "object" ? tag.id : tag,
      );
      const sharedTags = candidateTagIds.filter((tag) =>
        tagIds.has(tag),
      ).length;
      const topicScore =
        candidateTopic && candidateTopic === primaryTopic ? 4 : 0;
      const recencyScore = candidate.publicationDate
        ? Date.parse(candidate.publicationDate) / 1e13
        : 0;

      return {
        article: candidate,
        score: topicScore + sharedTags + recencyScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ article: candidate }) => candidate);

  return [...manual, ...automatic].slice(0, limit);
}
