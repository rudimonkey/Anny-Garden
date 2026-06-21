# Anny's Plantitas — Architecture Source of Truth v1.0

**Project:** Anny's Plantitas  
**Platforms:** Web (Next.js), Mobile (iOS & Android via Expo), API (Node.js + Express)  
**Document type:** Canonical Engineering & Product Reference  
**Status:** Active — supersedes all prior versioned and archived documents  
**Last updated:** 2026-06-20

> This document consolidates the v0.2 and v0.3 architecture archives, the v0.3.1 gap-resolution addendum, the golden schema specimen, and the phased development plan into a single source of truth. All prior `.md` files are archived. Engineering, QA, and product should reference only this document.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture Design](#2-system-architecture-design)
   - 2.1 Monorepo Layout
   - 2.2 Architecture Diagram
   - 2.3 API Layer
   - 2.4 Data Layer — MongoDB Schema & Collections
   - 2.5 Background Workers
   - 2.6 External & Infrastructure Services
   - 2.7 Auth & Access Control
   - 2.8 Key Data Flows
   - 2.9 Local Development Orchestration
   - 2.10 DB Migration Strategy
3. [Front-End Architecture Design](#3-front-end-architecture-design)
   - 3.1 Web App — Next.js
   - 3.2 Native App — Expo Router
   - 3.3 Shared Design System — Tamagui
   - 3.4 State Management
   - 3.5 Network Layer
   - 3.6 Offline Strategy
   - 3.7 i18n
   - 3.8 Error Handling & Boundaries
   - 3.9 Component Inventory
   - 3.10 Testing Strategy
   - 3.11 CI/CD & Deployment
4. [Functional & Non-Functional Requirements](#4-functional--non-functional-requirements)
   - 4.1 Functional Requirements
   - 4.2 Non-Functional Requirements
   - 4.3 Acceptance Criteria Summary
5. [Phased Development Plan](#5-phased-development-plan)
6. [Resolved Gaps Log](#6-resolved-gaps-log)
7. [Open Items](#7-open-items)

---

## 1. Project Overview

**Mission:** Deliver a bilingual (Spanish-first, English-supported), visually rich plant catalog and personal plant management app for users in Costa Rica and the broader Spanish-speaking world. The product combines an editorial-quality public plant reference with a personal plant shelf where authenticated users can track, care for, and receive reminders about their own plants.

**Core user journeys:**

- A guest discovers and reads about a plant via web search (SEO-optimized, pre-rendered pages).
- A mobile user browses by habitat, filters by use, and searches by name in Spanish.
- An authenticated user pins or adds plants to their collection and receives care reminders.
- An admin seeds, imports, manages, and publishes plant content with full audit logging.

**Initial catalog scope:** 200+ plants seeded manually as validated JSON before development begins. Schema specimen: `albahaca` (Sweet Basil) — see `Schema_Golden_Enhanced.json`.

**Primary language:** Spanish (`es`). Secondary: English (`en`). All plant data carries bilingual fields; UI strings are fully translated via `react-i18next`.

---

## 2. System Architecture Design

### 2.1 Monorepo Layout

```
plantitas-monorepo/
├── apps/
│   ├── native/          # Expo Router app (iOS & Android)
│   ├── web/             # Next.js (public catalog + admin panel)
│   └── api/             # Node.js + Express (REST API + worker runner)
├── packages/
│   ├── core/            # Shared business logic, Zustand slices, BL_* modules
│   ├── db/              # Mongoose models, seed scripts, migrations
│   ├── types/           # Zod schemas + TypeScript types (shared across all apps)
│   ├── ui/              # Tamagui shared primitives (PlantCard, Pagination, Toast…)
│   └── clients/         # HTTP clients: webApiClient.ts, nativeApiClient.ts
├── infra/
│   ├── docker-compose.yml   # Local MongoDB + Redis + MailHog
│   └── scripts/dev-setup.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-web.yml
│       ├── deploy-api.yml
│       └── eas-build.yml
└── turbo.json
```

**Key monorepo decisions:**

- **Zod everywhere.** `packages/types` defines all Zod schemas (plant, user, search filters, admin imports). Schema changes propagate instantly via TypeScript to all consumers: Next.js forms, Expo forms (`react-hook-form`), and Express `MW_Valid`.
- **Mongoose in `packages/db`.** Next.js Server Components query MongoDB directly for read-only public catalog pages (no Express hop). The mobile app always goes through the Express API.
- **Admin panel in `apps/web`.** Under `app/admin/*` behind a protected layout. No separate SPA or deployment.
- **UI sharing is pragmatic.** Next.js uses semantic HTML + Tailwind for its own pages. Shared Tamagui components live in `packages/ui` and are consumed by both native screens and the web admin panel where universal rendering applies.
- **`packages/clients`.** Contains `webApiClient.ts` (fetch wrapper with HttpOnly cookies + CSRF) and `nativeApiClient.ts` (Axios with `expo-secure-store` interceptors).

---

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  ACTORS                                                             │
│  👤 Guest User   🔐 Auth User   🛡️ Admin User                       │
└────────────┬──────────────┬──────────────┬──────────────────────────┘
             │              │              │
┌────────────▼──────────────▼──────────────▼──────────────────────────┐
│  WEB — Next.js (apps/web)                                           │
│  ┌──────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ Public Routes (ISR/SSR)  │  │ Admin Routes /admin/* (server)  │  │
│  │ / · /plants/[slug]       │  │ Plant CRUD · Media · Users      │  │
│  │ /categories/[slug]       │  │ Taxonomy · Bulk Import          │  │
│  │ /search                  │  │ Revalidation status             │  │
│  └──────────┬───────────────┘  └───────────────┬─────────────────┘  │
│             │ direct Mongoose (read)            │ webApiClient.ts    │
│             │                                  │ (writes → API)     │
│  ┌──────────▼───────────────┐  ┌───────────────▼─────────────────┐  │
│  │ NextAuth.js              │  │ POST /api/revalidate             │  │
│  │ (HttpOnly session cookie)│  │ (secret-gated ISR webhook)      │  │
│  └──────────────────────────┘  └─────────────────────────────────┘  │
└────────────────────────────────────────┬────────────────────────────┘
                                         │
┌────────────────────────────────────────▼────────────────────────────┐
│  NATIVE — Expo Router (apps/native)                                 │
│  Screens: Home · Browse · Search · Collection · Detail              │
│  Business logic: BL_Auth · BL_Pin · BL_Filter · BL_Offline …       │
│  State: Zustand (plantsSlice · userSlice · collectionSlice)         │
│  Network: Axios + JWT interceptor + React Query + MMKV offline      │
└────────────────────────────────────────┬────────────────────────────┘
                                         │ HTTPS REST /api/v1
┌────────────────────────────────────────▼────────────────────────────┐
│  API — Node.js + Express (apps/api)                                 │
│  Middleware: rate-limit · CORS · helmet · JWT verify · Zod valid    │
│  Routes: /auth · /plants · /categories · /users/:id/* · /admin      │
│  Services: AuthService · PlantService · UserService · MediaService  │
│            SearchService · NotificationService                      │
│  Workers (BullMQ): WK_Reminder (nightly) · WK_Import (on-demand)   │
└────────────────────────────────────────┬────────────────────────────┘
                                         │
┌────────────────────────────────────────▼────────────────────────────┐
│  DATA — MongoDB Atlas                                               │
│  plants · users · user_collections · categories · plant_media       │
│  changelog                                                          │
└─────────────────────────────────────────────────────────────────────┘
                                         │
┌─────────────────────────────────────────────────────────────────────┐
│  EXTERNAL / INFRA                                                   │
│  Cloudinary (CDN) · Expo Push · Google OAuth · Redis (BullMQ)       │
│  Sentry · PostHog · AWS Secrets Manager                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2.3 API Layer

#### Middleware pipeline (applied in order)

```
Request
  → Global Rate Limiter
  → CORS
  → Helmet
  → JWT Verify (MW_Auth)
  → Guest Access Filter (MW_Guest)
  → Per-user Rate Limiter on write endpoints (MW_RateUser)
  → Zod Validation (MW_Valid — schemas from packages/types)
  → Pino Logger
  → Router
```

#### Route handlers

| Route | Methods | Auth |
|---|---|---|
| `/auth/register` | POST | No |
| `/auth/login` | POST | No |
| `/auth/refresh` | POST | Refresh token |
| `/auth/logout` | POST | Yes |
| `/auth/oauth/google` | POST | No (issues JWT) |
| `/plants` | GET | Guest OK |
| `/plants/search` | GET | Guest OK |
| `/plants/:slug` | GET | Guest OK |
| `/categories` | GET | Guest OK |
| `/categories/:slug/plants` | GET | Guest OK |
| `/users/:id` | GET, PATCH | Auth |
| `/users/:id/pins` | GET, POST, DELETE | Auth |
| `/users/:id/collection` | GET, POST, DELETE | Auth |
| `/users/:id/notifications` | GET, PATCH, DELETE | Auth |
| `/admin/plants` | GET, POST, PATCH, DELETE | Admin |
| `/admin/categories` | GET, POST, PATCH, DELETE | Admin |
| `/admin/import` | POST | Admin |
| `/admin/media` | GET, DELETE | Admin |
| `/admin/users` | GET, PATCH | Admin |
| `/admin/jobs` | GET | Admin |

#### Service layer

| Service | Key operations |
|---|---|
| `AuthService` | `hashPassword`, `comparePassword`, `signJWT`, `verifyJWT`, `refreshJWT`, `verifyGoogleToken` |
| `PlantService` | `findAll` (paginated), `findBySlug`, `search`, `filterByFacets`, `create`, `update`, `delete`, `bulkUpsert`, `revalidateISR` |
| `UserService` | `getProfile`, `updateProfile`, `getPins`, `addPin`, `removePin`, `getCollection`, `addToCollection`, `removeFromCollection`, `setNotificationPrefs`, `deleteNotificationToken` |
| `MediaService` | `buildCDNUrl`, `uploadFromUrl` (Cloudinary), `saveMediaRecord` (with `width`+`height`), `deleteMediaRecord`, `setPrimary` |
| `SearchService` | `textSearch` ($text index), `tagMatch` (array $in), `fuzzyMatch` (regex on indexed `commonName`) |
| `NotificationService` | `registerToken`, `sendBatch` (Expo SDK, max 100/batch), `scheduleReminder`, `cancelReminder` |

#### Web API client (`packages/clients/webApiClient.ts`)

Used by `apps/web` admin mutations. Uses `fetch` with `credentials: 'include'`, adds `X-CSRF-Token` header, retries idempotent requests with exponential backoff. Exposes typed helpers: `get<T>`, `post<T>`, `patch<T>`, `del`.

```ts
// Usage in admin
import { webApi } from '@plantitas/clients'
await webApi.post('/admin/plants', plantPayload)
```

#### ISR revalidation webhook

**Endpoint:** `POST https://<web-host>/api/revalidate`  
**Auth:** `x-revalidate-secret: <REVALIDATE_SECRET>` (stored in Secrets Manager)  
**Body:** `{ slugs: string[] }`  
**Response:** `{ revalidated: string[], failed: string[] }`

`PlantService.revalidateISR` reads `WEB_REVALIDATE_URL` and `WEB_REVALIDATE_SECRET`, POSTs with the secret header, retries up to 3× on network errors, logs failures to changelog and Sentry.

---

### 2.4 Data Layer — MongoDB Schema & Collections

#### `plants` collection

```
_id                 ObjectId
slug                String  — unique index; used for ISR routing
commonName          String  — text-indexed
scientificName      String
botanicalFamily     String  — indexed
labelES             String  — Spanish display name
labelEN             String  — English display name
featured            Boolean — default false; indexed (home feed queries)
growthRate          String
growthHeight        String
growthWidth         String
bloomColor          String
bloomTime           String
bloomSeason         String  — enum: spring | summer | autumn | winter
waterNeeds          String  — enum: low | moderate | high
lightNeeds          String  — enum: low | indirect | direct
sunlightHoursMin    Number
sunlightHoursMax    Number
temperatureRange    String
humidityNeeds       String
relativeHumidityNeeds String
fertilizerNeeds     String
soilNeeds           String
nativeRegion        String
predominantCRRegions String
droughtTolerance    String
hardinessZone       String
localNames          String
culturalUses        String
culturalUsesES      String
toxicityPets        String
toxicityHumans      String
propagationMethods  String[]
economicImportance  String
localSeasonality    String
warnings            String[]
warningsES          String[]
careTips            String[]
careTipsES          String[]
facets              {
  habitat:          String[]   — e.g. ["exterior", "garden", "huerto"]
  growthHabit:      String[]   — e.g. ["bushy", "herbaceous", "annual"]
  use:              String[]   — e.g. ["culinary", "medicinal", "aromatic"]
  difficulty:       String[]   — e.g. ["beginner"]
  pollinator:       String[]   — e.g. ["bees", "butterflies"]
  companion:        Boolean
  maintenance:      String[]   — e.g. ["medium"]
}
images              { _id, url, width, height, caption, isPrimary,
                      attribution, uploadedAt, altText }[]
genus               String
cultivar            String | null
lifeCycle           String  — enum: annual | perennial | biennial
bloomStart          String
bloomEnd            String
phenologyRecords    { stage, startMonth, endMonth, crSpecific }[]
careTips            String[]
companionPlants     { slug, benefit, benefitES, notes, notesES }[]
companionInfo       { goodWith: String[], avoidWith: String[] }
pollinatorValue     { attracts, nectarRating, specificNotes, specificNotesES }
beneficialInsects   String[]
pestRepellent       String[]
harvestInfo         { firstHarvestDays, daysToMaturity, yieldPerPlant,
                      yieldPerPlantES, expectedYieldPerSqMeter,
                      frequency, frequencyES, edibleParts, ediblePartsES }
culinaryUses        { part, recipes, tips }[]
commonPests         { name, nameES, symptoms, symptomsES,
                      organicControls, organicControlsES }[]
diseaseResistance   String
soilPreferences     { phRange, preferredType, nutrientNotes, nutrientNotesES }
climateSuitability  { heatTolerance, frostSensitivity, drought,
                      rainfallPreference, windTolerance }  (+ ES variants)
carbonSequestration String
biodiversityScore   Number
invasivePotential   String
regionalAdaptations { region, adaptation, notes }[]
relatedPlants       { slug, benefit }[]
seedSources         { supplier, url }[]
organicCertification String
externalIds         { GBIF, POWO, IPNI, Wikidata, Trefle, Perenual, USDA, iNaturalist }
synonyms            String[]
etymology           String
tags                String[]
searchKeywords      String[]
metaDescription     String
difficultyLevel     String
maintenanceLevel    String
popularityScore     Number
published           Boolean
source              { api, lastSyncedAt, enrichmentLevel }
changeLog           { date, changes, updatedBy }[]
version             Number
createdAt           Date
updatedAt           Date
createdBy           ObjectId → users._id
updatedBy           ObjectId → users._id
```

#### `users` collection

```
_id                 ObjectId
username            String
email               String  — unique index
passwordHash        String
role                Enum [user, admin]  — guest = no token, not stored
profile             { displayName, avatarUrl, bio, location, locale,
                      providers: [{ provider, id }] }
notificationToken   String  — sparse index (Expo push token)
notificationEnabled Boolean — default false
createdAt           Date
```

#### `user_collections` collection

```
_id                 ObjectId
userId              ObjectId → users._id
plantId             ObjectId → plants._id
type                Enum [pinned, owned]
notes               String
reminderAt          Date  — sparse index (next reminder date)
reminderFreqDays    Number  — 0 = disabled
addedAt             Date
```

#### `categories` collection

```
_id                 ObjectId
slug                String  — unique
labelES             String
labelEN             String
parentSlug          String  — null for top-level
iconUrl             String
sortOrder           Number
```

#### `plant_media` collection

```
_id                 ObjectId
plantId             ObjectId → plants._id
url                 String  — CDN URL
width               Number  — px (prevents gallery layout shift)
height              Number  — px
caption             String
isPrimary           Boolean
attribution         String
uploadedAt          Date
altText             String
```

#### `changelog` collection

```
_id                 ObjectId
entityType          Enum [plant, category, user, media]
entityId            ObjectId
action              Enum [create, update, delete, bulkImport, revalidate]
changedBy           ObjectId → users._id
changedAt           Date
diff                Object  — before/after snapshot
```

#### Key indexes

| Collection | Index | Type | Purpose |
|---|---|---|---|
| plants | `{ commonName, "facets.*" }` | Text | Full-text search |
| plants | `{ "facets.habitat": 1, "facets.use": 1 }` | Compound | Faceted filtering |
| plants | `{ botanicalFamily: 1 }` | Single | Browse by family |
| plants | `{ slug: 1 }` | Unique | ISR path lookup |
| plants | `{ featured: 1 }` | Single | Home feed featured grid |
| user_collections | `{ userId: 1, type: 1 }` | Compound | Pin/owned lookups per user |
| user_collections | `{ reminderAt: 1 }` | Sparse | Nightly reminder job |
| users | `{ email: 1 }` | Unique | Auth lookup |
| users | `{ notificationToken: 1 }` | Sparse | Token dedup |

---

### 2.5 Background Workers

Both workers use BullMQ with Redis. All jobs are idempotent, have exponential backoff, and move to a dead-letter queue (DLQ) after `maxAttempts`. DLQ events create admin notifications visible at `/admin/jobs`.

#### WK_Reminder (nightly cron, ~07:00 local)

1. Query `user_collections` where `reminderAt <= now` and `reminderFreqDays > 0`.
2. Batch Expo push calls via `NotificationService.sendBatch` (max 100/batch).
3. On transient Expo error: retry up to 5× with exponential backoff.
4. On permanent error (invalid token): mark token for deletion, notify user via email.
5. Update `reminderAt = now + reminderFreqDays` for each sent record.
6. Log per-device delivery status to `notifications_log`.
7. On repeated failure → DLQ + admin ticket with sample payload.

**Push payload schema:**

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

Deep-link on tap: `plantitas://plants/{plantSlug}`. If slug not found locally, app attempts network fetch; on miss, shows "Plant not found — it may have been removed."

#### WK_Import (on-demand, triggered by `/admin/import`)

1. Parse CSV/JSON upload.
2. Validate each row with Zod `plantSchema` from `packages/types`.
3. Invalid rows recorded with error message and row index.
4. Chunk rows into sub-jobs for large imports (avoids timeouts).
5. `PlantService.bulkUpsert` — insert new, update existing by slug.
6. Write changelog entries for each changed plant.
7. Call `PlantService.revalidateISR` for all affected slugs.
8. Return summary: `{ inserted: n, updated: m, errors: [{row, error}] }`.
9. Admin UI polls job status and shows per-row errors with "edit and retry" flow.

---

### 2.6 External & Infrastructure Services

| Service | Role |
|---|---|
| Cloudinary | Plant photo storage, CDN delivery, URL signing. `MediaService.uploadFromUrl(url)` returns `{ url, width, height }`. |
| Expo Push Notifications | Care reminder delivery via `NotificationService.sendBatch`. |
| Google OAuth | Alternative auth. Web: NextAuth Google provider. Native: `expo-auth-session` → POST `/auth/oauth/google` → Express issues JWT. |
| Redis (ElastiCache) | BullMQ job queue for `WK_Reminder` and `WK_Import`. |
| AWS Secrets Manager | All secrets for the API (JWT, REVALIDATE_SECRET, Cloudinary, DB). |
| Sentry | Crash reporting for `apps/native` and `apps/web`. Workers tag captures with `worker: WK_*`. |
| PostHog | Event tracking; also used to measure offline session rate (trigger for full-catalog offline v2). |
| Perenual / Trefle | External plant APIs used by the seed pipeline. |

#### `.env.example` (canonical)

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

# External plant APIs
PERENUAL_API_KEY=
TREFLE_API_KEY=
```

---

### 2.7 Auth & Access Control

| Role | Capabilities |
|---|---|
| Guest (no token) | Browse, search, plant detail — read-only |
| User | All guest access + pin plants, manage collection, edit profile, set notification preferences |
| Admin | All user access + plant CRUD, bulk import, taxonomy management, media management, user role management |

`"guest"` is not stored in `users.role`. Guest = no JWT. `users.role` enum: `[user, admin]`.

**Native token flow:**

```
POST /auth/login → AuthService.verifyPassword
→ sign accessToken (15m) + refreshToken (7d)
→ client stores both in expo-secure-store (Keychain/Keystore)
→ Axios interceptor attaches Bearer token
→ 401 → refresh → new accessToken stored
→ sustained 401 on refresh → force logout, clear expo-secure-store
→ on login: BL_Notif registers Expo push token via POST /users/:id/notifications
```

**Web token flow:**

```
POST /auth/login (NextAuth credential provider)
→ Express AuthService issues JWT
→ NextAuth wraps in HttpOnly session cookie
→ Admin routes protected by Next.js middleware (reads session, checks role: admin)
→ Mutations use webApiClient.ts which includes X-CSRF-Token header
```

**OAuth (Google) — account linking rules:**

- Web: if email matches existing user, prompt to link ("Link Google account to existing Plantitas account?"). If no match, create new user with `role: user`.
- Native: if user is already logged in and calls OAuth, API links provider to existing account (`providers[]` array in `users.profile`).
- Allow unlinking only if at least one other auth method exists.

---

### 2.8 Key Data Flows

**Browse by Category (native)**
```
SC_Browse → BL_Filter → GET /plants?habitat=interior&use=medicinal&page=1
→ JWT attached (or omitted for guest) → PlantService.filterByFacets → Response
→ React Query cache → plantsSlice → SC_Browse re-renders
```

**Plant Detail (web — ISR)**
```
User hits /plants/albahaca
→ Next.js serves pre-rendered HTML (zero DB query for guest)
→ Admin edits plant → Express PlantService.revalidateISR('albahaca')
→ POST /api/revalidate with x-revalidate-secret header
→ Next.js regenerates /plants/albahaca in background
```

**New plant (ISR fallback)**
```
Admin creates new plant (no static page exists yet)
→ fallback: 'blocking' serves SSR on first request, caches it
→ PlantService.revalidateISR called immediately after create
→ Page available without 404
```

**Pin a Plant (native)**
```
SC_Detail → BL_Pin (optimistic UI update)
→ POST /users/:id/pins { plantId } → per-user rate limiter → UserService.addPin
→ BL_Offline snapshots plant document to MMKV
→ 201 OK → collectionSlice.pinnedIds updated
→ Failure → rollback optimistic update + discard MMKV snapshot
```

**Offline (native)**
```
Network unavailable
→ BL_Offline reads pinned plant documents from MMKV
→ SC_Collection renders with OfflineBadge
→ SC_Browse shows "connect to browse" state
→ On reconnect → React Query refetches → BL_Offline refreshes MMKV snapshots
```

---

### 2.9 Local Development Orchestration

**`infra/docker-compose.yml`** services: `mongo:6`, `redis:7`, `mailhog`.

**Developer onboarding:**

```bash
git clone && pnpm install
cp .env.example .env          # fill secrets
docker compose up -d          # infra
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter native start
pnpm --filter db seed -- --dry-run   # validate mapping
pnpm --filter db seed -- --commit    # seed initial plants
```

---

### 2.10 DB Migration Strategy

**Tooling:** `migrate-mongo` (in `packages/db/migrations/`). Timestamped scripts, idempotent.  
**Backfills:** separate scripts in `packages/db/backfill/` with `--dry-run` and `--commit` modes.

**Release process:**

1. Add migration script to repo.
2. CI runs migrations against staging DB.
3. Run backfill in a low-traffic window.
4. Monitor changelog and Sentry.

**Example — add `featured` flag:**

```js
module.exports = {
  async up(db) {
    await db.collection('plants').updateMany(
      { featured: { $exists: false } },
      { $set: { featured: false } }
    );
    await db.collection('plants').createIndex({ featured: 1 });
  },
  async down(db) {
    await db.collection('plants').updateMany({}, { $unset: { featured: '' } });
  }
}
```

---

## 3. Front-End Architecture Design

### 3.1 Web App — Next.js (`apps/web`)

#### Public routes

| Route | Strategy | Data source |
|---|---|---|
| `/` | SSR | `packages/db` direct Mongoose |
| `/plants/[slug]` | ISR — `generateStaticParams` + `fallback: 'blocking'` | `packages/db` |
| `/categories/[slug]` | ISR | `packages/db` |
| `/search` | SSR (query-driven) | `packages/db` |

All 200+ plant detail pages are pre-rendered at build via `generateStaticParams`. New slugs use `fallback: 'blocking'` (no 404 on first request). Admin edits trigger `PlantService.revalidateISR` → Next.js `POST /api/revalidate`.

#### Admin routes

| Route | Purpose |
|---|---|
| `/admin/plants` | Plant list, inline edit, bulk import trigger |
| `/admin/plants/new` | Create plant form (Zod + react-hook-form; triggers ISR on save) |
| `/admin/plants/[slug]/edit` | Pre-filled edit form; on save triggers revalidatePath |
| `/admin/categories` | Taxonomy: add/edit facets, labelES/labelEN, iconUrl, sortOrder |
| `/admin/media` | CDN browser; set primary image; delete media |
| `/admin/import` | CSV/JSON upload → enqueues WK_Import → polls status → per-row errors |
| `/admin/users` | User list, role toggle, soft delete |
| `/admin/jobs` | BullMQ job status, DLQ items, revalidation log |

Mutations use `webApiClient.ts`. Admin layout protected by Next.js middleware (reads NextAuth session, checks `role: admin`).

---

### 3.2 Native App — Expo Router (`apps/native`)

#### Route map

| File | Screen | Guard |
|---|---|---|
| `app/(tabs)/index.tsx` | SC_Home — Discovery Feed | None |
| `app/(tabs)/browse.tsx` | SC_Browse — Category Grid | None |
| `app/(tabs)/search.tsx` | SC_Search — Full-text + tag | None |
| `app/(tabs)/collection.tsx` | SC_Collection — Pinned + owned | Auth redirect |
| `app/plants/[slug].tsx` | SC_Detail — Full plant detail | None |
| `app/profile/index.tsx` | SC_Profile — Settings | Auth redirect |
| `app/profile/notifications.tsx` | SC_Notif — Reminder prefs | Auth redirect |
| `app/auth/login.tsx` | Login | Redirect if authed |
| `app/auth/register.tsx` | Register | Redirect if authed |
| `app/auth/guest.tsx` | Guest entry | None |

#### Root layout (`app/_layout.tsx`)

Single point of truth for:
- `TamaguiProvider` wrapping the full tree
- Auth guard (reads `userSlice.isGuest`; redirects protected routes to `/auth/login`)
- `BL_I18n.init()` via `expo-localization` on mount
- Expo push token registration on login (`BL_Notif.registerToken`)
- Sentry `wrap` for the root navigator

#### Deep links (auto-generated by Expo Router)

| URL | Resolves to |
|---|---|
| `plantitas://plants/albahaca` | `app/plants/[slug].tsx` with `slug="albahaca"` |
| `plantitas://browse` | `app/(tabs)/browse.tsx` |
| `plantitas://collection` | `app/(tabs)/collection.tsx` (auth-gated) |

Push notification taps route to `plantitas://plants/{plantSlug}` with no custom handler code.

#### Business Logic modules (`packages/core`)

| Module | Responsibility |
|---|---|
| `BL_Auth` | JWT check; sets `isGuest` flag when no token; guest → auth upgrade flow |
| `BL_Pin` | Add/remove pins; optimistic update with rollback on failure |
| `BL_Collection` | Add/remove owned plants; sync with API |
| `BL_Filter` | Multi-select facet query builder |
| `BL_Search` | Query builder for name, tag, habitat |
| `BL_Offline` | Snapshots pinned plants to MMKV on pin write; reads on no-network; last-write-wins merge on reconnect |
| `BL_Notif` | Registers Expo push token on login; manages per-plant reminder preferences |
| `BL_I18n` | Bootstraps locale from `expo-localization`; falls back to `"es"`; writes to `localeSlice` |

---

### 3.3 Shared Design System — Tamagui (`packages/ui`)

**Decision:** Tamagui over NativeWind. Design tokens defined once in `tamagui.config.ts`, consumed by both native and web admin components. Compiler flattens styles at build time (no runtime overhead on low-end Android). Storybook renders components in browser without a native runtime.

Tailwind is used only in `apps/web` Next.js public pages (where Tamagui is not needed).

#### Token system

```typescript
const tokens = createTokens({
  color: {
    leafGreen1:  '#f0f7ee',
    leafGreen9:  '#2d6a4f',
    leafGreen11: '#1b4332',
    soilBrown6:  '#a0522d',
    morningSky1: '#e8f4fd',
    alertRed9:   '#c0392b',
    guestGray5:  '#9e9e9e',
  },
  space:  { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 },
  size:   { 1: 18, 2: 36, 3: 44, 4: 56 },
  radius: { 1: 4, 2: 8, 3: 12, 4: 20, round: 9999 },
  zIndex: { 1: 100, 2: 200, 3: 300, 4: 400, overlay: 500 },
})
```

Includes `themes` with `light` and `dark` variants. `useTheme()` hook available to all consumers.

#### Shared component catalogue (`packages/ui/components/`)

| Component | Consumers | Description |
|---|---|---|
| `PlantCard` | Native list, web admin | Image, commonName, primary badge, offline indicator |
| `CategoryBadge` | Browse chips, plant detail | Color-coded facet chip |
| `SearchBar` | SC_Search, web search | Controlled input, 300ms debounce, clear button |
| `OfflineBadge` | SC_Collection | Shown when plant served from MMKV |
| `LoadingShimmer` | All list screens | Skeleton animation while React Query fetches |
| `ErrorBoundaryFallback` | All boundaries | Inline error with retry button |
| `Pagination` | Admin plant list, search results | Accessible, keyboard-friendly; supports page and cursor modes |
| `Toast` / `Snackbar` | Optimistic confirmations | Success / error / info variants |
| `FeaturedBadge` | Home feed, plant detail | Visual indicator for `plant.featured === true` |

Every component has a collocated `*.test.tsx` and `*.stories.tsx`.

---

### 3.4 State Management — Zustand (`packages/core`)

| Slice | Contents |
|---|---|
| `plantsSlice` | Catalog list, current page, active filters, selected plant |
| `userSlice` | Profile, JWT access token, refresh token, `isGuest`, `locale` |
| `collectionSlice` | Pinned plant IDs, owned plant IDs, local notes |
| `uiSlice` | Loading states, modal visibility, error messages |
| `localeSlice` | `current: "es" | "en"`, `detected: string` |

Primitives in `packages/ui` are stateless and receive all data via props. No direct Zustand reads in shared components — this keeps Storybook stories free of store mocks.

---

### 3.5 Network Layer

- **`expo-secure-store`** for all JWT storage (Keychain/Keystore — encrypted at rest).
- Axios instance: `baseURL = /api/v1`, interceptors for JWT attach and 401-triggered refresh.
- React Query: 60s stale time, background refetch on app focus.
- On offline: `@react-native-community/netinfo` triggers `BL_Offline`; pending mutations queued and replayed on reconnect.

**Error handling cascade:**

```
4xx (except 401) → no retry; error propagates to screen boundary
401              → Axios refresh interceptor; new token acquired; request retried once
401 on refresh   → force logout; clear expo-secure-store; redirect to /auth/login
5xx / network    → React Query retries 3× (500ms, 1s, 2s exponential)
Still failing    → error propagates to screen boundary; Sentry capture
```

---

### 3.6 Offline Strategy — Pinned Plants Only

```
On pin write  → BL_Offline snapshots plant document to MMKV
On app open   → if network: sync pinned IDs from API, update MMKV snapshots
               if no network: serve from MMKV, show OfflineBadge
On reconnect  → last-write-wins merge (server is source of truth)
               MMKV snapshots refreshed from API response
```

Full catalog offline is deferred to v2. Trigger for reconsideration: >30% of sessions show >1 browse page loaded while offline (measured via PostHog).

Images are excluded from MMKV; Expo Image's built-in disk cache handles offline image availability.

---

### 3.7 i18n

- `expo-localization` detects device locale on first launch; defaults to `"es"` if unsupported.
- `react-i18next` with JSON string maps in `packages/core/locales/es.json` and `en.json`.
- Plant data carries bilingual fields: `labelES`/`labelEN`, `careTipsES`, `warningsES`, etc. i18n module selects the correct field based on `localeSlice.current`.
- User locale preference stored on `users.profile.locale`, synced to `localeSlice` on login.

---

### 3.8 Error Handling & Boundaries

**Three boundary levels:**

| Level | Scope | Fallback |
|---|---|---|
| Root | Entire app tree | Full-screen "something went wrong" + Reload button |
| Screen | Each tab/page | Screen-level fallback; tabs bar remains interactive |
| Widget | Gallery, search bar, filter chips | Silent empty state; logged to Sentry |

All screen boundaries use the reusable `withScreenBoundary` HOC (wraps `Sentry.withErrorBoundary` with `ErrorBoundaryFallback`).

**Sentry tagging conventions:**

| Tag | Values |
|---|---|
| `platform` | `native-ios`, `native-android`, `web` |
| `user_role` | `guest`, `user`, `admin` |
| `screen` | Expo Router segment or Next.js route path |
| `network_status` | `online`, `offline` |

---

### 3.9 Component Inventory Summary

| Group | Count | Storybook | Unit tested |
|---|---|---|---|
| `packages/ui` shared primitives | 9 | ✓ (all) | ✓ (all) |
| `apps/native` screens (Expo Router) | 10 | — | Via Detox E2E |
| `apps/native` screen-local components | 8 | — | Selected |
| `apps/web` public catalog pages | 8 | — | Via Playwright |
| `apps/web` admin panel pages | 9 | — | Via Playwright |
| `apps/web` auth | 1 | — | Via Playwright |

Full annotated inventory (with props, responsibilities, tags, and coverage dots) lives in `Plantitas_Presentation_Components_Inventory.html` — open in a browser for the filterable table view.

---

### 3.10 Testing Strategy

```
┌──────────────────────────────────────────┐
│  E2E — Detox (mobile) / Playwright (web) │
├──────────────────────────────────────────┤
│  Storybook visual review (packages/ui)   │
├──────────────────────────────────────────┤
│  Unit / snapshot — Jest + RNTL           │
│  (packages/core, packages/ui, types)     │
└──────────────────────────────────────────┘
```

**Coverage thresholds (enforced in CI):**

| Layer | Threshold |
|---|---|
| `packages/core` business logic | ≥80% lines |
| `packages/ui` components | ≥70% lines |
| `packages/types` Zod schemas | ≥90% lines |

**Detox critical flows (mobile):**

| ID | Journey |
|---|---|
| E2E-M-01 | Guest browses by category; filter chip changes results |
| E2E-M-02 | Guest → auth upgrade on pin; pin replays after login |
| E2E-M-03 | Auth user pins offline; badge visible; syncs on reconnect |
| E2E-M-04 | Care reminder tap opens correct plant via deep link |
| E2E-M-05 | Search finds plant; navigate to detail; back nav works |

**Playwright critical flows (web):**

| ID | Journey |
|---|---|
| E2E-W-01 | ISR plant detail page loads pre-rendered HTML |
| E2E-W-02 | Search returns results; pagination works; URL shareable |
| E2E-W-03 | Admin creates plant; appears in catalog; ISR triggered |
| E2E-W-04 | Admin bulk imports CSV; job succeeds; plants visible |
| E2E-W-05 | Non-admin blocked from `/admin`; redirected to login |

---

### 3.11 CI/CD & Deployment

**Branching:** Trunk-based development. Short-lived feature branches (<2 days) → `main` via PR + CI green + 1 reviewer. Feature flags (PostHog) for incomplete merged features.

**CI pipeline (`ci.yml`) — runs on every PR:**

```
lint (ESLint + Prettier) → type-check (tsc --noEmit) → unit tests (Jest) → build dry-run
```

Turbo remote cache: unchanged packages are skipped.

**Web → Vercel:**

- `main` push → Vercel production deploy → Next.js build (200+ static plant pages) + Sentry source maps.
- PR push → Vercel preview (Playwright E2E runs against preview URL).

**Native → EAS Build + Submit:**

- `main` push → EAS Build production → iOS binary (TestFlight) + Android AAB (Play Console).
- PR push → EAS Build preview → Detox E2E against preview binary.
- JS-only changes → EAS Update (OTA) to `production` channel (same CI gates).

**API → AWS Elastic Beanstalk:**

- Dockerized Node.js; persistent processes for BullMQ workers and nightly cron.
- `main` push → Docker build → push to ECR → EB rolling deploy → `/health` check.
- Secrets in AWS Secrets Manager (injected at container startup).

**Environment matrix:**

| Environment | Native | Web | API |
|---|---|---|---|
| `development` | Expo Go / dev client | `next dev` | `nodemon` |
| `preview` | EAS Build preview | Vercel preview | EB staging |
| `production` | EAS Build production → stores | Vercel production | EB production |

---

## 4. Functional & Non-Functional Requirements

### 4.1 Functional Requirements

#### FR-01 Plant Catalog

| ID | Requirement |
|---|---|
| FR-01.1 | The system shall serve a public catalog of 200+ plants, each with a unique slug-based URL. |
| FR-01.2 | Plant detail pages shall be pre-rendered (ISR) and available without JavaScript for SEO and accessibility. |
| FR-01.3 | New plants added after build shall be available without a full rebuild, using `fallback: 'blocking'` and on-demand revalidation. |
| FR-01.4 | Each plant shall support bilingual content: Spanish (primary) and English (secondary) across name, care tips, warnings, and all descriptive fields. |
| FR-01.5 | Plant data shall conform to the golden schema specimen (`Schema_Golden_Enhanced.json`), including facets, care data, companion plants, pest/disease info, harvest info, and regional adaptations for Costa Rica. |
| FR-01.6 | The catalog shall be browsable by facet category (habitat, use, difficulty, growth habit) with multi-select filtering. |
| FR-01.7 | Full-text and tag-based search shall return ranked results for Spanish and English queries. |
| FR-01.8 | Featured plants (`plant.featured === true`) shall be surfaced on the home feed. The admin shall control which plants are featured. |

#### FR-02 Plant Shelf & Collection

| ID | Requirement |
|---|---|
| FR-02.1 | Authenticated users shall be able to pin plants (read-interest tracking). |
| FR-02.2 | Authenticated users shall be able to add plants to their owned collection and attach personal notes. |
| FR-02.3 | Pinned plants shall be cached locally on mobile (MMKV snapshot) and remain viewable offline with an OfflineBadge indicator. |
| FR-02.4 | Optimistic UI updates shall apply immediately on pin/unpin and roll back on API failure. |
| FR-02.5 | Local pin state shall sync to server on reconnect (last-write-wins; server is source of truth). |

#### FR-03 Care Reminders

| ID | Requirement |
|---|---|
| FR-03.1 | Authenticated users shall be able to set per-plant reminder frequency (in days). |
| FR-03.2 | The system shall send push notifications via Expo on the scheduled `reminderAt` date. |
| FR-03.3 | Notification payload shall include plant slug; tapping the notification shall deep-link to the plant detail screen. |
| FR-03.4 | Invalid or expired push tokens shall be removed automatically and the user notified to re-register. |
| FR-03.5 | Failed reminder batches shall enter the DLQ and surface an admin alert. |

#### FR-04 Search

| ID | Requirement |
|---|---|
| FR-04.1 | Search shall support full-text matching on `commonName`, `labelES`, `labelEN`, `scientificName`, and `searchKeywords`. |
| FR-04.2 | Search results shall be ranked and paginated. |
| FR-04.3 | Web search shall be operable via a `GET` form with query params in the URL (shareable, no-JS compatible). |
| FR-04.4 | The search service abstraction shall allow upgrading to Algolia/Typesense without changes to route handlers when the catalog exceeds 1,000 plants. |

#### FR-05 Authentication & Authorization

| ID | Requirement |
|---|---|
| FR-05.1 | Users shall be able to register and log in with email + password. |
| FR-05.2 | Users shall be able to authenticate with Google OAuth (web via NextAuth; mobile via `expo-auth-session`). |
| FR-05.3 | Guest users (no token) shall have read-only access to the catalog. Attempting a protected action shall redirect to login. |
| FR-05.4 | After logging in from a guest flow, the pending action (e.g., pin) shall replay automatically. |
| FR-05.5 | Admin users shall have access to all CRUD, import, media management, and taxonomy management features. |
| FR-05.6 | JWT access tokens shall expire in 15 minutes; refresh tokens in 7 days. Both stored in `expo-secure-store` on mobile. |
| FR-05.7 | Web admin sessions shall use HttpOnly cookies (NextAuth). No JWT in `localStorage` on web. |

#### FR-06 Admin Panel

| ID | Requirement |
|---|---|
| FR-06.1 | Admin shall be able to create, edit, and delete individual plants via a Zod-validated form. |
| FR-06.2 | Admin shall be able to bulk-import plants from CSV or JSON; per-row errors shall be surfaced with row index and message. |
| FR-06.3 | Admin shall be able to trigger ISR revalidation for individual slugs; success or failure shall be visible in the UI. |
| FR-06.4 | Admin shall be able to manage plant media (set primary, delete, view CDN URLs). |
| FR-06.5 | Admin shall be able to manage the category taxonomy (add/edit facets, labels, icon URLs, sort order). |
| FR-06.6 | Admin shall be able to view and manage users (role toggle, soft delete). |
| FR-06.7 | Admin shall be able to view BullMQ job status, DLQ items, and per-row import errors. |
| FR-06.8 | All admin plant mutations shall write an entry to the `changelog` collection. |

#### FR-07 Seed Pipeline

| ID | Requirement |
|---|---|
| FR-07.1 | The seed pipeline shall support `--dry-run` (validate and log errors only) and `--commit` (upload and upsert) modes. |
| FR-07.2 | The seed pipeline shall map Perenual/Trefle API responses to the golden schema via a deterministic `mapToSchema()` function. |
| FR-07.3 | Each plant's primary image shall be uploaded to Cloudinary; `width` and `height` shall be stored. |
| FR-07.4 | Validation errors shall be written to `seed_errors.log` and be visible in the admin seed review queue. |
| FR-07.5 | The pipeline shall support `--resume` mode to continue after partial failures. |

---

### 4.2 Non-Functional Requirements

#### NFR-01 Performance

| ID | Requirement |
|---|---|
| NFR-01.1 | ISR plant detail pages shall achieve Largest Contentful Paint (LCP) < 2.5s on a 4G connection for guest users (pre-rendered, no client waterfall). |
| NFR-01.2 | Plant list images shall include stored `width` and `height` to eliminate Cumulative Layout Shift (CLS = 0). |
| NFR-01.3 | Native app plant list shall render at ≥60fps during scroll on a mid-range Android device. |
| NFR-01.4 | React Query stale time of 60s shall prevent redundant API calls on screen revisit. |
| NFR-01.5 | Tamagui's build-time style compilation shall eliminate runtime style calculation on mobile. |

#### NFR-02 Security

| ID | Requirement |
|---|---|
| NFR-02.1 | All JWTs on mobile shall be stored in `expo-secure-store` (Keychain/Keystore). No `AsyncStorage` for tokens. |
| NFR-02.2 | Web admin sessions shall use HttpOnly cookies; no token accessible from JavaScript. |
| NFR-02.3 | The ISR revalidation endpoint shall be protected by a shared secret (`x-revalidate-secret` header). |
| NFR-02.4 | All secrets (JWT, DB URI, Cloudinary, revalidation secret) shall be stored in AWS Secrets Manager. No secrets committed to the repository. |
| NFR-02.5 | Per-user rate limiting shall apply to all write endpoints for pins and collections (sliding window keyed on `userId`). |
| NFR-02.6 | All API requests shall pass through CORS, Helmet, and global rate limiting middleware. |
| NFR-02.7 | Google OAuth account linking shall require explicit user confirmation before linking to an existing account. |
| NFR-02.8 | A user shall not be allowed to unlink an OAuth provider if it is their only auth method. |

#### NFR-03 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-03.1 | BullMQ workers shall retry failed jobs with exponential backoff before moving to the DLQ. |
| NFR-03.2 | The system shall have three React error boundary levels (root, screen, widget); no user action shall produce an unhandled white screen. |
| NFR-03.3 | Worker exceptions shall be captured by Sentry with worker identity tags. |
| NFR-03.4 | The API shall expose a `GET /health` endpoint returning 200 for deployment readiness checks. |
| NFR-03.5 | DB migrations shall be idempotent and reversible (`up` and `down` functions). |

#### NFR-04 Scalability

| ID | Requirement |
|---|---|
| NFR-04.1 | The `SearchService` abstraction shall allow swapping MongoDB `$text` for Algolia/Typesense without changing route handlers when the catalog exceeds 1,000 plants. |
| NFR-04.2 | Large CSV imports shall be chunked into sub-jobs to avoid worker timeouts. |
| NFR-04.3 | AWS EB shall run a minimum of 1 instance with auto-scaling to 3 under load. |
| NFR-04.4 | Expo push batches shall not exceed 100 notifications per call (Expo SDK limit). |

#### NFR-05 Accessibility & Internationalization

| ID | Requirement |
|---|---|
| NFR-05.1 | All shared UI components shall be keyboard-navigable and meet WCAG 2.1 AA color contrast requirements. |
| NFR-05.2 | The `Pagination` component shall be accessible (ARIA roles, keyboard support). |
| NFR-05.3 | All static UI strings shall be covered by Spanish and English translations in `packages/core/locales/`. |
| NFR-05.4 | Plant content shall default to Spanish display fields (`labelES`, `careTipsES`, etc.) and fall back to English when the device locale is not Spanish. |
| NFR-05.5 | The web app shall be operable without JavaScript for read-only public catalog pages (progressive enhancement). |

#### NFR-06 Maintainability

| ID | Requirement |
|---|---|
| NFR-06.1 | All `packages/core` business logic shall have ≥80% line coverage. |
| NFR-06.2 | All `packages/ui` shared components shall have a Storybook story and a collocated unit test. |
| NFR-06.3 | All `packages/types` Zod schemas shall have ≥90% line coverage. |
| NFR-06.4 | Feature branches shall be merged within 2 days. `main` shall always be production-deployable. |
| NFR-06.5 | The seed pipeline shall run in `--dry-run` mode in CI on every PR to catch mapping regressions. |
| NFR-06.6 | All admin mutations shall produce a `changelog` entry with the changed fields diff. |

#### NFR-07 Developer Experience

| ID | Requirement |
|---|---|
| NFR-07.1 | `docker compose up -d` + `pnpm dev` shall boot all services locally within 2 minutes of cloning. |
| NFR-07.2 | A populated `.env.example` shall exist at repo root; no undocumented environment variable shall be required. |
| NFR-07.3 | Turbo remote cache shall ensure that unchanged packages are not re-tested on CI. |

---

### 4.3 Acceptance Criteria Summary

| Phase | Checkpoint | Criteria |
|---|---|---|
| A — Setup | Monorepo boots | `pnpm -w test` passes; Storybook renders PlantCard |
| B — API & DB | Local dev works | `docker compose up` + `pnpm dev` boots all apps; `webApiClient.post('/admin/ping')` returns 200 |
| C — Seed (10 plants) | Pages render | `/plants/[slug]` renders all 10 slugs on web and native; images show correct aspect ratio; zero unhandled seed errors |
| D — Admin + ISR | Revalidation works | Admin plant create → plant detail page available immediately (no 404); admin UI shows revalidation success |
| E — Native | Offline works | Pinning offline persists across app restarts; sync on reconnect; OfflineBadge shown |
| F — Workers | Notifications work | CSV import returns per-row error summary; reminder notification sent to staging Expo token |
| G — Full seed | Production ready | All 200+ plants seeded; all critical E2E tests pass; no critical Sentry errors in staging |

---

## 5. Phased Development Plan

### Phase A — Project Setup & Shared Foundations

**Goal:** Monorepo, shared types, Zod schemas, Tamagui tokens, CI skeleton.

Key tasks:
- Initialize Turborepo structure and all packages.
- Implement `packages/types` Zod schemas for plants, users, media.
- Create `packages/ui` Tamagui config and PlantCard primitive with story.
- Add CI skeleton with lint, type-check, unit tests.

Deliverables: Passing CI on a trivial PR. Storybook renders PlantCard.

### Phase B — API & DB Foundations

**Goal:** Express API, Mongoose models, DB infra, local dev orchestration.

Key tasks:
- Implement Mongoose models in `packages/db` with all indexes.
- `infra/docker-compose.yml` for local MongoDB and Redis.
- `packages/clients/webApiClient.ts` and `nativeApiClient.ts`.
- `PlantService` skeleton with `bulkUpsert` and `revalidateISR` stub.

Deliverables: `docker compose up` + `pnpm dev` boots all apps. `webApiClient.post('/admin/ping')` returns 200.

### Phase C — Seed Pipeline (10 Plants) & Media Flow

**Goal:** 10 validated plants in MongoDB, images in Cloudinary, pages rendering.

Key tasks:
- Curate 10-plant CSV (houseplants, edible, medicinal, succulent).
- Implement `seed-plants.ts` with `--dry-run`/`--commit`/`--resume`.
- Implement `mapToSchema()` and `MediaService.uploadFromUrl()`.
- Run dry-run, fix mapping, commit seed.

Deliverables: 10 plant documents with Cloudinary images. All `/plants/[slug]` pages render on web and native. Zero unhandled seed validation errors.

### Phase D — Web Admin, ISR Revalidation & Client Integration

**Goal:** Admin CRUD calls Express API and triggers Next.js revalidation.

Key tasks:
- Implement `POST /api/revalidate` endpoint.
- Implement `PlantService.revalidateISR`.
- Admin UI pages using `webApiClient`.

Deliverables: Creating a plant in admin → plant detail immediately available. Admin UI shows revalidation result.

### Phase E — Native App Integration & Offline

**Goal:** Native app reads seeded plants, supports pinning and offline.

Key tasks:
- Expo Router routes and Tamagui provider in `_layout.tsx`.
- `plantsSlice` and `BL_Offline` with MMKV snapshot.
- Axios interceptors with `expo-secure-store`.
- PlantPhotoGallery with Expo Image and stored dimensions.

Deliverables: Browse, search, detail screens. Pinning offline persists; syncs on reconnect.

### Phase F — Workers, Notifications & Admin Job UI

**Goal:** BullMQ workers, import job, basic reminder notifications.

Key tasks:
- `WK_Import` and `WK_Reminder` with retry/backoff and DLQ hooks.
- Admin job status endpoint and UI.
- `NotificationService.sendBatch` with Expo payload schema.

Deliverables: CSV import returns job summary with per-row errors. Reminder job sends test notification to staging Expo token.

### Phase G — Validation, QA & Full 200+ Seed

**Goal:** Full QA, iterate, then run complete seed.

Key tasks:
- Full QA checklist: accessibility, i18n, error boundaries, offline.
- Iterate on mapping rules and image attributions.
- Run full seed for 200+ plants with chunked imports and monitoring.

Deliverables: Production-ready catalog. All critical E2E tests pass. No critical Sentry errors in staging. Runbook for seed, revalidation, and DLQ handling.

---

## 6. Resolved Gaps Log

| # | Gap | Resolution |
|---|---|---|
| 1 | Missing web API client | `packages/clients/webApiClient.ts` with cookie-aware fetch and CSRF |
| 2 | Underspecified ISR revalidation | `POST /api/revalidate` endpoint + `PlantService.revalidateISR` contract |
| 3 | Incomplete seed pipeline | Full `seed-plants.ts` with Perenual/Trefle mapping, Cloudinary upload, `mapToSchema()` spec |
| 4 | Missing worker error handling | Retry policy, DLQ, admin job status endpoint, per-row import errors |
| 5 | Undesigned Google OAuth | NextAuth Google (web) + `expo-auth-session` (native) + account linking rules |
| 6 | Push payload schema absent | JSON schema + deep-link contract + delivery logging spec |
| 7 | ISR fallback for new plants | `fallback: 'blocking'` + immediate `revalidateISR` call after `PlantService.create` |
| 8 | Missing Pagination, Toast components | Both added to `packages/ui` with accessibility requirements |
| 9 | Tamagui dark mode unspecified | `themes` in `tamagui.config.ts`; `ThemeProvider` + `useTheme()` hook |
| 10 | No local dev orchestration | `infra/docker-compose.yml` + `scripts/dev-setup.sh` |
| 11 | No `.env.example` | Canonical `.env.example` documented in §2.6 |
| 12 | No migration strategy | `migrate-mongo` in `packages/db/migrations/`; idempotent up/down scripts |

---

## 7. Open Items

| # | Item | Priority | Notes |
|---|---|---|---|
| 1 | User-submitted photo flow (upload → moderation → publish) | Low | Deferred to v2; out of scope for initial validation |
| 2 | Chromatic visual regression (Storybook snapshot diffing in CI) | Low | Nice-to-have v2; Storybook ready to connect |
| 3 | EAS Workflows replacing GitHub Actions YAML for native builds | Low | Evaluate when Expo Workflows reaches stable GA |
| 4 | Detox on real devices (Sauce Labs / BrowserStack) | Low | Simulator-only sufficient for v1 |
| 5 | Full-catalog offline (MMKV caching beyond pinned plants) | Medium | Trigger: >30% of sessions load >1 browse page offline (PostHog) |
| 6 | Search upgrade to Algolia / Typesense | Medium | Trigger: catalog >1,000 plants or search becomes primary funnel |
| 7 | `WebPlantCard` vs `PlantCard` usage governance | Medium | Define which components web-only pages use vs shared Tamagui ones; document in component inventory |

---

*Anny's Plantitas — Architecture Source of Truth v1.0*  
*Supersedes: plantitas_architecture_doc_v0.2-archived.md, plantitas_fe_architecture_v0_3-archived.md, Anny's Plantitas — Unified Architecture & Front-End System (v0.3 → v0.3.1)*
