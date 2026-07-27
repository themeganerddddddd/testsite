import type { CollectionConfig } from "payload";

import { authenticated, ownersFieldAccess, ownersOnly } from "@/lib/access";
import { roleOptions } from "@/lib/roles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    defaultColumns: ["name", "email", "roles", "active", "lastLogin"],
    group: "Users",
    useAsTitle: "name",
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: ownersOnly,
    delete: ownersOnly,
    read: authenticated,
    update: ({ id, req }) =>
      Boolean(req.user?.id === id) || ownersOnly({ req }),
  },
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        await req.payload.update({
          collection: "users",
          data: { lastLogin: new Date().toISOString() },
          depth: 0,
          id: user.id,
          overrideAccess: true,
        });
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: ownersFieldAccess,
        update: ownersFieldAccess,
      },
      defaultValue: ["reviewer"],
      hasMany: true,
      options: roleOptions,
      required: true,
    },
    {
      name: "active",
      type: "checkbox",
      access: {
        create: ownersFieldAccess,
        update: ownersFieldAccess,
      },
      defaultValue: true,
      required: true,
    },
    {
      name: "lastLogin",
      type: "date",
      admin: {
        readOnly: true,
      },
    },
  ],
};
