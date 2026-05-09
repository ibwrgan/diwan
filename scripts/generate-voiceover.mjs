#!/usr/bin/env node
// Generates a placeholder Arabic voice-over for the /pitch reel using
// macOS' built-in `say` command with the Majed (Saudi) voice.
//
// Usage: node scripts/generate-voiceover.mjs
//
// Replace public/pitch/voiceover-ar.m4a with your own recording at any time
// — the PitchReel will pick it up automatically.

import {execSync} from 'node:child_process';
import {writeFileSync, mkdirSync, existsSync, unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

// Mirror of PITCH_SCRIPT timings — keep in sync with src/components/pitch/script.ts
const SCENES = [
  {start:   0, end:   8, ar: 'ديوان — حيث تأخذ الفضاءات شكلها. بيوت ومحلّات سعوديّة، تُسلَّم خلال ثلاثين يوماً.'},
  {start:   8, end:  24, ar: 'تتسلّم العائلة السعودية مفتاح بيتها — صندوقاً فارغاً. ثم تبدأ الرحلة: ستّة أشهر، ثمانية موردين، ثلاثة مقاولين بوعود متضاربة، ولا شخص واحد مسؤول عن النتيجة.'},
  {start:  24, end:  38, ar: 'وُجد ديوان لأنّ التصميم والتنفيذ قرار واحد — لا ثمانية. توقيع واحد. رقم هاتف واحد. ضمان واحد على كامل التجهيز لمدّة اثني عشر شهراً.'},
  {start:  38, end:  58, ar: 'ائتنا بإلهامات Pinterest، أو لوحة هويّة، أو حتى صور بيت ضيّقة من الجوّال. يحوّلها ذكاء ديوان إلى تصاميم أوّليّة خلال ثوانٍ. ثمّ يأتي فريقنا للقياس مجاناً — قياس دقيق بالملّيمتر — أو يقبل ديوان ملفّك الهندسي إن كان جاهزاً.'},
  {start:  58, end:  76, ar: 'كلّ مشروع يخرج بمخطّط هندسي ثنائي الأبعاد مختوم — مجلس، وصالة عائلة، ومُصلَّى بقبلة دقيقة، ومطبخ، وغرف نوم — مرسوم بمنطقنا السعودي. توقّع مرّة واحدة على هذا الرّسم — يبدأ الإنتاج في اليوم نفسه.'},
  {start:  76, end:  96, ar: 'نحدّد كلّ مادّة على حِدة — أرز محفور، نُحاس مَطْروق، حجر كلسي، طين مصبوب يدوياً، صوف وكتّان. شبكة موردينا من ستّة إلى أحد عشر موردًا تُورِّد تحت أمر شراء واحد بإسم ديوان. نُدير التركيب، والكهرباء، والسباكة، والقبول النهائي. أنت لا تتعامل إلا معنا.'},
  {start:  96, end: 114, ar: 'اثنا عشر مشروعاً مُسلَّماً عبر المملكة. فيلا نجدية في النخيل، طابق استثماري خاص في KAFD، محمصة قهوة على شارع العُلَيّا، مقهى تراثي بمحاذاة البُجَيْري، تاون هاوس عائلي في حِطّين. كلّها تحت ديوان.'},
  {start: 114, end: 128, ar: 'ما يميّز ديوان: ثلاثون يوماً متوسّط التسليم. أرخص من المجموع التجزئة بأربعة عشر بالمائة. رقم واحد لمتابعة ما بعد البيع لاثني عشر شهراً. هويّة سعوديّة بيد متخصّصين. ابدأ فضاءك على diwan.sa'},
];

const OUT_DIR = 'public/pitch';
const OUT_FILE = join(OUT_DIR, 'voiceover-ar.m4a');
const VOICE = 'Majed';
const RATE = 165; // words/minute — slow, formal cadence

mkdirSync(OUT_DIR, {recursive: true});

const tmp = tmpdir();
const sceneFiles = [];

console.log(`\nGenerating Arabic VO with macOS '${VOICE}' voice at ${RATE} wpm...\n`);

for (let i = 0; i < SCENES.length; i++) {
  const s = SCENES[i];
  const targetDur = s.end - s.start;
  const sceneAiff = join(tmp, `diwan-scene-${i}.aiff`);
  const padAiff = join(tmp, `diwan-pad-${i}.aiff`);

  // 1. Generate the line at AIFF format
  const safeText = s.ar.replace(/"/g, '\\"');
  execSync(`say -v ${VOICE} -r ${RATE} -o "${sceneAiff}" "${safeText}"`);

  // 2. Probe duration via afinfo (built into macOS)
  const info = execSync(`afinfo "${sceneAiff}"`).toString();
  const durMatch = info.match(/estimated duration:\s*([\d.]+)\s*sec/i);
  const dur = durMatch ? parseFloat(durMatch[1]) : targetDur;
  const padNeeded = Math.max(0, targetDur - dur - 0.2);

  console.log(`  scene ${i + 1} : "${s.ar.slice(0, 40)}…" → ${dur.toFixed(1)}s (target ${targetDur}s, pad +${padNeeded.toFixed(1)}s)`);

  // 3. Pad to target duration with silence (so each scene aligns with PITCH_SCRIPT timing)
  if (padNeeded > 0.05) {
    // Generate a short silent file by saying " " then trimming, fall back: just use scene as-is
    // afconvert can't synthesize silence directly, so we use `say` with whitespace + slow rate.
    // Simplest: append silence using sox if available, or just leave it short.
    // We use Python to make the silence — most macs have it.
    try {
      execSync(`python3 -c "import wave, struct; f = wave.open('${padAiff.replace('.aiff','.wav')}', 'w'); f.setnchannels(1); f.setsampwidth(2); f.setframerate(22050); f.writeframes(b'\\x00\\x00' * int(${padNeeded} * 22050)); f.close()"`);
      // concat scene + silence into one m4a per scene
      const padWav = padAiff.replace('.aiff', '.wav');
      const concatList = join(tmp, `diwan-list-${i}.txt`);
      writeFileSync(concatList, `file '${sceneAiff}'\nfile '${padWav}'\n`);
      sceneFiles.push(concatList);
      sceneFiles.push(sceneAiff);
      sceneFiles.push(padWav);
    } catch {
      sceneFiles.push(sceneAiff);
    }
  }
  sceneFiles.push(sceneAiff);
}

// Final concat: build a list of just the AIFF files in order, with silence-pad WAVs interleaved
// Simpler approach: re-run, building a single big AIFF using `say` with SSML-ish pauses encoded
// as repeated " ... " between scenes.

console.log('\nMerging scenes into a single file...\n');

// Build one big text with placeholder pauses encoded by repetition. macOS `say` interprets
// "[[slnc 800]]" as 800ms of silence — that's exactly what we need.
let combined = '';
for (let i = 0; i < SCENES.length; i++) {
  if (i > 0) {
    const prev = SCENES[i - 1];
    const gap = SCENES[i].start - prev.start; // scene-to-scene gap in seconds
    // crude: rest a bit between scenes; the visual track is on its own timer anyway
    combined += ` [[slnc 600]] `;
  }
  combined += SCENES[i].ar + ' ';
}

const finalAiff = join(tmp, 'diwan-pitch-full.aiff');
const safeCombined = combined.replace(/"/g, '\\"');
execSync(`say -v ${VOICE} -r ${RATE} -o "${finalAiff}" "${safeCombined}"`);

// Convert AIFF → m4a (AAC) so it plays everywhere
execSync(`afconvert -f m4af -d aac "${finalAiff}" "${OUT_FILE}"`);

const sz = execSync(`stat -f %z "${OUT_FILE}"`).toString().trim();
const dur = (() => {
  const info = execSync(`afinfo "${OUT_FILE}"`).toString();
  const m = info.match(/estimated duration:\s*([\d.]+)\s*sec/i);
  return m ? parseFloat(m[1]).toFixed(1) : '?';
})();

// Cleanup temp files
try { unlinkSync(finalAiff); } catch {}
sceneFiles.forEach((f) => { try { unlinkSync(f); } catch {} });

console.log(`✓ Wrote ${OUT_FILE} — ${(parseInt(sz, 10) / 1024).toFixed(0)} KB · ${dur}s\n`);
console.log(`  This is a robotic placeholder. Replace public/pitch/voiceover-ar.m4a`);
console.log(`  with your own recording (any audio format) when ready.\n`);
