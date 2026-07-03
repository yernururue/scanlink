'use client';

import { useEffect, useRef, useState } from 'react';
import ArrowCta from '@/components/ArrowCta';
import DashboardBar from '@/components/DashboardBar';
import SectionRule from '@/components/SectionRule';
import TerminalLog from '@/components/TerminalLog';
import { apiUrl } from '@/lib/api';
import { HR_STATUSES, parseName, SAMPLES, type Candidate, type MatrixRow, type Verdict } from '@/lib/judgment';
import { BLUE, CREAM, DARK, FAINT, INK } from '@/lib/theme';

// avatar arrives from the standalone backend; Next.js handlers omit it
type HrCandidate = Candidate & { avatar?: string };

interface HrScanResult {
  confidence: string;
  columns: (HrCandidate & { caseNo: string })[];
  rows: MatrixRow[];
  verdicts: Verdict[];
}

type Phase = 'idle' | 'scanning' | 'done';

export default function HrDashboard() {
  const [urlInput, setUrlInput] = useState('');
  const [candidates, setCandidates] = useState<HrCandidate[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<HrScanResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const addCandidate = () => {
    const url = urlInput.trim();
    if (!url || candidates.length >= 5) return;
    setCandidates((c) => [...c, { name: parseName(url), url: url.replace(/https?:\/\//, '') }]);
    setUrlInput('');
    setPhase('idle');
    setResult(null);
  };

  const removeCandidate = (i: number) => {
    setCandidates((c) => c.filter((_, j) => j !== i));
    setPhase('idle');
    setResult(null);
  };

  const playLog = (statuses: string[]) =>
    new Promise<void>((resolve) => {
      setLog([statuses[0]]);
      let i = 1;
      timerRef.current = setInterval(() => {
        if (i >= statuses.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          resolve();
          return;
        }
        const line = statuses[i];
        setLog((l) => [...l, line]);
        i++;
      }, 480);
    });

  const canScan = candidates.length >= 2 && phase !== 'scanning';

  // 5 готовых субъектов: backend отдаёт их с аватарками; если он лежит —
  // локальный SAMPLES, чтобы демо не умирало никогда.
  const loadDemoBatch = async () => {
    let batch: HrCandidate[] = SAMPLES.slice();
    try {
      const r = await fetch(apiUrl('/api/hr/demo-profiles'));
      if (r.ok) {
        const data = (await r.json()) as { profiles?: HrCandidate[] };
        if (Array.isArray(data.profiles) && data.profiles.length >= 2) batch = data.profiles;
      }
    } catch {
      // backend unreachable - the local roster still gets judged
    }
    setCandidates(batch);
    setPhase('idle');
    setResult(null);
  };

  const runScan = async () => {
    if (!canScan) return;
    setPhase('scanning');
    setResult(null);
    try {
      const [res] = await Promise.all([
        fetch(apiUrl('/api/hr/scan'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidates }),
        }).then((r) => {
          if (!r.ok) throw new Error('scan failed');
          return r.json() as Promise<HrScanResult>;
        }),
        playLog(HR_STATUSES),
      ]);
      setResult(res);
      setPhase('done');
    } catch {
      setLog((l) => [...l, 'ERROR: JUDGMENT ENGINE UNREACHABLE. SUBJECTS REMAIN UNJUDGED (FOR NOW).']);
      setPhase('idle');
    }
  };

  return (
    <div>
      <DashboardBar badge="HR OPERATIVE — VERIFIED (SORT OF)" badgeStyle={{ borderColor: BLUE, color: BLUE }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SectionRule left="// MODULE: BULK_JUDGMENT" right="HR-001" />

        <div style={{ border: `1px solid ${INK}`, marginTop: 16, background: CREAM }}>
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
            <span>CANDIDATE_INTAKE</span>
            <span>{candidates.length} / 5 SUBJECTS</span>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 0, maxWidth: 720 }}>
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCandidate();
                }}
                placeholder="paste linkedin profile url — e.g. linkedin.com/in/chad-hustleton"
                style={{
                  flex: 1,
                  border: `1px solid ${INK}`,
                  background: '#fff',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  padding: '12px 14px',
                  color: INK,
                }}
              />
              <button
                onClick={addCandidate}
                className="hovBgBlue"
                style={{
                  border: `1px solid ${INK}`,
                  borderLeft: 'none',
                  background: INK,
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  padding: '0 26px',
                  cursor: 'pointer',
                }}
              >
                ADD
              </button>
            </div>
            <button
              onClick={loadDemoBatch}
              style={{
                marginTop: 12,
                background: 'none',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 10,
                letterSpacing: '0.14em',
                color: BLUE,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              LOAD SAMPLE BATCH (5 SUBJECTS)
            </button>

            {candidates.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
                {candidates.map((c, i) => (
                  <div
                    key={c.name + i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      border: `1px solid ${INK}`,
                      padding: '8px 12px',
                      fontSize: 11,
                      background: '#fff',
                    }}
                  >
                    {c.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element -- avatars come from the backend origin
                      <img
                        src={c.avatar}
                        alt={c.name}
                        width={22}
                        height={22}
                        style={{ border: `1px solid ${INK}`, display: 'block' }}
                      />
                    ) : (
                      <span style={{ color: BLUE }}>■</span>
                    )}
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: FAINT, fontSize: 9 }}>{c.url}</span>
                    <button
                      onClick={() => removeCandidate(i)}
                      className="hovTextBlue"
                      style={{
                        background: 'none',
                        border: 'none',
                        fontFamily: 'inherit',
                        color: FAINT,
                        cursor: 'pointer',
                        fontSize: 12,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ArrowCta
              label="RUN BULK SUSPICION SCAN"
              onClick={runScan}
              style={{ marginTop: 24, opacity: canScan ? 1 : 0.4 }}
              spanStyle={{ fontSize: 11, padding: '14px 34px' }}
            />
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: FAINT, marginTop: 10 }}>
              MINIMUM 2 SUBJECTS. NOT LEGALLY — JUST SPIRITUALLY.
            </div>
          </div>

          {phase === 'scanning' && (
            <TerminalLog lines={log} style={{ borderTop: `1px solid ${INK}` }} />
          )}
        </div>

        {phase === 'done' && result && (
          <div style={{ marginTop: 40 }}>
            <SectionRule
              left="// OUTPUT: COMPARATIVE_JUDGMENT_MATRIX"
              right={<span style={{ color: BLUE }}>{result.confidence}</span>}
            />
            <div style={{ border: `1px solid ${INK}`, marginTop: 16, background: '#fff', overflowX: 'auto' }}>
              {/* header */}
              <div style={{ display: 'flex', borderBottom: `1px solid ${INK}`, background: DARK, color: CREAM }}>
                <div
                  style={{
                    width: 250,
                    flexShrink: 0,
                    padding: '14px 16px',
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    color: FAINT,
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  METRIC / SUBJECT
                </div>
                {result.columns.map((c) => (
                  <div key={c.caseNo} style={{ flex: 1, minWidth: 150, borderLeft: '1px solid #3a3a3a', padding: '14px 16px' }}>
                    {c.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element -- avatars come from the backend origin
                      <img
                        src={c.avatar}
                        alt={c.name}
                        width={40}
                        height={40}
                        style={{ border: `1px solid ${CREAM}`, display: 'block', marginBottom: 8 }}
                      />
                    )}
                    <div style={{ fontSize: 9, letterSpacing: '0.14em', color: BLUE }}>{c.caseNo}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{c.name}</div>
                  </div>
                ))}
              </div>
              {/* rows */}
              {result.rows.map((row, ri) => (
                <div
                  key={row.label}
                  style={{ display: 'flex', borderBottom: '1px solid #d7d4cb', background: ri % 2 === 0 ? '#fff' : '#F5F3EC' }}
                >
                  <div style={{ width: 250, flexShrink: 0, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: INK }}>{row.label}</div>
                    <div style={{ fontSize: 9, color: FAINT, marginTop: 2 }}>{row.note}</div>
                  </div>
                  {row.cells.map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        flex: 1,
                        minWidth: 150,
                        borderLeft: '1px solid #d7d4cb',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: cell.weight, color: cell.accent ? BLUE : INK }}>{cell.text}</span>
                    </div>
                  ))}
                </div>
              ))}
              {/* verdict row */}
              <div style={{ display: 'flex', background: BLUE, color: '#fff' }}>
                <div style={{ width: 250, flexShrink: 0, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>FINAL VERDICT</div>
                  <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>issued by AuraNet™, non-appealable</div>
                </div>
                {result.verdicts.map((v, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 150, borderLeft: '1px solid rgba(255,255,255,0.3)', padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>{v.title}</div>
                    <div style={{ fontSize: 9, letterSpacing: '0.1em', opacity: 0.75, marginTop: 6 }}>{v.rec}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: FAINT, marginTop: 12 }}>
              ALL STATISTICS ARE BASED ON LINKEDIN PROFILES AND VIBES. MOSTLY VIBES.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
