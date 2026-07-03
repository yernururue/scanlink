"""AuraNet(tm) deterministic judgment core - 1:1 port of frontend/src/lib/judgment.ts.

Same seed string must produce the same verdict as the Next.js route handlers,
so the frontend can switch between backends without changing anyone's fate.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Callable

_DATA_DIR = Path(__file__).parent / "data"

with open(_DATA_DIR / "meme_titles.json", encoding="utf-8") as f:
    _MEME = json.load(f)

TITLES: list[str] = _MEME["final_verdict_titles"]
RECS: list[str] = _MEME["recommendations"]


def hash_seed(s: str) -> int:
    # JS: h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h)
    # charCodeAt yields UTF-16 code units; `| 0` wraps to signed int32.
    h = 7
    b = s.encode("utf-16-le")
    for i in range(0, len(b), 2):
        unit = b[i] | (b[i + 1] << 8)
        h = (h * 31 + unit) & 0xFFFFFFFF
    if h >= 0x80000000:
        h -= 0x100000000
    return abs(h)


def pick(arr: list[str], seed: str) -> str:
    return arr[hash_seed(seed) % len(arr)]


def pct(seed: str, lo: int, hi: int) -> int:
    return lo + (hash_seed(seed) % (hi - lo + 1))


def case_no(name: str, i: int) -> str:
    return f"CASE № 0{i + 1}{40 + (hash_seed(name) % 50)}-SUS"


def _binary(seed: str, a: str, b: str, bad_is_b: bool) -> Callable[[str], dict[str, Any]]:
    def fn(name: str) -> dict[str, Any]:
        v = hash_seed(name + seed) % 2 == 0
        return {"text": a if v else b, "accent": v != (not bad_is_b), "weight": 700}

    return fn


def _percent(seed: str, lo: int, hi: int) -> Callable[[str], dict[str, Any]]:
    def fn(name: str) -> dict[str, Any]:
        v = pct(name + seed, lo, hi)
        return {"text": f"{v}%", "accent": v < 30, "weight": 600}

    return fn


def _body_count(name: str) -> dict[str, Any]:
    return {
        "text": pick(["0 (VERIFIED)", "2", "7", "CLASSIFIED", "ERR_OVERFLOW"], name + "bc"),
        "accent": False,
        "weight": 600,
    }


def _aura(name: str) -> dict[str, Any]:
    v = pct(name + "aura", -9000, 12000)
    return {"text": ("+" if v > 0 else "") + f"{v:,}", "accent": v < 0, "weight": 700}


_ROW_DEFS: list[tuple[str, str, Callable[[str], dict[str, Any]]]] = [
    ("HOT DOG OR NOT", "foundational classifier", _binary("hd", "HOT DOG", "NOT HOT DOG", False)),
    ("EMPLOYMENT SUCCESS RATE", "projected, generously", _percent("emp", 4, 96)),
    ("INTERNSHIP SURVIVAL RATE", "unpaid included", _percent("int", 12, 99)),
    ("BODY COUNT", "as reported by the algorithm", _body_count),
    ("AURA", "net balance, points", _aura),
    ("KISS OR SLAP", "first-impression protocol", _binary("ks", "KISS", "SLAP", True)),
    ("SLAVE OR LOVE", "work-life diagnostic", _binary("sl", "LOVE", "SLAVE (TO THE GRIND)", True)),
    ("SMASH OR PASS", "recruiter heuristic", _binary("sp", "SMASH", "PASS", True)),
    ("HOT AIR INDEX", "chief vozdukhan coefficient", _percent("air", 15, 100)),
    ("DEATH IN POVERTY", "probability, actuarial-ish", _percent("dip", 1, 98)),
    ("MOM'S FRIEND'S SON SCORE", "the benchmark you never beat", _percent("mfs", 0, 100)),
]


def build_rows(names: list[str]) -> list[dict[str, Any]]:
    return [
        {"label": label, "note": note, "cells": [fn(name) for name in names]}
        for label, note, fn in _ROW_DEFS
    ]


def build_verdicts(names: list[str]) -> list[dict[str, str]]:
    return [
        {"title": pick(TITLES, name + "title"), "rec": pick(RECS, name + "rec")}
        for name in names
    ]


VERDICT_QUOTES = [
    "You look like your startup has no users but already has a pricing page.",
    "You would pass a YC interview but fail airport security.",
    "Strong LinkedIn energy, weak legal defense.",
    "Not guilty, but definitely launching a course soon.",
]


def build_user_report(seed: str) -> dict[str, Any]:
    def um(label: str, value: str, accent: bool = False) -> dict[str, Any]:
        return {"label": label, "value": value, "accent": accent}

    return {
        "caseNo": f"CASE № {1000 + (hash_seed(seed + 'case') % 9000)}-SUS",
        "confidence": "CONFIDENCE 97.3%",
        "metrics": [
            um("LINKEDIN ENERGY", f"{pct(seed + 'le', 55, 95)}%"),
            um("INTERPOL ENERGY", f"{pct(seed + 'ie', 40, 80)}%", True),
            um("HOT DOG OR NOT", "NOT HOT DOG"),
            um("AURA", "-450", True),
            um("EMPLOYMENT SUCCESS RATE", f"{pct(seed + 'emp', 8, 40)}%"),
            um("MOM'S FRIEND'S SON SCORE", f"{pct(seed + 'mfs', 1, 9)}%", True),
            um("ALIBI STRENGTH", "WEAK"),
            um("FOUNDER DELUSION INDEX", f"{pct(seed + 'fd', 70, 99)}%"),
        ],
        "quote": pick(VERDICT_QUOTES, seed + "quote"),
        "stamp": "SUSPICIOUS",
    }
