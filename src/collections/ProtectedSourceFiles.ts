import path from "node:path";
import { randomUUID } from "node:crypto";

import type { CollectionConfig } from "payload";

import { sourceFieldAccess, sourceManagersOnly } from "@/lib/access";

export const ProtectedSourceFiles: CollectionConfig = {
  slug: "protected-source-files",
  labels: {
    plural: "Protected Source Files",
    singular: "Protected Source File",
  },
  admin: {
    defaultColumns: ["source", "category", "createdAt", "updatedAt"],
    group: "Protected Sources",
    useAsTitle: "category",
  },
  access: {
    create: sourceManagersOnly,
    delete: sourceManagersOnly,
    read: sourceManagersOnly,
    update: sourceManagersOnly,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        const file = (req as typeof req & { file?: { name?: string } }).file;
        if (!file?.name) {
          return data;
        }

        const originalName = file.name;
        const extension = path.extname(originalName).toLowerCase();
        file.name = `${randomUUID()}${extension}`;

        return {
          ...data,
          originalFilename: data?.originalFilename || originalName,
        };
      },
    ],
  },
  upload: {
    bulkUpload: false,
    displayPreview: false,
    filesRequiredOnCreate: true,
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
    ],
    pasteURL: false,
    staticDir: "private/source-files",
  },
  fields: [
    {
      name: "source",
      type: "relationship",
      relationTo: "protected-sources",
      required: true,
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Identity documentation", value: "identity-documentation" },
        { label: "Employment verification", value: "employment-verification" },
        { label: "Supporting internal material", value: "supporting-material" },
        { label: "Interview notes", value: "interview-notes" },
        { label: "Other confidential file", value: "other" },
      ],
      required: true,
    },
    {
      name: "originalFilename",
      type: "text",
      access: {
        read: sourceFieldAccess,
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: "accessNotes",
      type: "textarea",
      access: {
        read: sourceFieldAccess,
      },
    },
  ],
};
