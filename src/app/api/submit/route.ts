import { getPayload } from "payload";

import configPromise from "@payload-config";
import { rateLimit } from "@/lib/rateLimit";
import {
  formDataToObject,
  makeSubmissionReference,
  submissionSchema,
} from "@/lib/validation";

function normalizeSubmissionInput(input: Record<string, unknown>) {
  const checkbox = (key: string) =>
    input[key] === "on" || input[key] === "true" || input[key] === true;

  return {
    ...input,
    activeDisputeOrLitigation: checkbox("activeDisputeOrLitigation"),
    namedIndividualsImplicated: checkbox("namedIndividualsImplicated"),
    noPersonalDataAcknowledged: checkbox("noPersonalDataAcknowledged"),
    notWorkDeviceAcknowledged: checkbox("notWorkDeviceAcknowledged"),
    privacyAcknowledged: checkbox("privacyAcknowledged"),
  };
}

async function parseRequest(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return normalizeSubmissionInput(await request.json());
  }

  return normalizeSubmissionInput(formDataToObject(await request.formData()));
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";

  if (!rateLimit({ key: `submit:${ip}`, limit: 4, windowMs: 10 * 60_000 })) {
    return Response.json(
      { error: "Please wait before sending another submission." },
      { status: 429 },
    );
  }

  const input = await parseRequest(request);
  const parsed = submissionSchema.safeParse(input);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Please review the required fields and safety acknowledgements.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.trap) {
    return Response.json({ referenceNumber: makeSubmissionReference() });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    let referenceNumber = makeSubmissionReference();

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const existing = await payload.find({
        collection: "submissions",
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          referenceNumber: { equals: referenceNumber },
        },
      });

      if (existing.docs.length === 0) {
        break;
      }

      referenceNumber = makeSubmissionReference();
    }

    await payload.create({
      collection: "submissions",
      data: {
        activeDisputeOrLitigation: parsed.data.activeDisputeOrLitigation,
        additionalContext: parsed.data.additionalContext,
        anonymityReason:
          parsed.data.needsAnonymity === "yes"
            ? parsed.data.anonymityReason
            : undefined,
        completeDraft: parsed.data.completeDraft,
        consents: {
          noPersonalDataAcknowledged: parsed.data.noPersonalDataAcknowledged,
          notWorkDeviceAcknowledged: parsed.data.notWorkDeviceAcknowledged,
          privacyAcknowledged: parsed.data.privacyAcknowledged,
        },
        contactPreference: parsed.data.contactPreference,
        contributorName: parsed.data.contributorName,
        currentOrFormerEmployee: parsed.data.currentOrFormerEmployee,
        evidenceAvailability: parsed.data.evidenceAvailability,
        generalRole: parsed.data.generalRole,
        namedIndividualsImplicated: parsed.data.namedIndividualsImplicated,
        needsAnonymity: parsed.data.needsAnonymity === "yes",
        organization: parsed.data.organization,
        personalEmail: parsed.data.personalEmail,
        proposedHeadline: parsed.data.proposedHeadline,
        pseudonym:
          parsed.data.needsAnonymity === "yes"
            ? parsed.data.pseudonym
            : undefined,
        referenceNumber,
        status: "new",
        submissionDate: new Date().toISOString(),
        submissionType: parsed.data.submissionType,
      },
      overrideAccess: true,
    });

    return Response.json({
      confirmationUrl: `/submit/confirmation?ref=${encodeURIComponent(referenceNumber)}`,
      referenceNumber,
    });
  } catch {
    return Response.json(
      {
        error: "Submit is unavailable until the database is running.",
      },
      { status: 503 },
    );
  }
}
