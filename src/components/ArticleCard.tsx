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
  showMobileImage?: boolean;
};

function topicLabel(topic: ArticleCardProps["article"]["primaryTopic"]) {
  return typeof topic === "object" && topic ? topic.name : null;
}

export function ArticleCard({
  article,
  lead = false,
  showMobileImage = true,
}: ArticleCardProps) {
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
    ? "grid border-b thin-rule pb-7 sm:border-b-0 sm:pb-0 md:grid-cols-[1.15fr_0.85fr] md:gap-6"
    : showMobileImage
      ? "grid h-full grid-cols-[minmax(0,1fr)_6.75rem] gap-x-4 border-b thin-rule pb-5 sm:flex sm:flex-col sm:border-b-0 sm:pb-0"
      : "grid h-full border-b thin-rule pb-5 sm:flex sm:flex-col sm:border-b-0 sm:pb-0";
  const textBlockClass = lead
    ? "block border-t thin-rule pt-4 md:col-start-1 md:row-span-2 md:pt-0"
    : "min-w-0 sm:flex sm:flex-col sm:border-t sm:pt-4";
  const eyebrowClass = lead
    ? "font-ui text-xs uppercase tracking-[0.16em] text-[var(--accent)]"
    : "font-ui mb-2 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--accent)] sm:mb-0 sm:min-h-8 sm:text-xs";
  const titleClass = `mt-3 font-headline font-semibold leading-[1.04] ${
    lead
      ? "text-[2.65rem] sm:text-6xl"
      : "mt-0 text-[1.45rem] sm:mt-3 sm:min-h-[7.8rem] sm:text-3xl"
  }`;
  const subtitleClass = lead
    ? "mt-3 text-lg leading-7 text-[var(--muted)]"
    : "mt-2 text-base leading-6 text-[var(--muted)] sm:mt-3 sm:min-h-[5.25rem] sm:text-lg sm:leading-7";
  const mediaClass = lead
    ? "mt-5 md:col-start-2 md:row-start-1 md:mt-0"
    : showMobileImage
      ? "col-start-2 row-start-1 self-start sm:col-auto sm:row-auto sm:mt-4 sm:self-auto"
      : "hidden sm:col-auto sm:row-auto sm:mt-4 sm:block";
  const imageClass = lead
    ? "relative aspect-[4/3] w-full overflow-hidden bg-[var(--soft)]"
    : "relative aspect-square w-full overflow-hidden bg-[var(--soft)] sm:aspect-[4/3]";
  const metaClass = lead
    ? "mt-4 font-ui text-xs uppercase tracking-[0.14em] text-[var(--muted)] md:col-start-2 md:row-start-2"
    : "col-start-1 row-start-2 mt-3 font-ui text-[0.68rem] uppercase leading-5 tracking-[0.12em] text-[var(--muted)] sm:mt-4 sm:text-xs sm:tracking-[0.14em]";

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
      <div className={mediaClass}>
        <div
          className={imageClass}
          data-article-image
          data-mobile-image={showMobileImage ? "visible" : "hidden"}
        >
          {image?.url ? (
            <Image
              alt={image.altText || ""}
              className="object-cover"
              fill
              sizes={
                lead
                  ? "(min-width: 768px) 45vw, 100vw"
                  : "(max-width: 639px) 108px, (min-width: 768px) 33vw, 100vw"
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
      </div>
      <div className={metaClass}>
        <p>
          {renderPublicByline(
            article.publicByline as never,
            article.authorshipType,
          )}{" "}
          / {date} / {readingTime(article.body)} min read
        </p>
        {article.verificationIndicators?.length ? (
          <p className="mt-2 font-semibold text-[var(--success)]">
            Verified contributor
          </p>
        ) : null}
      </div>
    </article>
  );
}
