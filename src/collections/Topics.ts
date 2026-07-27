import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";
import { slugHook } from "@/lib/hooks";

export const Topics: CollectionConfig = {
  slug: "topics",
  admin: {
    defaultColumns: ["name", "slug", "showInNavigation", "displayOrder"],
    group: "Topics and Tags",
    useAsTitle: "name",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: () => true,
    update: editorialUsers,
  },
  defaultSort: "displayOrder",
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
      name: "shortDescription",
      type: "textarea",
      required: true,
    },
    {
      name: "longIntroduction",
      type: "richText",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "showInNavigation",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "displayOrder",
      type: "number",
      defaultValue: 100,
      required: true,
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
};
