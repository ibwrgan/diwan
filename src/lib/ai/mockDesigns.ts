// Mock design generator. Used when API keys are absent (demo mode) so the
// pitch can run without ANTHROPIC_API_KEY / REPLICATE_API_TOKEN. The shape
// matches the live pipeline so the rest of the app doesn't care.

import {SKUS} from '@/data/products';
import type {RoomType} from '@/data/roomTypes';
import type {DesignBrief, PipelineRequest, GeneratedDesigns} from './types';
import {artTreatments} from '@/data/quiz';

type Concept = {
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  palette: string[];
  styleAdjectives: string[];
  styleTags: string[];        // for SKU filtering
  artForRoom: Record<string, string>; // roomType -> artTreatment key
  fallbackArt: string;
};

const CONCEPTS: Concept[] = [
  {
    name: 'Modern Najdi',
    nameAr: 'نجدي معاصر',
    tagline: 'Carved geometry, warm earth, and a quiet ceremonial weight.',
    taglineAr: 'هندسة محفورة، ألوان ترابية، ووقار هادئ.',
    palette: ['#B8552E', '#B89968', '#1A1F2E', '#F4EFE6', '#1F1A14'],
    styleAdjectives: ['Carved', 'Layered', 'Warm', 'Grounded'],
    styleTags: ['najdi', 'warm', 'layered'],
    artForRoom: {
      'majlis-men': 'najdi-warm',
      'majlis-women': 'najdi-geom',
      'family-living': 'clay-brass',
      'master-bedroom': 'cocoon',
      'kids-bedroom': 'najdi-warm',
      'kitchen': 'warm-hub',
      'dining': 'long-evening',
      'office': 'najdi-geom',
      'prayer': 'najdi-warm',
      'gaming': 'cocoon',
      'guest': 'najdi-geom',
      'outdoor': 'open-living',
      'bathroom': 'clay-brass',
      'storage': 'spare-craft',
    } as Record<RoomType, string>,
    fallbackArt: 'najdi-warm',
  },
  {
    name: 'Coastal Hijazi',
    nameAr: 'حجازي ساحلي',
    tagline: 'Pale wood, daylight, and the airiness of an open Hijazi room.',
    taglineAr: 'خشب فاتح، نهار، وانفتاح حجازي.',
    palette: ['#DDD3C3', '#B89968', '#3D4A6B', '#FAFAF7', '#1F1A14'],
    styleAdjectives: ['Airy', 'Light', 'Crafted', 'Open'],
    styleTags: ['hijazi', 'cool', 'minimal'],
    artForRoom: {
      'majlis-men': 'hijazi-light',
      'majlis-women': 'bright-morn',
      'family-living': 'open-living',
      'master-bedroom': 'daylight-bed',
      'kids-bedroom': 'bright-morn',
      'kitchen': 'quiet-workshop',
      'dining': 'bright-morn',
      'office': 'spare-craft',
      'prayer': 'open-living',
      'gaming': 'daylight-bed',
      'guest': 'hijazi-light',
      'outdoor': 'open-living',
      'bathroom': 'stone-cool',
      'storage': 'quiet-workshop',
    } as Record<RoomType, string>,
    fallbackArt: 'hijazi-light',
  },
  {
    name: 'Riyadh Contemporary',
    nameAr: 'رياضي معاصر',
    tagline: 'Linen, limestone, and the discipline of negative space.',
    taglineAr: 'كتّان، حجر، وانضباط الفراغ.',
    palette: ['#F4EFE6', '#DDD3C3', '#3D4A6B', '#1A1F2E', '#1F1A14'],
    styleAdjectives: ['Spare', 'Composed', 'Quiet', 'Refined'],
    styleTags: ['contemporary', 'cool', 'minimal'],
    artForRoom: {
      'majlis-men': 'stone-cool',
      'majlis-women': 'spare-craft',
      'family-living': 'spare-craft',
      'master-bedroom': 'daylight-bed',
      'kids-bedroom': 'bright-morn',
      'kitchen': 'quiet-workshop',
      'dining': 'ink-stone',
      'office': 'spare-craft',
      'prayer': 'stone-cool',
      'gaming': 'ink-stone',
      'guest': 'stone-cool',
      'outdoor': 'open-living',
      'bathroom': 'stone-cool',
      'storage': 'quiet-workshop',
    } as Record<RoomType, string>,
    fallbackArt: 'stone-cool',
  },
];

function pickSkus(roomType: RoomType, styleTags: string[], maxItems = 4): string[] {
  // Score each SKU by category fit + style match; return top N.
  const candidates = SKUS.filter((s) => s.forRooms.includes(roomType));
  const scored = candidates.map((s) => {
    const matches = s.styleTags.filter((t) => styleTags.includes(t)).length;
    return {sku: s, score: matches + (s.forRooms[0] === roomType ? 0.5 : 0) + Math.random() * 0.3};
  });
  scored.sort((a, b) => b.score - a.score);
  // Distinct categories (don't return 4 sofas)
  const seenCat = new Set<string>();
  const picked: string[] = [];
  for (const {sku} of scored) {
    if (seenCat.has(sku.category)) continue;
    seenCat.add(sku.category);
    picked.push(sku.id);
    if (picked.length >= maxItems) break;
  }
  return picked;
}

