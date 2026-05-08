'use client';

import {useEffect, useState, useTransition} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {ArrowLeft, ArrowRight, Check} from 'lucide-react';
import {QUIZ, type Answer, type QuizState, type Question, INITIAL_STATE, computeTasteVector} from '@/data/quiz';
import {loadQuizState, saveQuizState, setAnswer, clearQuizState} from '@/lib/quizStore';
import {QuizProgress} from './QuizProgress';
import {ArtPanel} from './ArtPanel';
import {RangeSlider} from './RangeSlider';

export function QuizContainer({locale}: {locale: string}) {
  const t = useTranslations('Quiz');
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [showSavedFlash, setShowSavedFlash] = useState(false);

  useEffect(() => {
    setState(loadQuizState());
    setHydrated(true);
  }, []);

  // Persist on every state change after hydration.
  useEffect(() => {
    if (hydrated) saveQuizState(state);
  }, [state, hydrated]);

  // Render an empty container during SSR + first paint to avoid hydration mismatch.
  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  const isComplete = state.completedAt !== null;
  if (isComplete) {
    return <CompleteScreen state={state} locale={locale} onRestart={() => {
      clearQuizState();
      setState(INITIAL_STATE);
    }} />;
  }

  const idx = state.currentIndex;
  const q = QUIZ[idx];
  const answer = state.answers[q.id];
  const total = QUIZ.length;
  const answeredIndexes = new Set(
    Object.keys(state.answers).map((id) => QUIZ.findIndex((qq) => qq.id === id)).filter((i) => i >= 0)
  );

  const flashSaved = () => {
    setShowSavedFlash(true);
    setTimeout(() => setShowSavedFlash(false), 1500);
  };

  function record(a: Answer) {
    setState((prev) => setAnswer(prev, a));
    flashSaved();
  }

  function next() {
    if (idx === total - 1) {
      // complete
      setState((prev) => ({...prev, completedAt: Date.now()}));
      return;
    }
    setState((prev) => ({...prev, currentIndex: prev.currentIndex + 1}));
  }

  function back() {
    setState((prev) => ({...prev, currentIndex: Math.max(0, prev.currentIndex - 1)}));
  }

  const canAdvance = isAnswerValid(q, answer);

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Top bar */}
      <div className="border-b border-ink-12 bg-sand-100/80 backdrop-blur-md sticky top-16 md:top-20 z-30">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
          <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
            {t('ui.questionOf', {n: idx + 1, total})}
          </span>
          <QuizProgress current={idx} total={total} answered={answeredIndexes} />
          <span
            className={`font-sans uppercase transition-opacity duration-300 ${showSavedFlash ? 'opacity-100' : 'opacity-0'} text-clay-700`}
            style={{fontSize: '11px', letterSpacing: '0.22em'}}
          >
            <Check className="inline h-3 w-3 me-1" />
            {t('ui.saved')}
          </span>
        </div>
      </div>

      {/* Question body */}
      <div className="flex-1 max-w-[1100px] w-full mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col gap-10">
        <QuestionRenderer q={q} answer={answer} onAnswer={record} locale={locale} />
      </div>

      {/* Footer nav */}
      <div className="border-t border-ink-12 bg-bone/40">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={back}
            disabled={idx === 0}
            className="btn-ghost !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{fontSize: '12px'}}
          >
            <ArrowLeft className="rtl:hidden h-4 w-4" />
            <ArrowRight className="hidden rtl:inline h-4 w-4" />
            {t('ui.back')}
          </button>
          <button
            type="button"
            onClick={() => startTransition(next)}
            disabled={!canAdvance}
            className="btn-primary !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{fontSize: '12px'}}
          >
            {idx === total - 1 ? t('complete.continueButton') : t('ui.next')}
            <ArrowRight className="rtl:hidden h-4 w-4" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function isAnswerValid(q: Question, a: Answer | undefined): boolean {
  if (!a) return q.type === 'range';  // range starts with default
  if (a.type === 'multiSelect') return a.selected.length > 0;
  return true;
}

