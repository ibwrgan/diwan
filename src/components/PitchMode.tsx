'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Zap, Settings, X, RotateCcw} from 'lucide-react';

const KEY_FAST = 'diwan.pitchMode.fast.v1';

export function PitchMode() {
  const t = useTranslations('PitchMode');
  const [open, setOpen] = useState(false);
  const [fast, setFast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFast(typeof window !== 'undefined' && localStorage.getItem(KEY_FAST) === '1');
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
        if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function toggleFast() {
    const next = !fast;
    setFast(next);
    if (next) localStorage.setItem(KEY_FAST, '1');
    else localStorage.removeItem(KEY_FAST);
  }

  function resetAll() {
    if (!confirm(t('resetConfirm'))) return;
    [
      'diwan.quiz.v1',
      'diwan.space.v1',
      'diwan.designs.v1',
      'diwan.supplier.auth.v1',
      KEY_FAST,
    ].forEach((k) => localStorage.removeItem(k));
    window.location.href = '/';
  }

  if (!mounted) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Pitch mode"
        className="fixed bottom-5 end-5 z-[200] h-12 w-12 rounded-full bg-midnight-950 text-sand-100 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        {fast ? <Zap className="h-5 w-5 text-clay-400" /> : <Settings className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-[210] flex items-end sm:items-center justify-end bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-[420px] bg-sand-100 sm:rounded-sm sm:m-6 border border-ink-12 shadow-2xl flex flex-col">
            <header className="px-6 py-5 border-b border-ink-12 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="eyebrow">{t('title')}</span>
                <p className="font-sans text-ink-60" style={{fontSize: '12px'}}>{t('subtitle')}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-ink-60 hover:text-clay-700">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Fast forward toggle */}
              <button
                onClick={toggleFast}
                className={[
                  'flex items-start gap-4 p-4 rounded-sm border-2 text-start transition-all',
                  fast ? 'border-clay-700 bg-clay-700/5' : 'border-ink-12 hover:border-ink-40',
                ].join(' ')}
              >
                <span className={`p-2 rounded-full mt-0.5 ${fast ? 'bg-clay-700 text-sand-100' : 'bg-ink-12 text-ink-60'}`}>
                  <Zap className="h-4 w-4" />
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-serif font-bold inline-flex items-center gap-2" style={{fontSize: '15px'}}>
                    {t('fast')}
                    <span className={`font-sans uppercase px-2 py-0.5 rounded-full ${fast ? 'bg-clay-700 text-sand-100' : 'bg-ink-12 text-ink-60'}`} style={{fontSize: '9px', letterSpacing: '0.16em'}}>
                      {fast ? 'ON' : 'OFF'}
                    </span>
                  </h3>
                  <p className="font-sans text-ink-60" style={{fontSize: '13px'}}>{t('fastDesc')}</p>
                </div>
              </button>

              {/* Reset */}
              <button
                onClick={resetAll}
                className="flex items-start gap-4 p-4 rounded-sm border-2 border-ink-12 hover:border-error text-start transition-all group"
              >
                <span className="p-2 rounded-full bg-ink-12 text-ink-60 group-hover:bg-error group-hover:text-sand-100 transition-colors mt-0.5">
                  <RotateCcw className="h-4 w-4" />
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-serif font-bold" style={{fontSize: '15px'}}>{t('reset')}</h3>
                  <p className="font-sans text-ink-60" style={{fontSize: '13px'}}>{t('resetDesc')}</p>
                </div>
              </button>
            </div>

            <footer className="px-6 py-3 border-t border-ink-12 bg-bone text-center">
              <p className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                {t('shortcut')}
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

// Helper for components to read the fast-forward flag
export function isPitchModeFast(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEY_FAST) === '1';
}
