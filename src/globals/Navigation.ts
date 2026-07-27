import type { GlobalConfig } from "payload";

import { editorialUsers } from "@/lib/access";

const linkFields = [
  {
    name: "label",
    type: "text",
    required: true,
  },
  {
    name: "href",
    label: "Internal or external destination",
    type: "text",
    required: true,
  },
  {
    name: "order",
    type: "number",
    defaultValue: 100,
    required: true,
  },
  {
    name: "visible",
    type: "checkbox",
    defaultValue: true,
  },
] as const;

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    group: "Navigation",
  },
  access: {
    read: () => true,
    update: editorialUsers,
  },
  fields: [
    {
      name: "primaryNavigation",
      type: "array",
      fields: [...linkFields],
    },
    {
      name: "footerNavigation",
      type: "array",
      fields: [
        {
          name: "groupLabel",
          type: "text",
          required: true,
        },
        {
          name: "links",
          type: "array",
          fields: [...linkFields],
          required: true,
        },
      ],
    },
  ],
};
