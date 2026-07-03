import { NextResponse } from 'next/server';

/** GET /api/health — Suspicion Engine status line. */
export async function GET() {
  return NextResponse.json({
    status: 'ALL SYSTEMS OPERATIONAL',
    engine: 'AuraNet™',
    uptime: '99.99%',
    verdictsPerSecond: '28.5K',
    facesAnalyzed: '2.7M',
    judging: true,
  });
}
