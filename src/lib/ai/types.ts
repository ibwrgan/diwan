// Shared shapes between the API route, the AI orchestrator, and the
// client-side design store / review screens (Day 6).

import type {RoomType} from '@/data/roomTypes';
import type {TasteVector} from '@/data/quiz';

export type DesignBrief = {
  // High-level direction
  name: string;          // e.g. "Modern Najdi" — bilingual when generated; English in mock
  nameAr?: string;
  tagline: string;
  paletteHex: string[];  // 4-6 colors
  styleAdjectives: string[];

  // Room-by-room
  rooms: Array<{
    roomId: string;       // matches TaggedRoom.id
    roomType: RoomType;
    roomLabel: string;
    description: string;  // ~30-40 words about the room's design
    materials: string[];  // e.g. ["walnut", "travertine", "brass"]
    skuIds: string[];     // matched SKUs from the catalog
    imagePrompt: string;  // prompt for the renderer
    imageUrl: string | null; // populated after Replicate (or mock URL)
  }>;
};

export type PipelineRequest = {
  taste: TasteVector;
  inspirations: {
    boardIds: string[];
    pinterestUrls: string[];
    uploadCount: number;
  };
  budget: number;        // SAR
  timelineWeeks: number;
  rooms: Array<{
    id: string;
    type: RoomType;
    label: string;
    widthM: number;
    heightM: number;
  }>;
  mustHaves: string[];   // q11 multi-select keys
  colorVoice: string;    // q12 key
};

export type PipelineProgress =
  | {phase: 'brief';     pct: number}
  | {phase: 'render';    pct: number; roomIndex?: number}
  | {phase: 'skuMatch';  pct: number}
  | {phase: 'quote';     pct: number}
  | {phase: 'review';    pct: number}
  | {phase: 'done';      pct: 100}
  | {phase: 'error';     pct: number; error: string};

export type GeneratedDesigns = {
  generatedAt: number;
  durationMs: number;
  source: 'live' | 'mock';
  designs: DesignBrief[];
};
