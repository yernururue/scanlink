import type { CSSProperties } from 'react';
import { DARK } from '@/lib/theme';

/** Dark terminal block: "> line" rows with a blinking cursor. */
export default function TerminalLog({
  lines,
  style,
}: {
  lines: readonly string[];
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: DARK,
        color: '#d9d9d2',
        fontSize: 12,
        lineHeight: 2.1,
        padding: '20px 24px',
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>&gt; {line}</div>
      ))}
      <div className="blink">_</div>
    </div>
  );
}
