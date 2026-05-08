// Diwan taste-vector quiz — structure shared between client & AI pipeline
// Five axes, each from -1 to 1. The Claude API call on Day 5 reads this profile.

export type TasteAxis = 'style' | 'warmth' | 'density' | 'formality' | 'regional';
export type TasteVector = Record<TasteAxis, number>;

export const ZERO_VECTOR: TasteVector = {
  style: 0,
  warmth: 0,
  density: 0,
  formality: 0,
  regional: 0,
};

export type VisualABOption = {
  // Identifies the gradient/treatment used in <VisualAB />. Must match a key in artTreatments.
  art: string;
  // Partial taste-vector delta applied when this option is picked.
  vector: Partial<TasteVector>;
};

export type Question =
  | {
      type: 'visualAB';
      id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8';
      optionA: VisualABOption;
      optionB: VisualABOption;
    }
  | {
      type: 'range';
      id: 'q9' | 'q10';
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      formatter: 'sar' | 'weeks';
    }
  | {
      type: 'multiSelect';
      id: 'q11';
      optionKeys: string[];
    }
  | {
      type: 'singleSelect';
      id: 'q12';
      options: {key: string; vector: Partial<TasteVector>}[];
    };

export const QUIZ: Question[] = [
  // 1 — Modern Najdi vs Riyadh Contemporary
  {
    type: 'visualAB',
    id: 'q1',
    optionA: {art: 'najdi-warm',  vector: {style: -0.4, regional: -0.6, density: 0.2,  warmth: 0.3}},
    optionB: {art: 'stone-cool',  vector: {style: 0.6,  regional: 0,    density: -0.4, warmth: -0.2}},
  },
  // 2 — Warm clay & brass vs Cool stone & ink
  {
    type: 'visualAB',
    id: 'q2',
    optionA: {art: 'clay-brass',  vector: {warmth: 0.7, density: 0.2,  formality: 0.3}},
    optionB: {art: 'ink-stone',   vector: {warmth: -0.6, density: -0.3, formality: 0.2}},
  },
  // 3 — Layered & rich vs Spare & crafted
  {
    type: 'visualAB',
    id: 'q3',
    optionA: {art: 'layered-rugs', vector: {density: 0.7, style: -0.2, warmth: 0.3}},
    optionB: {art: 'spare-craft',  vector: {density: -0.7, style: 0.4}},
  },
  // 4 — Najdi geometry vs Hijazi openness
  {
    type: 'visualAB',
    id: 'q4',
    optionA: {art: 'najdi-geom',   vector: {regional: -0.7, style: -0.3, density: 0.2}},
    optionB: {art: 'hijazi-light', vector: {regional: 0.7,  style: 0.2,  warmth: 0.1}},
  },
  // 5 — Formal majlis vs Open living
  {
    type: 'visualAB',
    id: 'q5',
    optionA: {art: 'formal-majlis', vector: {formality: 0.8, density: 0.3}},
    optionB: {art: 'open-living',   vector: {formality: -0.6, density: -0.2, style: 0.3}},
  },
  // 6 — Cocoon bedroom vs Quiet daylight
  {
    type: 'visualAB',
    id: 'q6',
    optionA: {art: 'cocoon',       vector: {warmth: 0.5, density: 0.5, formality: 0.2}},
    optionB: {art: 'daylight-bed', vector: {warmth: -0.3, density: -0.4, style: 0.3}},
  },
  // 7 — Long evenings vs Bright mornings (dining)
  {
    type: 'visualAB',
    id: 'q7',
    optionA: {art: 'long-evening', vector: {warmth: 0.4, formality: 0.5, density: 0.3}},
    optionB: {art: 'bright-morn',  vector: {warmth: -0.2, formality: -0.3, style: 0.3}},
  },
  // 8 — Warm hub kitchen vs Quiet workshop
  {
    type: 'visualAB',
    id: 'q8',
    optionA: {art: 'warm-hub',      vector: {warmth: 0.5, density: 0.4, formality: -0.2}},
    optionB: {art: 'quiet-workshop',vector: {warmth: -0.4, density: -0.5, style: 0.5}},
  },
  // 9 — Budget (range, no taste-vector contribution)
  {
    type: 'range',
    id: 'q9',
    min: 60_000,
    max: 500_000,
    step: 5_000,
    defaultValue: 150_000,
    formatter: 'sar',
  },
  // 10 — Timeline (weeks)
  {
    type: 'range',
    id: 'q10',
    min: 4,
    max: 16,
    step: 1,
    defaultValue: 8,
    formatter: 'weeks',
  },
  // 11 — Must-haves (multi-select; affects program, not vector)
  {
    type: 'multiSelect',
    id: 'q11',
    optionKeys: ['majlis', 'prayer', 'segregated', 'kids', 'accessibility', 'study', 'guest', 'outdoor'],
  },
  // 12 — Color receptivity (single-select; influences warmth axis directly)
  {
    type: 'singleSelect',
    id: 'q12',
    options: [
      {key: 'muted',   vector: {warmth: -0.5, density: -0.3}},
      {key: 'warm',    vector: {warmth: 0.6,  density: 0.2}},
      {key: 'deep',    vector: {warmth: 0.2,  density: 0.4, formality: 0.4}},
      {key: 'vibrant', vector: {warmth: 0.7,  density: 0.5, style: 0.2}},
    ],
  },
];

