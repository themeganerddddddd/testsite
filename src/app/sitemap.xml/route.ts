import { getPublishedArticles, getTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

function urlNode(url: string, updated?: string | null) {
  return `<url><loc>${url}</loc>${updated ? `<lastmod>${updated}</lastmod>` : ""}</url>`;
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [articles, topics] = await Promise.all([
    getPublishedArticles({ limit: 1000 }),
    getTopics(),
  ]);

  const staticRoutes = [
    "",
    "/latest",
    "/topics",
    "/inside-work",
    "/about",
    "/submit",
    "/editorial-standards",
    "/anonymous-sources",
    "/source-protection",
    "/corrections",
    "/conflicts",
    "/contact",
    "/privacy",
    "/terms",
    "/search",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map((route) => urlNode(`${siteUrl}${route}`)).join("\n")}
${topics
  .filter((topic) => topic.slug)
  .map((topic) => urlNode(`${siteUrl}/topics/${topic.slug}`, topic.updatedAt))
  .join("\n")}
${articles
  .filter((article) => article.slug)
  .map((article) =>
    urlNode(
      `${siteUrl}/articles/${article.slug}`,
      article.updatedAt || article.updatedDate,
    ),
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
