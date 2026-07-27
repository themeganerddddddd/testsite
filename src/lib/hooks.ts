import type { CollectionBeforeValidateHook } from "payload";

import { uniqueSlug, type SlugFindArgs, type SlugPayload } from "@/lib/slug";

export function slugHook(sourceField: string): CollectionBeforeValidateHook {
  return async ({ collection, data, originalDoc, operation, req }) => {
    if (!data) {
      return data;
    }

    const currentSlug = typeof data.slug === "string" ? data.slug.trim() : "";
    const sourceValue =
      typeof data[sourceField] === "string"
        ? data[sourceField]
        : typeof data.title === "string"
          ? data.title
          : typeof data.internalTitle === "string"
            ? data.internalTitle
            : "";
    const slugPayload: SlugPayload = {
      find: (args: SlugFindArgs) =>
        req.payload.find({
          ...args,
          collection: args.collection as never,
          where: args.where as never,
        }) as Promise<{ docs: Array<{ id: number | string; slug?: string }> }>,
    };

    if (currentSlug && operation === "update") {
      data.slug = await uniqueSlug({
        base: currentSlug,
        collection: collection.slug,
        existingId: originalDoc?.id,
        payload: slugPayload,
      });
      return data;
    }

    if (!currentSlug && sourceValue) {
      data.slug = await uniqueSlug({
        base: sourceValue,
        collection: collection.slug,
        existingId: originalDoc?.id,
        payload: slugPayload,
      });
    }

    return data;
  };
}
