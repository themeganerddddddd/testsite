import type { CollectionConfig } from "payload";

import { editorialUsers } from "@/lib/access";

export const submissionStatuses = [
  { label: "New", value: "new" },
  { label: "Screening", value: "screening" },
  { label: "Follow-up Requested", value: "follow-up-requested" },
  { label: "Under Review", value: "under-review" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "declined" },
  { label: "Converted to Article", value: "converted-to-article" },
  { label: "Closed", value: "closed" },
];

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    defaultColumns: [
      "referenceNumber",
      "submissionType",
      "organization",
      "generalRole",
      "status",
      "assignedEditor",
      "submissionDate",
    ],
    group: "Submissions",
    useAsTitle: "referenceNumber",
  },
  access: {
    create: () => true,
    delete: editorialUsers,
    read: editorialUsers,
    update: editorialUsers,
  },
  fields: [
    {
      name: "referenceNumber",
      type: "text",
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "submissionType",
      type: "select",
      options: [
        { label: "Pitch an article", value: "pitch" },
        { label: "Submit a draft", value: "draft" },
        {
          label: "Share information confidentially",
          value: "confidential-info",
        },
        { label: "Respond to an article", value: "response" },
      ],
      required: true,
    },
    { name: "contributorName", type: "text" },
    {
      name: "needsAnonymity",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "pseudonym", type: "text" },
    { name: "personalEmail", type: "email", required: true },
    {
      name: "contactPreference",
      type: "select",
      defaultValue: "email",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Signal or secure follow-up", value: "secure-follow-up" },
      ],
    },
    {
      name: "currentOrFormerEmployee",
      type: "select",
      options: [
        { label: "Current employee", value: "current" },
        { label: "Former employee", value: "former" },
        { label: "Contractor or vendor", value: "contractor" },
        { label: "Other direct role", value: "other-direct-role" },
        { label: "Not applicable", value: "not-applicable" },
      ],
      required: true,
    },
    { name: "organization", type: "text" },
    { name: "generalRole", type: "text", required: true },
    { name: "proposedHeadline", type: "text" },
    { name: "additionalContext", type: "textarea" },
    { name: "whatReadersShouldUnderstand", type: "textarea" },
    { name: "personallyObserved", type: "textarea" },
    { name: "publicInterestExplanation", type: "textarea" },
    { name: "anonymityReason", type: "textarea" },
    {
      name: "evidenceAvailability",
      type: "select",
      options: [
        { label: "No documents", value: "none" },
        { label: "Can describe records", value: "describe" },
        {
          label: "May be able to share records later",
          value: "may-share-later",
        },
      ],
      required: true,
    },
    {
      name: "namedIndividualsImplicated",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "activeDisputeOrLitigation",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "completeDraft", type: "textarea" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: submissionStatuses,
      required: true,
    },
    { name: "assignedEditor", type: "relationship", relationTo: "users" },
    { name: "internalNotes", type: "textarea" },
    { name: "submissionDate", type: "date", required: true },
    {
      name: "consents",
      type: "group",
      fields: [
        { name: "privacyAcknowledged", type: "checkbox", required: true },
        { name: "notWorkDeviceAcknowledged", type: "checkbox", required: true },
        {
          name: "noPersonalDataAcknowledged",
          type: "checkbox",
          required: true,
        },
      ],
    },
  ],
};
