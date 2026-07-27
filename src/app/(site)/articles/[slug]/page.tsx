import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleRichText } from "@/components/ArticleRichText";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getArticleBySlug, getPublishedArticles } from "@/lib/data";
import {
  formatLabel,
  readingTime,
  renderPublicByline,
  selectRelatedArticles,
  shouldRenderVerificationPanel,
} from "@/lib/editorial";
import { verificationIndicatorOptions } from "@/collections/Articles";

export const dynamic = "force-dynamic";

function dateLabel(date?: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function objectName(value: unknown, key = "name") {
  return typeof value === "object" && value !== null && key in value
    ? String((value as Record<string, unknown>)[key] || "")
    : "";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const article = await getArticleBySlug(slug, query.preview === "1");

  return {
    description: article?.seo?.description || article?.subtitle,
    title: article?.seo?.title || article?.publicHeadline || "Article",
  };
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug, query.preview === "1"),
    getPublishedArticles({ limit: 48 }),
  ]);

  if (!article) {
    notFound();
  }

  const related = selectRelatedArticles(article, allArticles);
  const published = dateLabel(article.publicationDate);
  const updated = dateLabel(article.updatedDate);
  const topicName = objectName(article.primaryTopic);
  const indicators = verificationIndicatorOptions.filter((option) =>
    article.verificationIndicators?.includes(option.value),
  );
  const heroImage =
    typeof article.heroImage === "object" && article.heroImage
      ? article.heroImage
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": article.format === "inside-work" ? "NewsArticle" : "Article",
    author: {
      "@type": "Person",
      name: renderPublicByline(
        article.publicByline,
        article.authorshipType,
      ).replace(/^By /, ""),
    },
    dateModified: article.updatedDate || article.publicationDate,
    datePublished: article.publicationDate,
    description: article.subtitle,
    headline: article.publicHeadline,
    isAccessibleForFree: true,
    mainEntityOfPage: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/articles/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "PUBLIUS",
    },
  };

  return (
    <article className="editorial-container py-12">
      <header className="mx-auto max-w-3xl">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
          {formatLabel(article.format)}
          {topicName ? ` / ${topicName}` : ""}
        </p>
        <h1 className="mt-4 font-headline text-5xl font-semibold leading-[1.02] sm:text-6xl">
          {article.publicHeadline}
        </h1>
        {article.subtitle ? (
          <p className="mt-5 text-2xl leading-9 text-[var(--muted)]">
            {article.subtitle}
          </p>
        ) : null}
        <div className="mt-6 border-y thin-rule py-4 font-ui text-sm text-[var(--muted)]">
          <p>
            {renderPublicByline(article.publicByline, article.authorshipType)}
          </p>
          <p className="mt-1">
            {published ? `Published ${published}` : "Unscheduled"}
            {updated ? ` / Updated ${updated}` : ""} /{" "}
            {readingTime(article.body)} min read
          </p>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--soft)]">
          {heroImage?.url ? (
            <Image
              alt={heroImage.altText || ""}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              src={heroImage.url}
            />
          ) : (
            <div className="flex h-full items-end border thin-rule p-5">
              <span className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Publius article image
              </span>
            </div>
          )}
        </div>
        {article.heroImageCaption || article.heroImageCredit ? (
          <p className="mt-2 font-ui text-xs text-[var(--muted)]">
            {article.heroImageCaption}
            {article.heroImageCredit
              ? ` Credit: ${article.heroImageCredit}`
              : ""}
          </p>
        ) : null}
      </div>

      {shouldRenderVerificationPanel(article) ? (
        <aside className="mx-auto mt-8 max-w-3xl border thin-rule bg-[var(--paper)] p-5">
          <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            About the author
          </h2>
          <p className="mt-3 text-lg leading-8">
            {article.verificationStatement ||
              "Publius verified the author's identity, role, and direct knowledge. Certain nonmaterial details may be generalized to reduce identification risk."}
          </p>
          {indicators.length ? (
            <ul className="mt-4 flex flex-wrap gap-2 font-ui text-xs">
              {indicators.map((indicator) => (
                <li
                  key={indicator.value}
                  className="border border-[var(--success)] px-2 py-1 text-[var(--success)]"
                >
                  {indicator.label}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      ) : null}

      <div className="mx-auto mt-10 max-w-3xl">
        <ArticleRichText data={article.body} />

        {article.evidenceNote ? (
          <aside className="mt-10 border-t thin-rule pt-5">
            <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Evidence and methodology
            </h2>
            <p className="mt-3 text-lg leading-8">{article.evidenceNote}</p>
          </aside>
        ) : null}

        {article.employerResponseStatus &&
        article.employerResponseStatus !== "not-requested" ? (
          <aside className="mt-10 border-t thin-rule pt-5">
            <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Employer or institutional response
            </h2>
            <p className="mt-3 text-lg leading-8">
              {article.employerResponseContent ||
                `Response status: ${article.employerResponseStatus}`}
            </p>
          </aside>
        ) : null}

        {article.correctionRecords?.length ? (
          <aside className="mt-10 border-t thin-rule pt-5">
            <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Corrections and updates
            </h2>
            <ul className="mt-3 space-y-3">
              {article.correctionRecords.map((correction, index) => (
                <li key={`${correction.date}-${index}`}>
                  <p className="font-ui text-sm uppercase tracking-[0.12em] text-[var(--muted)]">
                    {dateLabel(correction.date)} / {correction.type}
                  </p>
                  <p className="mt-1 text-lg leading-8">{correction.text}</p>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        {typeof article.publicByline === "object" &&
        article.publicByline?.shortBiography ? (
          <aside className="mt-10 border-t thin-rule pt-5">
            <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Public byline biography
            </h2>
            <p className="mt-3 text-lg leading-8">
              {article.publicByline.shortBiography}
            </p>
          </aside>
        ) : null}
      </div>

      {related.length ? (
        <section
          className="mt-16 border-t thin-rule pt-8"
          aria-labelledby="related-heading"
        >
          <h2
            id="related-heading"
            className="font-headline text-4xl font-semibold"
          >
            Related Articles
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        id="newsletter"
        className="mx-auto mt-16 max-w-3xl border-y thin-rule py-8"
      >
        <h2 className="font-headline text-3xl font-semibold">
          Read the view from inside.
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Receive each new article and an occasional note from the editors.
        </p>
        <NewsletterForm sourcePage={`article:${article.slug}`} />
      </section>

      <section className="mx-auto mt-10 max-w-3xl border-b thin-rule pb-8">
        <h2 className="font-headline text-3xl font-semibold">
          Know this work firsthand?
        </h2>
        <p className="mt-2 text-lg text-[var(--muted)]">
          Begin a confidential conversation with the editors through Submit.
        </p>
        <Link
          href="/submit"
          className="mt-5 inline-block border border-[var(--foreground)] px-4 py-3 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Submit
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
