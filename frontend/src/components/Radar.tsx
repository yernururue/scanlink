'use client';

import { useEffect, useState } from 'react';
import { BLUE } from '@/lib/theme';

const PROFILES: number[][] = [
  [0.9, 0.55, 0.8, 0.35, 0.3, 0.2, 0.75],
  [0.4, 0.85, 0.5, 0.9, 0.15, 0.45, 0.6],
  [0.7, 0.3, 0.95, 0.5, 0.6, 0.1, 0.85],
];

function radarPoints(vals: number[], cx: number, cy: number, r: number): string {
  return vals
    .map((v, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / vals.length;
      return (cx + Math.cos(a) * r * v).toFixed(1) + ',' + (cy + Math.sin(a) * r * v).toFixed(1);
    })
    .join(' ');
}

const FULL = [1, 1, 1, 1, 1, 1, 1];

/** AURA_SCAN radar — cycles between sample suspicion profiles every 2.6s. */
export default function Radar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROFILES.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <svg width="300" height="280" viewBox="0 0 300 280">
      <g stroke="#4a4a44" fill="none" strokeWidth="1">
        <polygon points={radarPoints(FULL, 150, 140, 110)} />
        <polygon points={radarPoints(FULL, 150, 140, 73)} />
        <polygon points={radarPoints(FULL, 150, 140, 37)} />
        <line x1="150" y1="140" x2="150" y2="30" />
        <line x1="150" y1="140" x2="236" y2="86" />
        <line x1="150" y1="140" x2="257" y2="164" />
        <line x1="150" y1="140" x2="198" y2="239" />
        <line x1="150" y1="140" x2="102" y2="239" />
        <line x1="150" y1="140" x2="43" y2="164" />
        <line x1="150" y1="140" x2="64" y2="86" />
      </g>
      <polygon
        points={radarPoints(PROFILES[idx], 150, 140, 110)}
        fill="rgba(10,102,194,0.45)"
        stroke={BLUE}
        strokeWidth="1.5"
        style={{ transition: 'all 900ms ease' }}
      />
      <g
        fontFamily="var(--font-plex-mono), monospace"
        fontSize="8.5"
        fill="#c9c9c0"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        <text x="150" y="20">LINKEDIN ENERGY</text>
        <text x="248" y="76">INTERPOL ENERGY</text>
        <text x="262" y="182">FOUNDER DELUSION</text>
        <text x="202" y="256">CRYPTO SCAM AURA</text>
        <text x="96" y="256">ALIBI STRENGTH</text>
        <text x="38" y="182">REPLY CHANCE</text>
        <text x="54" y="76">AURA DEBT</text>
      </g>
    </svg>
  );
}
