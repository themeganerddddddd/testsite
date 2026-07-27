import type { CollectionConfig } from "payload";

import { pageBlocks } from "@/blocks/pageBlocks";
import { editorialUsers, publicPublishedPages } from "@/lib/access";
import { slugHook } from "@/lib/hooks";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    defaultColumns: ["title", "slug", "template", "_status", "updatedAt"],
    group: "Pages",
    livePreview: {
      url: ({ data }) => `/${data.slug}?preview=1`,
    },
    preview: (doc) => `/${doc.slug}?preview=1`,
    useAsTitle: "title",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: publicPublishedPages,
    readVersions: editorialUsers,
    update: editorialUsers,
  },
  hooks: {
    beforeValidate: [slugHook("title")],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1200,
        showSaveDraftButton: true,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: "title",
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
      name: "template",
      type: "select",
      defaultValue: "standard",
      options: [
        { label: "Standard page", value: "standard" },
        { label: "Policy page", value: "policy" },
        { label: "Topic landing page", value: "topic-landing" },
        { label: "Submission page", value: "submission" },
        { label: "Contact page", value: "contact" },
      ],
      required: true,
    },
    {
      name: "intro",
      label: "Introductory text",
      type: "textarea",
    },
    {
      name: "contentBlocks",
      label: "Page content",
      type: "blocks",
      blocks: pageBlocks,
    },
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "kicker", type: "text" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "caption", type: "textarea" },
      ],
    },
    {
      name: "showInNavigation",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "scheduledPublicationDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "canonicalUrl", type: "text" },
        { name: "noIndex", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
