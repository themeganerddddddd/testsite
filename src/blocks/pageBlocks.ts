import type { Block } from "payload";

export const TextSectionBlock: Block = {
  slug: "textSection",
  interfaceName: "TextSectionBlock",
  labels: {
    plural: "Text Sections",
    singular: "Text Section",
  },
  fields: [
    {
      name: "heading",
      type: "text",
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
  ],
};

export const CalloutBlock: Block = {
  slug: "callout",
  interfaceName: "CalloutBlock",
  labels: {
    plural: "Callouts",
    singular: "Callout",
  },
  fields: [
    {
      name: "label",
      type: "text",
    },
    {
      name: "text",
      type: "textarea",
      required: true,
    },
  ],
};

export const LinkListBlock: Block = {
  slug: "linkList",
  interfaceName: "LinkListBlock",
  labels: {
    plural: "Link Lists",
    singular: "Link List",
  },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "links",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
      required: true,
    },
  ],
};

export const pageBlocks = [TextSectionBlock, CalloutBlock, LinkListBlock];
