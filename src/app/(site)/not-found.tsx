import Link from "next/link";

export default function NotFound() {
  return (
    <div className="editorial-container py-16">
      <section className="mx-auto max-w-2xl border-y thin-rule py-10">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Not found
        </p>
        <h1 className="mt-3 font-headline text-5xl font-semibold">
          This page is not available.
        </h1>
        <p className="mt-4 text-xl leading-8 text-[var(--muted)]">
          The article or page may be unpublished, moved, or still under
          editorial review.
        </p>
        <Link
          href="/latest"
          className="mt-8 inline-block border border-[var(--foreground)] px-4 py-3 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Read latest articles
        </Link>
      </section>
    </div>
  );
}
