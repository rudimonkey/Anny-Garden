### Full Development Plan for Anny’s Plantitas

This plan translates the unified architecture into an actionable, implementation‑level roadmap. It focuses first on **presentational validation** with a **10‑plant seed** for fast feedback, then scales to the full 200+ seed once the UI and flows are validated. Each phase lists **goals**, **deliverables**, **owners**, **acceptance criteria**, and **checkpoints**. Use this as the canonical execution plan for engineering, QA, and product.

---

### 1. High Level Goals and Scope

**Primary goals**

- Validate the presentational layer (web + native) with real data and flows.
- Deliver a secure admin mutation path, ISR revalidation, and a working seed pipeline for 10 plants.
- Implement core infra for workers, notifications, and local developer experience.
- Establish CI gates, testing, and migration practices.

**Scope for initial validation**

- Seed **10 representative plants** (houseplants, edible, medicinal, and a succulent).
- Implement core UI primitives: PlantCard, PlantDetail, Browse, Search, Pagination, Toast.
- Implement `webApiClient`, Next.js revalidate endpoint, `PlantService.revalidateISR`.
- Implement `WK_Import` worker skeleton and `WK_Reminder` basic flow.
- Local dev infra: docker compose for MongoDB + Redis, `.env.example`, seed dry-run.

**Out of scope for initial validation**

- Full 200 plant seed (deferred until validation).
- Full production hardening of workers and DLQ policies (skeletons only).
- Advanced analytics dashboards and PostHog instrumentation beyond basic events.

---

### 2. Phase Plan and Tasks

#### Phase A Project Setup and Shared Foundations

**Goal**: Monorepo, shared types, Zod schemas, Tamagui tokens, CI skeleton.  
**Key tasks**

- Initialize Turborepo structure and packages.
- Implement `packages/types` Zod schemas for plants, users, media.
- Create `packages/ui` Tamagui config and PlantCard primitive.
- Add CI skeleton `.github/workflows/ci.yml` with lint, type-check, unit tests. **Deliverables**
- Monorepo with `apps/native`, `apps/web`, `apps/api`, `packages/{core,db,types,ui,clients}`.
- Passing CI on a trivial PR. **Acceptance criteria**
- `pnpm -w test` runs and passes for the initial packages.
- Storybook renders PlantCard story.

---

#### Phase B API and DB Foundations

**Goal**: Implement Express API core, Mongoose models, DB infra, and local dev orchestration.  
**Key tasks**

- Implement Mongoose models in `packages/db` and indexes.
- Add `infra/docker-compose.yml` for local MongoDB and Redis.
- Implement `packages/clients/nativeApiClient.ts` and `packages/clients/webApiClient.ts`.
- Implement basic auth routes and `PlantService` skeleton with `bulkUpsert` and `revalidateISR` stub. **Deliverables**
- Local dev environment that boots API, web, and native dev servers.
- `webApiClient` with cookie-aware fetch helpers. **Acceptance criteria**
- Local `docker compose up` + `pnpm dev` boots all apps.
- `webApiClient.post('/admin/ping')` returns 200 in dev.

---

#### Phase C Seed Pipeline for 10 Plants and Media Flow

**Goal**: Seed 10 validated plants, upload images to Cloudinary, and verify presentational pages.  
**Key tasks**

- Curate 10-plant CSV with common/scientific names and priority tags.
- Implement `packages/db/seed/seed-plants.ts` with `--dry-run` and `--commit` modes.
- Implement `mapToSchema()` mapping rules and Zod validation.
- Implement `MediaService.uploadFromUrl()` to Cloudinary and save `plant_media` with dimensions.
- Run seed in dry-run, fix mapping, then commit seed for 10 plants. **Deliverables**
- 10 plant documents in MongoDB with images in Cloudinary and `plant_media` records.
- Admin seed review queue showing any mapping errors. **Acceptance criteria**
- `/plants/[slug]` pages render for all 10 slugs on web and native.
- Images show correct aspect ratio and no layout shift.
- Seed script logs show zero unhandled validation errors after commit.

---

#### Phase D Web Admin, ISR Revalidation, and Client Integration

**Goal**: Admin create/update flows call Express API and trigger Next.js revalidation.  
**Key tasks**

- Implement Next.js revalidate endpoint `POST /api/revalidate` with `x-revalidate-secret`.
- Implement `PlantService.revalidateISR` to POST to the revalidate endpoint.
- Implement admin UI pages for plant CRUD and bulk import trigger using `webApiClient`.
- Wire admin create/update to call `PlantService.revalidateISR` server-side. **Deliverables**
- Admin plant create/edit UI.
- Revalidation logs and admin feedback UI. **Acceptance criteria**
- Creating a plant in admin results in the plant detail page being available immediately (no 404).
- Admin UI shows revalidation success or failure message.

---

#### Phase E Native App Integration and Offline Snapshot

**Goal**: Native app reads seeded plants, shows PlantDetail, supports pinning and offline snapshot for pinned plants.  
**Key tasks**

