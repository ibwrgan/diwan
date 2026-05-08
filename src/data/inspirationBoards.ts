// Diwan-curated inspiration boards. Each is a small set of styled cards that
// communicate the design direction. On Day 5+ these can be augmented with
// AI-generated reference photos. The art tokens reuse the same gradient
// vocabulary as the quiz panels.

import {artTreatments} from './quiz';

export type InspirationBoard = {
  id: string;
  name: string;             // bilingual key under Space.boards.<id>
  artKeys: string[];        // 3 art panel keys per board (gradient backgrounds)
  vector: {style: number; warmth: number; density: number; formality: number; regional: number};
};

export const INSPIRATION_BOARDS: InspirationBoard[] = [
  {
    id: 'modern-najdi',
    name: 'modernNajdi',
    artKeys: ['najdi-warm', 'najdi-geom', 'clay-brass'],
    vector: {style: -0.3, warmth: 0.6, density: 0.3, formality: 0.4, regional: -0.7},
  },
  {
    id: 'coastal-hijazi',
    name: 'coastalHijazi',
    artKeys: ['hijazi-light', 'bright-morn', 'open-living'],
    vector: {style: 0.2, warmth: 0.0, density: -0.2, formality: -0.2, regional: 0.7},
  },
  {
    id: 'riyadh-contemporary',
    name: 'riyadhContemporary',
    artKeys: ['stone-cool', 'spare-craft', 'quiet-workshop'],
    vector: {style: 0.7, warmth: -0.3, density: -0.4, formality: 0.1, regional: 0.0},
  },
  {
    id: 'cocoon',
    name: 'cocoon',
    artKeys: ['cocoon', 'long-evening', 'ink-stone'],
    vector: {style: -0.1, warmth: 0.5, density: 0.6, formality: 0.5, regional: 0.0},
  },
  {
    id: 'open-living',
    name: 'openLiving',
    artKeys: ['open-living', 'daylight-bed', 'bright-morn'],
    vector: {style: 0.4, warmth: 0.0, density: -0.4, formality: -0.5, regional: 0.3},
  },
  {
    id: 'workshop-quiet',
    name: 'workshopQuiet',
    artKeys: ['quiet-workshop', 'spare-craft', 'stone-cool'],
    vector: {style: 0.6, warmth: -0.4, density: -0.3, formality: 0.2, regional: 0.0},
  },
];

export {artTreatments};
