import { z } from "zod";

const booleanFromString = z
  .string()
  .optional()
  .transform((value) => value === "true");

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgres://publius:publius@localhost:5432/publius"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  PAYLOAD_SECRET: z
    .string()
    .min(32)
    .default("local-dev-publius-secret-change-before-prod"),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_FORCE_PATH_STYLE: booleanFromString,
  S3_REGION: z.string().default("auto"),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  SEED_OWNER_EMAIL: z.string().email().default("owner@publius.local"),
  SEED_OWNER_NAME: z.string().default("Publius Owner"),
  SEED_OWNER_PASSWORD: z
    .string()
    .min(12)
    .default("change-me-local-owner-password"),
});

const parsed = envSchema.parse(process.env);

if (
  process.env.NODE_ENV === "production" &&
  parsed.PAYLOAD_SECRET === "local-dev-publius-secret-change-before-prod"
) {
  throw new Error("PAYLOAD_SECRET must be set to a unique production secret.");
}

if (
  process.env.NODE_ENV === "production" &&
  parsed.SEED_OWNER_PASSWORD === "change-me-local-owner-password"
) {
  throw new Error(
    "SEED_OWNER_PASSWORD must be changed before production seeding.",
  );
}

export const env = parsed;

export const hasS3Config = Boolean(
  env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY,
);