function QuestionRenderer({q, answer, onAnswer, locale}: {q: Question; answer: Answer | undefined; onAnswer: (a: Answer) => void; locale: string}) {
  const t = useTranslations('Quiz');
  const qt = useTranslations(`Quiz.questions.${q.id}`);

  if (q.type === 'visualAB') {
    const choice = answer?.type === 'visualAB' ? answer.choice : null;
    return (
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-3 text-center max-w-[680px] mx-auto">
          <h1 className="h-section">{qt('title')}</h1>
          {hasKey(qt, 'subtitle') && <p className="lede !text-ink-60">{qt('subtitle')}</p>}
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[860px] mx-auto w-full">
          <button type="button" onClick={() => onAnswer({type: 'visualAB', id: q.id, choice: 'A'})} className="text-start">
            <ArtPanel art={q.optionA.art} label={qt('optionA.label')} tags={qt.raw('optionA.tags') as string[]} selected={choice === 'A'} />
          </button>
          <button type="button" onClick={() => onAnswer({type: 'visualAB', id: q.id, choice: 'B'})} className="text-start">
            <ArtPanel art={q.optionB.art} label={qt('optionB.label')} tags={qt.raw('optionB.tags') as string[]} selected={choice === 'B'} />
          </button>
        </div>
      </div>
    );
  }

  if (q.type === 'range') {
    const value = answer?.type === 'range' ? answer.value : q.defaultValue;
    const formatValue = (v: number) =>
      q.formatter === 'sar'
        ? `${v.toLocaleString('en-US')} ${t('ui.currency')}`
        : `${v} ${t('ui.weeks')}`;
    return (
      <div className="flex flex-col gap-12 max-w-[640px] mx-auto w-full">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="h-section">{qt('title')}</h1>
          {hasKey(qt, 'subtitle') && <p className="lede !text-ink-60">{qt('subtitle')}</p>}
        </header>
        <RangeSlider
          value={value}
          onChange={(v) => onAnswer({type: 'range', id: q.id, value: v})}
          min={q.min}
          max={q.max}
          step={q.step}
          formatValue={formatValue}
          rangeLabel={{min: formatValue(q.min), max: formatValue(q.max)}}
        />
      </div>
    );
  }

  if (q.type === 'multiSelect') {
    const selected = answer?.type === 'multiSelect' ? answer.selected : [];
    const options = qt.raw('options') as Array<{k: string; v: string}>;
    const toggle = (k: string) => {
      const next = selected.includes(k) ? selected.filter((s) => s !== k) : [...selected, k];
      onAnswer({type: 'multiSelect', id: q.id, selected: next});
    };
    return (
      <div className="flex flex-col gap-10 max-w-[820px] mx-auto w-full">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="h-section">{qt('title')}</h1>
          {hasKey(qt, 'subtitle') && <p className="lede !text-ink-60">{qt('subtitle')}</p>}
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSel = selected.includes(opt.k);
            return (
              <button
                key={opt.k}
                type="button"
                onClick={() => toggle(opt.k)}
                className={[
                  'flex items-center gap-4 p-5 rounded-sm border text-start transition-all',
                  isSel
                    ? 'border-clay-700 bg-clay-700/5'
                    : 'border-ink-20 hover:border-ink-40 bg-bone/40',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSel ? 'bg-clay-700 border-clay-700 text-sand-100' : 'border-ink-40',
                  ].join(' ')}
                >
                  {isSel && <Check className="h-4 w-4" />}
                </span>
                <span className="font-serif font-bold flex-1" style={{fontSize: '17px'}}>{opt.v}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (q.type === 'singleSelect') {
    const selected = answer?.type === 'singleSelect' ? answer.key : null;
    const options = qt.raw('options') as Array<{k: string; v: string; tags?: string}>;
    return (
      <div className="flex flex-col gap-10 max-w-[820px] mx-auto w-full">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="h-section">{qt('title')}</h1>
          {hasKey(qt, 'subtitle') && <p className="lede !text-ink-60">{qt('subtitle')}</p>}
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isSel = selected === opt.k;
            return (
              <button
                key={opt.k}
                type="button"
                onClick={() => onAnswer({type: 'singleSelect', id: q.id, key: opt.k})}
                className={[
                  'flex flex-col gap-2 p-6 rounded-sm border-2 text-start transition-all',
                  isSel
                    ? 'border-clay-700 bg-clay-700/5'
                    : 'border-ink-20 hover:border-ink-40 bg-bone/40',
                ].join(' ')}
              >
                <span className="font-serif font-bold" style={{fontSize: '20px'}}>{opt.v}</span>
                {opt.tags && (
                  <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                    {opt.tags}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

function hasKey(t: ReturnType<typeof useTranslations>, key: string): boolean {
  try {
    const v = t(key);
    return typeof v === 'string' && v.length > 0 && !v.startsWith('Quiz.');
  } catch {
    return false;
  }
}

function CompleteScreen({state, locale, onRestart}: {state: QuizState; locale: string; onRestart: () => void}) {
  const t = useTranslations('Quiz');
  const router = useRouter();
  const [, startTransition] = useTransition();
  const v = computeTasteVector(state.answers);

  const axes: Array<{key: 'style' | 'warmth' | 'density' | 'formality'; left: string; right: string}> = [
    {key: 'style',     left: t('complete.axes.traditional'), right: t('complete.axes.contemporary')},
    {key: 'warmth',    left: t('complete.axes.muted'),       right: t('complete.axes.vibrant')},
    {key: 'density',   left: t('complete.axes.minimal'),     right: t('complete.axes.layered')},
    {key: 'formality', left: t('complete.axes.casual'),      right: t('complete.axes.ceremonial')},
  ];

  return (
    <section className="min-h-[calc(100vh-80px)]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col gap-12">
        <header className="flex flex-col gap-5 max-w-[760px]">
          <span className="eyebrow">{t('complete.eyebrow')}</span>
          <h1 className="h-display">{t('complete.title')}</h1>
          <p className="lede max-w-[560px]">{t('complete.lede')}</p>
        </header>

        <div className="bg-bone/60 border border-ink-12 rounded-sm p-8 md:p-12 flex flex-col gap-8">
          <h2 className="font-serif font-bold" style={{fontSize: '22px'}}>
            {t('complete.summaryTitle')}
          </h2>
          <div className="flex flex-col gap-6">
            {axes.map(({key, left, right}) => {
              const val = v[key]; // -1..1
              const pct = ((val + 1) / 2) * 100;
              return (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                  <div className="relative h-2 bg-ink-12 rounded-full overflow-visible">
                    <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 bg-clay-700 rounded-full" style={{width: `${pct}%`, transition: 'width 600ms ease-out'}} />
                    <div
                      className="absolute -top-1 h-4 w-4 rounded-full bg-clay-700 ring-4 ring-sand-100"
                      style={{[locale === 'ar' ? 'right' : 'left']: `calc(${pct}% - 8px)`} as React.CSSProperties}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => startTransition(() => router.push('/space'))}
            className="btn-primary"
          >
            {t('complete.continueButton')}
            <ArrowRight className="rtl:hidden h-4 w-4" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4" />
          </button>
          <button type="button" onClick={onRestart} className="btn-ghost">
            {t('intro.begin')}
          </button>
        </div>
      </div>
    </section>
  );
}
