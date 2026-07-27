import fs from "node:fs/promises";
import path from "node:path";

import { getPayload } from "payload";
import sharp from "sharp";

import configPromise from "../payload.config";
import {
  demoArticles,
  demoBylines,
  demoHomepage,
  demoNavigation,
  demoPages,
  demoSiteSettings,
  demoSubmissions,
  demoTags,
  demoTopics,
} from "../src/lib/demoData";
import { env } from "../src/lib/env";
import type { Config } from "../src/payload-types";

type SeedDoc = Record<string, unknown> & { id: string };
type SeedData = Record<string, unknown>;
type SeedCollection = keyof Config["collections"];
type SeedPayloadClient = {
  create: (args: {
    collection: SeedCollection;
    data: SeedData;
    depth?: number;
    overrideAccess?: boolean;
  }) => Promise<SeedDoc>;
  find: (args: {
    collection: SeedCollection;
    depth?: number;
    limit?: number;
    overrideAccess?: boolean;
    where: Record<string, unknown>;
  }) => Promise<{ docs: SeedDoc[] }>;
  update: (args: {
    collection: SeedCollection;
    data: SeedData;
    depth?: number;
    id: string;
    overrideAccess?: boolean;
  }) => Promise<SeedDoc>;
};

async function upsertByField({
  collection,
  data,
  field,
  value,
}: {
  collection: SeedCollection;
  data: SeedData;
  field: string;
  value: string;
}): Promise<SeedDoc> {
  const payload = (await getPayload({
    config: configPromise,
  })) as unknown as SeedPayloadClient;
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { [field]: { equals: value } },
  });

  if (existing.docs[0]) {
    return payload.update({
      collection,
      data,
      depth: 0,
      id: existing.docs[0].id,
      overrideAccess: true,
    });
  }

  return payload.create({
    collection,
    data,
    depth: 0,
    overrideAccess: true,
  });
}

async function seedImage(label: string, index: number): Promise<SeedDoc> {
  const payload = await getPayload({ config: configPromise });
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { altText: { equals: label } },
  });

  if (existing.docs[0]) {
    return existing.docs[0] as unknown as SeedDoc;
  }

  const directory = path.resolve(process.cwd(), "public/seed-images");
  await fs.mkdir(directory, { recursive: true });
  const filePath = path.join(directory, `publius-seed-${index}.png`);
  const palette = [
    "#d8d2c4",
    "#c9d3cf",
    "#dcc9c0",
    "#c6c8d8",
    "#d7d0b8",
    "#cfc6ba",
  ];
  const color = palette[index % palette.length];
  const svg = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="800" fill="${color}"/>
<rect x="72" y="72" width="1056" height="656" fill="none" stroke="#171512" stroke-width="3"/>
<text x="96" y="650" font-family="Georgia" font-size="58" fill="#171512">PUBLIUS</text>
<text x="96" y="704" font-family="Arial" font-size="24" letter-spacing="6" fill="#6f6a61">THE VIEW FROM INSIDE</text>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(filePath);

  return (await payload.create({
    collection: "media",
    data: {
      altText: label,
      caption: "Fictional Publius seed image.",
      credit: "Generated locally for development.",
    },
    filePath,
    overrideAccess: true,
  })) as unknown as SeedDoc;
}

