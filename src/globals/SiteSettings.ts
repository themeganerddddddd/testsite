import type { GlobalConfig } from "payload";

import { editorialUsers } from "@/lib/access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: editorialUsers,
  },
  fields: [
    {
      name: "publicationName",
      type: "text",
      defaultValue: "PUBLIUS",
      required: true,
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "The view from inside.",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      defaultValue:
        "Verified perspectives from inside the institutions that shape public life.",
      required: true,
    },
    {
      name: "contactEmail",
      type: "email",
      defaultValue: "editors@publius.local",
      required: true,
    },
    {
      name: "logoSettings",
      type: "group",
      fields: [
        { name: "wordmarkText", type: "text", defaultValue: "PUBLIUS" },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "socialAccounts",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "defaultSocialImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "defaultSEO",
      type: "group",
      fields: [
        { name: "title", type: "text", defaultValue: "PUBLIUS" },
        {
          name: "description",
          type: "textarea",
          defaultValue:
            "Verified perspectives from inside the institutions that shape public life.",
        },
      ],
    },
    {
      name: "footerCopy",
      type: "textarea",
      defaultValue:
        "Publius publishes verified perspectives from people who understand institutions firsthand.",
    },
    {
      name: "newsletterSettings",
      type: "group",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "consentText", type: "textarea" },
      ],
    },
    {
      name: "copyrightNotice",
      type: "text",
      defaultValue: "Copyright (c) 2026 Publius.",
    },
  ],
};
