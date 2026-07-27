import { headers } from "next/headers";
import { getPayload, type Where } from "payload";

import configPromise from "@payload-config";
import {
  demoHomepage,
  demoNavigation,
  demoPages,
  demoSiteSettings,
  demoTopics,
  publishedDemoArticles,
} from "@/lib/demoData";
import { publishedArticleWhere } from "@/lib/access";
import type { PublicArticleLike } from "@/lib/editorial";
import type { HomepageSettingsLike } from "@/lib/homepage";
import { richTextToPlainText } from "@/lib/richText";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

export type PublicTopicLike = {
  id: number | string;
  name?: string | null;
  shortDescription?: string | null;
  slug?: string | null;
  updatedAt?: string | null;
};

export type PublicPageBlock =
  | {
      blockType: "textSection";
      body?: string | null;
      heading?: string | null;
    }
  | {
      blockType: "callout";
      label?: string | null;
      text?: string | null;
    }
  | {
      blockType: "linkList";
      heading?: string | null;
      links?: Array<{ label?: string | null; url?: string | null }> | null;
    };

export type PublicPageLike = {
  contentBlocks?: PublicPageBlock[] | null;
  id?: number | string;
  intro?: string | null;
  slug?: string | null;
  template?: string | null;
  title?: string | null;
};

export type PublicHomepageSettingsLike = HomepageSettingsLike & {
  announcement?: {
    text?: string | null;
    url?: string | null;
    visible?: boolean | null;
  } | null;
  newsletterCopy?: {
    description?: string | null;
    heading?: string | null;
  } | null;
  topicDisplayList?: PublicTopicLike[] | null;
};

export type PublicNavigationLike = {
  footerNavigation?: Array<{
    groupLabel?: string | null;
    links?: Array<{
      href?: string | null;
      label?: string | null;
      order?: number | null;
      visible?: boolean | null;
    }> | null;
  }> | null;
  primaryNavigation?: Array<{
    href?: string | null;
    label?: string | null;
    order?: number | null;
    visible?: boolean | null;
  }> | null;
};

export type PublicSiteSettingsLike = {
  copyrightNotice?: string | null;
  description?: string | null;
  footerCopy?: string | null;
  publicationName?: string | null;
  tagline?: string | null;
};

async function getPayloadClient(): Promise<PayloadClient> {
  return getPayload({ config: configPromise });
}

async function canPreviewDrafts(payload: PayloadClient): Promise<boolean> {
  try {
    const auth = await payload.auth({
      canSetHeaders: false,
      headers: await headers(),
    });

    return Boolean(auth.user);
  } catch {
    return false;
  }
}

async function withFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<PublicSiteSettingsLike> {
  return withFallback(async () => {
    const payload = await getPayloadClient();
    return (await payload.findGlobal({
      slug: "site-settings",
      depth: 2,
    })) as PublicSiteSettingsLike;
  }, demoSiteSettings as PublicSiteSettingsLike);
}

export async function getNavigation(): Promise<PublicNavigationLike> {
  return withFallback(async () => {
    const payload = await getPayloadClient();
    return (await payload.findGlobal({
      slug: "navigation",
      depth: 2,
    })) as PublicNavigationLike;
  }, demoNavigation as PublicNavigationLike);
}

export async function getHomepageSettings(): Promise<PublicHomepageSettingsLike> {
  return withFallback(async () => {
    const payload = await getPayloadClient();
    return (await payload.findGlobal({
      slug: "homepage",
      depth: 3,
    })) as PublicHomepageSettingsLike;
  }, demoHomepage as PublicHomepageSettingsLike);
}

export async function getPublishedArticles({
  limit = 24,
  where,
}: {
  limit?: number;
  where?: Where;
} = {}): Promise<PublicArticleLike[]> {
  return withFallback(
    async () => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "articles",
        depth: 3,
        draft: false,
        limit,
        sort: "-publicationDate",
        where: publishedArticleWhere(where),
      });

      return result.docs as unknown as PublicArticleLike[];
    },
    publishedDemoArticles.slice(0, limit) as PublicArticleLike[],
  );
}

