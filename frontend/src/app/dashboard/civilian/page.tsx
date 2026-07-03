'use client';

import { useEffect, useRef, useState } from 'react';
import ArrowCta from '@/components/ArrowCta';
import DashboardBar from '@/components/DashboardBar';
import SectionRule from '@/components/SectionRule';
import TerminalLog from '@/components/TerminalLog';
import { apiUrl } from '@/lib/api';
import { USER_STATUSES, type UserMetric } from '@/lib/judgment';
import { BLUE, BLUE_SOFT, CREAM, DARK, FAINT, IMPROVEMENT_PERCENT, INK, MUTED, PAPER, PREMIUM_PRICE } from '@/lib/theme';

interface UserScanResult {
  caseNo: string;
  confidence: string;
  metrics: UserMetric[];
  quote: string;
  stamp: string;
  premiumPrice: number;
  improvementPercent: number;
}

type Phase = 'idle' | 'scanning' | 'done';
type Premium = 'locked' | 'offer' | 'paid';

export default function CivilianDashboard() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [seed, setSeed] = useState('you');
  const [phase, setPhase] = useState<Phase>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [report, setReport] = useState<UserScanResult | null>(null);
  const [premium, setPremium] = useState<Premium>('locked');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      setPhoto(r.result as string);
      // the photo never leaves the browser — the scan is seeded by metadata only
      setSeed(`${f.name}:${f.size}`);
      setPhase('idle');
      setReport(null);
      setPremium('locked');
    };
    r.readAsDataURL(f);
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

  const canScan = !!photo && phase !== 'scanning';

  const runScan = async () => {
    if (!canScan) return;
    setPhase('scanning');
    setReport(null);
    setPremium('locked');
    try {
      const [res] = await Promise.all([
        fetch(apiUrl('/api/scan'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seed }),
        }).then((r) => {
          if (!r.ok) throw new Error('scan failed');
          return r.json() as Promise<UserScanResult>;
        }),
        playLog(USER_STATUSES),
      ]);
      setReport(res);
      setPhase('done');
    } catch {
      setLog((l) => [...l, 'ERROR: JUDGMENT ENGINE UNREACHABLE. YOU REMAIN UNJUDGED (FOR NOW).']);
      setPhase('idle');
    }
  };

  const price = report?.premiumPrice ?? PREMIUM_PRICE;
  const improvement = report?.improvementPercent ?? IMPROVEMENT_PERCENT;

  return (
    <div>
      <DashboardBar badge="CIVILIAN — UNVERIFIED, UNBOTHERED" />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
        <SectionRule left="// MODULE: SELF_JUDGMENT" right="CV-001" />

        {/* intake */}
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
            <span>SUBJECT_INTAKE</span>
            <span>{photo ? 'SUBJECT ACQUIRED' : 'AWAITING SUBJECT'}</span>
          </div>
          <div style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <label
              className="hovBorderBlue"
              style={{
                width: 200,
                height: 200,
                border: `1px dashed ${INK}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                background: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="subject" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: 22, color: BLUE }}>⌾</span>
                  <span style={{ fontSize: 9, letterSpacing: '0.16em', color: MUTED, textAlign: 'center', lineHeight: 1.8 }}>
                    DROP YOUR FACE HERE
                    <br />
                    JPG / PNG / GUILT
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </label>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>UPLOAD YOUR FACE.</div>
              <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, marginTop: 10, maxWidth: 420 }}>
                AuraNet™ will compute your full vibe-risk profile against 2.7M known suspicious faces. No credit card.
                Only judgment.
              </div>
              <ArrowCta
                label="RUN SUSPICION SCAN"
                onClick={runScan}
                style={{ marginTop: 22, opacity: canScan ? 1 : 0.4 }}
                spanStyle={{ fontSize: 11, padding: '14px 34px' }}
              />
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: FAINT, marginTop: 10 }}>
                WE DO NOT STORE YOUR PHOTO. WE ONLY STORE THE SHAME.
              </div>
            </div>
          </div>
          {phase === 'scanning' && <TerminalLog lines={log} style={{ borderTop: `1px solid ${INK}` }} />}
        </div>

        {/* report */}
        {phase === 'done' && report && photo && (
          <div style={{ marginTop: 40 }}>
            <SectionRule
              left="// OUTPUT: CREDIBILITY_REPORT"
              right={<span style={{ color: BLUE }}>{report.caseNo}</span>}
            />
            <div className="reportGrid" style={{ marginTop: 16 }}>
              {/* dossier */}
              <div style={{ border: `1px solid ${INK}`, background: PAPER, padding: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.12em' }}>
                  <span>SUBJECT: YOU</span>
                  <span>{report.confidence}</span>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    border: `1px solid ${INK}`,
                    height: 220,
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#d8d3c4',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="subject" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      top: 70,
                      left: 0,
                      right: 0,
                      height: 30,
                      background: BLUE,
                      opacity: 0.92,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 9,
                      letterSpacing: '0.2em',
                    }}
                  >
                    REDACTED BY AURANET™
                  </div>
                </div>
                <div style={{ marginTop: 18, fontSize: 11.5, lineHeight: 2.1 }}>
                  {report.metrics.map((m) => (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #b5ae9c' }}>
                      <span>{m.label}</span>
                      <span style={{ fontWeight: 700, color: m.accent ? BLUE : INK }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, fontSize: 11, fontStyle: 'italic', color: '#3a3a3a', lineHeight: 1.7 }}>
                  &quot;{report.quote}&quot;
                </div>
                <div style={{ position: 'relative', marginTop: 14 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      border: `2px solid ${BLUE}`,
                      color: BLUE,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      padding: '5px 12px',
                      transform: 'rotate(-6deg)',
                    }}
                  >
                    {report.stamp}
                  </span>
                </div>
              </div>

              {/* premium */}
              <div style={{ border: `1px solid ${INK}`, background: DARK, color: CREAM, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: '1px solid #3a3a3a',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    color: FAINT,
                  }}
                >
                  <span>PREMIUM_TRUTH.MODULE</span>
                  <span style={{ color: BLUE }}>LAYER 2</span>
                </div>
                <div style={{ padding: 26, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>PREMIUM TRUTH™</div>

                  {premium === 'locked' && (
                    <>
                      <div style={{ fontSize: 12, color: '#9a9a9a', lineHeight: 1.9, marginTop: 12 }}>
                        Our deepest insight layer. AuraNet™ has computed an optimized version of your face. Projected
                        profile improvement: <span style={{ color: BLUE_SOFT, fontWeight: 700 }}>+{improvement}%</span>.
                      </div>
                      <div style={{ flex: 1 }} />
                      <ArrowCta
                        label={`UNLOCK PREMIUM TRUTH — $${price}`}
                        onClick={() => setPremium('offer')}
                        hoverClass="hovBgBlueWhite"
                        style={{ display: 'flex', marginTop: 24 }}
                        spanStyle={{
                          flex: 1,
                          background: CREAM,
                          color: INK,
                          fontSize: 11,
                          letterSpacing: '0.14em',
                          padding: '14px 0',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      />
                    </>
                  )}

                  {premium === 'offer' && (
                    <>
                      <div style={{ marginTop: 16, border: '1px solid #3a3a3a', height: 200, overflow: 'hidden', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt="optimized subject (encrypted)"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', filter: 'blur(16px)' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            letterSpacing: '0.2em',
                            color: '#fff',
                            background: 'rgba(20,20,20,0.35)',
                          }}
                        >
                          ENCRYPTED UNTIL PAYMENT
                        </div>
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.9, marginTop: 14, color: '#9a9a9a' }}>
                        Optimization complete. Your profile will be{' '}
                        <span style={{ color: BLUE_SOFT, fontWeight: 700 }}>{improvement}% better</span>. This is a real
                        number we computed.
                      </div>
                      <div style={{ flex: 1 }} />
                      <ArrowCta
                        label={`PAY $${price} WITH VIBES`}
                        onClick={() => setPremium('paid')}
                        hoverClass="hovBgBlueDark"
                        style={{ display: 'flex', marginTop: 18 }}
                        spanStyle={{
                          flex: 1,
                          background: BLUE,
                          color: '#fff',
                          fontSize: 11,
                          letterSpacing: '0.14em',
                          padding: '14px 0',
                          textAlign: 'center',
                          fontWeight: 600,
                        }}
                      />
                    </>
                  )}

                  {premium === 'paid' && (
                    <>
                      <div style={{ marginTop: 16, border: `1px solid ${BLUE}`, height: 200, overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt="optimized subject"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 14,
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          color: FAINT,
                        }}
                      >
                        <span>OPTIMIZATION: MIRRORED</span>
                        <span style={{ color: BLUE_SOFT }}>+{improvement}% VERIFIED™</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.9, marginTop: 12 }}>
                        Behold. Your face, but {improvement}% better. Recruiters will notice the difference. They will
                        not be able to explain it.
                      </div>
                      <div style={{ marginTop: 14, fontSize: 11, fontStyle: 'italic', color: '#9a9a9a' }}>
                        Verdict: Still suspicious. But statistically improved.
                      </div>
                      <div style={{ flex: 1 }} />
                      <div style={{ marginTop: 18, fontSize: 9, letterSpacing: '0.14em', color: MUTED }}>
                        PAYMENT RECEIVED: {price}.00 VIBES · NON-REFUNDABLE · THANK YOU
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
