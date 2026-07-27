import { notFound } from "next/navigation";

import { PageBlocks } from "@/components/PageBlocks";
import { getPageBySlug } from "@/lib/data";

export async function EditablePage({
  preview = false,
  slug,
}: {
  preview?: boolean;
  slug: string;
}) {
  const page = await getPageBySlug(slug, preview);

  if (!page) {
    notFound();
  }

  return (
    <div className="editorial-container py-12">
      <article className="mx-auto max-w-3xl">
        <header className="border-b thin-rule pb-6">
          <h1 className="font-headline text-5xl font-semibold">{page.title}</h1>
          {page.intro ? (
            <p className="mt-4 text-2xl leading-9 text-[var(--muted)]">
              {page.intro}
            </p>
          ) : null}
        </header>
        <PageBlocks blocks={page.contentBlocks as never} />
      </article>
    </div>
  );
}
