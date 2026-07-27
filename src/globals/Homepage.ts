import type { GlobalConfig } from "payload";

import { editorialUsers } from "@/lib/access";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  admin: {
    group: "Homepage",
  },
  access: {
    read: () => true,
    update: editorialUsers,
  },
  versions: {
    max: 25,
  },
  fields: [
    {
      name: "leadMode",
      type: "select",
      defaultValue: "automatic",
      options: [
        { label: "Automatic newest eligible article", value: "automatic" },
        { label: "Curated lead article", value: "curated" },
      ],
      required: true,
    },
    {
      name: "curatedLeadArticle",
      type: "relationship",
      relationTo: "articles",
    },
    {
      name: "secondaryArticleOverrides",
      type: "relationship",
      hasMany: true,
      maxRows: 3,
      relationTo: "articles",
    },
    {
      name: "insideWorkOverrides",
      type: "relationship",
      hasMany: true,
      maxRows: 3,
      relationTo: "articles",
    },
    {
      name: "essentialReading",
      type: "relationship",
      hasMany: true,
      maxRows: 6,
      relationTo: "articles",
    },
    {
      name: "introductoryCopy",
      type: "textarea",
      defaultValue:
        "Verified perspectives from inside the institutions that shape public life.",
    },
    {
      name: "newsletterCopy",
      type: "group",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Read the view from inside.",
        },
        {
          name: "description",
          type: "textarea",
          defaultValue:
            "Receive each new article and an occasional note from the editors.",
        },
      ],
    },
    {
      name: "topicDisplayList",
      type: "relationship",
      hasMany: true,
      relationTo: "topics",
    },
    {
      name: "announcement",
      type: "group",
      fields: [
        { name: "visible", type: "checkbox", defaultValue: false },
        { name: "text", type: "text" },
        { name: "url", type: "text" },
      ],
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
