'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowCta from '@/components/ArrowCta';
import Logo from '@/components/Logo';
import Radar from '@/components/Radar';
import SectionRule from '@/components/SectionRule';
import TerminalLog from '@/components/TerminalLog';
import { apiUrl } from '@/lib/api';
import { FAQ } from '@/lib/judgment';
import { BLUE, BLUE_SOFT, CREAM, DARK, FAINT, IMPROVEMENT_PERCENT, INK, MUTED, PAPER, PREMIUM_PRICE } from '@/lib/theme';

const DOTO = 'var(--font-doto), monospace';

// The engine has been judging since this exact moment.
const JUDGING_SINCE = Date.UTC(2025, 6, 1, 9, 0, 0);

function NodeDiagram() {
  return (
    <svg width="680" height="150" viewBox="0 0 680 150" style={{ maxWidth: '92vw', height: 'auto' }}>
      <line x1="120" y1="30" x2="318" y2="75" stroke={INK} strokeWidth="1" />
      <line x1="120" y1="75" x2="318" y2="75" stroke={INK} strokeWidth="1" />
      <line x1="120" y1="120" x2="318" y2="75" stroke={INK} strokeWidth="1" />
      <line x1="362" y1="75" x2="560" y2="30" stroke={INK} strokeWidth="1" />
      <line x1="362" y1="75" x2="560" y2="75" stroke={INK} strokeWidth="1" />
      <line x1="362" y1="75" x2="560" y2="120" stroke={INK} strokeWidth="1" />
      <circle cx="200" cy="57" r="3" fill={BLUE} />
      <circle cx="250" cy="75" r="3" fill={BLUE} />
      <circle cx="200" cy="97" r="3" fill={BLUE} />
      <circle cx="470" cy="52" r="3" fill={BLUE} />
      <circle cx="440" cy="75" r="3" fill={BLUE} />
      <circle cx="470" cy="99" r="3" fill={BLUE} />
      <rect x="318" y="53" width="44" height="44" fill={CREAM} stroke={INK} strokeWidth="1" />
      <text x="340" y="82" textAnchor="middle" fontSize="20" fill={INK}>✳</text>
      <g fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="1">
        {(
          [
            ['Upload', 18],
            ['Scan', 63],
            ['Extract', 108],
          ] as const
        ).map(([label, y]) => (
          <g key={label}>
            <rect x="52" y={y} width="68" height="24" rx="12" fill={CREAM} stroke={INK} />
            <text x="86" y={y + 16} textAnchor="middle" fill={INK}>{label}</text>
          </g>
        ))}
        {(
          [
            ['Judge', 18],
            ['Expose', 63],
            ['Invoice', 108],
          ] as const
        ).map(([label, y]) => (
          <g key={label}>
            <rect x="560" y={y} width="68" height="24" rx="12" fill={CREAM} stroke={INK} />
            <text x="594" y={y + 16} textAnchor="middle" fill={INK}>{label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

const panelHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: `1px solid ${INK}`,
  fontSize: 10,
  letterSpacing: '0.12em',
};

function useJudgingFor(): string {
  const [text, setText] = useState('367d 07h 36m 34s');
  useEffect(() => {
    const fmt = () => {
      let s = Math.max(0, Math.floor((Date.now() - JUDGING_SINCE) / 1000));
      const d = Math.floor(s / 86400);
      s -= d * 86400;
      const h = Math.floor(s / 3600);
      s -= h * 3600;
      const m = Math.floor(s / 60);
      s -= m * 60;
      const p = (n: number) => String(n).padStart(2, '0');
      return `${d}d ${p(h)}h ${p(m)}m ${p(s)}s`;
    };
    const kick = setTimeout(() => setText(fmt()), 0);
    const t = setInterval(() => setText(fmt()), 1000);
    return () => {
      clearTimeout(kick);
      clearInterval(t);
    };
  }, []);
  return text;
}

export default function Landing() {
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState(-1);
  const [engineStatus, setEngineStatus] = useState('ALL SYSTEMS OPERATIONAL — SUSPICION ENGINE UPTIME 99.99%');
  const judgingFor = useJudgingFor();

  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then((r) => r.json())
      .then((h) => setEngineStatus(`${h.status} — SUSPICION ENGINE UPTIME ${h.uptime}`))
      .catch(() => {});
  }, []);

  const goLogin = () => router.push('/login');

  return (
    <div>
      {/* NAV */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          padding: '0 24px',
          height: 56,
          borderBottom: `1px solid ${INK}`,
          background: CREAM,
        }}
      >
        <Logo />
        <div className="navLinks">
          {(
            [
              ['PROBLEM', '#problem'],
              ['AURANET™', '#about'],
              ['PRICING', '#pricing'],
              ['FAQ', '#faq'],
            ] as const
          ).map(([label, href]) => (
            <a key={label} href={href} className="hovTextBlue" style={{ color: INK, textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>
        <span className="navSpacer" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={goLogin}
            className="hovTextBlue"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 12,
              letterSpacing: '0.14em',
              color: MUTED,
              cursor: 'pointer',
              padding: '8px 4px',
              whiteSpace: 'nowrap',
            }}
          >
            LOG IN
          </button>
          <button
            onClick={goLogin}
            className="hovBgBlue"
            style={{
              background: INK,
              color: '#fff',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 12,
              letterSpacing: '0.14em',
              padding: '10px 18px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ANALYZE MY AURA
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '84px 24px 40px' }}>
        <div style={{ fontFamily: DOTO, fontWeight: 900, fontSize: 'clamp(56px,9vw,130px)', lineHeight: 0.95, letterSpacing: '0.02em' }}>
          JUDGE. SCAN.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '36px 0 8px' }}>
          <NodeDiagram />
        </div>
        <div style={{ fontFamily: DOTO, fontWeight: 900, fontSize: 'clamp(56px,9vw,130px)', lineHeight: 0.95, letterSpacing: '0.02em' }}>
          VERDICT.
        </div>
        <p style={{ maxWidth: 560, margin: '28px auto 0', fontSize: 13, lineHeight: 1.8, color: '#3a3a3a' }}>
          SUSMETER.AI is the deterministic judgment layer between your face and everyone silently evaluating it. Upload
          one photo — get your LinkedIn-to-Interpol ratio in under 12 seconds. Proprietary AuraNet™ inference. Full
          emotional damage.
        </p>
        <ArrowCta label="ANALYZE MY AURA" onClick={goLogin} style={{ marginTop: 32 }} />
        <div style={{ marginTop: 18, fontSize: 10, letterSpacing: '0.14em', color: FAINT }}>
          2.7M SUSPICIOUS FACES ANALYZED · NO CREDIT CARD, ONLY JUDGMENT
        </div>
      </div>

      {/* SECTION: RAW_DATA */}
      <div id="problem" style={{ maxWidth: 1200, margin: '90px auto 0', padding: '0 24px' }}>
        <SectionRule left="// SECTION: RAW_DATA" right="004" />
        <div className="rawGrid" style={{ border: `1px solid ${INK}`, marginTop: 16, background: CREAM }}>
          {/* terminal */}
          <div style={{ borderRight: `1px solid ${INK}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...panelHeader, alignItems: 'center' }}>
              <span style={{ display: 'flex', gap: 5 }}>
                <span style={{ width: 8, height: 8, background: BLUE }} />
                <span style={{ width: 8, height: 8, background: INK }} />
                <span style={{ width: 8, height: 8, border: `1px solid ${INK}` }} />
              </span>
              <span>TERMINAL.SUS</span>
            </div>
            <TerminalLog
              lines={[
                'Initializing AuraNet™ pipeline...',
                'Loading judgment weights: 2.4GB',
                'Connecting to LinkedIn crimes database...',
                'Indexing 2.7M suspicious faces...',
                'Running inference: subject_you',
              ]}
              style={{ flex: 1, lineHeight: 2, padding: 18, minHeight: 300 }}
            />
          </div>
          {/* radar dither */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={panelHeader}>
              <span>AURA_SCAN.DITHER</span>
              <span>320×240</span>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: DARK,
                backgroundImage: 'radial-gradient(rgba(236,234,227,0.22) 1px, transparent 1px)',
                backgroundSize: '7px 7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                minHeight: 300,
              }}
            >
              <Radar />
            </div>
          </div>
          {/* metrics */}
          <div style={{ borderTop: `1px solid ${INK}`, borderRight: `1px solid ${INK}` }}>
            <div style={panelHeader}>
              <span>SUSPICION.METRICS</span>
              <span style={{ width: 8, height: 8, background: BLUE }} />
            </div>
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(
                [
                  ['12.4s', 'AVG TIME TO LOSE TRUST'],
                  ['2.7M', 'SUSPICIOUS FACES ANALYZED'],
                  ['94%', 'DISCOVERED HIDDEN INTERPOL ENERGY'],
                  ['99.99%', 'SUSPICION ENGINE UPTIME'],
                ] as const
              ).map(([value, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 40, fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.14em', color: FAINT }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* judgment nodes */}
          <div style={{ borderTop: `1px solid ${INK}`, display: 'flex', flexDirection: 'column' }}>
            <div style={panelHeader}>
              <span>JUDGMENT_NODES.STATUS</span>
              <span>TICK:0001</span>
            </div>
            <div style={{ padding: '18px 22px', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px 24px', fontSize: 11 }}>
                <span style={{ color: FAINT, fontSize: 10, letterSpacing: '0.12em' }}>SURFACE</span>
                <span style={{ color: FAINT, fontSize: 10, letterSpacing: '0.12em' }}>STATUS</span>
                <span style={{ color: FAINT, fontSize: 10, letterSpacing: '0.12em' }}>LATENCY</span>
                <span style={{ borderTop: '1px dashed #b5b3aa', gridColumn: '1 / -1' }} />
                {(
                  [
                    ['LINKEDIN-FEED', '3.8ms'],
                    ['HR-INBOX', '4.1ms'],
                    ['AIRPORT-SECURITY', '4.6ms'],
                    ['FAMILY-GROUP-CHAT', '2.2ms'],
                  ] as const
                ).map(([surface, latency]) => (
                  <React.Fragment key={surface}>
                    <span>{surface}</span>
                    <span style={{ color: BLUE }}>■ JUDGING</span>
                    <span>{latency}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: `1px solid ${INK}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.12em', color: FAINT }}>
                <span>GLOBAL JUDGMENT THROUGHPUT</span>
                <span>87%</span>
              </div>
              <div style={{ height: 8, border: `1px solid ${INK}`, marginTop: 8 }}>
                <div style={{ height: '100%', width: '87%', background: INK }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: ABOUT */}
      <div id="about" style={{ maxWidth: 1200, margin: '110px auto 0', padding: '0 24px' }}>
        <SectionRule left="// SECTION: ABOUT_AURANET" right="005" square />
        <div className="aboutGrid" style={{ border: `1px solid ${INK}`, marginTop: 16 }}>
          <div style={{ borderRight: `1px solid ${INK}`, display: 'flex', flexDirection: 'column' }}>
            <div style={panelHeader}>
              <span>RENDER: DOSSIER_SAMPLE.002</span>
              <span style={{ color: BLUE }}>● LIVE</span>
            </div>
            <div style={{ flex: 1, background: DARK, padding: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: PAPER, border: `1px solid ${INK}`, width: '100%', maxWidth: 340, padding: 22, color: INK }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.12em' }}>
                  <span>CASE № 0042-SUS</span>
                  <span>CONFIDENCE 97.3%</span>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    border: `1px solid ${INK}`,
                    backgroundColor: '#d8d3c4',
                    backgroundImage: 'radial-gradient(rgba(20,20,20,0.35) 1px, transparent 1px)',
                    backgroundSize: '5px 5px',
                    height: 150,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    color: MUTED,
                  }}
                >
                  SUBJECT_PHOTO.RAW
                  <div
                    style={{
                      position: 'absolute',
                      top: 44,
                      left: 0,
                      right: 0,
                      height: 26,
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
                <div style={{ marginTop: 14, fontSize: 10.5, lineHeight: 1.9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>LINKEDIN ENERGY</span>
                    <span style={{ fontWeight: 700 }}>87%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>INTERPOL ENERGY</span>
                    <span style={{ fontWeight: 700, color: BLUE }}>64%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ALIBI STRENGTH</span>
                    <span style={{ fontWeight: 700 }}>WEAK</span>
                  </div>
                </div>
                <div style={{ marginTop: 12, borderTop: '1px dashed #8a8a80', paddingTop: 10, fontSize: 10, fontStyle: 'italic', color: '#3a3a3a' }}>
                  &quot;Not guilty, but definitely launching a course soon.&quot;
                </div>
                <div style={{ position: 'relative', marginTop: 10 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      border: `2px solid ${BLUE}`,
                      color: BLUE,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.24em',
                      padding: '4px 10px',
                      transform: 'rotate(-6deg)',
                    }}
                  >
                    SUSPICIOUS
                  </span>
                </div>
              </div>
            </div>
            <div style={{ ...panelHeader, borderBottom: 'none', borderTop: `1px solid ${INK}`, color: FAINT }}>
              <span>CAM: -45DEG / ISO</span>
              <span style={{ color: BLUE }}>RES: 2048×2048</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={panelHeader}>
              <span>MANIFEST.MD</span>
              <span>V3.1</span>
            </div>
            <div style={{ padding: '30px 34px', flex: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.04em', color: BLUE }}>RAW JUDGMENT</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.9, color: '#3a3a3a', marginTop: 18 }}>
                We engineer the substrate layer that sits between your profile photo and everyone silently judging it.
                No abstractions. No mercy. Just deterministic vibe assessment, sub-12-second verdicts, and transparent
                emotional damage across every judgment node in the network.
              </p>
              <p style={{ fontSize: 12.5, lineHeight: 1.9, color: '#3a3a3a', marginTop: 14 }}>
                Founded by engineers who spent a decade being rejected at scale. We believe suspicion should be
                inspectable, auditable, and brutally measurable.
              </p>
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 0',
                  borderTop: `1px solid ${INK}`,
                  borderBottom: `1px solid ${INK}`,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                }}
              >
                <span style={{ color: BLUE }}>■</span> JUDGING FOR: {judgingFor}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  background: INK,
                  border: `1px solid ${INK}`,
                  marginTop: 22,
                }}
              >
                {(
                  [
                    ['FACES_ANALYZED', '2.7M'],
                    ['VIBE_METRICS', '12'],
                    ['VERDICTS_ISSUED', '12.8M'],
                    ['ACCURACY', 'EMOTIONAL'],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} style={{ background: CREAM, padding: 16 }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.12em', color: FAINT }}>{label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: PRICING */}
      <div id="pricing" style={{ maxWidth: 1200, margin: '110px auto 0', padding: '0 24px' }}>
        <SectionRule left="// SECTION: PRICING_TIERS" right="006" square />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginTop: 26 }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '0.02em' }}>SELECT YOUR JUDGMENT TIER</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 10, maxWidth: 420, lineHeight: 1.7 }}>
              All tiers include zero-config judgment, built-in shame, and access to the AuraNet™ inference API.
            </div>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: MUTED }}>
            <span style={{ color: BLUE }}>■</span> LIVE JUDGMENT: 28.5K VERDICTS/S
          </div>
        </div>

        <div className="priceGrid" style={{ marginTop: 28 }}>
          {/* FREE */}
          <div style={{ border: `1px solid ${INK}`, background: CREAM, display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...panelHeader, padding: '10px 16px', letterSpacing: '0.14em' }}>
              <span>FREE_TIER</span>
              <span>01</span>
            </div>
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                $0 <span style={{ fontSize: 11, fontWeight: 400, color: FAINT }}>/ FOREVER</span>
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.7 }}>
                Community-grade judgment. Rate-limited shame. No SLA.
              </div>
            </div>
            <div style={{ padding: '18px 22px', flex: 1, fontSize: 12, lineHeight: 2.2 }}>
              <div><span style={{ color: BLUE }}>✓</span> 1 suspicion scan / month</div>
              <div><span style={{ color: BLUE }}>✓</span> LinkedIn-to-Interpol ratio</div>
              <div><span style={{ color: BLUE }}>✓</span> Surface-level aura report</div>
              <div><span style={{ color: BLUE }}>✓</span> Single photo angle</div>
              <div style={{ color: '#9a9a92', textDecoration: 'line-through' }}>— Premium Truth™ (mirrored photo)</div>
              <div style={{ color: '#9a9a92', textDecoration: 'line-through' }}>— Aura Success Manager</div>
            </div>
            <ArrowCta
              label="GET JUDGED FREE"
              onClick={goLogin}
              arrowWidth={36}
              style={{ display: 'flex', margin: '0 22px 22px' }}
              spanStyle={{ flex: 1, fontSize: 11, padding: '13px 0', textAlign: 'center' }}
            />
          </div>
          {/* PRO */}
          <div
            className="proCard"
            style={{
              border: `1px solid ${INK}`,
              background: DARK,
              color: CREAM,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transform: 'translateY(-14px)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: BLUE,
                color: '#fff',
                fontSize: 9,
                letterSpacing: '0.22em',
                padding: '5px 14px',
              }}
            >
              POPULAR
            </div>
            <div style={{ ...panelHeader, padding: '10px 16px', letterSpacing: '0.14em', borderBottom: '1px solid #3a3a3a', color: FAINT }}>
              <span>PRO_TIER</span>
              <span>02</span>
            </div>
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ fontSize: 40, fontWeight: 700 }}>
                ${PREMIUM_PRICE} <span style={{ fontSize: 11, fontWeight: 400, color: FAINT }}>/ MO</span>
              </div>
              <div style={{ fontSize: 11, color: '#9a9a9a', marginTop: 8, lineHeight: 1.7 }}>
                Production-grade judgment. Sub-12s verdicts. 99.99% shame uptime SLA.
              </div>
            </div>
            <div style={{ padding: '18px 22px', flex: 1, fontSize: 12, lineHeight: 2.2 }}>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Unlimited suspicion scans</div>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Premium Truth™ (mirrored photo)</div>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Guaranteed +{IMPROVEMENT_PERCENT}% profile improvement</div>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Deep Alibi Analysis</div>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Founder Delusion Layer 2</div>
              <div><span style={{ color: BLUE_SOFT }}>✓</span> Priority judgment queue</div>
            </div>
            <ArrowCta
              label="START GETTING JUDGED"
              onClick={goLogin}
              arrowWidth={36}
              hoverClass="hovBgBlueWhite"
              style={{ display: 'flex', margin: '0 22px 22px' }}
              spanStyle={{ flex: 1, background: CREAM, color: INK, fontSize: 11, padding: '13px 0', textAlign: 'center', fontWeight: 600 }}
            />
          </div>
          {/* ENTERPRISE */}
          <div style={{ border: `1px solid ${INK}`, background: CREAM, display: 'flex', flexDirection: 'column' }}>
            <div style={{ ...panelHeader, padding: '10px 16px', letterSpacing: '0.14em' }}>
              <span>ENTERPRISE</span>
              <span>03</span>
            </div>
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ fontSize: 40, fontWeight: 700 }}>CUSTOM</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.7 }}>
                Air-gapped judgment. On-prem shame. Full operational control.
              </div>
            </div>
            <div style={{ padding: '18px 22px', flex: 1, fontSize: 12, lineHeight: 2.2 }}>
              <div><span style={{ color: BLUE }}>✓</span> Bulk Suspicion API</div>
              <div><span style={{ color: BLUE }}>✓</span> HR comparison dashboard</div>
              <div><span style={{ color: BLUE }}>✓</span> Custom Interpol Energy thresholds</div>
              <div><span style={{ color: BLUE }}>✓</span> Dedicated Aura Success Manager</div>
            </div>
            <ArrowCta
              label="CONTACT SALES"
              onClick={goLogin}
              arrowWidth={36}
              style={{ display: 'flex', margin: '0 22px 22px' }}
              spanStyle={{ flex: 1, fontSize: 11, padding: '13px 0', textAlign: 'center' }}
            />
          </div>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: FAINT, marginTop: 20 }}>
          * ALL PLANS BILLED EMOTIONALLY. CANCEL ANYTIME. THE SHAME REMAINS.
        </div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{ maxWidth: 1200, margin: '110px auto 0', padding: '0 24px' }}>
        <SectionRule left="// SECTION: FAQ_PROTOCOL" right="007" />
        <div style={{ border: `1px solid ${INK}`, borderBottom: 'none', marginTop: 16 }}>
          {FAQ.map((item, i) => (
            <div key={item.q} style={{ borderBottom: `1px solid ${INK}` }}>
              <button
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                className="hovTextBlue"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: 'left',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  color: INK,
                }}
              >
                <span>{item.q}</span>
                <span style={{ color: BLUE }}>{faqOpen === i ? '[−]' : '[+]'}</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: '0 20px 18px', fontSize: 12, color: '#3a3a3a', lineHeight: 1.8 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MEDIA STRIP */}
      <div style={{ maxWidth: 1200, margin: '110px auto 0', padding: '0 24px' }}>
        <SectionRule left="// PARTNERS: AS_SEEN_IN" right="008" />
        <div className="mediaGrid" style={{ border: `1px solid ${INK}`, marginTop: 16 }}>
          {['FORBES', 'TECHCRUNCH', 'BLOOMBERG', 'WIRED', 'RBC', 'THE VERGE'].map((outlet, i, arr) => (
            <div
              key={outlet}
              style={{
                padding: '20px 8px',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.14em',
                borderRight: i < arr.length - 1 ? `1px solid ${INK}` : undefined,
              }}
            >
              {outlet}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: FAINT, marginTop: 12 }}>
          * NONE OF THESE OUTLETS HAVE HEARD OF US
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${INK}`, marginTop: 110 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '34px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            fontSize: 10,
            letterSpacing: '0.14em',
            color: MUTED,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: INK, fontSize: 12 }}>SUSMETER.AI</div>
            <div style={{ marginTop: 8 }}>(C) 2026 SUSPICION INTELLIGENCE CORP.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>
              <span style={{ color: BLUE }}>■</span> {engineStatus}
            </div>
            <div style={{ marginTop: 8 }}>PRIVACY · TERMS · WE ARE NOT INTERPOL*</div>
          </div>
        </div>
      </div>
    </div>
  );
}
