import { describe, expect, it } from "vitest";

import {
  canAccessEditorial,
  canAccessNewsletter,
  canAccessSources,
  canManageUsers,
  canPublishArticles,
} from "@/lib/roles";
import {
  makeSubmissionReference,
  newsletterSchema,
  submissionSchema,
} from "@/lib/validation";

describe("role helpers", () => {
  it("keeps responsibilities separate", () => {
    expect(canAccessSources({ active: true, roles: ["editor"] })).toBe(false);
    expect(
      canPublishArticles({ active: true, roles: ["source_manager"] }),
    ).toBe(false);
    expect(
      canAccessNewsletter({ active: true, roles: ["newsletter_editor"] }),
    ).toBe(true);
  });

  it("owners can do everything", () => {
    const owner = { active: true, roles: ["owner" as const] };
    expect(canManageUsers(owner)).toBe(true);
    expect(canAccessSources(owner)).toBe(true);
    expect(canAccessEditorial(owner)).toBe(true);
  });

  it("inactive users have no permissions", () => {
    expect(canAccessEditorial({ active: false, roles: ["owner"] })).toBe(false);
  });
});

describe("newsletter and submissions", () => {
  it("normalizes newsletter emails", () => {
    const parsed = newsletterSchema.parse({ email: "  READER@EXAMPLE.TEST  " });
    expect(parsed.email).toBe("reader@example.test");
  });

  it("generates submission references", () => {
    expect(makeSubmissionReference(new Date("2026-07-27T12:00:00Z"))).toMatch(
      /^PUB-20260727-\d{4}$/,
    );
  });

  it("validates the Submit minimum required data", () => {
    const parsed = submissionSchema.safeParse({
      currentOrFormerEmployee: "current",
      evidenceAvailability: "describe",
      generalRole: "customer support specialist",
      noPersonalDataAcknowledged: true,
      notWorkDeviceAcknowledged: true,
      needsAnonymity: "no",
      personalEmail: "source@example.test",
      additionalContext:
        "I directly observed a workflow that affects many public users.",
      privacyAcknowledged: true,
      submissionType: "pitch",
    });

    expect(parsed.success).toBe(true);
  });

  it("requires pseudonym details only when anonymity is requested", () => {
    const parsed = submissionSchema.safeParse({
      currentOrFormerEmployee: "current",
      evidenceAvailability: "describe",
      generalRole: "customer support specialist",
      needsAnonymity: "yes",
      noPersonalDataAcknowledged: true,
      notWorkDeviceAcknowledged: true,
      personalEmail: "source@example.test",
      additionalContext:
        "I directly observed a workflow that affects many public users.",
      privacyAcknowledged: true,
      pseudonym: "a billing coordinator",
      anonymityReason:
        "Disclosure could identify my department and place my job at risk.",
      submissionType: "pitch",
    });

    expect(parsed.success).toBe(true);
  });
});
