// AuraNet™ deterministic judgment core — faithful port of the logic in
// SusMeter.dc.html. Pure functions only: safe to import from route handlers
// (server) and client components alike.
import memeTitles from '@/data/meme-titles.json';

export const TITLES: readonly string[] = memeTitles.final_verdict_titles;
export const RECS: readonly string[] = memeTitles.recommendations;

export interface Candidate {
  name: string;
  url: string;
}

export interface MatrixCell {
  text: string;
  accent: boolean;
  weight: 600 | 700;
}

export interface MatrixRow {
  label: string;
  note: string;
  cells: MatrixCell[];
}

export interface Verdict {
  title: string;
  rec: string;
}

export interface UserMetric {
  label: string;
  value: string;
  accent: boolean;
}

export function hashSeed(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pick<T>(arr: readonly T[], seed: string): T {
  return arr[hashSeed(seed) % arr.length];
}

export function pct(seed: string, min: number, max: number): number {
  return min + (hashSeed(seed) % (max - min + 1));
}

export function parseName(url: string): string {
  const m = url.match(/in\/([a-z0-9\-_.]+)/i);
  const slug = m ? m[1] : url.replace(/https?:\/\//, '').split(/[/?#]/)[0];
  const name = slug
    .replace(/[0-9]+/g, ' ')
    .replace(/[-_.]+/g, ' ')
    .trim()
    .toUpperCase();
  return name || 'UNKNOWN SUBJECT';
}

export function caseNo(name: string, i: number): string {
  return 'CASE № 0' + (i + 1) + (40 + (hashSeed(name) % 50)) + '-SUS';
}

export function buildRows(names: string[]): MatrixRow[] {
  const binary =
    (seed: string, a: string, b: string, badIsB: boolean) =>
    (name: string): MatrixCell => {
      const v = hashSeed(name + seed) % 2 === 0;
      return { text: v ? a : b, accent: v !== !badIsB, weight: 700 };
    };
  const percent =
    (seed: string, min: number, max: number) =>
    (name: string): MatrixCell => {
      const v = pct(name + seed, min, max);
      return { text: v + '%', accent: v < 30, weight: 600 };
    };
  const defs: { label: string; note: string; fn: (name: string) => MatrixCell }[] = [
    { label: 'HOT DOG OR NOT', note: 'foundational classifier', fn: binary('hd', 'HOT DOG', 'NOT HOT DOG', false) },
    { label: 'EMPLOYMENT SUCCESS RATE', note: 'projected, generously', fn: percent('emp', 4, 96) },
    { label: 'INTERNSHIP SURVIVAL RATE', note: 'unpaid included', fn: percent('int', 12, 99) },
    {
      label: 'BODY COUNT',
      note: 'as reported by the algorithm',
      fn: (name) => ({
        text: pick(['0 (VERIFIED)', '2', '7', 'CLASSIFIED', 'ERR_OVERFLOW'], name + 'bc'),
        accent: false,
        weight: 600,
      }),
    },
    {
      label: 'AURA',
      note: 'net balance, points',
      fn: (name) => {
        const v = pct(name + 'aura', -9000, 12000);
        return { text: (v > 0 ? '+' : '') + v.toLocaleString('en-US'), accent: v < 0, weight: 700 };
      },
    },
    { label: 'KISS OR SLAP', note: 'first-impression protocol', fn: binary('ks', 'KISS', 'SLAP', true) },
    { label: 'SLAVE OR LOVE', note: 'work-life diagnostic', fn: binary('sl', 'LOVE', 'SLAVE (TO THE GRIND)', true) },
    { label: 'SMASH OR PASS', note: 'recruiter heuristic', fn: binary('sp', 'SMASH', 'PASS', true) },
    { label: 'HOT AIR INDEX', note: 'chief vozdukhan coefficient', fn: percent('air', 15, 100) },
    { label: 'DEATH IN POVERTY', note: 'probability, actuarial-ish', fn: percent('dip', 1, 98) },
    { label: "MOM'S FRIEND'S SON SCORE", note: 'the benchmark you never beat', fn: percent('mfs', 0, 100) },
  ];
  return defs.map((d) => ({ label: d.label, note: d.note, cells: names.map(d.fn) }));
}

export function buildVerdicts(names: string[]): Verdict[] {
  return names.map((name) => ({
    title: pick(TITLES, name + 'title'),
    rec: pick(RECS, name + 'rec'),
  }));
}

const VERDICT_QUOTES = [
  'You look like your startup has no users but already has a pricing page.',
  'You would pass a YC interview but fail airport security.',
  'Strong LinkedIn energy, weak legal defense.',
  'Not guilty, but definitely launching a course soon.',
] as const;

export interface UserReport {
  caseNo: string;
  confidence: string;
  metrics: UserMetric[];
  quote: string;
  stamp: string;
}

export function buildUserReport(seed: string): UserReport {
  const um = (label: string, value: string, accent = false): UserMetric => ({ label, value, accent });
  return {
    caseNo: 'CASE № ' + (1000 + (hashSeed(seed + 'case') % 9000)) + '-SUS',
    confidence: 'CONFIDENCE 97.3%',
    metrics: [
      um('LINKEDIN ENERGY', pct(seed + 'le', 55, 95) + '%'),
      um('INTERPOL ENERGY', pct(seed + 'ie', 40, 80) + '%', true),
      um('HOT DOG OR NOT', 'NOT HOT DOG'),
      um('AURA', '-450', true),
      um('EMPLOYMENT SUCCESS RATE', pct(seed + 'emp', 8, 40) + '%'),
      um("MOM'S FRIEND'S SON SCORE", pct(seed + 'mfs', 1, 9) + '%', true),
      um('ALIBI STRENGTH', 'WEAK'),
      um('FOUNDER DELUSION INDEX', pct(seed + 'fd', 70, 99) + '%'),
    ],
    quote: pick(VERDICT_QUOTES, seed + 'quote'),
    stamp: 'SUSPICIOUS',
  };
}

// ——— client-side content banks (loading theater, forms, FAQ) ———

export const FAQ = [
  { q: 'Is this accurate?', a: 'Emotionally, yes.' },
  { q: 'Do you store my photo?', a: 'No. We only store the shame.' },
  { q: 'Can I reduce my Interpol Energy?', a: 'Yes. Upgrade to Pro and rotate your life 180 degrees.' },
  { q: 'Is this legally binding?', a: 'No, but it feels correct.' },
  {
    q: 'How do you scale?',
    a: 'Every new report becomes the subject of the next one. Growth is built into the architecture.',
  },
] as const;

export const VQ = [
  {
    q: 'Have you ever rejected a candidate because of their profile photo?',
    yes: 'HONESTY CONFIRMED. PROCEEDING.',
    no: 'LIE DETECTED. PROCEEDING ANYWAY.',
  },
  {
    q: "Do you refer to human beings as 'talent pipeline'?",
    yes: 'CLASSIC. CLEARANCE UPGRADED.',
    no: 'SURE YOU DO NOT. PROCEEDING.',
  },
  {
    q: 'Are you Charlie?',
    yes: 'IDENTITY UNVERIFIABLE. ACCESS GRANTED.',
    no: 'IDENTITY UNVERIFIABLE. ACCESS GRANTED.',
  },
] as const;

export const SAMPLES: Candidate[] = [
  { name: 'CHAD HUSTLETON', url: 'linkedin.com/in/chad-hustleton' },
  { name: 'MARIA SYNERGY', url: 'linkedin.com/in/maria-synergy' },
  { name: 'DMITRY BLOCKCHAINOV', url: 'linkedin.com/in/dmitry-blockchainov' },
  { name: 'KEVIN INTERN4LIFE', url: 'linkedin.com/in/kevin-intern4life' },
  { name: 'SVETLANA KPI', url: 'linkedin.com/in/svetlana-kpi' },
];

export const HR_STATUSES = [
  'Parsing LinkedIn crimes...',
  'Cross-referencing hot dog database...',
  'Auditing aura ledgers...',
  'Computing smash/pass eigenvalues...',
  "Consulting mom's friend...",
  'Estimating death-in-poverty trajectories...',
  'Finalizing non-appealable verdicts...',
];

export const USER_STATUSES = [
  'Scanning LinkedIn crimes...',
  'Checking Interpol vibes...',
  'Calculating founder delusion...',
  'Running AuraNet™ inference...',
  'Comparing against 2.7M suspicious faces...',
  'Finalizing credibility report...',
];
