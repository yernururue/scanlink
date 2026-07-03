'use client';

import { useRouter } from 'next/navigation';
import { BLUE, CREAM, FAINT, INK, MUTED } from '@/lib/theme';

const CLASSES = [
  {
    id: 'CLASS_01',
    title: 'CIVILIAN',
    desc: 'Judge yourself. No verification required — we already know what you are.',
    href: '/dashboard/civilian',
  },
  {
    id: 'CLASS_02',
    title: 'HR OPERATIVE',
    desc: 'Judge others in bulk. Verification protocol required. Obviously.',
    href: '/verify',
  },
] as const;

export default function Login() {
  const router = useRouter();

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
          <span>ACCESS_TERMINAL.SUS</span>
          <span style={{ color: BLUE }}>● SECURE-ISH</span>
        </div>
        <div style={{ padding: 34 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '0.03em' }}>SELECT OPERATIVE CLASS</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 10, lineHeight: 1.7 }}>
            Identity verification depends on how much power you want over other people.
          </div>
          <div className="loginGrid" style={{ marginTop: 28 }}>
            {CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => router.push(c.href)}
                className="hovInvert"
                style={{
                  border: `1px solid ${INK}`,
                  background: CREAM,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  padding: 20,
                  cursor: 'pointer',
                  color: INK,
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: '0.14em', color: BLUE }}>{c.id}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{c.title}</div>
                <div style={{ fontSize: 10.5, marginTop: 8, lineHeight: 1.7, opacity: 0.7 }}>{c.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => router.push('/')}
            className="hovTextBlue"
            style={{
              marginTop: 26,
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: FAINT,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ← BACK TO SURFACE
          </button>
        </div>
      </div>
    </div>
  );
}
