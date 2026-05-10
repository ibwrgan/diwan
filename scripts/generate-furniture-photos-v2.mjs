#!/usr/bin/env node
// Variant set 2 — extends the catalog with ~80 more photoreal product
// shots with brand/style cues (IKEA-style Scandinavian, West Elm modern,
// CB2 contemporary, Restoration Hardware heritage, Najdi heritage). Run
// AFTER scripts/generate-furniture-photos.mjs has populated the base set.
//
// Usage:
//   node --env-file=.env.local scripts/generate-furniture-photos-v2.mjs
//
// Cost: ~80 × $0.04 = ~$3.20 — combined with v1, 135 unique photos
// covering the 1,528-item catalog with proper variety.

import Replicate from 'replicate';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
const replicate = new Replicate({auth: TOKEN});

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');

// Each entry produces ONE product photo. Slug names follow the pattern
// {category}-{piece}-{material}-{style}.jpg so the catalog can map by
// (category, material, style) for proper variety.
const SHOT = (subject, style) =>
  `Photoreal product catalog photograph of ${subject}, in the style of ${style}. ` +
  `Studio shot on a clean cream-white background, soft directional natural light, ` +
  `three-quarter angle, the entire piece centered and visible. Realistic, sharp focus, ` +
  `commercial-grade product photography, no people, no text, no watermark. 4:3 aspect.`;

