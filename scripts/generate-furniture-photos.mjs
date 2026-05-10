#!/usr/bin/env node
// Generates photoreal product photographs for the furniture catalog using
// Replicate's Flux 1.1 Pro. Saves to public/furniture/cards/{slug}.jpg.
//
// Usage:
//   node --env-file=.env.local scripts/generate-furniture-photos.mjs
//   node --env-file=.env.local scripts/generate-furniture-photos.mjs --force
//
// Cost at current Replicate pricing: ~$0.04 per image. Run is ~50 photos
// covering 12 categories × top materials, so the full set is ~$2.00 and
// covers the entire 1,528-item catalog by mapping items to the closest
// (category, material) photo at runtime.

import Replicate from 'replicate';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
const replicate = new Replicate({auth: TOKEN});

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');

const SHOT_BASE = (subject) =>
  `Editorial product photograph of ${subject}. Studio shot on a clean warm-cream background, ` +
  `soft directional natural light, three-quarter angle, the entire piece centered and visible. ` +
  `Saudi heritage interior brand. Realistic, photoreal, 50mm lens, ultra-sharp focus, no people, ` +
  `no text, no watermark, no overlays. 4:3 aspect.`;

// 50+ distinct (category, material) photos. Each renders one clean
// product shot. The catalog at runtime maps each item to its closest
// (category-material) entry.
const SHOTS = [
  // ── SEATING ───────────────────────────────────────────────────────────
  {slug: 'seating-sofa-clay-velvet',     prompt: SHOT_BASE('a long 3-seat sofa in clay-terracotta velvet with hand-finished piping and four small brushed-brass legs')},
  {slug: 'seating-sofa-midnight-velvet', prompt: SHOT_BASE('a long 3-seat sofa in deep midnight-blue velvet with brushed-bronze legs')},
  {slug: 'seating-sofa-linen',           prompt: SHOT_BASE('a 3-seat sofa upholstered in bone linen with three loose seat cushions and walnut legs')},
  {slug: 'seating-sofa-wool',            prompt: SHOT_BASE('a 3-seat sofa in clay-toned chunky wool with carved walnut frame and linen-piped cushions')},
  {slug: 'seating-sectional-leather',    prompt: SHOT_BASE('an L-shape sectional sofa in cognac leather with brushed-bronze legs')},
  {slug: 'seating-armchair-walnut',      prompt: SHOT_BASE('a single hand-carved walnut armchair with clay-velvet seat and back cushions')},
  {slug: 'seating-armchair-cedar',       prompt: SHOT_BASE('a hand-carved cedar Najdi-pattern armchair with bone linen cushions')},
  {slug: 'seating-armchair-leather',     prompt: SHOT_BASE('a vintage cognac leather lounge armchair with walnut frame')},
  {slug: 'seating-stool-brass',          prompt: SHOT_BASE('a counter-height bar stool with a leather seat and a brushed-brass column base')},
  {slug: 'seating-bench-walnut',         prompt: SHOT_BASE('a long entryway bench in solid walnut with hand-rubbed oil finish')},
  {slug: 'seating-pouf-clay-velvet',     prompt: SHOT_BASE('a square clay-velvet floor pouf with hand-stitched piping')},

  // ── TABLES ────────────────────────────────────────────────────────────
  {slug: 'tables-coffee-travertine',     prompt: SHOT_BASE('a low travertine coffee table with a thick honed slab top and brushed-bronze legs')},
  {slug: 'tables-coffee-walnut',         prompt: SHOT_BASE('a round walnut coffee table with brass-tipped sculptural legs')},
  {slug: 'tables-dining-walnut',         prompt: SHOT_BASE('an 8-seat solid walnut dining table with a thick rectangular top and four heavy turned legs')},
  {slug: 'tables-dining-marble',         prompt: SHOT_BASE('an 8-seat dining table with a white-marble top and a sculpted walnut base')},
  {slug: 'tables-side-brass',            prompt: SHOT_BASE('a small round side table with a hammered-brass top and a sculptural single-stem brass base')},
  {slug: 'tables-console-walnut',        prompt: SHOT_BASE('a slim walnut entryway console table with two thin brass-frame legs')},
  {slug: 'tables-desk-walnut',           prompt: SHOT_BASE('a compact walnut writing desk with a single drawer and brushed-brass pull')},

  // ── BEDS ──────────────────────────────────────────────────────────────
  {slug: 'beds-king-walnut',             prompt: SHOT_BASE('a king-size bed with a hand-carved walnut headboard, white linen bedding, and two linen pillows')},
  {slug: 'beds-king-velvet',             prompt: SHOT_BASE('a king-size upholstered bed with a tall midnight-velvet tufted headboard, white duvet, and two pillows')},
  {slug: 'beds-headboard-linen',         prompt: SHOT_BASE('a wall-mounted bone-linen tufted headboard, single horizontal panel, brass-tipped corners')},

  // ── STORAGE ───────────────────────────────────────────────────────────
  {slug: 'storage-credenza-walnut',      prompt: SHOT_BASE('a long walnut credenza sideboard with three doors, hand-fitted brass pulls, and slim brass legs')},
  {slug: 'storage-wardrobe-walnut',      prompt: SHOT_BASE('a tall walnut wardrobe with two doors, full-height brass pulls, and a flat top')},
  {slug: 'storage-bookshelf-oak',        prompt: SHOT_BASE('a 5-tier open oak bookshelf with a brass frame and a few books on the middle shelves')},
  {slug: 'storage-nightstand-walnut',    prompt: SHOT_BASE('a small two-drawer walnut nightstand with brushed-brass pulls')},

  // ── LIGHTING ──────────────────────────────────────────────────────────
  {slug: 'lighting-pendant-brass',       prompt: SHOT_BASE('a single hand-hammered brass pendant lamp hanging from a long cord, conical shade')},
  {slug: 'lighting-cluster-brass',       prompt: SHOT_BASE('a cluster of five small hammered-brass pendant lamps hung at staggered heights from a single brass tray')},
  {slug: 'lighting-floor-lamp',          prompt: SHOT_BASE('a tall brass floor lamp with a beige linen shade and a tripod base')},
  {slug: 'lighting-table-lamp',          prompt: SHOT_BASE('a ceramic-base table lamp with a beige linen drum shade')},
  {slug: 'lighting-chandelier-brass',    prompt: SHOT_BASE('a six-arm hammered-brass chandelier with frosted-glass bulb covers')},
  {slug: 'lighting-sconce-brass',        prompt: SHOT_BASE('a small hand-hammered brass wall sconce with a single bulb')},
  {slug: 'lighting-lantern-cedar',       prompt: SHOT_BASE('a tall hand-carved cedar Najdi lantern with brass corner detail and an inner glow')},

  // ── RUGS ──────────────────────────────────────────────────────────────
  {slug: 'rugs-najdi-wool',              prompt: SHOT_BASE('a hand-knotted wool area rug with a Saudi Najdi geometric pattern in clay terracotta and bone tones, top-down studio shot')},
  {slug: 'rugs-modern-solid',            prompt: SHOT_BASE('a solid-colour wool area rug in soft sand tone with subtle texture, top-down studio shot')},
  {slug: 'rugs-runner',                  prompt: SHOT_BASE('a long hallway wool runner with a subtle geometric border, photographed top-down')},

  // ── WALL DECOR ────────────────────────────────────────────────────────
  {slug: 'wall-mashrabiya-cedar',        prompt: SHOT_BASE('a tall hand-carved cedar mashrabiya wall screen with traditional Saudi Najdi geometric pattern, mounted on a cream wall')},
  {slug: 'wall-mirror-brass-round',      prompt: SHOT_BASE('a large round wall mirror with a thick hand-hammered brass frame, mounted on a cream wall')},
  {slug: 'wall-mirror-leather',          prompt: SHOT_BASE('a full-length wall mirror with a thin walnut frame and a hanging cognac leather strap')},
  {slug: 'wall-calligraphy-walnut',      prompt: SHOT_BASE('a horizontal walnut panel with hand-carved Arabic calligraphy of Surat al-Ikhlas, brass-leaf inlay accents')},
  {slug: 'wall-sculpture-brass',         prompt: SHOT_BASE('an abstract hand-hammered brass wall sculpture composed of overlapping geometric discs')},
  {slug: 'wall-tile-ceramic',            prompt: SHOT_BASE('a wall-mounted ceramic-tile composition with hand-painted Saudi geometric pattern in clay-terracotta and bone tones')},

  // ── KITCHEN ───────────────────────────────────────────────────────────
  {slug: 'kitchen-island-marble',        prompt: SHOT_BASE('a freestanding kitchen island with a thick white-marble top, walnut cabinetry below, and three brass bar stools')},
  {slug: 'kitchen-pantry-oak',           prompt: SHOT_BASE('a tall oak pantry cabinet with double doors, brass pulls, and a flat top')},

  // ── BATH ──────────────────────────────────────────────────────────────
  {slug: 'bath-tub-ceramic',             prompt: SHOT_BASE('a free-standing oval ceramic bathtub with a brass faucet')},
  {slug: 'bath-vanity-marble',           prompt: SHOT_BASE('a double-sink bathroom vanity with a white-marble top and walnut cabinetry below')},

  // ── TEXTILES ──────────────────────────────────────────────────────────
  {slug: 'textiles-drape-linen',         prompt: SHOT_BASE('a pair of full-height bone-linen drapes hung from a brass rod, photographed against a cream wall')},
  {slug: 'textiles-cushion-velvet',      prompt: SHOT_BASE('a square clay-velvet throw cushion with hand-stitched piping')},
  {slug: 'textiles-throw-wool',          prompt: SHOT_BASE('a hand-loomed wool throw blanket folded into a soft pile, clay terracotta tone')},

  // ── PLANTS ────────────────────────────────────────────────────────────
  {slug: 'plants-palm',                  prompt: SHOT_BASE('a tall indoor date palm in a hand-thrown clay-terracotta ceramic pot')},
  {slug: 'plants-olive',                 prompt: SHOT_BASE('an indoor olive tree in a hand-thrown ceramic pot, soft window light')},
  {slug: 'plants-fiddle-leaf',           prompt: SHOT_BASE('an indoor fiddle-leaf fig in a tall ceramic pot')},

  // ── ACCENTS ───────────────────────────────────────────────────────────
  {slug: 'accents-tray-brass',           prompt: SHOT_BASE('a round hand-engraved hammered-brass tray, photographed top-down')},
  {slug: 'accents-dallah',               prompt: SHOT_BASE('a polished Saudi brass dallah coffee pot with a long curved spout, photographed at three-quarter angle')},
  {slug: 'accents-vase-ceramic',         prompt: SHOT_BASE('a tall hand-thrown ceramic vase in a soft clay-terracotta tone with subtle brushed texture')},
  {slug: 'accents-candle-holder-brass',  prompt: SHOT_BASE('a hand-hammered brass candle holder with a single white candle, on a cream surface')},
];

