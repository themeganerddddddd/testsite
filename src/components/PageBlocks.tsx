type PageBlock =
  | {
      blockType: "textSection";
      body?: string;
      heading?: string;
    }
  | {
      blockType: "callout";
      label?: string;
      text?: string;
    }
  | {
      blockType: "linkList";
      heading?: string;
      links?: Array<{ label?: string; url?: string }>;
    };

export function PageBlocks({ blocks }: { blocks?: PageBlock[] | null }) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="mt-10 space-y-10">
      {blocks.map((block, index) => {
        if (block.blockType === "callout") {
          return (
            <aside
              key={index}
              className="border-y thin-rule bg-[var(--paper)] py-5"
            >
              {block.label ? (
                <p className="font-ui text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {block.label}
                </p>
              ) : null}
              <p className="mt-2 text-xl leading-8">{block.text}</p>
            </aside>
          );
        }

        if (block.blockType === "linkList") {
          return (
            <section key={index} className="border-t thin-rule pt-5">
              <h2 className="font-headline text-3xl font-semibold">
                {block.heading}
              </h2>
              <ul className="mt-4 space-y-2 font-ui">
                {(block.links || []).map((link) => (
                  <li key={link.url}>
                    <a
                      className="underline decoration-[var(--accent)]"
                      href={link.url}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        return (
          <section key={index} className="border-t thin-rule pt-5">
            {block.heading ? (
              <h2 className="font-headline text-3xl font-semibold">
                {block.heading}
              </h2>
            ) : null}
            <p className="mt-3 text-xl leading-8 text-[var(--foreground)]">
              {block.body}
            </p>
          </section>
        );
      })}
    </div>
  );
}
