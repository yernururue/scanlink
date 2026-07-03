import { NextResponse } from 'next/server';
import { buildUserReport } from '@/lib/judgment';
import { IMPROVEMENT_PERCENT, PREMIUM_PRICE } from '@/lib/theme';

/**
 * POST /api/scan — civilian self-judgment.
 * Body: { seed?: string } — any stable identifier for the subject
 * (the photo itself never leaves the browser; we only store the shame).
 */
export async function POST(request: Request) {
  let seed = 'you';
  try {
    const body = await request.json();
    if (typeof body?.seed === 'string' && body.seed.trim()) seed = body.seed.trim();
  } catch {
    // no body — judge the default subject
  }
  return NextResponse.json({
    ...buildUserReport(seed),
    premiumPrice: PREMIUM_PRICE,
    improvementPercent: IMPROVEMENT_PERCENT,
  });
}
