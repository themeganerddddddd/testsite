import Link from "next/link";

import { getTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Topics",
};

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <div className="editorial-container py-12">
      <header className="border-b thin-rule pb-6">
        <h1 className="font-headline text-5xl font-semibold">Topics</h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--muted)]">
          Broad areas of institutional life. Topics are discovery paths, not
          fixed newsroom desks.
        </p>
      </header>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="border-t thin-rule py-5 hover:text-[var(--accent)]"
          >
            <h2 className="font-headline text-3xl font-semibold">
              {topic.name}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{topic.shortDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
