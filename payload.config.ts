import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig, type SharpDependency } from "payload";
import sharp from "sharp";

import { editorialBlocks } from "@/blocks/editorialBlocks";
import {
  Articles,
  Corrections,
  Media,
  NewsletterSubscriptions,
  Pages,
  ProtectedSourceFiles,
  ProtectedSources,
  PublicBylines,
  Submissions,
  Tags,
  Topics,
  Users,
} from "@/collections";
import { Homepage } from "@/globals/Homepage";
import { Navigation } from "@/globals/Navigation";
import { SiteSettings } from "@/globals/SiteSettings";
import { env, hasS3Config } from "@/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const editor = lexicalEditor({
  admin: {
    placeholder:
      "Write with care. Verification notes and editorial blocks are available from the toolbar.",
  },
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    InlineCodeFeature(),
    BlockquoteFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    HorizontalRuleFeature(),
    LinkFeature({
      enabledCollections: ["articles", "pages"],
    }),
    RelationshipFeature(),
    UploadFeature({
      collections: {
        media: {
          fields: [
            { name: "caption", type: "text" },
            { name: "credit", type: "text" },
          ],
        },
      },
    }),
    BlocksFeature({
      blocks: editorialBlocks,
    }),
    EXPERIMENTAL_TableFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, "src"),
    },
    meta: {
      description: "Private editorial system for Publius.",
      titleSuffix: "- Publius",
    },
    user: Users.slug,
  },
  blocks: editorialBlocks,
  collections: [
    Users,
    Articles,
    Pages,
    Topics,
    Tags,
    PublicBylines,
    Media,
    Submissions,
    ProtectedSources,
    ProtectedSourceFiles,
    NewsletterSubscriptions,
    Corrections,
  ],
  cors: [env.NEXT_PUBLIC_SITE_URL],
  csrf: [env.NEXT_PUBLIC_SITE_URL],
  db: postgresAdapter({
    blocksAsJSON: true,
    idType: "uuid",
    migrationDir: path.resolve(dirname, "src/migrations"),
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  editor,
  globals: [Homepage, SiteSettings, Navigation],
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  plugins: [
    s3Storage({
      acl: "private",
      alwaysInsertFields: true,
      bucket: env.S3_BUCKET || "publius-local-placeholder",
      collections: {
        media: {
          prefix: "public",
        },
        "protected-source-files": {
          prefix: "protected",
          signedDownloads: {
            expiresIn: 60,
          },
        },
      },
      config: {
        credentials: hasS3Config
          ? {
              accessKeyId: env.S3_ACCESS_KEY_ID || "",
              secretAccessKey: env.S3_SECRET_ACCESS_KEY || "",
            }
          : undefined,
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: env.S3_FORCE_PATH_STYLE,
        region: env.S3_REGION,
      },
      disableLocalStorage: hasS3Config,
      enabled: hasS3Config,
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  routes: {
    admin: "/admin",
  },
  sharp: sharp as unknown as SharpDependency,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
