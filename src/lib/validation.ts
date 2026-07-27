import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  sourcePage: z.string().optional().default("unknown"),
});

export const submissionSchema = z
  .object({
    activeDisputeOrLitigation: z.coerce.boolean().default(false),
    additionalContext: z.string().trim().max(8000).optional(),
    anonymityReason: z.string().max(4000).optional(),
    completeDraft: z.string().max(20000).optional(),
    contactPreference: z
      .enum(["email", "phone", "secure-follow-up"])
      .default("email"),
    contributorName: z.string().max(160).optional(),
    currentOrFormerEmployee: z.enum([
      "current",
      "former",
      "contractor",
      "other-direct-role",
      "not-applicable",
    ]),
    evidenceAvailability: z.enum(["none", "describe", "may-share-later"]),
    generalRole: z.string().trim().min(2).max(200),
    namedIndividualsImplicated: z.coerce.boolean().default(false),
    needsAnonymity: z.enum(["yes", "no"]),
    noPersonalDataAcknowledged: z.literal(true),
    notWorkDeviceAcknowledged: z.literal(true),
    organization: z.string().max(240).optional(),
    personalEmail: z.string().trim().toLowerCase().email(),
    pseudonym: z.string().trim().max(160).optional(),
    privacyAcknowledged: z.literal(true),
    proposedHeadline: z.string().max(240).optional(),
    submissionType: z.enum(["pitch", "draft", "confidential-info", "response"]),
    trap: z.string().max(0).optional(),
  })
  .superRefine((data, context) => {
    if (data.needsAnonymity !== "yes") {
      return;
    }

    if (!data.pseudonym || data.pseudonym.length < 2) {
      context.addIssue({
        code: "custom",
        message: "Please provide a pseudonym.",
        path: ["pseudonym"],
      });
    }

    if (!data.anonymityReason || data.anonymityReason.trim().length < 20) {
      context.addIssue({
        code: "custom",
        message: "Please explain why anonymity may be required.",
        path: ["anonymityReason"],
      });
    }
  });

export function formDataToObject(formData: FormData): Record<string, unknown> {
  return Object.fromEntries(formData.entries());
}

export function makeSubmissionReference(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000 + 1000);

  return `PUB-${y}${m}${d}-${random}`;
}
