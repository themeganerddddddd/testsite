import Link from "next/link";

export const metadata = {
  title: "Submission Received",
};

export default async function SubmissionConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="editorial-container py-16">
      <section className="mx-auto max-w-2xl border-y thin-rule py-10">
        <p className="font-ui text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Submission received
        </p>
        <h1 className="mt-3 font-headline text-5xl font-semibold">
          Thank you.
        </h1>
        <p className="mt-4 text-xl leading-8 text-[var(--muted)]">
          Publius has received your submission. Save this reference number for
          any follow-up with the editors.
        </p>
        <p className="mt-6 border thin-rule bg-[var(--paper)] p-4 font-ui text-lg font-semibold">
          {ref || "Reference pending"}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block border border-[var(--foreground)] px-4 py-3 font-ui text-sm font-semibold uppercase tracking-[0.12em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Return to Publius
        </Link>
      </section>
    </div>
  );
}
