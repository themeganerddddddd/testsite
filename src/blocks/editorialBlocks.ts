import type { Block } from "payload";

export const PullQuoteBlock: Block = {
  slug: "pullQuote",
  interfaceName: "PullQuoteBlock",
  labels: {
    plural: "Pull Quotes",
    singular: "Pull Quote",
  },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "attribution",
      type: "text",
    },
  ],
};

export const FactBoxBlock: Block = {
  slug: "factBox",
  interfaceName: "FactBoxBlock",
  labels: {
    plural: "Fact Boxes",
    singular: "Fact Box",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};

export const DataCalloutBlock: Block = {
  slug: "dataCallout",
  interfaceName: "DataCalloutBlock",
  labels: {
    plural: "Data Callouts",
    singular: "Data Callout",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "value",
      type: "text",
      required: true,
    },
    {
      name: "note",
      type: "textarea",
    },
  ],
};

export const DocumentExcerptBlock: Block = {
  slug: "documentExcerpt",
  interfaceName: "DocumentExcerptBlock",
  labels: {
    plural: "Document Excerpts",
    singular: "Document Excerpt",
  },
  fields: [
    {
      name: "sourceLabel",
      type: "text",
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "note",
      type: "textarea",
    },
  ],
};

export const VerificationNoteBlock: Block = {
  slug: "verificationNote",
  interfaceName: "VerificationNoteBlock",
  labels: {
    plural: "Verification Notes",
    singular: "Verification Note",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Verification note",
    },
    {
      name: "text",
      type: "textarea",
      required: true,
    },
  ],
};

export const EmployerResponseBlock: Block = {
  slug: "employerResponse",
  interfaceName: "EmployerResponseBlock",
  labels: {
    plural: "Employer Responses",
    singular: "Employer Response",
  },
  fields: [
    {
      name: "status",
      type: "select",
      defaultValue: "requested",
      options: [
        { label: "Requested", value: "requested" },
        { label: "Received", value: "received" },
        { label: "Declined", value: "declined" },
        { label: "No response", value: "no-response" },
      ],
      required: true,
    },
    {
      name: "text",
      type: "textarea",
    },
  ],
};

export const CorrectionNoticeBlock: Block = {
  slug: "correctionNotice",
  interfaceName: "CorrectionNoticeBlock",
  labels: {
    plural: "Correction Notices",
    singular: "Correction Notice",
  },
  fields: [
    {
      name: "date",
      type: "date",
      required: true,
    },
    {
      name: "text",
      type: "textarea",
      required: true,
    },
  ],
};

export const editorialBlocks = [
  PullQuoteBlock,
  FactBoxBlock,
  DataCalloutBlock,
  DocumentExcerptBlock,
  VerificationNoteBlock,
  EmployerResponseBlock,
  CorrectionNoticeBlock,
];
