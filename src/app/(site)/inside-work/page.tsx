import { ArticleCard } from "@/components/ArticleCard";
import { getInsideWorkArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inside Work",
};

export default async function InsideWorkPage() {
  const articles = await getInsideWorkArticles(48);

  return (
    <div className="editorial-container py-12">
      <header className="border-b thin-rule pb-6">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Editorial Franchise
        </p>
        <h1 className="mt-3 font-headline text-5xl font-semibold">
          Inside Work
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Verified accounts from the people carrying out the work.
        </p>
      </header>
      {articles.length ? (
        <div className="mt-8 grid gap-9 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-[var(--muted)]">
          No Inside Work articles have been published yet.
        </p>
      )}
    </div>
  );
}
