import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  getHomepageSettings,
  getPublishedArticles,
  getTopics,
} from "@/lib/data";
import {
  selectEssentialReading,
  selectHomepageLead,
  selectInsideWork,
  selectRecentArticles,
} from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, articles, topics] = await Promise.all([
    getHomepageSettings(),
    getPublishedArticles({ limit: 24 }),
    getTopics(),
  ]);
  const lead = selectHomepageLead(settings, articles);
  const recent = selectRecentArticles(lead, settings, articles);
  const insideWork = selectInsideWork(settings, articles);
  const essentialReading = selectEssentialReading(settings);
  const displayedTopics = settings.topicDisplayList?.length
    ? settings.topicDisplayList
    : topics;

  return (
    <div className="editorial-container py-12">
      {settings.announcement?.visible && settings.announcement.text ? (
        <Link
          href={settings.announcement.url || "/latest"}
          className="mb-8 block border-y thin-rule py-3 text-center font-ui text-sm uppercase tracking-[0.14em] text-[var(--accent)]"
        >
          {settings.announcement.text}
        </Link>
      ) : null}

      <section aria-labelledby="lead-heading">
        <h1 id="lead-heading" className="sr-only">
          Featured Publius article
        </h1>
        {lead ? <ArticleCard article={lead} lead /> : null}
      </section>

      <section className="mt-14" aria-labelledby="recent-heading">
        <div className="mb-5 border-b thin-rule pb-3">
          <Link
            href="/latest"
            className="inline-block hover:text-[var(--accent)]"
          >
            <h2
              id="recent-heading"
              className="font-ui text-sm uppercase tracking-[0.18em]"
            >
              Recent Articles
            </h2>
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {recent.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section
        className="mt-16 bg-[var(--panel)] py-10"
        aria-labelledby="inside-work-heading"
      >
        <div className="mx-auto max-w-5xl px-5">
          <h2
            id="inside-work-heading"
            className="font-headline text-4xl font-semibold"
          >
            Inside Work
          </h2>
          <p className="mt-2 max-w-2xl text-lg text-[var(--muted)]">
            Verified accounts from the people carrying out the work.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {insideWork.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-headline text-4xl font-semibold">
            Explore by topic
          </h2>
          <p className="mt-3 text-lg text-[var(--muted)]">
            Broad topic pages, not permanent newsroom sections.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {displayedTopics.slice(0, 6).map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="border-t thin-rule py-4 hover:text-[var(--accent)]"
            >
              <span className="font-headline text-2xl font-semibold">
                {topic.name}
              </span>
              <span className="mt-1 block text-sm text-[var(--muted)]">
                {topic.shortDescription}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="essential-heading">
        <h2
          id="essential-heading"
          className="border-b thin-rule pb-3 font-ui text-sm uppercase tracking-[0.18em]"
        >
          Essential Reading
        </h2>
        <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
          {essentialReading.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="border-b thin-rule pb-4 hover:text-[var(--accent)]"
            >
              <span className="font-headline text-2xl font-semibold">
                {article.publicHeadline}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="newsletter"
        className="mt-16 border-y thin-rule py-10 text-center"
      >
        <h2 className="font-headline text-4xl font-semibold">
          {settings.newsletterCopy?.heading || "Read the view from inside."}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--muted)]">
          {settings.newsletterCopy?.description ||
            "Receive each new article and an occasional note from the editors."}
        </p>
        <NewsletterForm align="center" sourcePage="homepage" />
      </section>
    </div>
  );
}
