import { BLUE } from '@/lib/theme';

export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '0.08em',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: 18,
          height: 18,
          background: BLUE,
          color: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
        }}
      >
        ◉
      </span>
      SUSMETER.AI
    </div>
  );
}