export async function getArticleBySlug(
  slug: string,
  preview = false,
): Promise<PublicArticleLike | null> {
  return withFallback(
    async () => {
      const payload = await getPayloadClient();
      const allowPreview = preview && (await canPreviewDrafts(payload));
      const result = await payload.find({
        collection: "articles",
        depth: 3,
        draft: allowPreview,
        limit: 1,
        where: allowPreview
          ? { slug: { equals: slug } }
          : publishedArticleWhere({ slug: { equals: slug } }),
      });

      return (
        (result.docs[0] as unknown as PublicArticleLike | undefined) || null
      );
    },
    (publishedDemoArticles.find((article) => article.slug === slug) as
      PublicArticleLike | undefined) || null,
  );
}

export async function getTopics(): Promise<PublicTopicLike[]> {
  return withFallback(async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "topics",
      depth: 2,
      limit: 100,
      sort: "displayOrder",
    });

    return result.docs as unknown as PublicTopicLike[];
  }, demoTopics as PublicTopicLike[]);
}

export async function getTopicBySlug(slug: string) {
  const topics = await getTopics();
  return topics.find((topic) => topic.slug === slug) || null;
}

export async function getArticlesByTopic(slug: string) {
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    return [];
  }

  const topicId = topic.id;
  const articles = await getPublishedArticles({
    limit: 100,
    where: {
      or: [
        { primaryTopic: { equals: topicId } },
        { additionalTopics: { equals: topicId } },
      ],
    },
  });

  return articles.filter((article) => {
    const primaryTopic =
      typeof article.primaryTopic === "object" && article.primaryTopic
        ? article.primaryTopic.slug
        : undefined;
    const additionalTopics = Array.isArray(article.additionalTopics)
      ? article.additionalTopics.map((item) =>
          typeof item === "object" ? item?.slug : "",
        )
      : [];

    return primaryTopic === slug || additionalTopics.includes(slug);
  });
}

export async function getInsideWorkArticles(limit = 24) {
  const articles = await getPublishedArticles({
    limit: 100,
    where: {
      or: [
        { format: { equals: "inside-work" } },
        { insideWorkEligible: { equals: true } },
      ],
    },
  });

  return articles
    .filter(
      (article) =>
        article.format === "inside-work" || article.insideWorkEligible,
    )
    .slice(0, limit);
}

export async function getPageBySlug(
  slug: string,
  preview = false,
): Promise<PublicPageLike | null> {
  return withFallback(
    async () => {
      const payload = await getPayloadClient();
      const allowPreview = preview && (await canPreviewDrafts(payload));
      const result = await payload.find({
        collection: "pages",
        depth: 3,
        draft: allowPreview,
        limit: 1,
        where: allowPreview
          ? { slug: { equals: slug } }
          : {
              and: [
                { _status: { equals: "published" } },
                { slug: { equals: slug } },
              ],
            },
      });

      return (result.docs[0] as unknown as PublicPageLike | undefined) || null;
    },
    (demoPages.find((page) => page.slug === slug) as
      PublicPageLike | undefined) || null,
  );
}

export async function searchPublicContent({
  date,
  format,
  query,
  topic,
}: {
  date?: string;
  format?: string;
  query?: string;
  topic?: string;
}) {
  const articles = await getPublishedArticles({ limit: 100 });
  const normalizedQuery = query?.trim().toLowerCase();

  return articles.filter((article) => {
    const topicSlug =
      typeof article.primaryTopic === "object" && article.primaryTopic
        ? article.primaryTopic.slug
        : undefined;
    const haystack = [
      article.publicHeadline,
      article.subtitle,
      richTextToPlainText(article.body),
      typeof article.publicByline === "object"
        ? article.publicByline?.displayName
        : "",
      typeof article.primaryTopic === "object"
        ? article.primaryTopic?.name
        : "",
      ...(Array.isArray(article.tags)
        ? article.tags.map((tag) => (typeof tag === "object" ? tag?.name : ""))
        : []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    const matchesFormat = !format || article.format === format;
    const matchesTopic = !topic || topicSlug === topic;
    const matchesDate =
      !date ||
      (article.publicationDate &&
        article.publicationDate.slice(0, 10) >= date.slice(0, 10));

    return matchesQuery && matchesFormat && matchesTopic && matchesDate;
  });
}
