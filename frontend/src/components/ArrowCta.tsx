import type { CSSProperties, ReactNode } from 'react';
import { BLUE, INK } from '@/lib/theme';

/** The signature split CTA: blue arrow block + dark label block. */
export default function ArrowCta({
  label,
  onClick,
  style,
  spanStyle,
  hoverClass = 'hovBgBlue',
  arrowWidth = 40,
}: {
  label: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  spanStyle?: CSSProperties;
  hoverClass?: string;
  arrowWidth?: number;
}) {
  return (
    <div style={{ display: 'inline-flex', cursor: 'pointer', ...style }} onClick={onClick}>
      <span
        style={{
          display: 'inline-flex',
          width: arrowWidth,
          alignItems: 'center',
          justifyContent: 'center',
          background: BLUE,
          color: '#fff',
          fontSize: 14,
        }}
      >
        →
      </span>
      <span
        className={hoverClass}
        style={{
          background: INK,
          color: '#fff',
          fontSize: 12,
          letterSpacing: '0.16em',
          padding: '14px 38px',
          ...spanStyle,
        }}
      >
        {label}
      </span>
    </div>
  );
}