function describeRoom(roomType: RoomType, concept: Concept): string {
  const baseDescriptions: Partial<Record<RoomType, string>> = {
    'majlis-men':     `${concept.styleAdjectives[0]} ${concept.styleAdjectives[3].toLowerCase()} men's majlis with ${concept.palette[0].toLowerCase()} accents and ${concept.styleAdjectives[1].toLowerCase()} layered seating around a central low table.`,
    'majlis-women':   `${concept.styleAdjectives[1]} women's majlis built around comfort, with brass details and a softer color rhythm.`,
    'family-living':  `Open family living anchored by a generous sectional, ${concept.styleAdjectives[2].toLowerCase()} lighting, and tactile rugs underfoot.`,
    'master-bedroom': `${concept.styleAdjectives[0]} master suite — ${concept.palette[1]} headboard wall, fitted joinery, and a quiet color story.`,
    'kids-bedroom':   `Kids' room with built-in storage, soft palette, and a desk that grows with the child.`,
    'kitchen':        `Working kitchen — ${concept.palette[1]} cabinetry, integrated appliances, an island that doubles as breakfast counter.`,
    'dining':         `Dining around a long ${concept.styleAdjectives[0].toLowerCase()} table, ceiling pendant cluster casting evening warmth.`,
    'office':         `Quiet study — fitted shelving, a writing desk, and a single armchair for reading.`,
    'prayer':         `Small dedicated prayer corner, qibla-aligned, with woven rug and a recessed niche.`,
    'gaming':         `Media room with deep seating, acoustic panels, and dimming controls.`,
    'guest':          `Self-contained guest suite — bed, sitting nook, and an en-suite bathroom.`,
    'outdoor':        `Terrace with shade structure, low seating cluster, and integrated planters.`,
    'bathroom':       `Calm bathroom — natural stone, brass fittings, walk-in shower.`,
    'storage':        `Utility space with full-height storage, a counter, and an integrated washing zone.`,
  };
  return baseDescriptions[roomType] ?? `${concept.styleAdjectives[0]} ${roomType.replace('-', ' ')}.`;
}

export async function generateMockDesigns(req: PipelineRequest, onProgress?: (p: number) => void, fast = false): Promise<GeneratedDesigns> {
  const start = Date.now();
  const waitMs = fast ? 0 : 120;
  const stepWaitMs = fast ? 0 : 60;
  // Simulate the pipeline visibly for the demo.
  const totalSteps = CONCEPTS.length * (req.rooms.length + 2);
  let stepsDone = 0;
  const tick = () => {
    stepsDone++;
    onProgress?.(Math.min(99, Math.round((stepsDone / totalSteps) * 100)));
  };

  const designs: DesignBrief[] = [];
  for (const concept of CONCEPTS) {
    // Brief
    await wait(waitMs);
    tick();

    const rooms = req.rooms.map((r) => {
      const art = concept.artForRoom[r.type] ?? concept.fallbackArt;
      const skuIds = pickSkus(r.type, concept.styleTags);
      return {
        roomId: r.id,
        roomType: r.type,
        roomLabel: r.label,
        description: describeRoom(r.type, concept),
        materials: extractMaterials(skuIds),
        skuIds,
        imagePrompt: `Photorealistic interior of a ${r.type.replace('-', ' ')} in the ${concept.name} style, ${concept.styleAdjectives.join(', ').toLowerCase()}.`,
        imageUrl: `gradient:${art}`, // sentinel — client renders artTreatments[art].bg
      };
    });

    // Per-room render simulation
    for (let i = 0; i < rooms.length; i++) {
      await wait(stepWaitMs);
      tick();
    }
    // SKU match + quote phases
    await wait(waitMs);
    tick();

    designs.push({
      name: concept.name,
      nameAr: concept.nameAr,
      tagline: concept.tagline,
      paletteHex: concept.palette,
      styleAdjectives: concept.styleAdjectives,
      rooms,
    });
  }

  onProgress?.(100);

  return {
    generatedAt: Date.now(),
    durationMs: Date.now() - start,
    source: 'mock',
    designs,
  };
}

function extractMaterials(skuIds: string[]): string[] {
  const out = new Set<string>();
  for (const id of skuIds) {
    const sku = SKUS.find((s) => s.id === id);
    if (!sku) continue;
    // crude extraction from the name
    for (const word of ['walnut', 'travertine', 'brass', 'linen', 'cane', 'velvet', 'cedar', 'marble', 'wool', 'stone']) {
      if (sku.name.toLowerCase().includes(word)) out.add(word);
    }
  }
  return [...out].slice(0, 4);
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Re-export so the client can resolve the gradient sentinel
export {artTreatments};
