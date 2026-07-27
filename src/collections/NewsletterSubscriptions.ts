import type { CollectionConfig } from "payload";

import { newsletterFieldAccess, newsletterUsers } from "@/lib/access";
import { canAccessNewsletter, type RoleBearingUser } from "@/lib/roles";
import { toCSV } from "@/lib/csv";

export const NewsletterSubscriptions: CollectionConfig = {
  slug: "newsletter-subscriptions",
  labels: {
    plural: "Newsletter Subscriptions",
    singular: "Newsletter Subscription",
  },
  admin: {
    defaultColumns: [
      "email",
      "status",
      "sourcePage",
      "createdAt",
      "unsubscribedDate",
    ],
    group: "Newsletter",
    useAsTitle: "email",
  },
  access: {
    create: () => true,
    delete: newsletterUsers,
    read: newsletterUsers,
    update: newsletterUsers,
  },
  endpoints: [
    {
      handler: async (req) => {
        if (!canAccessNewsletter(req.user as RoleBearingUser)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const subscriptions = await req.payload.find({
          collection: "newsletter-subscriptions",
          depth: 0,
          limit: 10000,
          overrideAccess: true,
          sort: "-createdAt",
        });
        const csv = toCSV(
          subscriptions.docs as unknown as Record<string, unknown>[],
          [
            "email",
            "status",
            "consentTimestamp",
            "sourcePage",
            "createdAt",
            "unsubscribedDate",
          ],
        );

        return new Response(csv, {
          headers: {
            "content-disposition":
              'attachment; filename="publius-newsletter.csv"',
            "content-type": "text/csv; charset=utf-8",
          },
        });
      },
      method: "get",
      path: "/export.csv",
    },
  ],
  fields: [
    {
      name: "email",
      type: "email",
      index: true,
      required: true,
      unique: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Unsubscribed", value: "unsubscribed" },
        { label: "Bounced", value: "bounced" },
      ],
      required: true,
    },
    {
      name: "consentTimestamp",
      type: "date",
      required: true,
    },
    {
      name: "sourcePage",
      type: "text",
    },
    {
      name: "unsubscribedDate",
      type: "date",
    },
    {
      name: "verificationToken",
      type: "text",
      access: {
        read: newsletterFieldAccess,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email && typeof data.email === "string") {
          data.email = data.email.trim().toLowerCase();
        }

        return data;
      },
    ],
  },
};
