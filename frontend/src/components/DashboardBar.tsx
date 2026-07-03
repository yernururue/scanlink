'use client';

import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { CREAM, INK, MUTED } from '@/lib/theme';

/** Sticky dashboard header: logo + operative badge + log out. */
export default function DashboardBar({
  badge,
  badgeStyle,
}: {
  badge: string;
  badgeStyle?: CSSProperties;
}) {
  const router = useRouter();
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 24px',
        height: 56,
        borderBottom: `1px solid ${INK}`,
        background: CREAM,
      }}
    >
      <Logo />
      <span
        style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          border: `1px solid ${INK}`,
          color: MUTED,
          padding: '4px 10px',
          ...badgeStyle,
        }}
      >
        {badge}
      </span>
      <span style={{ flex: 1 }} />
      <button
        onClick={() => router.push('/')}
        className="hovTextBlue"
        style={{
          background: 'none',
          border: 'none',
          fontFamily: 'inherit',
          fontSize: 11,
          letterSpacing: '0.14em',
          color: MUTED,
          cursor: 'pointer',
        }}
      >
        LOG OUT
      </button>
    </div>
  );
}
