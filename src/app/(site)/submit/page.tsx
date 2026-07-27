import { SubmissionForm } from "@/components/SubmissionForm";

export const metadata = {
  description:
    "Tell Publius what people outside your institution are missing. Begin with a confidential conversation with an editor.",
  title: "Submit",
};

export default function SubmitPage() {
  return (
    <div className="editorial-container py-12">
      <div className="mx-auto max-w-3xl">
        <header className="border-b thin-rule pb-6">
          <h1 className="font-headline text-5xl font-semibold">Submit</h1>
          <p className="mt-4 text-2xl leading-9 text-[var(--muted)]">
            Tell Publius what people outside your institution are missing. You
            may submit a query, share an article draft, or begin with a
            confidential conversation with an editor.
          </p>
        </header>

        <section className="mt-8 border-y thin-rule bg-[var(--paper)] py-5">
          <p className="text-lg leading-8">
            &quot;Off record&quot; describes the initial conversation. Publius
            will not publish your identity or submission merely because you
            contact us. Any later publication, attribution, and anonymity
            arrangement must be discussed and agreed upon explicitly.
          </p>
        </section>

        <SubmissionForm />
      </div>
    </div>
  );
}
