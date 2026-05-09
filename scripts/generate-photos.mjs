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
// Building exteriors (1 per project)
// -----------------------------------------------------------------------------

const EXTERIORS = [
  {
    id: 'najdi-villa-nakheel',
    prompt:
      "Editorial architectural photograph of a contemporary Saudi family villa exterior in Riyadh's Al-Nakheel district. " +
      "Sand-coloured stone walls with carved geometric Najdi patterns, modest arched windows with brass-detail frames, " +
      "low date palms in the front, a paved limestone driveway. Golden-hour light. Architectural photography, " +
      "35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'coastal-jeddah-corniche',
    prompt:
      "Editorial architectural photograph of a modern Jeddah apartment building exterior near the Red Sea corniche. " +
      "Pale travertine cladding, recessed Hijazi-style wood shutters on every floor, generous balconies overlooking " +
      "the sea. Soft afternoon light. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'riyadh-contemporary-penthouse',
    prompt:
      "Editorial architectural photograph at twilight from a penthouse balcony in Riyadh's Olaya district, looking " +
      "across the city skyline. Limestone parapet, glass railing, the building's brass-trimmed roof structure visible. " +
      "Sunset over the city below. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'cocoon-family-compound',
    prompt:
      "Editorial architectural photograph of a large Saudi multi-generational family compound exterior in Riyadh's " +
      "Diplomatic Quarter. Two-storey villa, sand-stone walls, deep-set windows, a covered entrance with carved cedar " +
      "mashrabiya screen, mature trees in the courtyard. Late-afternoon golden light. Architectural photography, " +
      "35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'open-living-3br-villa',
    prompt:
      "Editorial architectural photograph of a modern Saudi 3-bedroom family villa exterior in Riyadh's Al-Yasmin. " +
      "White stucco facade, full-height Hijazi shutters, low-key entrance with a single olive tree in the front yard, " +
      "warm afternoon light. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'boutique-cafe-dq',
    prompt:
      "Editorial architectural photograph of a boutique specialty coffee cafe storefront in Riyadh's Diplomatic " +
      "Quarter at dusk. Walnut-framed glass facade, warm brass-tinted interior visible through the windows, a single " +
      "minimal Arabic-and-Latin wordmark on the wall, low banquette seating glimpsed inside, a small outdoor terrace " +
      "with two cane chairs. Late-afternoon golden light. Architectural photography, 35mm, ultra-sharp, no text " +
      "watermark, no people.",
  },
  {
    id: 'workshop-dental-clinic',
    prompt:
      "Editorial architectural photograph of a boutique dental clinic exterior in Olaya, Riyadh. Limestone facade, " +
      "frosted glass entry, a single ash-wood door with brass handle, a small olive tree planter, calm refined " +
      "presence. No clinical signage, no medical iconography. Soft daylight. Architectural photography, 35mm, " +
      "ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'kafd-coworking-floor',
    prompt:
      "Editorial architectural photograph of the entrance lobby on the second floor of a boutique co-working space " +
      "in Riyadh's KAFD. Warm walnut reception desk, limestone floor, large picture window overlooking the KAFD " +
      "skyline, brass and ash detailing. Soft late-morning daylight. Architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
];

// -----------------------------------------------------------------------------
// Per-room photos for each project (saved as rooms/01.jpg, 02.jpg, ...)
// Order matches study.roomViews in src/data/projects.ts
// -----------------------------------------------------------------------------

const ROOM_PROMPTS = {
  'najdi-villa-nakheel': {
    style: "Modern Najdi style. Carved cedar mashrabiya, brass pendants, walnut and travertine, layered Najdi-pattern wool rugs, warm clay velvet upholstery",
    rooms: [
      "Men's majlis with low ceremonial seating around the perimeter",
      "Family living room with sectional sofa and TV unit",
      "Dining room with long walnut table for eight under a brass pendant cluster",
      "Master bedroom with upholstered headboard and warm clay tones",
      "Prayer niche with a wool rug and recessed mihrab",
      "Family kitchen with walnut cabinetry and a 3-metre travertine island",
    ],
  },
  'coastal-jeddah-corniche': {
    style: "Coastal Hijazi style. Pale ash floors, travertine surfaces, bone-linen upholstery, Hijazi pale-wood shutters, brass-tip ash detailing",
    rooms: [
      "Living room with a bone-linen 3-seat sofa and a sea view",
      "Dining nook with cane chairs around a travertine table",
      "Open kitchen with travertine island and pale ash cabinetry",
      "Master bedroom with linen headboard and ivory walls",
      "Bathroom with a travertine vanity and brass fixtures",
    ],
  },
  'riyadh-contemporary-penthouse': {
    style: "Riyadh Contemporary minimalism. Limestone floors, travertine sectional, Hijazi shutters, single sculptural objects per room, no rugs, brushed brass detailing",
    rooms: [
      "Living room with a 4-metre travertine sectional and a single Najdi-craft entrance bench",
      "Master suite with midnight wall and brushed-brass fittings",
      "Concealed kitchen with stone surfaces and walnut detailing",
      "Library with built-in walnut shelves and a single armchair",
      "Guest bathroom with limestone vanity and minimal fittings",
    ],
  },
  'cocoon-family-compound': {
    style: "Cocoon style. Deep midnight velvet, walnut everywhere, heavy wool rugs, brass-inlay accent panels, layered cushions, warm evening lighting",
    rooms: [
      "Men's majlis with 16-seat deep-velvet ceremonial seating",
      "Women's majlis with softer-velvet seating and brass details",
      "Family dining for fourteen with a long walnut table and brass pendants",
      "Family living with deep-clay sectional and walnut media unit",
      "Master suite with upholstered headboard wall in deep velvet",
      "Family kitchen with walnut cabinetry and a long communal island",
    ],
  },
  'open-living-3br-villa': {
    style: "Open Living style. Pale oak floors, white-oak kitchen island, stain-resistant linen sectional, Hijazi shutters across windows, soft boundaries",
    rooms: [
      "Open living-dining-kitchen volume with a 3-metre oak island",
      "Pale-oak kitchen island with seating for six",
      "Family dining table next to the kitchen island",
      "Master bedroom with linen headboard and pale oak floor",
      "Kids' room with built-in storage and a small desk",
    ],
  },
  'boutique-cafe-dq': {
    style: "Boutique cafe in Modern Najdi mood. Walnut bar, brass espresso machine, layered Najdi rugs, banquette seating in clay velvet, brass pendants",
    rooms: [
      "Walnut bar 4 metres linear with a brass espresso machine centre stage",
      "Banquette seating zone with clay-velvet seats and Najdi-pattern wool rug",
      "Long communal table under a brass pendant cluster",
      "Behind-the-bar working kitchen with stainless surfaces and walnut detailing",
      "Outdoor terrace with low cane seating and brass side tables",
    ],
  },
  'workshop-dental-clinic': {
    style: "Boutique dental clinic in Workshop Quiet style. Limestone reception, ash slat ceiling, brass-tip task lighting, warm 2700K LED, no fluorescent tubes, no clinical iconography",
    rooms: [
      "Limestone reception desk 4 metres custom with brass-tip lamp",
      "Treatment room 1 with stone vanity and ash-wood chair",
      "Consult room with walnut writing desk and two ash armchairs",
      "Recovery room with linen drapes and warm soft light",
      "Patient bathroom with travertine vanity and brass fittings",
    ],
  },
  'kafd-coworking-floor': {
    style: "Boutique co-working in Open Living style. Limestone floors, walnut phone rooms, communal limestone table, full-height windows, brass and ash detailing",
    rooms: [
      "Open-plan workspace with limestone floor and full-height windows",
      "Walnut phone room with acoustic linen panels and brass desk lamp",
      "Boardroom with built-in walnut media wall and limestone table",
      "Pantry with walnut cabinetry, travertine counter, integrated coffee station",
      "Prayer room with Najdi-craft mashrabiya screen and a wool rug",
      "Director's office with walnut desk and a single ash armchair",
    ],
  },
};

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate({prompt, outPath, model = 'black-forest-labs/flux-1.1-pro', aspect = '4:3'}) {
  if (!FORCE && existsSync(outPath)) {
    console.log(`× skip (exists)  ${outPath}`);
    return;
  }
  console.log(`→ generating    ${outPath}`);

  // Replicate throttles to 6/min when credit < $5, so we retry on 429 with the
  // server-supplied retry_after (plus a small cushion).
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
      // Pace requests to stay under the 6-per-minute throttle
      await sleep(11_000);
      return;
    } catch (err) {
      const msg = err?.message ?? String(err);
      const m429 = msg.match(/429/);
      const retryMatch = msg.match(/retry_after"?:\s*(\d+)/i);
      const retryAfter = retryMatch ? Number(retryMatch[1]) + 2 : 12;
      if (m429 && attempt < maxAttempts) {
        console.log(`  · throttled, retrying in ${retryAfter}s (attempt ${attempt}/${maxAttempts})`);
        await sleep(retryAfter * 1000);
        continue;
      }
      console.error(`  ✗ ${msg}`);
      return;
    }
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const start = Date.now();
console.log('\nDiwan photo generator\n=====================\n');

if (!ONLY || ONLY === 'projects') {
  console.log('Case studies — interior heroes (Flux 1.1 Pro)');
  console.log('---------------------------------------------');
  for (const p of PROJECTS) {
    await generate({
      prompt: p.prompt,
      outPath: `public/projects/${p.id}/hero.jpg`,
      model: 'black-forest-labs/flux-1.1-pro',
      aspect: '4:3',
    });
  }
}

if (!ONLY || ONLY === 'exteriors') {
  console.log('\nCase studies — building exteriors (Flux 1.1 Pro)');
  console.log('------------------------------------------------');
  for (const e of EXTERIORS) {
    await generate({
      prompt: e.prompt,
      outPath: `public/projects/${e.id}/exterior.jpg`,
      model: 'black-forest-labs/flux-1.1-pro',
      aspect: '16:9',
    });
  }
}

if (!ONLY || ONLY === 'rooms') {
  console.log('\nCase studies — per-room photos (Flux Schnell)');
  console.log('---------------------------------------------');
  for (const [id, data] of Object.entries(ROOM_PROMPTS)) {
    for (let i = 0; i < data.rooms.length; i++) {
      const room = data.rooms[i];
      const prompt =
        `Editorial interior photograph of a ${room}. ${data.style}. ` +
        `Architectural photography, 35mm, soft directional natural light, ultra-sharp, no text, no people, no watermark.`;
      await generate({
        prompt,
        outPath: `public/projects/${id}/rooms/${String(i + 1).padStart(2, '0')}.jpg`,
        model: 'black-forest-labs/flux-schnell',
        aspect: '4:3',
      });
    }
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
