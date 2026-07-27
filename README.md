# PUBLIUS

PUBLIUS is a locally runnable digital publication built with Next.js App Router, TypeScript, Payload CMS, PostgreSQL, Lexical rich text, local uploads, and optional S3/R2-compatible storage.

This project is intentionally configured for local evaluation. Do not deploy it publicly until you replace all local secrets, review source-protection practices with counsel/security support, and harden the hosting environment.

## What Is Included

- Public publication routes: homepage, latest, topics, Inside Work, article pages, search, RSS, sitemap, robots, and policy pages.
- Payload admin at `/admin` with collections for articles, pages, topics, tags, public bylines, media, corrections, submissions, newsletter subscriptions, protected sources, and protected source files.
- Editorial workflow fields: drafts, publication scheduling, editorial stages, verification statements, employer responses, corrections, SEO, related articles, and homepage curation.
- Role model: owner, editor, reviewer, source manager, and newsletter editor.
- Source protection boundary: public submission records are separate from identifying source records and protected files.
- Seed data with fictional articles, anonymous contributor examples, public policy pages, sample submissions, and one protected source record.
- Unit tests, Playwright public-route tests, Docker Compose for PostgreSQL, and GitHub Actions CI.

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

4. Run database migrations and seed content:

   ```bash
   pnpm payload:migrate
   pnpm seed
   ```

5. Start the site:

   ```bash
   pnpm dev
   ```

Open `http://localhost:3000` for the publication and `http://localhost:3000/admin` for Payload.

Default local owner credentials are read from `.env`. Change `SEED_OWNER_EMAIL` and `SEED_OWNER_PASSWORD` before reseeding any shared environment.

## Useful Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm payload:types
pnpm payload:importmap
pnpm payload:migrate:create initial
```

## Environment

Required locally:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `SEED_OWNER_EMAIL`
- `SEED_OWNER_NAME`
- `SEED_OWNER_PASSWORD`

Optional S3/R2-compatible storage:

- `S3_BUCKET`
- `S3_REGION`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_FORCE_PATH_STYLE`

When S3/R2 variables are absent, uploads remain local under `public/media` and protected source files under `private/source-files`.

## Source Protection Notes

The app separates public editorial records from protected source records. Public article pages never query submissions, protected sources, protected files, internal notes, or source-identifying fields. Payload access rules restrict protected source records and protected uploads to source managers.

The Submit form asks for personal contact details and sensitive context. This local implementation is a functional prototype, not a complete operational security program. Before production use, add secure email/notification handling, encrypted backups, retention automation, incident response procedures, and jurisdiction-specific legal review.

## Validation

Run the standard checks before handoff:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

For browser tests:

```bash
pnpm test:e2e
```

Playwright starts the local dev server automatically. Tests that require the database skip themselves when `/api/health` reports the database is unavailable.
