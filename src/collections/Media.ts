import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    plural: "Public Media",
    singular: "Public Media",
  },
  admin: {
    defaultColumns: ["filename", "altText", "caption", "credit"],
    group: "Media",
    useAsTitle: "altText",
  },
  access: {
    create: editorialUsers,
    delete: editorialUsers,
    read: () => true,
    update: editorialUsers,
  },
  upload: {
    adminThumbnail: "thumbnail",
    bulkUpload: true,
    displayPreview: true,
    focalPoint: true,
    imageSizes: [
      {
        height: 420,
        name: "thumbnail",
        width: 640,
        withoutEnlargement: true,
      },
      {
        height: 720,
        name: "article",
        width: 1180,
        withoutEnlargement: true,
      },
      {
        height: 1200,
        name: "social",
        width: 1200,
        withoutEnlargement: true,
      },
    ],
    mimeTypes: ["image/avif", "image/jpeg", "image/png", "image/webp"],
    pasteURL: false,
    staticDir: "public/media",
  },
  fields: [
    {
      name: "altText",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
    },
    {
      name: "credit",
      type: "text",
    },
    {
      name: "copyrightOrLicense",
      type: "textarea",
    },
  ],
};
