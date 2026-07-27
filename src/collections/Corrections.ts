import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";

export const Corrections: CollectionConfig = {
  slug: "corrections",
  admin: {
    defaultColumns: ["article", "correctionType", "date", "materialChange"],
    group: "Corrections",
    useAsTitle: "publicCorrectionText",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: () => true,
    update: editorialUsers,
  },
  fields: [
    {
      name: "article",
      type: "relationship",
      relationTo: "articles",
      required: true,
    },
    {
      name: "publicCorrectionText",
      type: "textarea",
      required: true,
    },
    {
      name: "correctionType",
      type: "select",
      defaultValue: "correction",
      options: [
        { label: "Correction", value: "correction" },
        { label: "Clarification", value: "clarification" },
        { label: "Update", value: "update" },
      ],
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
    {
      name: "editor",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "materialChange",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
