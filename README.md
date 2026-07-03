# SusMeter AI

> The world's first deterministic judgment layer. Upload one photo — get your
> LinkedIn-to-Interpol ratio in under 12 seconds. Proprietary AuraNet™
> inference. Full emotional damage.

**This is satire.** SusMeter AI is a hackathon-grade fake startup: the idea is
garbage on purpose, the execution is played completely straight. Every metric
is fictional, no photo ever leaves the browser, and no real analysis of any
person takes place. We are not Interpol.\*

Migrated to Next.js from the Claude Design source (`SusMeter.dc.html`).

## Structure

```
frontend/   Next.js 16 (App Router, TypeScript) — all screens (+ legacy judgment API)
backend/    FastAPI Suspicion Engine — judgment API, demo roster, avatars, AI layer
```

## Quick start

```bash
# backend (Suspicion Engine) — http://localhost:1488
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/uvicorn app.main:app --app-dir backend --port 1488

# frontend — http://localhost:3000
cd frontend
npm install
npm run dev
```

Production frontend: `npm run build && npm start`.

Config: `frontend/.env` (`NEXT_PUBLIC_PREMIUM_PRICE`, `NEXT_PUBLIC_IMPROVEMENT_PERCENT`,
`NEXT_PUBLIC_API_BASE_URL`) and `backend/.env` (`PREMIUM_PRICE`, `IMPROVEMENT_PERCENT`,
`AI_MODE`, `ANTHROPIC_API_KEY`) — see the `.env.example` files.

## Routes

| Route                 | Screen                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| `/`                   | Landing — hero, RAW_DATA panel (terminal + live radar), AuraNet™ manifest, pricing, FAQ, media strip |
| `/login`              | Operative class selection (Civilian / HR Operative)                    |
| `/verify`             | HR verification protocol (3 mandatory questions; answers don't matter) |
| `/dashboard/civilian` | Self-judgment: photo upload → suspicion scan → credibility report → Premium Truth™ |
| `/dashboard/hr`       | Bulk judgment: 2–5 LinkedIn URLs → comparative judgment matrix + final verdicts |

## API (FastAPI backend — `backend/`)

| Method | Path                    | Purpose                                                        |
| ------ | ----------------------- | -------------------------------------------------------------- |
| POST   | `/api/scan`             | Civilian report — `{ seed?: string }` → metrics, quote, stamp  |
| POST   | `/api/hr/scan`          | Bulk matrix — `{ candidates: {name, url}[] }` (2–5 subjects); columns carry `avatar` |
| GET    | `/api/hr/demo-profiles` | 5 ready-made demo subjects with avatars (LOAD SAMPLE BATCH)    |
| GET    | `/api/health`           | Suspicion Engine status (99.99% shame uptime)                  |

All judgment is deterministic (seeded hashing — same input, same verdict).
`backend/app/judgment.py` is a byte-for-byte port of
`frontend/src/lib/judgment.ts`; the Next.js route handlers in
`frontend/src/app/api/*` still serve the same contract as a fallback when
`NEXT_PUBLIC_API_BASE_URL` is unset. The loading sequence in the UI is pure
theater. Photos are read client-side only; the scan API receives a metadata
seed, never the image. We only store the shame.

The AI layer is hardcoded-deterministic by default; `AI_MODE=live` in
`backend/.env` lets Claude rewrite the flavor text with instant fallback
(see `backend/README.md`).
