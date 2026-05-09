'use client';

import {useEffect, useRef, useState, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Play, Pause, RotateCcw, Volume2, VolumeX} from 'lucide-react';
import {SAMPLE_PLANS} from '@/data/floorPlans';
import {FloorPlanSVG} from '@/components/space/FloorPlanSVG';
import {PITCH_SCRIPT, ALL_SEGMENTS, TOTAL_DURATION} from './script';

const VO_SRC = '/pitch/voiceover-ar.m4a';
const MUSIC_SRC = '/pitch/music.mp3';

export function PitchReel({locale}: {locale: string}) {
  const isAr = locale === 'ar';
  const voRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasVO, setHasVO] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(VO_SRC, {method: 'HEAD'}).then((r) => setHasVO(r.ok)).catch(() => setHasVO(false));
    fetch(MUSIC_SRC, {method: 'HEAD'}).then((r) => setHasMusic(r.ok)).catch(() => setHasMusic(false));
  }, []);

  // Music ducks to 25% under the VO; plays full when VO absent.
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = hasVO ? 0.25 : 0.55;
  }, [hasVO]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now() - time * 1000;
    const tick = () => {
      const vo = voRef.current;
      const elapsed = vo && hasVO ? vo.currentTime : (performance.now() - t0) / 1000;
      if (elapsed >= TOTAL_DURATION) {
        setTime(TOTAL_DURATION);
        setPlaying(false);
        return;
      }
      setTime(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, hasVO, time]);

  const start = () => {
    setStarted(true);
    if (voRef.current && hasVO) {
      voRef.current.currentTime = time;
      voRef.current.play().catch(() => {});
    }
    if (musicRef.current && hasMusic) {
      musicRef.current.play().catch(() => {});
    }
    setPlaying(true);
  };
  const pause = () => {
    voRef.current?.pause();
    musicRef.current?.pause();
    setPlaying(false);
  };
  const restart = () => {
    setTime(0);
    if (voRef.current) voRef.current.currentTime = 0;
    if (musicRef.current) musicRef.current.currentTime = 0;
    if (!playing) start();
    else {
      if (voRef.current && hasVO) voRef.current.play().catch(() => {});
      if (musicRef.current && hasMusic) musicRef.current.play().catch(() => {});
    }
  };

  const scene = useMemo(() => {
    return PITCH_SCRIPT.find((s) => time >= s.start && time < s.end) ?? PITCH_SCRIPT[PITCH_SCRIPT.length - 1];
  }, [time]);

  const sceneIndex = PITCH_SCRIPT.indexOf(scene);
  const sceneProgress = (time - scene.start) / (scene.end - scene.start);
  const overallProgress = time / TOTAL_DURATION;

  // Find the latest segment whose start time has passed.
  const activeSegment = useMemo(() => {
    let best = ALL_SEGMENTS[0];
    for (const s of ALL_SEGMENTS) {
      if (time >= s.at) best = s;
      else break;
    }
    return best;
  }, [time]);

  return (
    <div className="fixed inset-0 bg-ink text-bone overflow-hidden flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
      <audio
        ref={voRef}
        src={VO_SRC}
        preload="auto"
        muted={muted}
        onEnded={() => setPlaying(false)}
      />
      <audio
        ref={musicRef}
        src={MUSIC_SRC}
        preload="auto"
        loop
        muted={muted}
      />

      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <SceneFrame key={sceneIndex} scene={scene} progress={sceneProgress} isAr={isAr} />
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 top-6 flex justify-between items-center px-8 z-30">
        <span className="font-serif text-bone/80" style={{fontSize: '20px', letterSpacing: '0.02em'}}>
          DIWAN <span className="font-arabic font-bold ms-2">ديوان</span>
        </span>
        <span className="font-mono text-bone/60 tabular" style={{fontSize: '12px'}}>
          {fmtTime(time)} / {fmtTime(TOTAL_DURATION)}
        </span>
      </div>

      {/* Subtitle bar — Arabic only, max 2 lines, time-synced segments */}
      <div className="absolute inset-x-0 bottom-24 flex justify-center px-6 z-30 pointer-events-none">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment.at}
              initial={{opacity: 0, y: 12}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -8}}
              transition={{duration: 0.35}}
              className="bg-ink/55 backdrop-blur-sm rounded-md px-7 py-4 mx-auto"
              style={{
                width: 'fit-content',
                maxWidth: '100%',
              }}
              dir="rtl"
            >
              <p
                className="font-arabic font-medium text-bone text-center"
                style={{
                  fontSize: 'clamp(22px, 2.9vw, 36px)',
                  lineHeight: 1.5,
                  textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {activeSegment.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 px-6 py-5 z-30 bg-gradient-to-t from-ink to-transparent">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={playing ? pause : start}
            className="bg-clay-700 hover:bg-clay-400 transition-colors rounded-full w-12 h-12 flex items-center justify-center"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ms-0.5" />}
          </button>
          <button
            onClick={restart}
            className="text-bone/70 hover:text-bone transition-colors"
            aria-label="Restart"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="text-bone/70 hover:text-bone transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <div className="flex-1 h-1 bg-bone/20 rounded-full overflow-hidden">
            <div className="h-full bg-clay-400" style={{width: `${overallProgress * 100}%`}} />
          </div>
          <span className="font-mono text-bone/60 tabular" style={{fontSize: '11px'}}>
            scene {sceneIndex + 1} / {PITCH_SCRIPT.length}
          </span>
        </div>
      </div>

      {!started && (
        <button
          onClick={start}
          className="absolute inset-0 flex items-center justify-center z-40 bg-ink/40 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="bg-clay-700 hover:bg-clay-400 transition-colors rounded-full w-24 h-24 flex items-center justify-center">
              <Play className="h-9 w-9 ms-1" />
            </div>
            <div className="text-center">
              <p className="font-serif text-bone" style={{fontSize: '28px'}}>
                {isAr ? 'تعرّف على ديوان في دقيقتَين' : 'Meet Diwan in two minutes'}
              </p>
              <p className="font-sans text-bone/60 mt-2" style={{fontSize: '14px'}}>
                {hasVO
                  ? (isAr ? 'تعليق صوتي وترجمة' : 'Arabic voice-over · subtitles')
                  : (isAr ? 'موسيقى مع ترجمة · تعليق صوتي قريباً' : 'Music + subtitles · voice-over coming soon')}
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

function SceneFrame({scene, progress, isAr}: {scene: typeof PITCH_SCRIPT[number]; progress: number; isAr: boolean}) {
  const v = scene.visual;

  if (v.kind === 'title') {
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.6}}
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ink via-midnight-950 to-clay-700"
      >
        <motion.h1
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1.2, delay: 0.3}}
          className="font-arabic font-bold text-clay-400"
          style={{fontSize: 'clamp(64px, 12vw, 180px)', letterSpacing: '-0.02em'}}
        >
          ديوان
        </motion.h1>
        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1.2, delay: 1.2}}
          className="font-serif text-bone/70 mt-2"
          style={{fontSize: 'clamp(16px, 2vw, 28px)', letterSpacing: '0.4em'}}
        >
          DIWAN
        </motion.p>
      </motion.div>
    );
  }

  if (v.kind === 'photo') {
    const scale = v.zoom === 'in' ? 1 + progress * 0.08 : 1.08 - progress * 0.08;
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url('${v.src}')`, transform: `scale(${scale})`}}
      />
    );
  }

  if (v.kind === 'photoPair') {
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        className="absolute inset-0 grid grid-cols-2"
      >
        <div
          className="bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${v.left}')`,
            transform: `scale(${1 + progress * 0.05}) translateX(${-progress * 1}%)`,
          }}
        />
        <div
          className="bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${v.right}')`,
            transform: `scale(${1 + progress * 0.05}) translateX(${progress * 1}%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/55" />
      </motion.div>
    );
  }

  if (v.kind === 'plan') {
    const plan = SAMPLE_PLANS.find((p) => p.id === v.planId);
    return (
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.6}}
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sand-100 via-bone to-limestone-200 p-12"
      >
        <p className="font-sans uppercase text-ink-60 mb-6" style={{fontSize: '12px', letterSpacing: '0.28em'}}>
          {isAr ? 'مخطّط هندسي مختوم — يبدأ الإنتاج فور التوقيع' : 'Stamped 2D engineering layout — production starts on signature'}
        </p>
        {plan && (
          <div className="bg-white rounded-sm shadow-2xl p-8 w-full max-w-3xl">
            <FloorPlanSVG
              size={plan.size}
              rooms={plan.rooms.map((r) => ({id: r.id, type: r.defaultType, label: r.label, x: r.x, y: r.y, w: r.w, h: r.h}))}
              height={420}
            />
          </div>
        )}
      </motion.div>
    );
  }

  if (v.kind === 'closeups') {
    const tilesShown = Math.min(v.sources.length, Math.max(1, Math.ceil(progress * v.sources.length * 1.05)));
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        className="absolute inset-0 bg-ink p-8 md:p-16 flex items-center justify-center"
      >
        <div
          className="grid gap-3 md:gap-4 w-full max-w-6xl"
          style={{gridTemplateColumns: `repeat(${v.sources.length}, minmax(0, 1fr))`}}
        >
          {v.sources.map((src, i) => (
            <motion.div
              key={src}
              initial={{opacity: 0, scale: 0.94}}
              animate={{opacity: i < tilesShown ? 1 : 0.15, scale: i < tilesShown ? 1 : 0.94}}
              transition={{duration: 0.6}}
              className="aspect-square bg-cover bg-center rounded-sm"
              style={{backgroundImage: `url('${src}')`}}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (v.kind === 'montage') {
    const dwell = 1 / v.sources.length;
    const active = Math.min(v.sources.length - 1, Math.floor(progress / dwell));
    const item = v.sources[active];
    return (
      <motion.div
        key={`montage-${active}`}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.4}}
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url('${item.src}')`, transform: `scale(${1 + (progress % dwell) * 0.4})`}}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/50" />
        <div className="absolute top-1/2 start-12 -translate-y-1/2 max-w-md">
          <p className={`font-${isAr ? 'arabic' : 'serif'} font-bold text-bone drop-shadow-lg`} style={{fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1.05}}>
            {isAr ? item.tagAr : item.tagEn}
          </p>
        </div>
        <div className="absolute bottom-32 inset-x-0 flex justify-center gap-2">
          {v.sources.map((_, i) => (
            <span
              key={i}
              className="h-1 w-8 rounded-full transition-colors"
              style={{background: i === active ? '#D9886B' : 'rgba(250,250,247,0.3)'}}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (v.kind === 'numbers') {
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-midnight-950 via-ink to-clay-700 p-12"
      >
        <p className="font-sans uppercase text-bone/60 mb-12" style={{fontSize: '12px', letterSpacing: '0.32em'}}>
          {isAr ? 'ما يميّز ديوان' : 'What sets Diwan apart'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl">
          {v.rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: 0.15 * i}}
              className="text-center"
            >
              <div className="font-serif font-bold text-clay-400 tabular" style={{fontSize: 'clamp(48px, 6vw, 96px)', lineHeight: 1}}>
                {row.numEn}
              </div>
              <div className={`font-${isAr ? 'arabic' : 'sans'} text-bone/80 mt-3`} style={{fontSize: 'clamp(11px, 1.1vw, 14px)', letterSpacing: isAr ? '0' : '0.04em'}}>
                {isAr ? row.labelAr : row.labelEn}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="font-serif text-bone mt-16" style={{fontSize: 'clamp(18px, 2vw, 28px)', letterSpacing: '0.04em'}}>
          {isAr ? 'ابدأ فضاءك على ' : 'Start your space at '}
          <span className="text-clay-400 font-bold">diwan.sa</span>
        </p>
      </motion.div>
    );
  }

  return null;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, '0')}`;
}
