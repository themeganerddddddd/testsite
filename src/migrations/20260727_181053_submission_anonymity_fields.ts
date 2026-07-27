import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" ADD COLUMN "needs_anonymity" boolean DEFAULT false;
  ALTER TABLE "submissions" ADD COLUMN "pseudonym" varchar;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" DROP COLUMN "needs_anonymity";
  ALTER TABLE "submissions" DROP COLUMN "pseudonym";`);
}
