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
    <div className="editorial-container py-7 sm:py-12">
      {settings.announcement?.visible && settings.announcement.text ? (
        <Link
          href={settings.announcement.url || "/latest"}
          className="mb-6 block border-y thin-rule py-3 text-center font-ui text-xs uppercase tracking-[0.14em] text-[var(--accent)] sm:mb-8 sm:text-sm"
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

      <section className="mt-9 sm:mt-14" aria-labelledby="recent-heading">
        <div className="mb-4 border-y thin-rule py-2 sm:mb-5 sm:border-b sm:border-t-0 sm:pb-3 sm:pt-0">
          <Link
            href="/latest"
            className="inline-block hover:text-[var(--accent)]"
          >
            <h2
              id="recent-heading"
              className="font-ui text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm"
            >
              Recent Articles
            </h2>
          </Link>
        </div>
        <div className="grid gap-5 sm:gap-8 md:grid-cols-3">
          {recent.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              showMobileImage={false}
            />
          ))}
        </div>
      </section>

      <section
        className="-mx-4 mt-12 bg-[var(--panel)] px-4 py-8 sm:mx-0 sm:mt-16 sm:px-0 sm:py-10"
        aria-labelledby="inside-work-heading"
      >
        <div className="mx-auto max-w-5xl px-5">
          <h2
            id="inside-work-heading"
            className="border-y thin-rule py-2 font-ui text-xs font-semibold uppercase tracking-[0.18em] sm:border-0 sm:py-0 sm:font-headline sm:text-4xl sm:normal-case sm:tracking-normal"
          >
            Inside Work
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-6 text-[var(--muted)] sm:mt-2 sm:text-lg">
            Verified accounts from the people carrying out the work.
          </p>
          <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-8 md:grid-cols-3">
            {insideWork.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                showMobileImage={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="mt-12 grid gap-7 border-t thin-rule pt-7 sm:mt-16 sm:gap-10 sm:border-t-0 sm:pt-0 md:grid-cols-[0.9fr_1.1fr]"
        aria-labelledby="topics-heading"
      >
        <Link href="/topics" className="block hover:text-[var(--accent)]">
          <h2
            id="topics-heading"
            className="font-headline text-3xl font-semibold sm:text-4xl"
          >
            Explore by topic
          </h2>
          <p className="mt-2 font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)] sm:hidden">
            View all topics
          </p>
          <p className="mt-3 hidden text-lg text-[var(--muted)] sm:block">
            Broad topic pages, not permanent newsroom sections.
          </p>
        </Link>
        <div className="hidden gap-3 sm:grid sm:grid-cols-2">
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

      <section className="mt-12 sm:mt-16" aria-labelledby="essential-heading">
        <h2
          id="essential-heading"
          className="border-y thin-rule py-2 font-ui text-xs font-semibold uppercase tracking-[0.18em] sm:border-b sm:border-t-0 sm:pb-3 sm:pt-0 sm:text-sm"
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
        className="mt-12 border-y thin-rule py-9 text-center sm:mt-16 sm:py-10"
      >
        <h2 className="font-headline text-3xl font-semibold sm:text-4xl">
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
