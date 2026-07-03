'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import TerminalLog from '@/components/TerminalLog';
import { VQ } from '@/lib/judgment';
import { BLUE, CREAM, FAINT, INK } from '@/lib/theme';

export default function Verify() {
  const router = useRouter();
  const [vqIndex, setVqIndex] = useState(0);
  const [vlog, setVlog] = useState<string[]>(['HR verification protocol initiated...']);
  const doneRef = useRef(false);

  useEffect(() => {
    // pre-warm the dashboard so the 900ms handoff feels instant
    router.prefetch('/dashboard/hr');
  }, [router]);

  const vq = VQ[Math.min(vqIndex, VQ.length - 1)];

  const answer = (isYes: boolean) => {
    if (doneRef.current) return;
    const line = isYes ? vq.yes : vq.no;
    if (vqIndex >= VQ.length - 1) {
      doneRef.current = true;
      setVlog((l) => [...l, line, 'PROTOCOL COMPLETE. WELCOME, OPERATIVE.']);
      setTimeout(() => router.push('/dashboard/hr'), 900);
    } else {
      setVlog((l) => [...l, line]);
      setVqIndex((i) => i + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 560, border: `1px solid ${INK}`, background: CREAM }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: `1px solid ${INK}`,
            fontSize: 10,
            letterSpacing: '0.14em',
          }}
        >
          <span>HR_VERIFICATION_PROTOCOL</span>
          <span>Q_{Math.min(vqIndex, 2) + 1} / 3</span>
        </div>
        <TerminalLog lines={vlog} style={{ fontSize: 11, lineHeight: 2, padding: '16px 20px', minHeight: 96 }} />
        <div style={{ padding: '30px 34px' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: BLUE }}>MANDATORY QUESTION</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 12, lineHeight: 1.5 }}>{vq.q}</div>
          <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
            <button
              onClick={() => answer(true)}
              className="hovBgBlueBorder"
              style={{
                flex: 1,
                border: `1px solid ${INK}`,
                background: INK,
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: 12,
                letterSpacing: '0.16em',
                padding: '14px 0',
                cursor: 'pointer',
              }}
            >
              YES
            </button>
            <button
              onClick={() => answer(false)}
              className="hovBgBlueWhiteBorder"
              style={{
                flex: 1,
                border: `1px solid ${INK}`,
                background: CREAM,
                color: INK,
                fontFamily: 'inherit',
                fontSize: 12,
                letterSpacing: '0.16em',
                padding: '14px 0',
                cursor: 'pointer',
              }}
            >
              NO
            </button>
          </div>
          <div style={{ fontSize: 10, color: FAINT, marginTop: 18, letterSpacing: '0.1em' }}>
            YOUR ANSWER DOES NOT MATTER. THE PROTOCOL MUST BE OBSERVED.
          </div>
        </div>
      </div>
    </div>
  );
}
