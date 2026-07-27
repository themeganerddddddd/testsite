import Link from "next/link";
import Image from "next/image";

import { formatLabel, readingTime, renderPublicByline } from "@/lib/editorial";

type ArticleCardProps = {
  article: {
    authorshipType?: string | null;
    body?: unknown;
    format?: string | null;
    heroImage?:
      | {
          altText?: string | null;
          url?: string | null;
        }
      | number
      | string
      | null;
    primaryTopic?:
      { name?: string | null; slug?: string | null } | number | string | null;
    publicByline?: unknown;
    publicHeadline?: string | null;
    publicationDate?: string | null;
    slug?: string | null;
    subtitle?: string | null;
    verificationIndicators?: string[] | null;
  };
  lead?: boolean;
};

function topicLabel(topic: ArticleCardProps["article"]["primaryTopic"]) {
  return typeof topic === "object" && topic ? topic.name : null;
}

export function ArticleCard({ article, lead = false }: ArticleCardProps) {
  const date = article.publicationDate
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(article.publicationDate))
    : "Unscheduled";
  const image =
    typeof article.heroImage === "object" && article.heroImage
      ? article.heroImage
      : null;

  const articleClass = lead
    ? "grid gap-6 md:grid-cols-[1.15fr_0.85fr]"
    : "flex h-full flex-col";
  const textBlockClass = lead
    ? "block border-t thin-rule pt-4 md:pt-0"
    : "flex flex-col border-t thin-rule pt-4";
  const eyebrowClass = lead
    ? "font-ui text-xs uppercase tracking-[0.16em] text-[var(--accent)]"
    : "font-ui min-h-8 text-xs uppercase tracking-[0.16em] text-[var(--accent)]";
  const titleClass = `mt-3 font-headline font-semibold leading-[1.04] ${
    lead ? "text-4xl sm:text-6xl" : "text-2xl sm:min-h-[7.8rem] sm:text-3xl"
  }`;
  const subtitleClass = lead
    ? "mt-3 text-lg leading-7 text-[var(--muted)]"
    : "mt-3 text-lg leading-7 text-[var(--muted)] sm:min-h-[5.25rem]";

  return (
    <article className={articleClass}>
      <Link href={`/articles/${article.slug}`} className={textBlockClass}>
        <div className={eyebrowClass}>
          {formatLabel(article.format)}
          {topicLabel(article.primaryTopic)
            ? ` / ${topicLabel(article.primaryTopic)}`
            : ""}
        </div>
        <h2 className={titleClass}>{article.publicHeadline}</h2>
        {article.subtitle ? (
          <p data-article-subtitle className={subtitleClass}>
            {article.subtitle}
          </p>
        ) : lead ? null : (
          <p
            aria-hidden="true"
            className={`${subtitleClass} invisible`}
            data-article-subtitle
          >
            Subtitle spacer
          </p>
        )}
      </Link>
      <div className={lead ? "border-t thin-rule pt-4 md:pt-0" : "mt-4"}>
        <div
          className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--soft)]"
          data-article-image
        >
          {image?.url ? (
            <Image
              alt={image.altText || ""}
              className="object-cover"
              fill
              sizes={
                lead
                  ? "(min-width: 768px) 45vw, 100vw"
                  : "(min-width: 768px) 33vw, 100vw"
              }
              src={image.url}
            />
          ) : (
            <div className="flex h-full items-end border thin-rule p-4">
              <span className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Publius / {formatLabel(article.format)}
              </span>
            </div>
          )}
        </div>
        <p className="mt-4 font-ui text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          {renderPublicByline(
            article.publicByline as never,
            article.authorshipType,
          )}{" "}
          / {date} / {readingTime(article.body)} min read
        </p>
        {article.verificationIndicators?.length ? (
          <p className="mt-2 font-ui text-xs font-semibold uppercase tracking-[0.14em] text-[var(--success)]">
            Verified contributor
          </p>
        ) : null}
      </div>
    </article>
  );
}