const OUT_DIR = 'public/furniture/cards';
mkdirSync(OUT_DIR, {recursive: true});

console.log(`\nGenerating ${SHOTS.length} furniture product photos via Replicate Flux 1.1 Pro\n`);

let ok = 0, skipped = 0, failed = 0;
for (const shot of SHOTS) {
  const out = `${OUT_DIR}/${shot.slug}.jpg`;
  if (!FORCE && existsSync(out)) {
    console.log(`× skip (exists)  ${out}`);
    skipped++;
    continue;
  }
  console.log(`→ generating    ${out}`);
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const result = await replicate.run('black-forest-labs/flux-1.1-pro', {
        input: {prompt: shot.prompt, aspect_ratio: '4:3', output_format: 'jpg', output_quality: 92, safety_tolerance: 2},
      });
      const url = Array.isArray(result) ? String(result[0]) : String(result);
      const r = await fetch(url);
      if (!r.ok) throw new Error(`fetch ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(out, buf);
      console.log(`  ✓ ${(buf.length / 1024).toFixed(0)} KB`);
      ok++;
      await new Promise((res) => setTimeout(res, 11_000));
      break;
    } catch (err) {
      const msg = err?.message ?? String(err);
      if (msg.match(/429/) && attempt < 5) {
        const m = msg.match(/retry_after"?:\s*(\d+)/i);
        const wait = (m ? Number(m[1]) + 2 : 15) * 1000;
        console.log(`  · throttled, retry in ${wait/1000}s (${attempt}/5)`);
        await new Promise((res) => setTimeout(res, wait));
        continue;
      }
      console.error(`  ✗ ${msg}`);
      failed++;
      break;
    }
  }
}

console.log(`\n✓ Done — ${ok} generated, ${skipped} skipped, ${failed} failed\n`);