const SHOTS = [
  // ── SEATING — sofa variants by style ─────────────────────────────────
  {slug: 'seating-sofa-clay-velvet-najdi',     prompt: SHOT('a 3-seat sofa in clay-terracotta velvet with carved walnut frame and small brushed-brass legs', 'modern Saudi Najdi heritage')},
  {slug: 'seating-sofa-clay-velvet-westelm',   prompt: SHOT('a 3-seat tufted sofa in clay-terracotta velvet with rounded arms and walnut tapered legs', 'West Elm modern')},
  {slug: 'seating-sofa-linen-ikea',            prompt: SHOT('a 3-seat sofa upholstered in soft bone-linen, simple square arms, pale ash legs', 'IKEA Scandinavian minimalism')},
  {slug: 'seating-sofa-leather-rh',            prompt: SHOT('a deep cognac-leather chesterfield 3-seat sofa with hand-tufted backrest and rolled arms', 'Restoration Hardware heritage')},
  {slug: 'seating-sofa-wool-cb2',              prompt: SHOT('a low-slung 3-seat sofa in oatmeal wool boucle with sculptural curved armrests', 'CB2 contemporary')},
  {slug: 'seating-sectional-l-clay-velvet',    prompt: SHOT('a generous L-shape sectional in clay-terracotta velvet with deep seats and brass legs', 'modern Najdi')},
  {slug: 'seating-sectional-l-linen',          prompt: SHOT('an L-shape sectional with bone-linen upholstery, deep seats, throw cushions, walnut legs', 'West Elm modern')},
  {slug: 'seating-armchair-walnut-najdi',      prompt: SHOT('a single hand-carved walnut Najdi-pattern armchair with a deep clay-velvet seat cushion', 'Saudi Najdi heritage')},
  {slug: 'seating-armchair-rattan',            prompt: SHOT('a single rattan armchair with an open weave back and a flat linen seat cushion', 'CB2 contemporary')},
  {slug: 'seating-armchair-leather-vintage',   prompt: SHOT('a vintage cognac-leather club armchair with rolled arms and a button-tufted back', 'Restoration Hardware heritage')},
  {slug: 'seating-lounge-chair-wool',          prompt: SHOT('a sculptural lounge chair in oatmeal wool with bent walnut legs', 'IKEA Scandinavian')},
  {slug: 'seating-bench-walnut-long',          prompt: SHOT('a long entryway bench in solid walnut with rounded edges and a small brass detail', 'Najdi heritage')},
  {slug: 'seating-bar-stool-leather',          prompt: SHOT('a counter-height bar stool with a tan leather seat and a single sculpted walnut leg', 'CB2 contemporary')},
  {slug: 'seating-floor-cushion-velvet',       prompt: SHOT('a square floor cushion in clay-terracotta velvet with hand-stitched piping', 'Najdi heritage')},
  {slug: 'seating-pouf-leather',               prompt: SHOT('a round leather pouf in cognac with hand-stitched seams', 'modern industrial')},

  // ── TABLES — variants by style ───────────────────────────────────────
  {slug: 'tables-coffee-walnut-najdi',         prompt: SHOT('a low rectangular walnut coffee table with hand-carved Najdi pattern around the apron and brass-tipped legs', 'Najdi heritage')},
  {slug: 'tables-coffee-marble-cb2',           prompt: SHOT('a round coffee table with a thick white-marble top and a single sculpted brass column base', 'CB2 contemporary')},
  {slug: 'tables-coffee-glass',                prompt: SHOT('a low coffee table with a thick clear-glass top and a brushed-brass tubular frame', 'modern industrial')},
  {slug: 'tables-coffee-rattan',               prompt: SHOT('a round rattan coffee table with a woven top', 'West Elm modern')},
  {slug: 'tables-dining-walnut-westelm',       prompt: SHOT('an 8-seat rectangular walnut dining table with a thick top and tapered legs', 'West Elm modern')},
  {slug: 'tables-dining-oak-ikea',             prompt: SHOT('a 6-seat rectangular oak dining table with simple square legs', 'IKEA Scandinavian')},
  {slug: 'tables-dining-marble-cb2',           prompt: SHOT('an 8-seat dining table with an oval white-marble top and a sculpted black-metal pedestal base', 'CB2 contemporary')},
  {slug: 'tables-dining-12-walnut',            prompt: SHOT('a long 12-seat ceremonial walnut dining table with thick chunky base and brass-tipped feet', 'Restoration Hardware heritage')},
  {slug: 'tables-side-walnut',                 prompt: SHOT('a small round walnut side table with three splayed brass legs', 'CB2 contemporary')},
  {slug: 'tables-side-marble',                 prompt: SHOT('a small round side table with a white-marble top and a single brass column base', 'CB2 contemporary')},
  {slug: 'tables-console-walnut-westelm',      prompt: SHOT('a slim walnut console table with two brass X-shaped legs', 'West Elm modern')},
  {slug: 'tables-console-marble',              prompt: SHOT('a long console table with a white-marble top and brushed-brass legs', 'CB2 contemporary')},
  {slug: 'tables-desk-walnut-westelm',         prompt: SHOT('a writing desk in walnut with two drawers, brass pulls, tapered legs', 'West Elm modern')},
  {slug: 'tables-desk-executive-leather',      prompt: SHOT('an executive desk in walnut with a leather-inlay top and brass corner detail', 'Restoration Hardware heritage')},
  {slug: 'tables-nesting-brass',               prompt: SHOT('a set of three nesting tables with brass tubular frames and walnut tops, stacked', 'modern industrial')},

  // ── BEDS ─────────────────────────────────────────────────────────────
  {slug: 'beds-king-walnut-najdi',             prompt: SHOT('a king bed with a hand-carved walnut Najdi-pattern headboard, white linen bedding, two pillows', 'Saudi Najdi heritage')},
  {slug: 'beds-king-velvet-cb2',               prompt: SHOT('a king bed with a tall channel-tufted midnight-velvet headboard, white duvet, two pillows', 'CB2 contemporary')},
  {slug: 'beds-king-linen-westelm',            prompt: SHOT('a king bed with an upholstered bone-linen headboard, simple wood frame, two pillows', 'West Elm modern')},
  {slug: 'beds-queen-oak-ikea',                prompt: SHOT('a queen bed with a simple oak frame and a low headboard, white duvet, two pillows', 'IKEA Scandinavian')},
  {slug: 'beds-daybed-rattan',                 prompt: SHOT('a single daybed with a rattan frame, a tufted bone-linen mattress and three throw cushions', 'CB2 contemporary')},
  {slug: 'beds-bunk-oak',                      prompt: SHOT('a kids bunk bed with a simple oak frame, white linens, and a small wooden ladder', 'IKEA Scandinavian')},
  {slug: 'beds-headboard-velvet',              prompt: SHOT('a wall-mounted upholstered midnight-velvet tufted headboard, single horizontal panel', 'CB2 contemporary')},

  // ── STORAGE ──────────────────────────────────────────────────────────
  {slug: 'storage-credenza-walnut-westelm',    prompt: SHOT('a long walnut credenza sideboard with three tambour doors and tapered legs', 'West Elm modern')},
  {slug: 'storage-wardrobe-walnut-najdi',      prompt: SHOT('a tall walnut wardrobe with hand-carved Najdi pattern panels and brass pulls', 'Najdi heritage')},
  {slug: 'storage-bookshelf-walnut',           prompt: SHOT('a 5-tier walnut bookshelf with brass tube supports and a few books on shelves', 'modern industrial')},
  {slug: 'storage-bookshelf-oak-ikea',         prompt: SHOT('a 5-tier open oak bookshelf with simple square frame and a few books', 'IKEA Scandinavian')},
  {slug: 'storage-dresser-walnut',             prompt: SHOT('a 6-drawer walnut dresser with brass pulls and tapered legs', 'West Elm modern')},
  {slug: 'storage-display-glass',              prompt: SHOT('a tall display cabinet with glass doors, a brass frame, and three glass shelves', 'modern industrial')},

  // ── LIGHTING ─────────────────────────────────────────────────────────
  {slug: 'lighting-pendant-cluster',           prompt: SHOT('a cluster of five hand-hammered brass pendants hung at staggered heights from a single brass tray', 'Najdi heritage')},
  {slug: 'lighting-pendant-glass',             prompt: SHOT('a single glass globe pendant lamp with a brass canopy on a long cord', 'CB2 contemporary')},
  {slug: 'lighting-floor-arc',                 prompt: SHOT('a tall arc floor lamp with a brushed-brass pole and a beige linen drum shade', 'West Elm modern')},
  {slug: 'lighting-floor-tripod',              prompt: SHOT('a tripod floor lamp with three walnut legs and a beige linen drum shade', 'IKEA Scandinavian')},
  {slug: 'lighting-table-ceramic',             prompt: SHOT('a ceramic-base table lamp with a beige linen drum shade, soft warm tone', 'IKEA Scandinavian')},
  {slug: 'lighting-table-brass',               prompt: SHOT('a hand-hammered brass table lamp with a small linen drum shade', 'Najdi heritage')},
  {slug: 'lighting-chandelier-modern',         prompt: SHOT('a six-arm chandelier with brass arms and frosted glass globes', 'CB2 contemporary')},
  {slug: 'lighting-sconce-modern',             prompt: SHOT('a wall-mounted brass sconce with an articulated arm and a small cone shade', 'modern industrial')},

  // ── RUGS ─────────────────────────────────────────────────────────────
  {slug: 'rugs-hijazi-wool',                   prompt: SHOT('a Saudi Hijazi-pattern wool area rug with delicate geometric medallion in soft sand and clay tones, photographed top-down', 'Hijazi heritage')},
  {slug: 'rugs-vintage-wool',                  prompt: SHOT('a vintage-style Persian wool rug with a faded medallion in soft clay-terracotta and bone, top-down', 'Restoration Hardware heritage')},
  {slug: 'rugs-modern-stripes',                prompt: SHOT('a modern striped wool rug in soft sand and bone tones, photographed top-down', 'IKEA Scandinavian')},
  {slug: 'rugs-round-wool',                    prompt: SHOT('a round wool area rug with a soft graded clay-terracotta tone, top-down studio shot', 'CB2 contemporary')},

  // ── WALL DECOR ───────────────────────────────────────────────────────
  {slug: 'wall-mashrabiya-tall',               prompt: SHOT('a tall hand-carved cedar mashrabiya wall screen with intricate Najdi geometric pattern, mounted on a cream wall', 'Saudi Najdi heritage')},
  {slug: 'wall-mirror-arch',                   prompt: SHOT('an arched wall mirror with a hand-hammered brass frame, mounted on a cream wall', 'modern Mediterranean')},
  {slug: 'wall-mirror-rectangular',            prompt: SHOT('a large rectangular wall mirror with a thin walnut frame and a hanging cognac leather strap', 'CB2 contemporary')},
  {slug: 'wall-art-large',                     prompt: SHOT('a large abstract canvas painting in clay-terracotta and bone tones, in a thin walnut frame, mounted on a cream wall', 'modern minimalism')},
  {slug: 'wall-calligraphy-arabic',            prompt: SHOT('a horizontal walnut panel with hand-carved Arabic calligraphy of the Bismillah, brass-leaf inlay accents, on a cream wall', 'Saudi Najdi heritage')},
  {slug: 'wall-tapestry-wool',                 prompt: SHOT('a hand-woven wool tapestry with a Saudi geometric pattern in clay-terracotta and bone, hung on a cream wall', 'Najdi heritage')},

  // ── KITCHEN ──────────────────────────────────────────────────────────
  {slug: 'kitchen-island-walnut',              prompt: SHOT('a freestanding kitchen island with a thick walnut top, white-marble waterfall edge, and three brass bar stools', 'CB2 contemporary')},
  {slug: 'kitchen-bar-counter',                prompt: SHOT('a tall bar counter with a marble top, walnut cabinetry below, and a built-in wine fridge', 'modern industrial')},
  {slug: 'kitchen-pantry-walnut',              prompt: SHOT('a tall walnut pantry cabinet with double doors, brass pulls, and adjustable shelving inside', 'West Elm modern')},

  // ── BATH ─────────────────────────────────────────────────────────────
  {slug: 'bath-tub-modern',                    prompt: SHOT('a modern free-standing rectangular bathtub in matte white ceramic with a tall brass faucet', 'CB2 contemporary')},
  {slug: 'bath-vanity-double',                 prompt: SHOT('a wide double-sink bathroom vanity with white-marble top, walnut cabinetry, and brass faucets', 'West Elm modern')},
  {slug: 'bath-vanity-single',                 prompt: SHOT('a compact single-sink bathroom vanity with travertine top and walnut cabinetry below', 'Najdi heritage')},

  // ── TEXTILES ─────────────────────────────────────────────────────────
  {slug: 'textiles-drape-velvet',              prompt: SHOT('a pair of full-height clay-terracotta velvet drapes hung from a brass rod', 'Restoration Hardware heritage')},
  {slug: 'textiles-cushion-bolster',           prompt: SHOT('a bolster cushion in oatmeal linen with hand-stitched piping', 'CB2 contemporary')},
  {slug: 'textiles-throw-fringed',             prompt: SHOT('a fringed wool throw blanket in soft sand tone, folded into a soft pile', 'IKEA Scandinavian')},
  {slug: 'textiles-bedding-linen',             prompt: SHOT('a king bedding set in soft bone linen, folded neatly with two pillows', 'West Elm modern')},

  // ── PLANTS ───────────────────────────────────────────────────────────
  {slug: 'plants-snake-plant',                 prompt: SHOT('a tall snake plant in a tall ceramic pot, soft window light', 'IKEA Scandinavian')},
  {slug: 'plants-monstera',                    prompt: SHOT('an indoor monstera plant in a hand-thrown clay-terracotta ceramic pot', 'CB2 contemporary')},
  {slug: 'plants-planter-tripod',              prompt: SHOT('a tripod brass planter stand holding a hand-thrown ceramic pot with a fern', 'modern industrial')},

  // ── ACCENTS ──────────────────────────────────────────────────────────
  {slug: 'accents-tray-engraved',              prompt: SHOT('a hand-engraved hammered-brass round tray with traditional Saudi geometric pattern, top-down', 'Saudi Najdi heritage')},
  {slug: 'accents-coffee-set-brass',           prompt: SHOT('a Saudi coffee service of polished brass dallah, six small porcelain cups, and a brass tray', 'Saudi Najdi heritage')},
  {slug: 'accents-vase-tall',                  prompt: SHOT('a tall hand-thrown ceramic vase in a soft sand tone, with sculptural lip', 'CB2 contemporary')},
  {slug: 'accents-vase-glass',                 prompt: SHOT('a tall clear-glass vase with a single sculptural shape', 'IKEA Scandinavian')},
  {slug: 'accents-bowl-travertine',            prompt: SHOT('a decorative travertine bowl with a thick rim, photographed top-down', 'modern minimalism')},
  {slug: 'accents-candle-trio',                prompt: SHOT('a trio of brass candle holders in graduated heights, each with a single white candle', 'modern industrial')},
  {slug: 'accents-coffee-table-books',         prompt: SHOT('a curated set of five large hardcover design books stacked on a flat surface, with a small brass detail on top', 'modern minimalism')},
  {slug: 'accents-sculpture-wood',             prompt: SHOT('an abstract sculpted walnut object on a flat surface', 'modern minimalism')},
];

const OUT_DIR = 'public/furniture/cards';
mkdirSync(OUT_DIR, {recursive: true});

console.log(`\nGenerating ${SHOTS.length} variant furniture photos via Replicate Flux 1.1 Pro\n`);

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
