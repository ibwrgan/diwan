#!/usr/bin/env node
// Transcribe the VO with word-level timestamps via Replicate Whisper.
import Replicate from 'replicate';
import {readFileSync, writeFileSync} from 'node:fs';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
const replicate = new Replicate({auth: TOKEN});

const audioBuffer = readFileSync('public/pitch/voiceover-ar.m4a');
const audioB64 = `data:audio/m4a;base64,${audioBuffer.toString('base64')}`;

console.log('Transcribing… (Whisper-large-v3 via Replicate)');
const output = await replicate.run(
  'vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c',
  {
    input: {
      audio: audioB64,
      task: 'transcribe',
      language: 'arabic',
      timestamp: 'word',
      batch_size: 24,
    },
  },
);

console.log('Output keys:', Object.keys(output || {}));
writeFileSync('/tmp/diwan-vo-transcript.json', JSON.stringify(output, null, 2));
console.log('Saved → /tmp/diwan-vo-transcript.json');

// Print the high-level text
if (typeof output === 'object' && output !== null) {
  if (output.text) console.log('\nFULL TEXT:\n', output.text);
  if (Array.isArray(output.chunks)) {
    console.log(`\n${output.chunks.length} word/segment chunks captured`);
    console.log('First 5:', output.chunks.slice(0, 5));
  }
}
