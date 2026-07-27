export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const text = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /*?preview=1

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
