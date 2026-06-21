### Anny’s Plantitas — Unified Architecture & Front-End System (v0.3 → v0.3.1)

Below is a single, integrated architecture and front‑end system document that merges **v0.2** and **v0.3**, resolves the gaps discovered in the audit, and adds concrete, implementable specs for the missing pieces (API client, ISR revalidation, seeding, worker error handling, OAuth, push payloads, local dev, env schema, migrations, and missing UI primitives). Use this as the canonical reference for engineering, QA, and ops during implementation.

---

## Contents

1. Overview and goals
2. Monorepo layout (updated)
3. Key additions that resolve the gaps (quick list)
4. Web API client and auth flows (new)
5. ISR revalidation: webhook, secrets, and new Next.js endpoint (new)
6. Seeding: full seed pipeline, mapping, images, and Cloudinary flow (expanded)
7. Workers: retry, DLQ, admin feedback, and observability (expanded)
8. Push notifications: payload schema and deep-linking contract (new)
9. OAuth design and account linking (new)
10. ISR fallback strategy for new plants (decision + implementation)
11. UI primitives added (Pagination, Toast, Featured flag, Theme/dark mode)
12. Local development orchestration and `.env.example` (new)
13. DB migration strategy and backfill plan (new)
14. Testing, CI, and rollout notes (updated)
15. Appendix: short checklists for implementers

---

### 1. Overview and goals

**Goal:** ship a production-ready, bilingual plant catalog (200+ seeded plants) with robust web + native clients, admin tooling, background workers, and a clear developer experience. This unified doc keeps the original architecture (monorepo, Next.js ISR, Expo native app, Express API, MongoDB, BullMQ) while closing the critical gaps identified in the audit.

Two sentences from the original architecture that remain central:

> “The project uses a Turborepo monorepo. Expo Web is dropped in favour of a Next.js app for SEO, ISR, and the admin panel.”  
> “Zod everywhere — `packages/types` defines all Zod schemas (plant, user, search filters).”

---

### 2. Monorepo layout (updated)

```
plantitas-monorepo/
├── apps/
│   ├── native/          # Expo Router app (iOS & Android)
│   ├── web/             # Next.js (public catalog + admin panel)
│   └── api/             # Node.js + Express (REST API + workers runner)
├── packages/
│   ├── core/            # Shared business logic, Zustand slices, BL_*
│   ├── db/              # Mongoose models, seed scripts, migrations
│   ├── types/           # Zod schemas + TS types
│   ├── ui/              # Tamagui primitives + Pagination, Toast
│   └── clients/         # HTTP clients: axios wrappers for native + web
├── infra/               # docker-compose, local infra scripts, infra docs
├── .github/
└── turbo.json
```

**New packages:**

- `packages/clients` — contains `webApiClient.ts` (fetch wrapper using cookies), `nativeApiClient.ts` (axios with secure-store interceptors), and shared request/response types.
- `infra/docker-compose.yml` — local MongoDB, Redis, and optional MailHog.

---

### 3. Key additions that resolve the gaps (quick list)

