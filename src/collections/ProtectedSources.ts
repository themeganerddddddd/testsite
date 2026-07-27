import type { CollectionConfig } from "payload";

import {
  editorialOrSourceManagers,
  sourceFieldAccess,
  sourceManagersOnly,
} from "@/lib/access";

export const ProtectedSources: CollectionConfig = {
  slug: "protected-sources",
  labels: {
    plural: "Protected Sources",
    singular: "Protected Source",
  },
  admin: {
    defaultColumns: [
      "sourceCode",
      "employmentStatus",
      "assignedSourceManager",
      "updatedAt",
    ],
    group: "Protected Sources",
    useAsTitle: "sourceCode",
  },
  access: {
    create: sourceManagersOnly,
    delete: sourceManagersOnly,
    read: editorialOrSourceManagers,
    update: sourceManagersOnly,
  },
  fields: [
    {
      name: "sourceCode",
      type: "text",
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "legalName",
      type: "text",
      access: { read: sourceFieldAccess },
      required: true,
    },
    {
      name: "preferredName",
      type: "text",
      access: { read: sourceFieldAccess },
    },
    {
      name: "personalEmail",
      type: "email",
      access: { read: sourceFieldAccess },
      required: true,
    },
    {
      name: "personalTelephone",
      type: "text",
      access: { read: sourceFieldAccess },
    },
    {
      name: "employer",
      type: "text",
      access: { read: sourceFieldAccess },
      required: true,
    },
    {
      name: "exactPosition",
      type: "text",
      access: { read: sourceFieldAccess },
      required: true,
    },
    {
      name: "employmentStatus",
      type: "select",
      options: [
        { label: "Current", value: "current" },
        { label: "Former", value: "former" },
        { label: "Contractor", value: "contractor" },
        { label: "Other", value: "other" },
      ],
      required: true,
    },
    {
      name: "identityVerificationMethod",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "employmentVerificationMethod",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "riskNotes",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "anonymityRequestReasoning",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "potentialConflicts",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "relatedArticles",
      type: "relationship",
      hasMany: true,
      relationTo: "articles",
    },
    {
      name: "assignedSourceManager",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "retentionOrDeletionDate",
      type: "date",
      access: { read: sourceFieldAccess },
    },
    {
      name: "consentRecords",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
    {
      name: "internalNotes",
      type: "textarea",
      access: { read: sourceFieldAccess },
    },
  ],
};