- Implement Expo Router routes and Tamagui provider in `_layout.tsx`.
- Implement `plantsSlice` and `BL_Offline` to snapshot pinned plants to MMKV.
- Implement Axios interceptors with `expo-secure-store` for JWT.
- Implement plant detail gallery using Expo Image and `plant_media` dimensions. **Deliverables**
- Native app with browse, search, and detail screens for seeded plants.
- Pin action that persists to MMKV and syncs with API when online. **Acceptance criteria**
- Pinning a plant offline shows offline badge and persists across app restarts.
- On reconnect, pinned state syncs with server.

---

#### Phase F Workers, Notifications, and Admin Job UI

**Goal**: Implement worker skeletons, import job flow, and basic reminder notifications.  
**Key tasks**

- Implement BullMQ workers `WK_Import` and `WK_Reminder` with retry/backoff and DLQ hooks.
- Implement admin job status endpoint and UI to view import job results and per-row errors.
- Implement `NotificationService.sendBatch` with Expo payload schema and logging. **Deliverables**
- Admin import flow that enqueues `WK_Import` and returns job status.
- `WK_Reminder` that enqueues reminder notifications and logs results. **Acceptance criteria**
- CSV import of a small sample returns a job summary with inserted/updated counts and errors.
- Reminder job enqueues and sends test notification to a registered Expo token in staging.

---

#### Phase G Validation, QA, and Scale Seed

**Goal**: Validate UX, fix issues, then run full 200+ seed.  
**Key tasks**

- Run full QA checklist across web and native: accessibility, i18n, error boundaries, offline behavior.
- Iterate on mapping rules and image attributions.
- After signoff, run full seed pipeline for 200+ plants with chunked imports and monitoring. **Deliverables**
- Production-ready catalog seeded with 200+ plants.
- Runbook for seed, revalidation, and worker DLQ handling. **Acceptance criteria**
- All critical flows pass E2E tests.
- No critical Sentry errors in staging after full seed.
- Admin can revalidate and update pages without manual rebuilds.

---

### 3. QA, Testing, and Acceptance Criteria

**Testing layers**

- **Unit tests**: Zod schemas, `mapToSchema`, `PlantService` logic, BL modules.
- **Component tests**: `packages/ui` components with Jest + RNTL.
- **Storybook**: visual review for PlantCard, Pagination, Toast.
- **E2E**: Playwright for web admin and ISR pages; Detox for native pin/offline flows.

**Key acceptance checks**

- **Presentational validation**: 10 seeded plants render correctly on web and native; images load and gallery uses dimensions.
- **Admin mutation validation**: create/update triggers revalidation and admin sees success.
- **Offline validation**: pin offline persists and syncs.
- **Worker validation**: import job returns per-row errors; reminder job sends test notification.

---

### 4. Deployment and Rollout Strategy

**Environments**

- `development` local with docker compose.
- `preview` CI preview deployments for web and EAS preview builds for native.
- `production` Vercel for web, EAS production for native, AWS EB for API and workers.

**Rollout steps**

- Deploy API and web to staging; run seed dry-run and commit 10 plants to staging.
- Run Playwright and Detox E2E against staging preview builds.
- After signoff, run full seed in a controlled window and monitor Sentry and job DLQ.

**Rollback plan**

- For seed errors: stop import worker, revert DB changes using changelog diffs or restore from snapshot.
- For revalidation failures: re-run `PlantService.revalidateISR` with retry and inspect revalidate endpoint logs.
- For worker failures: pause worker queue, inspect DLQ, and reprocess after fixes.

---

### 5. Risks, Mitigations, and Operational Notes

**Top risks**

- **Seed mapping errors** → mitigated by `--dry-run`, per-row validation, and admin review queue.
- **Revalidation secret leak** → mitigate with secret rotation and restricted EB outbound IPs.
- **Worker DLQ growth** → mitigate with monitoring, alerting, and admin job UI to surface failures.
- **Image licensing issues** → mitigate by preferring CC0 or Unsplash/Pexels and storing attribution in `plant_media.caption`.

**Operational notes**

- Maintain changelog entries for all bulkUpsert operations.
- Monitor Expo push token validity and remove invalid tokens proactively.
- Enforce CI coverage thresholds for `packages/types` and `packages/core`.

---

### 6. Implementation Checklists

#### Preseed checklist for 10 plants

- [ ] Curate 10-plant CSV with common/scientific names and sample images.
- [ ] Add Perenual/Trefle API keys to `.env`.
- [ ] Run `pnpm --filter db seed -- --dry-run` and fix mapping errors.
- [ ] Run `pnpm --filter db seed -- --commit` to seed 10 plants.
- [ ] Verify `/plants/[slug]` on web and native.

#### Admin and revalidation checklist

- [ ] Implement `apps/web/api/revalidate/route.ts` and set `WEB_REVALIDATE_SECRET`.
- [ ] Implement `PlantService.revalidateISR` to call revalidate endpoint.
- [ ] Test admin create → revalidate → page available.

#### Worker and notification checklist

- [ ] Configure Redis and BullMQ in staging.
- [ ] Implement `WK_Import` with per-row error reporting.
- [ ] Implement `WK_Reminder` with batch send and DLQ handling.
- [ ] Test reminder send to a staging Expo token.

---
