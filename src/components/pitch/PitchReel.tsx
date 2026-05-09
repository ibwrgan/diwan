'use client';

import {useEffect, useRef, useState, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize} from 'lucide-react';
import {SAMPLE_PLANS} from '@/data/floorPlans';
import {FloorPlanSVG} from '@/components/space/FloorPlanSVG';
import {PITCH_SCRIPT, ALL_SEGMENTS, TOTAL_DURATION} from './script';
import {ServiceScene, InstallScene} from './IllustratedScenes';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current as (HTMLDivElement & {webkitRequestFullscreen?: () => Promise<void>}) | null;
    const doc = document as Document & {webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void>};
    const inFs = doc.fullscreenElement || doc.webkitFullscreenElement;
    if (inFs) {
      (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc)?.catch?.(() => {});
      return;
    }
    if (!el) return;
    const req = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (req) {
      const result = req.call(el);
      // iOS Safari sometimes resolves but doesn't actually go fullscreen, or
      // throws synchronously without rejecting. Fallback to opening the reel
      // in a top-level tab where the fixed inset-0 layout fills the screen.
      if (result && typeof result.catch === 'function') {
        result.catch(() => openInTopWindow());
      }
    } else {
      openInTopWindow();
    }
  };

  // Fallback fullscreen: open /pitch in the parent window so the iframe
  // chrome doesn't constrain it. Useful on iOS Safari where iframe
  // requestFullscreen often doesn't work.
  const openInTopWindow = () => {
    try {
      const target = `/${locale}/pitch`;
      if (window.top && window.top !== window.self) {
        window.top.location.href = target;
      } else {
        window.location.href = target;
      }
    } catch {
      window.open(`/${locale}/pitch`, '_blank');
    }
  };

  // Seek to a fraction of the timeline (0..1).
  const seek = (frac: number) => {
    const t = Math.max(0, Math.min(TOTAL_DURATION, frac * TOTAL_DURATION));
    setTime(t);
    if (voRef.current && hasVO) voRef.current.currentTime = t;
  };

  const onScrubPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const rect = target.getBoundingClientRect();
    const handle = (clientX: number) => {
      const frac = (clientX - rect.left) / rect.width;
      seek(frac);
    };
    handle(e.clientX);
    const onMove = (ev: PointerEvent) => handle(ev.clientX);
    const onUp = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', onUp);
      target.removeEventListener('pointercancel', onUp);
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {}
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onUp);
  };

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
    <div ref={containerRef} className="fixed inset-0 bg-ink text-bone overflow-hidden flex flex-col" dir={isAr ? 'rtl' : 'ltr'}>
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
        <div className="relative w-full max-w-3xl flex justify-center" style={{minHeight: 70}}>
          <motion.div
            key={activeSegment.at}
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.18}}
            className="bg-ink/55 backdrop-blur-sm rounded-md px-5 py-2.5"
            style={{maxWidth: '100%'}}
            dir="rtl"
          >
              <p
                className="font-arabic font-medium text-bone text-center"
                style={{
                  fontSize: 'clamp(15px, 1.9vw, 24px)',
                  lineHeight: 1.45,
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
          <button
            onClick={toggleFullscreen}
            className="text-bone/70 hover:text-bone transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <div
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(overallProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onPointerDown={onScrubPointer}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') seek(Math.max(0, overallProgress - 0.02));
              else if (e.key === 'ArrowRight') seek(Math.min(1, overallProgress + 0.02));
            }}
            className="flex-1 group cursor-pointer touch-none flex items-center"
            style={{minHeight: 32, padding: '14px 0'}}
          >
            <div className="relative h-1 w-full bg-bone/20 rounded-full overflow-visible group-hover:h-1.5 transition-all">
              <div className="absolute inset-y-0 left-0 bg-clay-400 rounded-full" style={{width: `${overallProgress * 100}%`}} />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-clay-400 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{left: `${overallProgress * 100}%`}}
              />
            </div>
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
        <motion.div
          initial={{opacity: 0, scale: 0.85}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 1.0, delay: 0.1}}
          className="text-clay-400"
          style={{width: 'clamp(80px, 9vw, 130px)', height: 'clamp(80px, 9vw, 130px)'}}
        >
          <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
            <path d="M10 56 V28 a22 22 0 0 1 44 0 V56" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M20 56 V32 a12 12 0 0 1 24 0 V56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.55" />
            <path d="M27 46 q5 -2 10 0 q-1 4 -5 4 q-4 0 -5 -4 z" fill="currentColor" />
            <line x1="6" y1="56" x2="58" y2="56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </motion.div>
        <motion.h1
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1.0, delay: 0.6}}
          className="font-arabic font-bold text-clay-400 mt-6"
          style={{fontSize: 'clamp(56px, 10vw, 150px)', letterSpacing: '-0.02em', lineHeight: 1}}
        >
          ديوان
        </motion.h1>
        <motion.p
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 1.0, delay: 1.1}}
          className="font-serif text-bone/70 mt-3"
          style={{fontSize: 'clamp(14px, 1.6vw, 22px)', letterSpacing: '0.4em'}}
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

  if (v.kind === 'illustrated') {
    return (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        className="absolute inset-0"
      >
        {v.scene === 'service' && <ServiceScene progress={progress} />}
        {v.scene === 'install' && <InstallScene progress={progress} />}
      </motion.div>
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
