#!/usr/bin/env node
// Generates Diwan-styled photos for case studies and inspiration sets
// using Replicate (Flux). Reads keys from .env.local.
//
// Usage:  npm run generate-photos
//         npm run generate-photos -- --force            (regenerate even if files exist)
//         npm run generate-photos -- --only=projects    (just case studies)
//         npm run generate-photos -- --only=inspirations
//
// Cost at current Replicate pricing:
//   Flux 1.1 Pro  ≈ $0.04/image  (used for case-study heroes — 8 photos ≈ $0.32)
//   Flux Schnell  ≈ $0.003/image (used for inspiration responses — 18 photos ≈ $0.06)
//   Total ≈ $0.40

import Replicate from 'replicate';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname} from 'node:path';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) {
  console.error('\n❌  REPLICATE_API_TOKEN not set.\n   Add it to .env.local in the project root, then re-run.\n');
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const ONLY = [...args].find((a) => a.startsWith('--only='))?.split('=')[1];

const replicate = new Replicate({auth: TOKEN});

// -----------------------------------------------------------------------------
// Case studies — one hero photo each (used on /projects cards + modal hero)
// -----------------------------------------------------------------------------

const PROJECTS = [
  {
    id: 'najdi-villa-nakheel',
    prompt:
      "Editorial photograph of a contemporary Saudi villa men's majlis in Modern Najdi style. " +
      "Layered low seating in clay velvet around the perimeter. Carved cedar mashrabiya screens. " +
      "Najdi-pattern wool rug in the centre. Brass pendant cluster overhead. Walnut and travertine. " +
      "Warm directional natural light from a single high window. Architectural interior photography, " +
      "35mm, soft contrast, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'coastal-jeddah-corniche',
    prompt:
      "Editorial photograph of a Hijazi-coastal apartment living interior in Jeddah. " +
      "Pale ash floors. Travertine 6-seat dining table beside an open kitchen. Linen sofa in bone. " +
      "Hijazi pale-wood shutters in front of a Red Sea view. Brass-tip ash kitchen pulls. " +
      "Soft daylight, sea breeze ambience. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'riyadh-contemporary-penthouse',
    prompt:
      "Editorial photograph of a high-floor penthouse interior in Riyadh, twenty stories above Olaya. " +
      "Limestone floors throughout. Travertine 4m sectional sofa. A single Najdi-craft sculptural bench " +
      "by the entrance. Floor-to-ceiling Hijazi shutters. Minimal, composed, quiet. " +
      "Soft directional daylight. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'cocoon-family-compound',
    prompt:
      "Editorial photograph of a Saudi family compound men's majlis interior. " +
      "16-seat ceremonial seating in deep midnight velvet. Walnut everywhere. Heavy wool rugs. " +
      "Brass-inlay accent panels behind the seating. Warm-tone evening lighting. Najdi craft details. " +
      "Architectural interior photography, dramatic shadows, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'open-living-3br-villa',
    prompt:
      "Editorial photograph of a Saudi family open-plan living interior. " +
      "3-metre oak kitchen island as social anchor with seating for six. Stain-resistant linen sectional " +
      "in family-room area. Pale ash floors. Hijazi shutters across windows. Bright morning light. " +
      "Family-first, soft boundaries. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'boutique-cafe-dq',
    prompt:
      "Editorial photograph of a boutique specialty coffee cafe interior in Riyadh's Diplomatic Quarter. " +
      "Walnut bar, 4 metres linear, with a brass espresso machine. 8 banquette seats in clay velvet. " +
      "Brass pendant cluster over a long communal table. Najdi-pattern wool rugs in the seating zone. " +
      "Late-afternoon golden light. Interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'workshop-dental-clinic',
    prompt:
      "Editorial photograph of a boutique dental clinic reception interior in Olaya, Riyadh. " +
      "Limestone reception desk, 4 metres custom. Ash slat acoustic ceiling. Brass-tip task lighting. " +
      "Stone vanity in a treatment room visible through a half-open doorway. " +
      "Warm 2700K LED lighting throughout. Calming, hospitality-grade quiet — no fluorescent tubes, " +
      "no plastic, no clinical sterility. Interior architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'kafd-coworking-floor',
    prompt:
      "Editorial photograph of a boutique co-working floor interior in Riyadh's KAFD. " +
      "Limestone open-plan workspace. Walnut phone rooms with acoustic linen panels visible. " +
      "Communal limestone table for fourteen. Soft daylight from full-height windows. " +
      "Brass and ash detailing throughout. Quiet, focused, brand-coherent. " +
      "Interior architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
];

// -----------------------------------------------------------------------------
// Inspiration sets — three Diwan-styled responses each (saved as diwan-1/2/3.jpg)
// -----------------------------------------------------------------------------

const INSPIRATIONS = [
  {
    slug: '01-najdi-souls',
    prompts: [
      "Editorial photograph of a contemporary Najdi men's majlis. Carved cedar wall panels, layered seating in earth-tone velvet, brass pendants, wool rug. Warm directional light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Najdi family living room. Brass-inlay accent wall, walnut media unit, layered ottomans, cream linen sectional. Soft afternoon light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Najdi prayer corner with mashrabiya screen. Wool rug, recessed niche, warm lantern light. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '02-grammar-of-space',
    prompts: [
      "Top-down architectural floor plan of a 4-bedroom Saudi villa with separated men's and women's majlis, prayer room aligned to qibla, family living, kitchen, master suite. Clean line drawing, labelled rooms in Arabic and English, parchment background. No text watermark.",
      "Editorial photograph of a Saudi villa entrance hallway showing the spatial logic — men's majlis door on one side, family-living vista on the other, prayer-room door visible at end of hall. Limestone floors, walnut door frames. 35mm, ultra-sharp, no text, no people.",
      "Aerial editorial photograph of a Saudi villa interior at night, lit from within, showing the spatial flow between men's majlis, family living, dining, and outdoor terrace. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '03-the-third-place',
    prompts: [
      "Editorial photograph of a boutique co-working floor in Riyadh. Limestone open plan, walnut phone rooms, communal table for 14, full-height windows. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a single walnut phone room with acoustic linen panels, brass desk lamp, and a single ash chair. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a co-working pantry with walnut cabinetry, travertine counter, brass tap, integrated coffee station. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '04-kitchen-as-stage',
    prompts: [
      "Editorial photograph of a boutique specialty coffee bar in Riyadh — walnut bar 4m linear, brass espresso machine centre stage, leather barstools, layered Najdi-pattern rug behind the seating zone. Late afternoon light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a cafe long communal table under a brass pendant cluster, eight cane chairs, walnut floor, terrazzo accent wall. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a cafe outdoor terrace, low banquette seating in clay velvet, brass side tables, planters, evening string lights. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '05-clinic-as-hospitality',
    prompts: [
      "Editorial photograph of a boutique dental clinic reception in Riyadh — limestone reception desk, ash slat ceiling, brass task lighting, calming earth tones, no fluorescent lighting, no plastic. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a dental treatment room — stone vanity, ash chair, brass-tip lamp, soft warm 2700K LED light, no clinical sterility. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a clinic consult room — walnut writing desk, two ash armchairs, soft linen drapes, framed Saudi art. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '06-rooms-that-hold',
    prompts: [
      "Editorial photograph of a Saudi family compound men's majlis — 16-seat deep-velvet seating, walnut everywhere, heavy wool rugs, brass-inlay panels. Evening light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Saudi family dining for fourteen — long walnut table, brass pendant cluster, layered rugs underfoot. Warm winter evening. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Saudi family living — sectional in deep clay velvet, walnut media unit, layered cushions, brass coffee table. 35mm, ultra-sharp, no text, no people.",
    ],
  },
];

// -----------------------------------------------------------------------------
// Generation helpers
// -----------------------------------------------------------------------------

async function generate({prompt, outPath, model = 'black-forest-labs/flux-1.1-pro', aspect = '4:3'}) {
  if (!FORCE && existsSync(outPath)) {
    console.log(`× skip (exists)  ${outPath}`);
    return;
  }
  console.log(`→ generating    ${outPath}`);
  try {
    const output = await replicate.run(model, {
      input: {prompt, aspect_ratio: aspect, output_format: 'jpg', output_quality: 92, safety_tolerance: 2},
    });
    const url = Array.isArray(output) ? String(output[0]) : String(output);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(outPath), {recursive: true});
    writeFileSync(outPath, buf);
    console.log(`  ✓ saved ${(buf.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    console.error(`  ✗ ${err?.message ?? err}`);
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const start = Date.now();
console.log('\nDiwan photo generator\n=====================\n');

if (!ONLY || ONLY === 'projects') {
  console.log('Case studies (Flux 1.1 Pro)');
  console.log('---------------------------');
  for (const p of PROJECTS) {
    await generate({
      prompt: p.prompt,
      outPath: `public/projects/${p.id}/hero.jpg`,
      model: 'black-forest-labs/flux-1.1-pro',
      aspect: '4:3',
    });
  }
}

if (!ONLY || ONLY === 'inspirations') {
  console.log('\nInspiration responses (Flux Schnell)');
  console.log('------------------------------------');
  for (const set of INSPIRATIONS) {
    for (let i = 0; i < set.prompts.length; i++) {
      await generate({
        prompt: set.prompts[i],
        outPath: `public/inspirations/${set.slug}/diwan-${i + 1}.jpg`,
        model: 'black-forest-labs/flux-schnell',
        aspect: '4:5',
      });
    }
  }
}

const seconds = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n✓ Done in ${seconds}s\n`);
