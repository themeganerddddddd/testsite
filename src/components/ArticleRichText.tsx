import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

type BlockConverterArgs = {
  node: {
    fields?: unknown;
  };
};

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    correctionNotice: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as { date?: string; text?: string };
      return (
        <aside className="my-8 border-y thin-rule bg-[var(--paper)] py-4 font-ui text-sm">
          <p className="font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Correction
          </p>
          <p className="mt-2">{fields.text}</p>
        </aside>
      );
    },
    dataCallout: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as {
        label?: string;
        note?: string;
        value?: string;
      };
      return (
        <aside className="my-8 border-y thin-rule py-5">
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            {fields.label}
          </p>
          <p className="font-headline text-4xl font-semibold">{fields.value}</p>
          {fields.note ? (
            <p className="mt-2 text-base text-[var(--muted)]">{fields.note}</p>
          ) : null}
        </aside>
      );
    },
    documentExcerpt: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as {
        excerpt?: string;
        note?: string;
        sourceLabel?: string;
      };
      return (
        <aside className="my-8 border thin-rule bg-[var(--paper)] p-5 font-ui text-sm">
          <p className="font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {fields.sourceLabel}
          </p>
          <blockquote className="mt-3 border-l-2 border-[var(--accent)] pl-4">
            {fields.excerpt}
          </blockquote>
          {fields.note ? (
            <p className="mt-3 text-[var(--muted)]">{fields.note}</p>
          ) : null}
        </aside>
      );
    },
    employerResponse: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as { status?: string; text?: string };
      return (
        <aside className="my-8 border-y thin-rule py-4">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Employer response: {fields.status}
          </p>
          {fields.text ? <p className="mt-3">{fields.text}</p> : null}
        </aside>
      );
    },
    factBox: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as {
        heading?: string;
        items?: Array<{ text?: string }>;
      };
      return (
        <aside className="my-8 border thin-rule bg-[var(--paper)] p-5">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {fields.heading}
          </p>
          <ul className="mt-3 space-y-2">
            {(fields.items || []).map((item, index) => (
              <li key={`${item.text}-${index}`}>{item.text}</li>
            ))}
          </ul>
        </aside>
      );
    },
    pullQuote: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as { attribution?: string; quote?: string };
      return (
        <aside className="my-10 border-l-2 border-[var(--accent)] pl-5">
          <p className="font-headline text-3xl font-semibold leading-tight">
            {fields.quote}
          </p>
          {fields.attribution ? (
            <p className="mt-3 font-ui text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              {fields.attribution}
            </p>
          ) : null}
        </aside>
      );
    },
    verificationNote: ({ node }: BlockConverterArgs) => {
      const fields = node.fields as { heading?: string; text?: string };
      return (
        <aside className="my-8 border thin-rule bg-[var(--soft)] p-5">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {fields.heading || "Verification note"}
          </p>
          <p className="mt-3">{fields.text}</p>
        </aside>
      );
    },
  },
});

export function ArticleRichText({ data }: { data: unknown }) {
  return (
    <RichText
      className="article-prose"
      converters={converters}
      data={data as never}
    />
  );
}