- **Web API client** (`packages/clients/webApiClient.ts`) with cookie-aware fetch and CSRF protection. (resolves gap #1)
- **Next.js revalidation endpoint** (`apps/web/app/api/revalidate/route.ts`) and secure webhook contract for `PlantService.revalidateISR`. (resolves gap #2)
- **Seed pipeline**: `packages/db/seed/seed-plants.ts` expanded to include Perenual/Trefle mapping, Cloudinary upload, `mapToSchema()` spec, and admin review step. (resolves gap #3)
- **Worker error handling**: retry policy, DLQ, admin job status, and per-row import error reporting. (resolves gap #4)
- **OAuth design**: Google OAuth flows for web (NextAuth) and native (Expo AuthSession), plus account linking/unlinking rules. (resolves gap #5)
- **Push payload schema** and deep-link contract for reminders. (resolves gap #6)
- **ISR fallback policy**: `fallback: 'blocking'` for plant pages + revalidation webhook for new slugs. (resolves gap #7)
- **UI primitives**: `Pagination`, `Toast/Snackbar`, `Theme` tokens (light/dark), `Featured` flag on plants. (resolves gap #8 & #9)
- **Local dev orchestration**: `infra/docker-compose.yml` and `scripts/dev-setup.sh`. (resolves gap #10)
- **`.env.example`** with required variables for web, api, and native. (resolves gap #11)
- **DB migration strategy**: `packages/db/migrations` using `migrate-mongo` or `mongock` with backfill tasks. (resolves gap #12)

---

### 4. Web API client and auth flows (new)

**Purpose:** provide a consistent, secure client for admin mutations from `apps/web` that uses HttpOnly session cookies (NextAuth) and calls the Express API for writes.

**File:** `packages/clients/webApiClient.ts` (TypeScript)

**Behavior:**

- Uses `fetch` (or `undici` in Node) with `credentials: 'include'`.
- Adds `X-CSRF-Token` header when available (NextAuth session cookie + server-provided CSRF token).
- Retries idempotent requests (GET/HEAD) with exponential backoff.
- Exposes typed helpers: `get<T>(path)`, `post<T>(path, body)`, `patch<T>(path, body)`, `del(path)`.

**Example usage (admin):**

```ts
import { webApi } from '@plantitas/clients'

await webApi.post('/admin/plants', plantPayload)
```

**Why needed:** NextAuth wraps JWT in HttpOnly cookies; the web admin must not read tokens from JS. The client ensures cookies are sent and provides consistent error handling and retry semantics.

---

### 5. ISR revalidation: webhook, secrets, and new Next.js endpoint (new)

**Problem:** `PlantService.revalidateISR` was underspecified. We add a secure, single-purpose revalidation endpoint in Next.js and a server-side contract.

**Next.js endpoint:** `apps/web/app/api/revalidate/route.ts`

**Contract:**

- **URL:** `https://<web-host>/api/revalidate`
- **Method:** `POST`
- **Auth:** `x-revalidate-secret: <REVALIDATE_SECRET>` header (shared secret stored in AWS Secrets Manager / Vercel env)
- **Body:** `{ slugs: string[] }`
- **Behavior:** For each slug, call `res.revalidate('/plants/' + slug)`; return `{ revalidated: ['slug1','slug2'], failed: [] }`.

**Express `PlantService.revalidateISR` implementation:**

- Reads `WEB_REVALIDATE_URL` and `WEB_REVALIDATE_SECRET` from secrets.
- POSTs `{ slugs }` with header `x-revalidate-secret`.
- Retries up to 3× on network errors; logs failures to changelog and Sentry.

**Security notes:**

- The revalidation secret is rotated periodically.
- The endpoint only accepts POST and only from the API (EB IPs allowed via firewall if desired).
- Admin UI shows revalidation status returned by the API.

---

### 6. Seeding: full seed pipeline, mapping, images, and Cloudinary flow (expanded)

**Seed entrypoint:** `packages/db/seed/seed-plants.ts`

**High-level flow:**

1. **Source list**: curated CSV of 200 target plants (common/scientific names + priority tags).
2. **Fetch details**: call Perenual/Trefle endpoints for each species (rate-limited).
3. **Map to schema**: `mapToSchema(raw: APIPlant): PlantInput` — deterministic mapping rules:
    - `sunlight` → `lightNeeds` enum mapping table
    - `watering` → `waterNeeds` enum mapping table
    - `family` → `botanicalFamily`
    - `habitat` → `facets.habitat[]`
    - `use` → `facets.use[]`
    - `images[]` → list of remote URLs
4. **Image handling**:
    - For each image URL, fetch image metadata (content-type, width, height).
    - Upload to Cloudinary via `MediaService.uploadFromUrl(url)` which returns CDN URL and dimensions.
    - Save `plant_media` records with `width`, `height`, `isPrimary`.
5. **Validation**: validate with `plantSchema.parse()` (Zod). On validation error, write to `seed_errors.log` and continue.
6. **Bulk upsert**: call `PlantService.bulkUpsert(validatedPlants, { updatedBy: seedAdminUserId })`.
7. **Post-seed manual review**: admin panel shows `seed_errors` and `seed_review` queue for manual edits and localized copy.

**mapToSchema() spec (excerpt):**

```ts
function mapToSchema(raw) {
  return {
    commonName: raw.common_name || raw.name,
    scientificName: raw.scientific_name,
    botanicalFamily: raw.family,
    facets: {
      habitat: normalizeHabitat(raw.habitat),
      growthHabit: normalizeGrowth(raw.habit),
      use: normalizeUse(raw.human_use),
    },
    careTips: generateCareTips(raw),
    waterNeeds: mapWater(raw.watering),
    lightNeeds: mapLight(raw.sunlight),
    images: raw.images.map(img => ({ url: img.url, source: 'perenual' })),
    slug: slugify(raw.common_name || raw.scientific_name),
  }
}
```

**Image licensing & attribution:**

- Prefer Perenual/Trefle images with explicit license.
- If license unknown, fallback to Unsplash/Pexels with attribution stored in `plant_media.caption`.
- Admin UI displays source and attribution.

**Seed run modes:**

- `--dry-run` prints mapping and validation errors.
- `--commit` performs uploads and DB upserts.
- `--resume` continues after failures.

**Two sentences from the seeding guidance:**

> “Start with Perenual/Trefle to fetch structured JSON. Script the import (Node.js script in `packages/db/seed/` using your Zod schemas for validation).”

---

### 7. Workers: retry, DLQ, admin feedback, and observability (expanded)

**Workers covered:** `WK_Reminder`, `WK_Import`

**Common worker patterns:**

- Use BullMQ with Redis.
- Each job has `attempts`, `backoff` (exponential), and `removeOnComplete` policy.
- **Dead-letter queue (DLQ):** failed jobs after `maxAttempts` are moved to `dlq` queue and an admin notification is created (changelog + admin UI job list).
- **Idempotency:** jobs are idempotent (use plant slug or job id to dedupe).
- **Monitoring:** expose `/admin/jobs` endpoint showing job status, failures, and DLQ items.

**WK_Reminder specifics:**

- **Batching:** send up to 100 notifications per batch (Expo limit).
- **Retry policy:** if Expo returns transient error, retry job up to 5 attempts with exponential backoff; if permanent error (invalid token), mark token for deletion and notify user via email/admin.
- **Delivery logging:** store per-device delivery status in `notifications_log` collection.
- **Failure handling:** if a batch fails repeatedly, move to DLQ and create an admin ticket with sample payload and error.

**WK_Import specifics:**

- **Per-row validation:** each CSV row validated with Zod; invalid rows are recorded with error messages and row index.
- **Atomicity:** import job writes successful rows and returns a summary: `{ inserted: n, updated: m, errors: [{row, error}] }`.
- **Admin feedback:** admin UI polls job status and displays per-row errors with “edit and retry” flow.
- **Large imports:** chunk rows into sub-jobs to avoid timeouts; each chunk has its own retry/DLQ.

**Observability:**

- Workers emit metrics to Prometheus or CloudWatch: job rate, failure rate, DLQ size.
- Sentry captures worker exceptions with tags `worker: WK_Import` or `worker: WK_Reminder`.

---

### 8. Push notifications: payload schema and deep-linking contract (new)

**Goal:** deterministic deep-linking and reliable reminder behavior.

**Notification payload (JSON):**

```json
{
  "to": "<expoPushToken>",
  "title": "Care reminder: Albahaca",
  "body": "Time to water your Albahaca — light watering this week.",
  "data": {
    "type": "reminder",
    "plantSlug": "albahaca",
    "collectionId": "64a1f2...",
    "reminderId": "rem-20260619-001"
  }
}
```

**Deep-linking contract:**

- On tap, the app resolves `plantitas://plants/{plantSlug}`.
- If `plantSlug` not found locally, app attempts network fetch; if still missing, show friendly fallback: “Plant not found — it may have been removed.”
- NotificationService logs `notificationId`, `sentAt`, `deliveredAt` (if available), and `tapAt` (when user taps).

**Server-side `NotificationService.sendBatch` behavior:**

- Accepts array of payloads, groups by Expo host, sends in batches of 100.
- On Expo response with invalid tokens, mark tokens for deletion and create a user-level notification to re-register.
- Return per-payload status to caller for logging.

---

### 9. OAuth design and account linking (new)

**Web (Next.js):**

- Use NextAuth Google provider.
- On first OAuth sign-in:
    - If email matches existing user, prompt admin/user to link accounts (UI flow: “Link Google account to existing Plantitas account?”).
    - If no match, create new user with `role: user`.
- Admin can view linked providers in `/admin/users/:id`.

**Native (Expo):**

- Use `expo-auth-session` for Google sign-in.
- Flow:
    1. Native obtains Google ID token.
    2. POST `/auth/oauth/google` to Express API with token.
    3. API verifies token with Google, then issues access + refresh tokens (same as credential flow).
- **Account linking:** if user is logged in and calls OAuth, API links provider to existing account (store `providers: [{ provider: 'google', id: '...' }]`).

**Security & UX rules:**

- Allow unlinking only if user has at least one auth method (prevent lockout).
- Store provider metadata in `users.profile.providers`.
- Admin can force link/unlink via admin UI.

---

### 10. ISR fallback strategy for new plants (decision + implementation)

**Problem:** new plants added after build must be discoverable.

**Decision:** use `fallback: 'blocking'` for `/plants/[slug]` pages and rely on `revalidate` for updates.

**Implementation:**

- `generateStaticParams` pre-renders known slugs at build time.
- Next.js page `getStaticProps` uses `fallback: 'blocking'` so that when a new slug is requested:
    - Next.js will server-render the page on first request, cache it, and then serve it statically thereafter.
- Admin-created plants:
    - After `PlantService.create`, call `revalidate` endpoint for the new slug to ensure immediate availability.
- Admin UI shows `revalidate` result and any errors.

**Why:** `blocking` avoids 404s for new content and keeps ISR semantics for updates.

---

### 11. UI primitives added (Pagination, Toast, Featured flag, Theme/dark mode)

**New components in `packages/ui`:**

- **`Pagination`** — accessible, keyboard-friendly, supports server-side pagination (page, pageSize) and cursor mode.
- **`Toast` / `Snackbar`** — used for optimistic update confirmations and rollback messages; supports success/error/info variants.
- **`FeaturedBadge`** — visual indicator for `plant.featured === true`.
- **`ThemeProvider`** — Tamagui tokens include light/dark themes; `packages/ui/tamagui.config.ts` exposes `themes` and `useTheme()` hook.

**Data model change:** add `featured: Boolean` to `plants` collection (default `false`) and index `featured` for quick home queries.

**Home feed:** `GET /plants?featured=true&limit=24` returns featured plants for the discovery grid.

---

### 12. Local development orchestration and `.env.example` (new)

**Infra:** `infra/docker-compose.yml` (dev)

- Services: `mongo:6`, `redis:7`, `mailhog`, `localstack` (optional).
- `scripts/dev-setup.sh` automates seeding a small dataset and creating an admin user.

**`.env.example` (excerpt):**

```
# API
MONGO_URI=mongodb://localhost:27017/plantitas_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=changeme
REFRESH_TOKEN_SECRET=changeme2
WEB_REVALIDATE_URL=http://localhost:3000/api/revalidate
WEB_REVALIDATE_SECRET=changeme3
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Next.js
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_ENV=development

# Expo
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_ENV=development

# Perenual/Trefle
PERENUAL_API_KEY=
TREFLE_API_KEY=
```

**Developer onboarding steps (short):**

1. `git clone && pnpm install`
2. `cp .env.example .env` and fill secrets
3. `docker compose up -d` (infra)
4. `pnpm --filter api dev` ; `pnpm --filter web dev` ; `pnpm --filter native start`
5. `pnpm --filter db seed -- --commit` to seed initial plants (or `--dry-run`)

---

### 13. DB migration strategy and backfill plan (new)

**Tooling options:** `migrate-mongo` or `mongock` (choose one). We recommend `migrate-mongo` for simplicity.

**Pattern:**

- `packages/db/migrations/` contains timestamped migration scripts: `20260619-add-featured-flag.js`.
- Each migration is idempotent and logs progress.
- Backfill tasks are separate scripts (e.g., `backfill/compute-image-dimensions.ts`) that can be run with `--dry-run` and `--commit`.

**Example migration (add `featured`):**

```js
module.exports = {
  async up(db) {
    await db.collection('plants').updateMany({ featured: { $exists: false } }, { $set: { featured: false } });
    await db.collection('plants').createIndex({ featured: 1 });
  },
  async down(db) {
    await db.collection('plants').updateMany({}, { $unset: { featured: "" } });
  }
}
```

**Release process:**

1. Add migration to repo.
2. CI runs migrations against staging DB.
3. Run backfill in a controlled window (low traffic).
4. Monitor changelog and Sentry for anomalies.

---

### 14. Testing, CI, and rollout notes (updated)

**CI gates (unchanged):** lint, type-check, unit tests, Storybook build.

**New CI checks:**

- `infra/docker-compose.yml` smoke test in CI (optional) to ensure local infra scripts run.
- Migration lint: ensure new migrations are present for schema changes.
- Seed smoke: run `seed --dry-run` in CI to detect mapping errors.

**Rollout:**

- Feature flags for `featured` and `seeded` content.
- Canary release for API workers: deploy to staging EB environment, run `WK_Import` job with small CSV, verify DLQ behavior.

---

### 15. Appendix: short checklists for implementers

#### Before writing admin mutation code (web)

- [ ] Use `packages/clients/webApiClient.ts` for all API calls.
- [ ] Ensure `X-CSRF-Token` header is included when required.
- [ ] After successful plant create/update/delete, call `PlantService.revalidateISR` (server-side) which posts to Next.js revalidate endpoint.

#### Before running seed

- [ ] Obtain Perenual/Trefle API keys and add to `.env`.
- [ ] Confirm Cloudinary credentials and `CLOUDINARY_URL`.
- [ ] Run `pnpm --filter db seed -- --dry-run` and fix mapping errors.
- [ ] Run `pnpm --filter db seed -- --commit`.

#### Worker deployment checklist

- [ ] Configure Redis (ElastiCache) and EB environment variables.
- [ ] Configure Sentry DSN for workers.
- [ ] Ensure DLQ monitoring and admin UI integration.

---

## Closing notes

This integrated document preserves the original architecture decisions (monorepo, Next.js ISR, Expo Router, Tamagui, BullMQ workers) and fills the critical implementation gaps that would block a first working end‑to‑end flow. The three highest-priority items to implement first are:

1. **Web API client** (`packages/clients/webApiClient.ts`) so admin mutations work.
2. **Next.js revalidation endpoint** + `PlantService.revalidateISR` contract so ISR updates succeed.
3. **Seed pipeline** with mapping and Cloudinary image handling so the initial catalog is populated reliably.

