'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Lock, Unlock} from 'lucide-react';
import {SignInForm} from './SignInForm';
import {SignUpForm} from './SignUpForm';

type Props = {
  onSignedIn: () => void;
};

export function PortalLanding({onSignedIn}: Props) {
  const t = useTranslations('Portal.landing');
  const [mode, setMode] = useState<'signin' | 'apply'>('signin');

  const headlines = t.raw('headlines.items') as Array<{k: string; title: string; body: string; lock: boolean}>;

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: marketing teaser */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <header className="flex flex-col gap-5">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="h-display">{t('title')}</h1>
            <p className="lede !text-ink-60 max-w-[560px]">{t('lede')}</p>
          </header>

          {/* Headline cards */}
          <div className="flex flex-col gap-4 mt-2">
            <h2 className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
              {t('headlines.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {headlines.map((h) => (
                <article
                  key={h.k}
                  className={[
                    'flex flex-col gap-2 p-5 rounded-sm border transition-all',
                    h.lock
                      ? 'border-ink-12 bg-ink/5 hover:border-clay-700/40'
                      : 'border-ink-12 bg-bone',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    {h.lock ? (
                      <Lock className="h-4 w-4 text-ink-40" />
                    ) : (
                      <Unlock className="h-4 w-4 text-success" />
                    )}
                    <span
                      className={`font-sans uppercase ${h.lock ? 'text-ink-40' : 'text-success'}`}
                      style={{fontSize: '9px', letterSpacing: '0.18em'}}
                    >
                      {h.lock ? 'Inside the portal' : 'Public'}
                    </span>
                  </div>
                  <h3 className={`font-serif font-bold ${h.lock ? 'text-ink/70' : ''}`} style={{fontSize: '17px', lineHeight: 1.25}}>
                    {h.title}
                  </h3>
                  <p className={`body-text ${h.lock ? 'text-ink-40 italic' : 'text-ink-60'}`} style={{fontSize: '14px'}}>
                    {h.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sign-in / apply tabs */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('signin')}
                className={[
                  'flex-1 py-2.5 rounded-sm border transition-all font-sans uppercase',
                  mode === 'signin' ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
                ].join(' ')}
                style={{fontSize: '11px', letterSpacing: '0.18em'}}
              >
                {t('tabs.signin')}
              </button>
              <button
                onClick={() => setMode('apply')}
                className={[
                  'flex-1 py-2.5 rounded-sm border transition-all font-sans uppercase',
                  mode === 'apply' ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
                ].join(' ')}
                style={{fontSize: '11px', letterSpacing: '0.18em'}}
              >
                {t('tabs.apply')}
              </button>
            </div>
            {mode === 'signin' ? (
              <SignInForm onSignedIn={onSignedIn} onSwitchToApply={() => setMode('apply')} />
            ) : (
              <SignUpForm onSwitchToSignIn={() => setMode('signin')} />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