async function main() {
  const payload = await getPayload({ config: configPromise });

  const owner = await upsertByField({
    collection: "users",
    data: {
      active: true,
      email: env.SEED_OWNER_EMAIL,
      name: env.SEED_OWNER_NAME,
      password: env.SEED_OWNER_PASSWORD,
      roles: ["owner", "editor", "source_manager", "newsletter_editor"],
    },
    field: "email",
    value: env.SEED_OWNER_EMAIL,
  });

  const topicMap = new Map<string, SeedDoc>();
  for (const [index, topic] of demoTopics.entries()) {
    const doc = await upsertByField({
      collection: "topics",
      data: {
        displayOrder: index + 1,
        name: topic.name,
        shortDescription: topic.shortDescription,
        showInNavigation: false,
        slug: topic.slug,
      },
      field: "slug",
      value: topic.slug,
    });
    topicMap.set(topic.id, doc);
  }

  const tagMap = new Map<string, SeedDoc>();
  for (const tag of demoTags) {
    const doc = await upsertByField({
      collection: "tags",
      data: tag,
      field: "slug",
      value: tag.slug,
    });
    tagMap.set(tag.id, doc);
  }

  const bylineMap = new Map<string, SeedDoc>();
  for (const byline of demoBylines) {
    const doc = await upsertByField({
      collection: "public-bylines",
      data: {
        authorshipType: byline.authorshipType,
        displayName: byline.displayName,
        relevantExpertise: byline.shortBiography,
        shortBiography: byline.shortBiography,
        slug: byline.id.replace("byline-", ""),
        verificationWording: byline.verificationWording,
      },
      field: "slug",
      value: byline.id.replace("byline-", ""),
    });
    bylineMap.set(byline.id, doc);
  }

  const media = await Promise.all([
    seedImage("Publius editorial image for institutional work", 0),
    seedImage("Publius editorial image for public service", 1),
    seedImage("Publius editorial image for technology systems", 2),
  ]);

  const articleMap = new Map<string, SeedDoc>();
  for (const [index, article] of demoArticles.entries()) {
    const topic = topicMap.get(article.primaryTopic.id);
    const byline = bylineMap.get(article.publicByline.id);
    const tagIds = (article.tags || [])
      .map((tag) => tagMap.get(tag.id)?.id)
      .filter(Boolean);
    const data = {
      _status: article._status,
      assignedEditor: owner.id,
      authorshipType: article.authorshipType,
      body: article.body,
      correctionRecords: article.correctionRecords,
      employerResponseContent: article.employerResponseContent,
      employerResponseDate: article.employerResponseDate,
      employerResponseStatus: article.employerResponseStatus || "not-requested",
      essentialReadingEligible: Boolean(article.essentialReadingEligible),
      format: article.format,
      heroImage: media[index % media.length]?.id,
      heroImageCaption: "Fictional development image for layout evaluation.",
      heroImageCredit: "Generated locally for Publius seed data.",
      insideWorkEligible: Boolean(article.insideWorkEligible),
      internalTitle: article.publicHeadline,
      primaryTopic: topic?.id,
      publicByline: byline?.id,
      publicHeadline: article.publicHeadline,
      publicationDate: article.publicationDate,
      scheduledPublicationDate: article.scheduledPublicationDate,
      slug: article.slug,
      subtitle: article.subtitle,
      tags: tagIds,
      updatedDate: article.correctionRecords?.length
        ? "2026-06-26T14:00:00.000Z"
        : undefined,
      verificationIndicators: article.verificationIndicators,
      verificationStatement: article.verificationStatement,
    };
    const doc = await upsertByField({
      collection: "articles",
      data,
      field: "slug",
      value: article.slug,
    });

    if (article._status === "published") {
      await payload.update({
        collection: "articles",
        data: { _status: "published" },
        depth: 0,
        id: doc.id,
        overrideAccess: true,
      });
    }

    articleMap.set(article.id, doc);
  }

  const correctedArticle = articleMap.get("article-anonymous-sourcing");
  if (correctedArticle) {
    await upsertByField({
      collection: "corrections",
      data: {
        article: correctedArticle.id,
        correctionType: "clarification",
        date: "2026-06-26T14:00:00.000Z",
        editor: owner.id,
        materialChange: false,
        publicCorrectionText:
          "This demonstration correction clarifies that Publius minimizes exposure but does not promise absolute anonymity.",
      },
      field: "publicCorrectionText",
      value:
        "This demonstration correction clarifies that Publius minimizes exposure but does not promise absolute anonymity.",
    });
  }

  for (const page of demoPages) {
    await upsertByField({
      collection: "pages",
      data: {
        _status: "published",
        contentBlocks: page.contentBlocks,
        intro: page.intro,
        slug: page.slug,
        template: page.template,
        title: page.title,
      },
      field: "slug",
      value: page.slug,
    });
  }

  for (const submission of demoSubmissions) {
    await upsertByField({
      collection: "submissions",
      data: {
        ...submission,
        consents: {
          noPersonalDataAcknowledged: true,
          notWorkDeviceAcknowledged: true,
          privacyAcknowledged: true,
        },
      },
      field: "referenceNumber",
      value: submission.referenceNumber,
    });
  }

  await upsertByField({
    collection: "protected-sources",
    data: {
      anonymityRequestReasoning:
        "Fictional seed source used to validate protected access boundaries.",
      assignedSourceManager: owner.id,
      employmentStatus: "current",
      employer: "Fictional Regional Hospital System",
      exactPosition: "Operations coordinator",
      identityVerificationMethod:
        "Government ID reviewed in person for seed demonstration.",
      legalName: "Jordan Ellis",
      personalEmail: "jordan.ellis@example.test",
      preferredName: "Jordan",
      sourceCode: "SOURCE-0017",
    },
    field: "sourceCode",
    value: "SOURCE-0017",
  });

  await payload.updateGlobal({
    data: {
      ...demoSiteSettings,
    },
    overrideAccess: true,
    slug: "site-settings",
  });

  await payload.updateGlobal({
    data: demoNavigation,
    overrideAccess: true,
    slug: "navigation",
  });

  await payload.updateGlobal({
    data: {
      ...demoHomepage,
      essentialReading: demoHomepage.essentialReading
        .map((article) => articleMap.get(article.id)?.id)
        .filter(Boolean),
      topicDisplayList: demoTopics
        .map((topic) => topicMap.get(topic.id)?.id)
        .filter(Boolean),
    } as Partial<Config["globals"]["homepage"]>,
    overrideAccess: true,
    slug: "homepage",
  });

  await payload.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
