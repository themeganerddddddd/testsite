"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="editorial-container py-16">
      <section className="mx-auto max-w-2xl border-y thin-rule py-10">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Something went wrong
        </p>
        <h1 className="mt-3 font-headline text-5xl font-semibold">
          Publius could not load this view.
        </h1>
        <p className="mt-4 text-xl leading-8 text-[var(--muted)]">
          Try again. If the local database is still starting, this usually
          clears after a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 border border-[var(--foreground)] px-4 py-3 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Try again
        </button>
      </section>
    </div>
  );
}
