# SusMeter AI — backend (Suspicion Engine, phase 2)

Standalone FastAPI service implementing the same judgment contract as the old
Next.js route handlers, plus the demo roster with avatars. The frontend points
here via `NEXT_PUBLIC_API_BASE_URL=http://localhost:1488` (already set in
`frontend/.env`).

## Run locally

```bash
# from the repo root (deps live in the root .venv, Python 3.14)
.venv/bin/pip install -r backend/requirements.txt
.venv/bin/uvicorn app.main:app --app-dir backend --port 1488
```

## API

| Method | Path                    | Body                                  | Response                                            |
| ------ | ----------------------- | ------------------------------------- | --------------------------------------------------- |
| POST   | `/api/scan`             | `{ seed?: string }`                   | `UserReport` + `premiumPrice`, `improvementPercent` |
| POST   | `/api/hr/scan`          | `{ candidates: {name, url}[] }` (2–5) | `{ confidence, columns, rows, verdicts }` — columns now carry `avatar` |
| GET    | `/api/hr/demo-profiles` | —                                     | `{ profiles: {name, url, avatar}[] }` — 5 ready-made demo subjects |
| GET    | `/api/health`           | —                                     | Suspicion Engine status line                        |
| GET    | `/avatars/{file}`       | —                                     | bundled avatar images                               |

The judgment core (`app/judgment.py`) is a 1:1 port of
`frontend/src/lib/judgment.ts` — same seed, same verdict, byte-for-byte.

## Demo roster & avatars

`app/data/demo_profiles.json` holds the 5 ready-made demo people ("LOAD SAMPLE
BATCH" in the HR dashboard fetches them from `/api/hr/demo-profiles`). To use
real people for the demo: edit the JSON (name + LinkedIn URL) and drop real
images into `app/static/avatars/` (any format; update the `avatar` filenames).

Avatar resolution for arbitrary URLs in `/api/hr/scan`:
1. URL matches a demo profile → its bundled avatar.
2. Try to scrape `og:image` from the profile page (2.5s timeout; LinkedIn
   usually refuses to be judged).
3. Fallback → deterministically picked bundled avatar. The demo never breaks.

## AI layer

Hardcoded by default (`AI_MODE=off` in `backend/.env`): all verdicts come from
the deterministic seed-hash core. Flip the switch just in case:

```
AI_MODE=live
ANTHROPIC_API_KEY=sk-ant-...
```

In live mode Claude (`claude-opus-4-8`) rewrites the civilian verdict quote and
the HR recommendations; any error/timeout falls back to the deterministic text
instantly, so the stage demo cannot break. `GET /api/health` reports which
layer is active (`aiLayer: hardcoded | live`).

## Config (`backend/.env`)

| Var                   | Default | Meaning                                   |
| --------------------- | ------- | ----------------------------------------- |
| `PREMIUM_PRICE`       | 29      | Premium Truth™ price in the scan response |
| `IMPROVEMENT_PERCENT` | 70      | promised self-improvement, %              |
| `AI_MODE`             | off     | `off` = hardcoded, `live` = Claude flavor |
| `ANTHROPIC_API_KEY`   | —       | required only for `AI_MODE=live`          |
