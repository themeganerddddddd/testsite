import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByTopic, getTopicBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  return {
    description: topic?.shortDescription,
    title: topic?.name || "Topic",
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [topic, articles] = await Promise.all([
    getTopicBySlug(slug),
    getArticlesByTopic(slug),
  ]);

  if (!topic) {
    notFound();
  }

  return (
    <div className="editorial-container py-12">
      <header className="border-b thin-rule pb-6">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Topic
        </p>
        <h1 className="mt-3 font-headline text-5xl font-semibold">
          {topic.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          {topic.shortDescription}
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
          No published articles are assigned to this topic yet.
        </p>
      )}
    </div>
  );
}
