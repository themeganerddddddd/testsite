export type SlugFindArgs = {
  collection: string;
  depth?: number;
  limit?: number;
  where: Record<string, unknown>;
};

export type SlugPayload = {
  find: (
    args: SlugFindArgs,
  ) => Promise<{ docs: Array<{ id: number | string; slug?: string }> }>;
};

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export async function uniqueSlug({
  base,
  collection,
  existingId,
  payload,
}: {
  base: string;
  collection: string;
  existingId?: number | string;
  payload: SlugPayload;
}): Promise<string> {
  const sanitized = slugify(base) || "untitled";
  let slug = sanitized;
  let suffix = 2;

  while (true) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      where: {
        slug: { equals: slug },
      },
    });

    const duplicate = result.docs[0];

    if (!duplicate || duplicate.id === existingId) {
      return slug;
    }

    slug = `${sanitized}-${suffix}`;
    suffix += 1;
  }
}
