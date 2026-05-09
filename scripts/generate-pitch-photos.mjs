#!/usr/bin/env node
// Generates the "problem state" + "measurement" photos that ground the
// pitch reel's narrative. Saves into public/pitch/.

import Replicate from 'replicate';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
const replicate = new Replicate({auth: TOKEN});

const PHOTOS = [
  {
    out: 'public/pitch/problem-shell.jpg',
    aspect: '16:9',
    prompt:
      "Photograph of a raw empty Saudi villa interior at handover day. Bare concrete walls, " +
      "dust on the floor, exposed electrical conduit, no furniture, no doors, harsh worklight " +
      "from a single bare bulb, plastic sheeting in the corner. Realistic, slightly chaotic, " +
      "the BEFORE state. Wide angle, 35mm, no people, no text, no watermark.",
  },
  {
    out: 'public/pitch/problem-chaos.jpg',
    aspect: '16:9',
    prompt:
      "Photograph of a homeowner's living room cluttered with mismatched furniture samples — " +
      "cardboard boxes labeled with different supplier names, sample fabric swatches, paint " +
      "tester pots, three contractor binders fanned out on a folding table, an open laptop " +
      "with five email tabs visible. Stress, confusion, paralysis. Daylight, realistic, " +
      "documentary photography. No people, no text, no watermark.",
  },
  {
    out: 'public/pitch/empty-room.jpg',
    aspect: '16:9',
    prompt:
      "Editorial wide-angle architectural photograph of a clean, empty Saudi villa interior — " +
      "freshly plastered cream-colored walls, polished concrete floor, a single tall window " +
      "letting in soft morning light, generous high ceiling, no furniture, no people, no " +
      "construction debris, just a calm empty space ready for design. 35mm, sharp, " +
      "professional architectural photography, golden-hour warm tones, ultra-sharp, " +
      "no text, no watermark.",
  },
  {
    out: 'public/pitch/install-progress.jpg',
    aspect: '16:9',
    prompt:
      "Editorial wide-angle photograph of a Najdi-style Saudi majlis interior in mid-" +
      "installation. A clay-velvet sofa is half-unwrapped from clear protective film, a " +
      "brass pendant light is suspended mid-installation with cables visible, a Najdi-" +
      "pattern wool rug is half-rolled out on a polished concrete floor. Carved cedar " +
      "mashrabiya screens already mounted on the wall. Tools and a clay hardhat sit on " +
      "a nearby step ladder. Soft afternoon light. No people visible. Architectural " +
      "interior photography, 35mm, ultra-sharp, no text, no watermark.",
  },
  {
    out: 'public/pitch/ipad-moodboard.jpg',
    aspect: '16:9',
    prompt:
      "Editorial close-up photograph of an iPad lying on a walnut desk, screen showing a " +
      "Pinterest-style mood board grid of nine images: carved cedar mashrabiya, brass " +
      "espresso machine, clay-velvet sofa, terracotta tones, hammered brass tray, Najdi " +
      "rug pattern, walnut shelving, hand-poured mud plaster wall, limestone floor. Soft " +
      "warm window light. No people, no hands visible. 35mm, sharp focus on the iPad, " +
      "shallow depth of field, professional product photography, no text overlays.",
  },
];

mkdirSync('public/pitch', {recursive: true});

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');

for (const p of PHOTOS) {
  if (!FORCE && existsSync(p.out)) {
    console.log(`× skip (exists)  ${p.out}`);
    continue;
  }
  console.log(`→ generating    ${p.out}`);
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const out = await replicate.run('black-forest-labs/flux-1.1-pro', {
        input: {prompt: p.prompt, aspect_ratio: p.aspect, output_format: 'jpg', output_quality: 92, safety_tolerance: 2},
      });
      const url = Array.isArray(out) ? String(out[0]) : String(out);
      const r = await fetch(url); if (!r.ok) throw new Error(`fetch ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(p.out, buf);
      console.log(`  ✓ ${(buf.length/1024).toFixed(0)} KB`);
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
      console.error(`  ✗ ${msg}`); break;
    }
  }
}
console.log('\n✓ Done\n');
