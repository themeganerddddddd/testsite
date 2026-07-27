import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";
import { slugHook } from "@/lib/hooks";

export const PublicBylines: CollectionConfig = {
  slug: "public-bylines",
  labels: {
    plural: "Public Bylines",
    singular: "Public Byline",
  },
  admin: {
    defaultColumns: [
      "displayName",
      "authorshipType",
      "organization",
      "updatedAt",
    ],
    group: "Public Bylines",
    useAsTitle: "displayName",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: () => true,
    update: editorialUsers,
  },
  hooks: {
    beforeValidate: [slugHook("displayName")],
  },
  fields: [
    {
      name: "displayName",
      label: "Public display name or occupational byline",
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
      name: "authorshipType",
      type: "select",
      defaultValue: "named",
      options: [
        { label: "Named", value: "named" },
        { label: "Verified anonymous", value: "verified-anonymous" },
      ],
      required: true,
    },
    {
      name: "shortBiography",
      type: "textarea",
    },
    {
      name: "longBiography",
      type: "richText",
    },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "organization",
      type: "text",
      admin: {
        description: "Public only when approved for attribution.",
      },
    },
    {
      name: "relevantExpertise",
      type: "textarea",
    },
    {
      name: "verificationWording",
      type: "textarea",
      admin: {
        description:
          "Reusable wording editors may adapt on individual articles.",
      },
    },
    {
      name: "publishedArticles",
      type: "relationship",
      hasMany: true,
      relationTo: "articles",
    },
  ],
};
