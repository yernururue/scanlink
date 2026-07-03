import type { ReactNode } from 'react';
import { BLUE, MUTED } from '@/lib/theme';

/** "// SECTION: X ———— 004" dashed rule used above every section. */
export default function SectionRule({
  left,
  right,
  square = false,
}: {
  left: string;
  right?: ReactNode;
  square?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        letterSpacing: '0.14em',
        color: MUTED,
      }}
    >
      <span>{left}</span>
      <span style={{ flex: 1, borderTop: '1px dashed #9a9a92' }} />
      {square && <span style={{ width: 8, height: 8, background: BLUE, display: 'inline-block' }} />}
      {right != null && <span>{right}</span>}
    </div>
  );
}
