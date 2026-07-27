import { getPublishedArticles, getSiteSettings } from "@/lib/data";
import { richTextToPlainText } from "@/lib/richText";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const [settings, articles] = await Promise.all([
    getSiteSettings(),
    getPublishedArticles({ limit: 50 }),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const items = articles
    .map((article) => {
      const url = `${siteUrl}/articles/${article.slug}`;
      return `<item>
  <title>${escapeXml(article.publicHeadline || "")}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>
  <pubDate>${new Date(article.publicationDate || Date.now()).toUTCString()}</pubDate>
  <description>${escapeXml(article.subtitle || richTextToPlainText(article.body).slice(0, 240))}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${escapeXml(settings.publicationName || "PUBLIUS")}</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>${escapeXml(settings.description || "Verified perspectives from inside institutions.")}</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
