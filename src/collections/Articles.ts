import type { CollectionConfig } from "payload";

import {
  editorialUsers,
  publicPublishedArticles,
  publishCapableEditors,
} from "@/lib/access";
import { slugHook } from "@/lib/hooks";

export const articleFormats = [
  { label: "Inside Work", value: "inside-work" },
  { label: "Expert Analysis", value: "expert-analysis" },
  { label: "Reported Essay", value: "reported-essay" },
  { label: "Explainer", value: "explainer" },
  { label: "Response", value: "response" },
  { label: "Editorial", value: "editorial" },
];

export const editorialStages = [
  { label: "Pitch", value: "pitch" },
  { label: "Under Review", value: "under-review" },
  { label: "Accepted", value: "accepted" },
  { label: "Editing", value: "editing" },
  { label: "Verification", value: "verification" },
  {
    label: "Employer Response Requested",
    value: "employer-response-requested",
  },
  { label: "Final Review", value: "final-review" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Updated", value: "updated" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

export const verificationIndicatorOptions = [
  { label: "Identity verified", value: "identity-verified" },
  { label: "Employment verified", value: "employment-verified" },
  { label: "Role verified", value: "role-verified" },
  { label: "Direct knowledge verified", value: "direct-knowledge-verified" },
  {
    label: "Supporting records reviewed",
    value: "supporting-records-reviewed",
  },
  { label: "Corroborated by additional sources", value: "corroborated" },
];

const draftVersions = {
  drafts: {
    autosave: {
      interval: 900,
      showSaveDraftButton: true,
    },
    schedulePublish: true,
  },
  maxPerDoc: 75,
};

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    defaultColumns: [
      "publicHeadline",
      "format",
      "publicByline",
      "editorialStage",
      "_status",
      "publicationDate",
      "assignedEditor",
    ],
    group: "Articles",
    livePreview: {
      url: ({ data }) => `/articles/${data.slug}?preview=1`,
    },
    preview: (doc) => `/articles/${doc.slug}?preview=1`,
    useAsTitle: "publicHeadline",
  },
  access: {
    create: editorialUsers,
    delete: publishCapableEditors,
    read: publicPublishedArticles,
    readVersions: editorialUsers,
    update: editorialUsers,
  },
  defaultSort: "-publicationDate",
  hooks: {
    beforeValidate: [slugHook("publicHeadline")],
  },
  versions: draftVersions,
  fields: [
    {
      name: "internalTitle",
      type: "text",
      required: true,
    },
    {
      name: "publicHeadline",
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
      name: "subtitle",
      label: "Subtitle or dek",
      type: "textarea",
    },
    {
      name: "format",
      type: "select",
      defaultValue: "reported-essay",
      options: articleFormats,
      required: true,
    },
    {
      name: "primaryTopic",
      type: "relationship",
      relationTo: "topics",
      required: true,
    },
    {
      name: "additionalTopics",
      type: "relationship",
      hasMany: true,
      relationTo: "topics",
    },
    {
      name: "tags",
      type: "relationship",
      hasMany: true,
      relationTo: "tags",
    },
    {
      name: "publicByline",
      type: "relationship",
      relationTo: "public-bylines",
      required: true,
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
      name: "body",
      type: "richText",
      required: true,
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "heroImageCaption",
      type: "textarea",
    },
    {
      name: "heroImageCredit",
      type: "text",
    },
    {
      name: "socialImage",
      label: "Social-sharing image override",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "verificationStatement",
      type: "textarea",
      admin: {
        description: "Required for verified anonymous articles.",
      },
    },
    {
      name: "verificationIndicators",
      type: "select",
      hasMany: true,
      options: verificationIndicatorOptions,
    },
    {
      name: "evidenceNote",
      label: "Evidence or methodology note",
      type: "textarea",
    },
    {
      name: "employerResponseStatus",
      type: "select",
      defaultValue: "not-requested",
      options: [
        { label: "Not requested", value: "not-requested" },
        { label: "Requested", value: "requested" },
        { label: "Received", value: "received" },
        { label: "Declined to comment", value: "declined" },
        { label: "No response", value: "no-response" },
      ],
    },
    {
      name: "employerResponseContent",
      type: "textarea",
    },
    {
      name: "employerResponseDate",
      type: "date",
    },
    {
      name: "relatedArticles",
      type: "relationship",
      hasMany: true,
      relationTo: "articles",
    },
    {
      name: "essentialReadingEligible",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "insideWorkEligible",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publicationDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
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
      name: "updatedDate",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "correctionRecords",
      type: "array",
      fields: [
        { name: "date", type: "date", required: true },
        {
          name: "type",
          type: "select",
          defaultValue: "correction",
          options: [
            { label: "Correction", value: "correction" },
            { label: "Clarification", value: "clarification" },
            { label: "Update", value: "update" },
          ],
        },
        { name: "text", type: "textarea", required: true },
        { name: "materialChange", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "corrections",
      type: "relationship",
      hasMany: true,
      relationTo: "corrections",
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
    {
      name: "editorialStage",
      type: "select",
      defaultValue: "pitch",
      options: editorialStages,
      required: true,
    },
    {
      name: "assignedEditor",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "internalEditorialNotes",
      type: "textarea",
      access: {
        read: ({ req }) => Boolean(req.user),
      },
    },
  ],
};
