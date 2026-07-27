import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" ALTER COLUMN "what_readers_should_understand" DROP NOT NULL;
  ALTER TABLE "submissions" ALTER COLUMN "personally_observed" DROP NOT NULL;
  ALTER TABLE "submissions" ALTER COLUMN "public_interest_explanation" DROP NOT NULL;
  ALTER TABLE "submissions" ADD COLUMN "additional_context" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" ALTER COLUMN "what_readers_should_understand" SET NOT NULL;
  ALTER TABLE "submissions" ALTER COLUMN "personally_observed" SET NOT NULL;
  ALTER TABLE "submissions" ALTER COLUMN "public_interest_explanation" SET NOT NULL;
  ALTER TABLE "submissions" DROP COLUMN "additional_context";`);
}
