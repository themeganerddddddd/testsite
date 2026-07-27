import { getPayload } from "payload";

import configPromise from "@payload-config";
import { rateLimit } from "@/lib/rateLimit";
import { newsletterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";

  if (!rateLimit({ key: `newsletter:${ip}`, limit: 8, windowMs: 60_000 })) {
    return Response.json(
      { error: "Please wait before trying again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const existing = await payload.find({
      collection: "newsletter-subscriptions",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        email: { equals: parsed.data.email },
      },
    });

    if (existing.docs.length > 0) {
      return Response.json({
        duplicate: true,
        message: "You are already on the Publius list.",
      });
    }

    await payload.create({
      collection: "newsletter-subscriptions",
      data: {
        consentTimestamp: new Date().toISOString(),
        email: parsed.data.email,
        sourcePage: parsed.data.sourcePage,
        status: "active",
      },
      overrideAccess: true,
    });

    return Response.json({
      message: "Thank you. You are on the Publius list.",
    });
  } catch {
    return Response.json(
      {
        error:
          "Newsletter signup is unavailable until the database is running.",
      },
      { status: 503 },
    );
  }
}
