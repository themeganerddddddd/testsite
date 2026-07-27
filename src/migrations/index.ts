import * as migration_20260727_173435_initial from "./20260727_173435_initial";
import * as migration_20260727_181053_submission_anonymity_fields from "./20260727_181053_submission_anonymity_fields";
import * as migration_20260727_190023_simplified_submission_context from "./20260727_190023_simplified_submission_context";

export const migrations = [
  {
    up: migration_20260727_173435_initial.up,
    down: migration_20260727_173435_initial.down,
    name: "20260727_173435_initial",
  },
  {
    up: migration_20260727_181053_submission_anonymity_fields.up,
    down: migration_20260727_181053_submission_anonymity_fields.down,
    name: "20260727_181053_submission_anonymity_fields",
  },
  {
    up: migration_20260727_190023_simplified_submission_context.up,
    down: migration_20260727_190023_simplified_submission_context.down,
    name: "20260727_190023_simplified_submission_context",
  },
];
