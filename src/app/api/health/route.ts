import { getPayload } from "payload";

import configPromise from "@payload-config";

export async function GET() {
  try {
    await getPayload({ config: configPromise });

    return Response.json({
      database: "ok",
      status: "ok",
    });
  } catch {
    return Response.json(
      {
        database: "unavailable",
        status: "degraded",
      },
      { status: 503 },
    );
  }
}
