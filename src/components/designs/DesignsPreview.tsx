'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {loadDesigns} from '@/lib/designStore';
import {artTreatments} from '@/data/quiz';
import {SKUS} from '@/data/products';
import type {GeneratedDesigns} from '@/lib/ai/types';
import {ConceptDetail} from './ConceptDetail';

export function DesignsPreview({locale}: {locale: string}) {
  const t = useTranslations('Designs.overview');
  const [designs, setDesigns] = useState<GeneratedDesigns | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    setDesigns(loadDesigns());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (!designs) {
    return (
      <section className="py-24 max-w-[760px] mx-auto px-6 text-center flex flex-col gap-6">
        <h1 className="h-display">No designs yet.</h1>
        <p className="lede">Complete the quiz and share your space first.</p>
        <Link href="/start" className="btn-primary self-center">Start the quiz</Link>
      </section>
    );
  }

  // Detail view
  if (activeIdx !== null && designs.designs[activeIdx]) {
    return (
      <ConceptDetail
        design={designs.designs[activeIdx]}
        conceptIndex={activeIdx}
        totalConcepts={designs.designs.length}
        onBack={() => setActiveIdx(null)}
        onSwitchConcept={setActiveIdx}
        locale={locale}
      />
    );
  }

  // Overview
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col gap-12">
        <header className="flex items-end justify-between gap-6 flex-wrap">
          <div className="flex flex-col gap-3 max-w-[680px]">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="h-display">{t('title')}</h1>
            <p className="lede !text-ink-60">{t('lede')}</p>
          </div>
          <span
            className={`font-sans uppercase px-3 py-1.5 rounded-full ${designs.source === 'live' ? 'bg-success/15 text-success' : 'bg-clay-700/15 text-clay-700'}`}
            style={{fontSize: '11px', letterSpacing: '0.18em'}}
          >
            {designs.source === 'live' ? `● ${t('modeLive')}` : `● ${t('modeMock')}`} · {t('generatedIn', {sec: (Math.round(designs.durationMs / 100) / 10).toString()})}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {designs.designs.map((d, i) => {
            const total = d.rooms.reduce((sum, r) => sum + r.skuIds.reduce((s, id) => {
              const sku = SKUS.find((x) => x.id === id);
              return s + (sku?.diwanPrice ?? 0);
            }, 0), 0);
            const retail = d.rooms.reduce((sum, r) => sum + r.skuIds.reduce((s, id) => {
              const sku = SKUS.find((x) => x.id === id);
              return s + (sku?.retailPrice ?? 0);
            }, 0), 0);
            const savings = retail - total;
            const heroArt = d.rooms[0]?.imageUrl?.startsWith('gradient:') ? d.rooms[0].imageUrl.split(':')[1] : null;
            const itemCount = d.rooms.reduce((s, r) => s + r.skuIds.length, 0);

            return (
              <article key={i} className="flex flex-col gap-0 rounded-sm border border-ink-12 bg-bone overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden">
                  {heroArt ? (
                    <div style={{background: artTreatments[heroArt]?.bg}} className="absolute inset-0" />
                  ) : d.rooms[0]?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.rooms[0].imageUrl} alt={d.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-limestone-200" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1.5 text-sand-100">
                    <span className="font-sans uppercase opacity-70" style={{fontSize: '10px', letterSpacing: '0.18em'}}>Concept 0{i + 1}</span>
                    <h2 className="font-serif font-bold leading-tight" style={{fontSize: '24px'}}>{d.name}</h2>
                    {d.nameAr && (
                      <span className="font-arabic font-bold opacity-80" style={{fontSize: '15px', letterSpacing: 0}}>{d.nameAr}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-5 p-6">
                  <p className="lede !text-ink-60 italic" style={{fontSize: '15px'}}>{d.tagline}</p>
                  <div className="flex gap-1">
                    {d.paletteHex.map((c) => (
                      <span key={c} className="flex-1 h-7 rounded-sm" style={{background: c}} title={c} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {d.styleAdjectives.map((a) => (
                      <span key={a} className="font-sans uppercase px-2.5 py-1 rounded-full bg-clay-700/10 text-clay-700" style={{fontSize: '10px', letterSpacing: '0.14em'}}>
                        {a}
                      </span>
                    ))}
                  </div>
                  <hr className="rule" />
                  <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>Diwan price</span>
                      <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '24px'}}>SAR {fmt(total)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>Retail equivalent</span>
                      <span className="font-sans tabular text-ink-60 line-through" style={{fontSize: '15px'}}>SAR {fmt(retail)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans uppercase text-success" style={{fontSize: '11px', letterSpacing: '0.18em'}}>You save</span>
                      <span className="font-sans tabular text-success" style={{fontSize: '15px'}}>SAR {fmt(savings)} · {Math.round((savings / retail) * 100)}%</span>
                    </div>
                  </div>
                  <hr className="rule" />
                  <div className="flex justify-between items-baseline font-sans" style={{fontSize: '12px'}}>
                    <span className="text-ink-60 uppercase" style={{letterSpacing: '0.18em'}}>{t('rooms', {n: d.rooms.length})}</span>
                    <span className="text-ink-60 uppercase" style={{letterSpacing: '0.18em'}}>{t('items', {n: itemCount})}</span>
                  </div>
                  <button onClick={() => setActiveIdx(i)} className="btn-primary !py-2.5 text-center w-full mt-2 group inline-flex items-center justify-center gap-2">
                    {t('exploreConcept')}
                    <ArrowRight className="rtl:hidden h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <ArrowLeft className="hidden rtl:inline h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
