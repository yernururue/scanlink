import { NextResponse } from 'next/server';
import { buildRows, buildVerdicts, caseNo } from '@/lib/judgment';

interface RawCandidate {
  name?: unknown;
  url?: unknown;
}

/**
 * POST /api/hr/scan — bulk judgment for HR operatives.
 * Body: { candidates: Array<{ name: string; url: string }> } (2–5 subjects).
 */
export async function POST(request: Request) {
  let raw: RawCandidate[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.candidates)) raw = body.candidates;
  } catch {
    // fall through to validation below
  }

  const candidates = raw
    .map((c) => ({
      name: String(c?.name ?? '').trim().toUpperCase() || 'UNKNOWN SUBJECT',
      url: String(c?.url ?? '').trim(),
    }))
    .slice(0, 5);

  if (candidates.length < 2) {
    return NextResponse.json(
      { error: 'MINIMUM 2 SUBJECTS. NOT LEGALLY — JUST SPIRITUALLY.' },
      { status: 422 },
    );
  }

  const names = candidates.map((c) => c.name);
  return NextResponse.json({
    confidence: 'CONFIDENCE 97.3%',
    columns: candidates.map((c, i) => ({ ...c, caseNo: caseNo(c.name, i) })),
    rows: buildRows(names),
    verdicts: buildVerdicts(names),
  });
}