// Visual treatments for the A/B cards. Inline-CSS gradients (Tailwind safelist
// is unreliable for dynamic classes from data files). On Day 5 these can be
// swapped to AI-generated reference photographs without changing the data shape.
export type ArtTreatment = {
  bg: string;        // CSS background gradient
  motif: 'arch' | 'grid' | 'horizon' | 'rays' | 'block';
};

// Hex tokens (kept in sync with tailwind.config.ts)
const C = {
  clay700: '#B8552E',
  clay400: '#D9886B',
  brass500: '#B89968',
  evening600: '#3D4A6B',
  midnight950: '#1A1F2E',
  sand100: '#F4EFE6',
  bone: '#FAFAF7',
  limestone200: '#DDD3C3',
};

export const artTreatments: Record<string, ArtTreatment> = {
  'najdi-warm':     {bg: `linear-gradient(135deg, ${C.clay700} 0%, ${C.clay400} 55%, ${C.brass500} 100%)`,                                motif: 'arch'},
  'stone-cool':     {bg: `linear-gradient(135deg, ${C.limestone200} 0%, ${C.bone} 50%, ${C.sand100} 100%)`,                              motif: 'horizon'},
  'clay-brass':     {bg: `linear-gradient(45deg, ${C.clay700} 0%, ${C.brass500} 55%, ${C.clay400} 100%)`,                                motif: 'rays'},
  'ink-stone':      {bg: `linear-gradient(135deg, ${C.midnight950} 0%, ${C.evening600} 50%, ${C.limestone200} 100%)`,                    motif: 'block'},
  'layered-rugs':   {bg: `linear-gradient(225deg, ${C.clay400} 0%, ${C.brass500} 50%, ${C.clay700} 100%)`,                               motif: 'grid'},
  'spare-craft':    {bg: `linear-gradient(135deg, ${C.bone} 0%, ${C.sand100} 50%, ${C.limestone200} 100%)`,                              motif: 'block'},
  'najdi-geom':     {bg: `linear-gradient(135deg, ${C.clay700} 0%, ${C.brass500} 100%)`,                                                  motif: 'grid'},
  'hijazi-light':   {bg: `linear-gradient(135deg, ${C.bone} 0%, ${C.limestone200} 60%, ${C.brass500}66 100%)`,                            motif: 'arch'},
  'formal-majlis':  {bg: `linear-gradient(135deg, ${C.midnight950} 0%, ${C.evening600} 50%, ${C.clay700}99 100%)`,                        motif: 'arch'},
  'open-living':    {bg: `linear-gradient(135deg, ${C.sand100} 0%, ${C.bone} 50%, ${C.limestone200} 100%)`,                              motif: 'horizon'},
  'cocoon':         {bg: `linear-gradient(135deg, ${C.midnight950} 0%, ${C.clay700} 60%, ${C.brass500}66 100%)`,                          motif: 'rays'},
  'daylight-bed':   {bg: `linear-gradient(135deg, ${C.bone} 0%, ${C.sand100} 50%, ${C.limestone200} 100%)`,                              motif: 'horizon'},
  'long-evening':   {bg: `linear-gradient(135deg, ${C.midnight950} 0%, ${C.clay700} 55%, ${C.brass500} 100%)`,                            motif: 'rays'},
  'bright-morn':    {bg: `linear-gradient(45deg, ${C.bone} 0%, ${C.limestone200} 50%, ${C.sand100} 100%)`,                               motif: 'horizon'},
  'warm-hub':       {bg: `linear-gradient(135deg, ${C.clay400} 0%, ${C.brass500} 55%, ${C.clay700}B3 100%)`,                              motif: 'block'},
  'quiet-workshop': {bg: `linear-gradient(135deg, ${C.limestone200} 0%, ${C.bone} 55%, ${C.evening600}33 100%)`,                          motif: 'grid'},
};

export type Answer =
  | {type: 'visualAB'; id: Question['id']; choice: 'A' | 'B'}
  | {type: 'range'; id: Question['id']; value: number}
  | {type: 'multiSelect'; id: Question['id']; selected: string[]}
  | {type: 'singleSelect'; id: Question['id']; key: string};

export type QuizState = {
  currentIndex: number;
  answers: Record<string, Answer>;
  startedAt: number;
  completedAt: number | null;
};

export const INITIAL_STATE: QuizState = {
  currentIndex: 0,
  answers: {},
  startedAt: 0,
  completedAt: null,
};

export function computeTasteVector(answers: Record<string, Answer>): TasteVector {
  const v = {...ZERO_VECTOR};
  for (const a of Object.values(answers)) {
    const q = QUIZ.find((x) => x.id === a.id);
    if (!q) continue;
    if (a.type === 'visualAB' && q.type === 'visualAB') {
      const opt = a.choice === 'A' ? q.optionA : q.optionB;
      for (const [k, val] of Object.entries(opt.vector)) {
        v[k as TasteAxis] += val ?? 0;
      }
    } else if (a.type === 'singleSelect' && q.type === 'singleSelect') {
      const opt = q.options.find((o) => o.key === a.key);
      if (opt) for (const [k, val] of Object.entries(opt.vector)) v[k as TasteAxis] += val ?? 0;
    }
  }
  // Clamp to [-1, 1] and normalize roughly by # of contributing answers.
  for (const k of Object.keys(v) as TasteAxis[]) {
    v[k] = Math.max(-1, Math.min(1, v[k] / 3));
  }
  return v;
}
