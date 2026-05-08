'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowRight, ArrowLeft, Check, Sparkles} from 'lucide-react';
import {loadSpace, type SpaceState, SPACE_INITIAL} from '@/lib/spaceStore';
import {loadQuizState} from '@/lib/quizStore';
import {loadDesigns, saveDesigns} from '@/lib/designStore';
import {computeTasteVector, QUIZ} from '@/data/quiz';
import {SAMPLE_PLANS} from '@/data/floorPlans';
import {INSPIRATION_BOARDS} from '@/data/inspirationBoards';
import type {PipelineRequest, GeneratedDesigns} from '@/lib/ai/types';
import {FloorPlanSVG} from './FloorPlanSVG';

export function Dashboard({locale}: {locale: string}) {
  const t = useTranslations('Dashboard');
  const tSpace = useTranslations('Space');
  const tRoom = useTranslations('Space.roomTypes');
  const tBoard = useTranslations('Space.boards');
  const tPlan = useTranslations('Space.plans');

  const [state, setState] = useState<SpaceState>(SPACE_INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [designs, setDesigns] = useState<GeneratedDesigns | null>(null);
  const [pipelineMode, setPipelineMode] = useState<'live' | 'mock' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    setState(loadSpace());
    const existing = loadDesigns();
    if (existing) {
      setDesigns(existing);
      setProgress(100);
    }
    setHydrated(true);
  }, []);

  // Kick off the AI pipeline once on mount (if not already cached)
  useEffect(() => {
    if (!hydrated) return;
    if (designs) return;
    if (triggered.current) return;
    triggered.current = true;

    const space = loadSpace();
    const quiz = loadQuizState();
    if (!space.rooms.length) {
      // Without rooms, nothing to generate — leave progress at 0
      return;
    }

    const taste = computeTasteVector(quiz.answers);
    const budgetAns = quiz.answers['q9'];
    const timelineAns = quiz.answers['q10'];
    const mustHavesAns = quiz.answers['q11'];
    const colorAns = quiz.answers['q12'];
    const budget = budgetAns?.type === 'range' ? budgetAns.value : 150_000;
    const timelineWeeks = timelineAns?.type === 'range' ? timelineAns.value : 8;
    const mustHaves = mustHavesAns?.type === 'multiSelect' ? mustHavesAns.selected : [];
    const colorVoice = colorAns?.type === 'singleSelect' ? colorAns.key : 'warm';

    const req: PipelineRequest = {
      taste,
      inspirations: space.inspirations,
      budget,
      timelineWeeks,
      rooms: space.rooms.map((r) => ({id: r.id, type: r.type, label: r.label, widthM: r.widthM, heightM: r.heightM})),
      mustHaves,
      colorVoice,
    };

    // Probe live availability so we can label the badge
    fetch('/api/generate-designs').then((r) => r.json()).then((d: {live: boolean}) => setPipelineMode(d.live ? 'live' : 'mock')).catch(() => {});

    const fast = typeof window !== 'undefined' && localStorage.getItem('diwan.pitchMode.fast.v1') === '1';
    fetch(`/api/generate-designs${fast ? '?fast=1' : ''}`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(req),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Pipeline ${r.status}`);
        const result = (await r.json()) as GeneratedDesigns;
        setDesigns(result);
        saveDesigns(result);
        setProgress(100);
      })
      .catch((e) => {
        console.error(e);
        setError(e?.message ?? 'pipeline failed');
      });
  }, [hydrated, designs]);

  // While generation runs, animate progress smoothly so the UI feels alive
  useEffect(() => {
    if (!hydrated || designs) return;
    const fast = typeof window !== 'undefined' && localStorage.getItem('diwan.pitchMode.fast.v1') === '1';
    const id = window.setInterval(() => {
      setProgress((p) => (p < 92 ? Math.min(92, p + (fast ? 14 : 3.5) + 0.5) : p));
    }, fast ? 200 : 1200);
    return () => window.clearInterval(id);
  }, [hydrated, designs]);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  const plan = SAMPLE_PLANS.find((p) => p.id === state.planId);
  const totalArea = state.rooms.reduce((s, r) => s + r.widthM * r.heightM, 0);
  const phases = t.raw('etaPhases') as Array<{k: string; label: string}>;
  const phasePct = 100 / phases.length;

  const fmt = (n: number) => n.toLocaleString('en-US', {maximumFractionDigits: 1});

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Greeting */}
        <header className="flex flex-col gap-3">
          <span className="eyebrow">{t('greeting')}</span>
          <h1 className="h-display">{t('subgreeting')}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ETA + phases */}
          <div className="lg:col-span-7 flex flex-col gap-6 p-8 md:p-10 rounded-sm midnight">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">{t('etaTitle')}</span>
              <h2 className="h-section">{t('etaTitle')}</h2>
              <p className="lede max-w-[480px]">{t('etaLede')}</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex justify-between font-sans uppercase text-sand-100/80" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                <span>{t('etaProgressLabel')}</span>
                <span className="tabular">{Math.round(progress)} %</span>
              </div>
              <div className="relative h-1.5 bg-cream-20 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 ltr:left-0 rtl:right-0 bg-clay-400 rounded-full transition-all duration-700 ease-out"
                  style={{width: `${progress}%`}}
                />
              </div>
            </div>

            <ul className="flex flex-col gap-3 mt-4">
              {phases.map((p, i) => {
                const min = i * phasePct;
                const isDone = progress >= min + phasePct;
                const isActive = !isDone && progress >= min;
                return (
                  <li key={p.k} className="flex items-center gap-3">
                    <span
                      className={[
                        'inline-flex items-center justify-center h-6 w-6 rounded-full flex-shrink-0',
                        isDone ? 'bg-clay-400 text-midnight-950' : isActive ? 'bg-clay-700 text-sand-100' : 'border border-cream-40 text-cream-60',
                      ].join(' ')}
                      style={{fontSize: '11px', fontWeight: 600}}
                    >
                      {isDone ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className={`font-sans ${isDone ? 'text-sand-100' : isActive ? 'text-clay-400' : 'text-cream-60'}`} style={{fontSize: '15px'}}>
                      {p.label}
                    </span>
                    {isActive && (
                      <span className="ms-auto font-sans uppercase text-clay-400" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                        in progress
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap gap-3 mt-4 pt-6 border-t border-cream-20 items-center">
              {designs ? (
                <Link href="/designs" className="btn-primary !bg-clay-400 !text-midnight-950 hover:!bg-sand-100 inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('designsReady')}
                  <ArrowRight className="rtl:hidden h-4 w-4" />
                  <ArrowLeft className="hidden rtl:inline h-4 w-4" />
                </Link>
              ) : (
                <button disabled className="btn-primary !bg-cream-20 !text-cream-60 cursor-not-allowed">
                  {t('notYet')}
                </button>
              )}
              {pipelineMode && (
                <span
                  className={`font-sans uppercase px-3 py-1 rounded-full ${pipelineMode === 'live' ? 'bg-success/20 text-success' : 'bg-clay-400/20 text-clay-400'}`}
                  style={{fontSize: '10px', letterSpacing: '0.18em'}}
                >
                  {pipelineMode === 'live' ? '● Live AI' : '● Demo mode'}
                </span>
              )}
              {error && <span className="font-sans text-error" style={{fontSize: '12px'}}>{error}</span>}
            </div>
          </div>

          {/* Project summary */}
          <aside className="lg:col-span-5 flex flex-col gap-5 p-8 md:p-10 rounded-sm border border-ink-12 bg-bone">
            <header className="flex flex-col gap-2">
              <span className="eyebrow">{t('summaryTitle')}</span>
              <h3 className="h-section" style={{fontSize: '28px'}}>{t('summaryTitle')}</h3>
            </header>

            {plan && state.planSize && (
              <FloorPlanSVG
                size={state.planSize}
                rooms={state.rooms.map((r) => ({id: r.id, type: r.type, label: tRoom(r.type), x: r.x, y: r.y, w: r.w, h: r.h}))}
                showLabels={false}
                height={220}
              />
            )}

            <dl className="flex flex-col divide-y divide-ink-12">
              <Row k={t('summary.plan')}        v={plan ? tPlan(plan.name) : (state.planId === 'upload' ? 'Custom upload' : '—')} />
              <Row k={t('summary.rooms')}       v={`${state.rooms.length}`} />
              <Row k={t('summary.area')}        v={`${fmt(totalArea)} ${tSpace('step2.areaUnit')}`} />
              <Row k={t('summary.inspirations')} v={`${state.inspirations.boardIds.length} ${t('summary.boards')}, ${state.inspirations.pinterestUrls.length + state.inspirations.uploadCount} pins/uploads`} />
            </dl>

            {state.inspirations.boardIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {state.inspirations.boardIds.map((id) => {
                  const b = INSPIRATION_BOARDS.find((x) => x.id === id);
                  if (!b) return null;
                  return (
                    <span key={id} className="font-sans uppercase px-3 py-1 rounded-full border border-clay-700/30 text-clay-700" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                      {tBoard(`${b.name}.name`)}
                    </span>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({k, v}: {k: string; v: string}) {
  return (
    <div className="flex justify-between items-baseline py-3 gap-4">
      <dt className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{k}</dt>
      <dd className="font-serif font-bold text-end" style={{fontSize: '15px'}}>{v}</dd>
    </div>
  );
}
