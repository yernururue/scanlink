"""Optional AI flavor layer.

Default is AI_MODE=off: every verdict comes from the deterministic AuraNet(tm)
core - fully hardcoded, demo can never break. Flip AI_MODE=live (plus
ANTHROPIC_API_KEY in backend/.env) and Claude rewrites the flavor text; any
error or timeout falls back to the deterministic output instantly.
"""
from __future__ import annotations

import json
import os

MODEL = "claude-opus-4-8"

SYSTEM = (
    "You write one-liners for SusMeter AI, a deliberately absurd satirical "
    "'AI suspiciousness calculator' played completely straight. Deadpan "
    "corporate-thriller tone, LinkedIn-meets-Interpol energy. Keep it PG-13, "
    "never reference real people or real crimes. Output ONLY what is asked - "
    "no preamble, no quotes around the text."
)

_client = None


def enabled() -> bool:
    return (
        os.getenv("AI_MODE", "off").strip().lower() == "live"
        and bool(os.getenv("ANTHROPIC_API_KEY"))
    )


def _get_client():
    # lazy import: keeps startup instant and lets AI_MODE=off run without the key
    global _client
    if _client is None:
        import anthropic

        _client = anthropic.Anthropic(timeout=6.0, max_retries=0)
    return _client


def _complete(prompt: str, max_tokens: int = 300) -> str | None:
    try:
        resp = _get_client().messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=SYSTEM,
            messages=[{"role": "user", "content": prompt}],
        )
        text = next((b.text for b in resp.content if b.type == "text"), "")
        return text.strip() or None
    except Exception:
        return None


def roast_quote(seed: str) -> str | None:
    """One verdict quote for the civilian credibility report."""
    return _complete(
        "Write ONE short verdict quote (max 18 words) for a civilian who just "
        f"scanned their own profile photo (case seed: {seed!r}). Style example: "
        "'You would pass a YC interview but fail airport security.'"
    )


def verdict_recs(names: list[str]) -> list[str] | None:
    """One hiring recommendation per candidate for the HR judgment matrix."""
    raw = _complete(
        "For each candidate below, write one absurd hiring recommendation "
        "starting with 'REC:' (max 8 words each, ALL CAPS). Respond with a "
        f"JSON array of exactly {len(names)} strings, nothing else.\n"
        + "\n".join(f"- {n}" for n in names),
        max_tokens=400,
    )
    if not raw:
        return None
    try:
        recs = json.loads(raw)
        if (
            isinstance(recs, list)
            and len(recs) == len(names)
            and all(isinstance(r, str) and r.strip() for r in recs)
        ):
            return [r.strip() for r in recs]
    except Exception:
        pass
    return None
