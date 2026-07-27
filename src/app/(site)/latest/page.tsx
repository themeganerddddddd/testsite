import { ArticleCard } from "@/components/ArticleCard";
import { getPublishedArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Latest",
};

export default async function LatestPage() {
  const articles = await getPublishedArticles({ limit: 48 });

  return (
    <div className="editorial-container py-12">
      <header className="border-b thin-rule pb-6">
        <h1 className="font-headline text-5xl font-semibold">Latest</h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Recent published Publius articles, ordered by publication date.
        </p>
      </header>
      <div className="mt-8 grid gap-9 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
