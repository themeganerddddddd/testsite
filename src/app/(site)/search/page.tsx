import { ArticleCard } from "@/components/ArticleCard";
import { getTopics, searchPublicContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    format?: string;
    q?: string;
    topic?: string;
  }>;
}) {
  const params = await searchParams;
  const [topics, results] = await Promise.all([
    getTopics(),
    searchPublicContent({
      date: params.date,
      format: params.format,
      query: params.q,
      topic: params.topic,
    }),
  ]);

  return (
    <div className="editorial-container py-12">
      <header className="border-b thin-rule pb-6">
        <h1 className="font-headline text-5xl font-semibold">Search</h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Search published public articles. Drafts, submissions, protected
          sources, protected files, and internal notes are excluded.
        </p>
      </header>

      <form className="mt-8 grid gap-4 border-b thin-rule pb-8 font-ui md:grid-cols-4">
        <label className="text-sm font-semibold md:col-span-2">
          Search terms
          <input
            className="mt-2 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-3"
            name="q"
            type="search"
            defaultValue={params.q}
          />
        </label>
        <label className="text-sm font-semibold">
          Format
          <select
            className="mt-2 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-3"
            name="format"
            defaultValue={params.format}
          >
            <option value="">All formats</option>
            <option value="inside-work">Inside Work</option>
            <option value="expert-analysis">Expert Analysis</option>
            <option value="reported-essay">Reported Essay</option>
            <option value="explainer">Explainer</option>
            <option value="response">Response</option>
            <option value="editorial">Editorial</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Topic
          <select
            className="mt-2 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-3"
            name="topic"
            defaultValue={params.topic}
          >
            <option value="">All topics</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.slug || ""}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Published after
          <input
            className="mt-2 w-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-3"
            name="date"
            type="date"
            defaultValue={params.date}
          />
        </label>
        <button
          type="submit"
          className="self-end border border-[var(--foreground)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Search
        </button>
      </form>

      <section className="mt-8">
        <h2 className="font-ui text-sm uppercase tracking-[0.18em]">
          {results.length} result{results.length === 1 ? "" : "s"}
        </h2>
        <div className="mt-6 grid gap-9 md:grid-cols-3">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
