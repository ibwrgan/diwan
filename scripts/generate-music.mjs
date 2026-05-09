#!/usr/bin/env node
// Generates an ambient instrumental for the /pitch reel using Replicate's
// MusicGen. Saves to public/pitch/music.mp3.
//
// Usage:  node --env-file=.env.local scripts/generate-music.mjs
//         node --env-file=.env.local scripts/generate-music.mjs --duration=30
//
// Cost: ~$0.04 per 30s on meta/musicgen stereo-large.

import Replicate from 'replicate';
import {writeFileSync, mkdirSync} from 'node:fs';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) {
  console.error('REPLICATE_API_TOKEN missing.');
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const durArg = [...args].find((a) => a.startsWith('--duration='))?.split('=')[1];
const duration = durArg ? Math.min(60, Math.max(8, Number(durArg))) : 30;

const replicate = new Replicate({auth: TOKEN});

const PROMPT =
  'Slow, contemplative, cinematic instrumental in a Najdi heritage mood. ' +
  'Soft oud melody, distant warm strings, low cello drone, gentle desert ' +
  'ambience. No percussion. No vocals. Restrained, refined, dignified — ' +
  'suitable for a Saudi luxury brand pitch video. Stereo, smooth, soft attack.';

console.log(`\nGenerating ${duration}s ambient track via Replicate MusicGen...\n`);
console.log('Prompt:', PROMPT, '\n');

const output = await replicate.run('meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb', {
  input: {
    prompt: PROMPT,
    duration,
    model_version: 'stereo-large',
    output_format: 'mp3',
    normalization_strategy: 'peak',
    temperature: 0.95,
    top_k: 250,
    classifier_free_guidance: 3,
  },
});

const url = Array.isArray(output) ? String(output[0]) : String(output);
console.log('  Downloading from', url);

const res = await fetch(url);
if (!res.ok) {
  console.error('  Download failed:', res.status);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
mkdirSync('public/pitch', {recursive: true});
writeFileSync('public/pitch/music.mp3', buf);
console.log(`\n✓ Saved public/pitch/music.mp3 — ${(buf.length / 1024).toFixed(0)} KB\n`);
