"""SusMeter AI - standalone Suspicion Engine (phase 2).

Implements the same contract as the Next.js route handlers in
frontend/src/app/api/*, so the frontend switches over via
NEXT_PUBLIC_API_BASE_URL=http://localhost:1488.

Run:  .venv/bin/uvicorn app.main:app --app-dir backend --port 1488
"""
from __future__ import annotations

import os
from functools import partial
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

import anyio.to_thread
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import ai
from .judgment import build_rows, build_user_report, build_verdicts, case_no

PREMIUM_PRICE = int(os.getenv("PREMIUM_PRICE", "29"))
IMPROVEMENT_PERCENT = int(os.getenv("IMPROVEMENT_PERCENT", "70"))

app = FastAPI(title="SusMeter AI - Suspicion Engine", docs_url=None, redoc_url=None)

_allowed_origins = os.getenv("ALLOWED_ORIGINS", "")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _allowed_origins.split(",") if o.strip()] or [],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ALL SYSTEMS OPERATIONAL",
        "engine": "AuraNet™",
        "uptime": "99.99%",
        "verdictsPerSecond": "28.5K",
        "facesAnalyzed": "2.7M",
        "judging": True,
        "core": "backend/fastapi",
        "aiLayer": "live" if ai.enabled() else "hardcoded",
    }


@app.post("/api/scan")
async def scan(request: Request) -> dict:
    seed = "you"
    try:
        body = await request.json()
        if isinstance(body, dict) and isinstance(body.get("seed"), str) and body["seed"].strip():
            seed = body["seed"].strip()
    except Exception:
        pass

    report = build_user_report(seed)
    if ai.enabled():
        quote = await anyio.to_thread.run_sync(partial(ai.roast_quote, seed))
        if quote:
            report["quote"] = quote
    return {**report, "premiumPrice": PREMIUM_PRICE, "improvementPercent": IMPROVEMENT_PERCENT}


@app.post("/api/hr/scan")
async def hr_scan(request: Request):
    raw = []
    try:
        body = await request.json()
        if isinstance(body, dict) and isinstance(body.get("candidates"), list):
            raw = body["candidates"]
    except Exception:
        pass

    candidates = [
        {
            "name": str(c.get("name") or "").strip().upper() or "UNKNOWN SUBJECT",
            "url": str(c.get("url") or "").strip(),
        }
        for c in raw
        if isinstance(c, dict)
    ][:5]

    if len(candidates) < 2:
        return JSONResponse(
            {"error": "MINIMUM 2 SUBJECTS. NOT LEGALLY — JUST SPIRITUALLY."},
            status_code=422,
        )

    names = [c["name"] for c in candidates]
    verdicts = build_verdicts(names)

    if ai.enabled():
        recs = await anyio.to_thread.run_sync(partial(ai.verdict_recs, names))
        if recs:
            for v, rec in zip(verdicts, recs):
                v["rec"] = rec

    return {
        "confidence": "CONFIDENCE 97.3%",
        "columns": [
            {**c, "caseNo": case_no(c["name"], i)}
            for i, c in enumerate(candidates)
        ],
        "rows": build_rows(names),
        "verdicts": verdicts,
    }


@app.get("/api/hr/demo-profiles")
def demo_profiles() -> dict:
    return {
        "profiles": [
            {"name": "BAKHREDIN ZURGAMBAYEV", "url": "linkedin.com/in/bakhredin-zurgambayev-072500281"},
            {"name": "JAFAR MAZHITOV", "url": "linkedin.com/in/jafar-mazhitov"},
            {"name": "DIANA", "url": "linkedin.com/in/dibsnva"},
            {"name": "DAUREN APAS", "url": "linkedin.com/in/dauren-apas"},
            {"name": "BAHAUDDIN TOLEU", "url": "linkedin.com/in/bahauddintoleu"},
        ]
    }
