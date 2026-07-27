import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";
import { slugHook } from "@/lib/hooks";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    defaultColumns: ["name", "slug", "description"],
    group: "Topics and Tags",
    useAsTitle: "name",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: () => true,
    update: editorialUsers,
  },
  hooks: {
    beforeValidate: [slugHook("name")],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
