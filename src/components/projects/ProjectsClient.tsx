'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowLeft, ArrowRight, MapPin, Calendar, Sparkles, X, Check} from 'lucide-react';
import {CASE_STUDIES, artTreatments, type CaseStudy} from '@/data/projects';

type FilterKey = 'all' | 'residential' | 'commercial';

export function ProjectsClient({locale}: {locale: string}) {
  const t = useTranslations('Projects');
  const isAr = locale === 'ar';
  const [filter, setFilter] = useState<FilterKey>('all');
  const [active, setActive] = useState<CaseStudy | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter((c) => c.category === filter);
  }, [filter]);

  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <>
      {/* Filter chips */}
      <section className="py-8 border-b border-ink-12">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-wrap gap-2">
          {(['all', 'residential', 'commercial'] as FilterKey[]).map((f) => {
            const count = f === 'all' ? CASE_STUDIES.length : CASE_STUDIES.filter((c) => c.category === f).length;
            const sel = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-sans uppercase transition-all',
                  sel ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
                ].join(' ')}
                style={{fontSize: '11px', letterSpacing: '0.18em'}}
              >
                {t(`filters.${f}`)}
                <span className="tabular">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className="text-start group flex flex-col gap-0 rounded-sm overflow-hidden border border-ink-12 bg-bone hover:border-clay-700/40 transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div style={{background: artTreatments[c.conceptArt]?.bg}} className="absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink/85 to-transparent" />
                <div className="absolute top-4 start-4">
                  <span
                    className="font-sans uppercase px-2.5 py-1 rounded-full bg-sand-100/90 text-ink"
                    style={{fontSize: '10px', letterSpacing: '0.18em'}}
                  >
                    {c.category === 'residential' ? t('filters.residential') : t('filters.commercial')}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-sand-100 flex flex-col gap-2">
                  <span className="font-sans uppercase opacity-70" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                    {c.district} · {c.city}
                  </span>
                  <h3 className="font-serif font-bold leading-tight" style={{fontSize: 'clamp(22px, 2.4vw, 28px)'}}>
                    {isAr ? c.titleAr : c.titleEn}
                  </h3>
                  <p className="font-sans opacity-80 max-w-[420px]" style={{fontSize: '13px'}}>
                    {isAr ? c.clientLabelAr : c.clientLabelEn}
                  </p>
                </div>
              </div>
              <div className="p-5 flex items-baseline justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                    {t('cardLabels.budget')}
                  </span>
                  <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '20px'}}>
                    SAR {fmt(c.budget)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 text-end">
                  <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                    {t('cardLabels.delivered')}
                  </span>
                  <span className="font-serif font-bold tabular" style={{fontSize: '17px'}}>
                    {c.deliveredDays} d
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Video placeholder */}
      <VideoSection />

      {/* CTA */}
      <CTASection />

      {active && (
        <CaseStudyModal study={active} onClose={() => setActive(null)} locale={locale} />
      )}
    </>
  );
}

function VideoSection() {
  const t = useTranslations('Projects.videoSection');
  return (
    <section className="midnight">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 flex flex-col gap-5">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-display">{t('title')}</h2>
          <p className="lede max-w-[440px]">{t('lede')}</p>
        </div>
        <div className="lg:col-span-7">
          {/* Drop a /public/video/walkthrough.mp4 file and the page picks it up.
              Until then, a branded placeholder is shown. */}
          <div className="aspect-video bg-ink/40 rounded-sm relative overflow-hidden border border-cream-20">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              controls
              poster="/brand/logo.svg"
              preload="none"
            >
              <source src="/video/walkthrough.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex flex-col items-center gap-3 text-cream-60">
                <span
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-clay-700/30 border border-clay-400"
                  aria-hidden
                >
                  <span className="ms-1 w-0 h-0 border-y-[10px] border-y-transparent border-s-[16px] border-s-clay-400" />
                </span>
                <span className="font-sans uppercase" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                  {t('captionPending')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const t = useTranslations('Projects.cta');
  return (
    <section className="py-24 md:py-32 border-t border-ink-12">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center flex flex-col items-center gap-6">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="h-display max-w-[780px]">{t('title')}</h2>
        <p className="lede max-w-[560px]">{t('lede')}</p>
        <div className="flex flex-wrap items-center gap-4 mt-4 justify-center">
          <Link href="/start" className="btn-primary inline-flex items-center gap-2 group">
            {t('primary')}
            <ArrowRight className="rtl:hidden h-4 w-4 transition-transform group-hover:translate-x-1" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
          <Link href="/contact" className="btn-ghost">
            {t('secondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}

function CaseStudyModal({study, onClose, locale}: {study: CaseStudy; onClose: () => void; locale: string}) {
  const t = useTranslations('Projects.detail');
  const isAr = locale === 'ar';
  const fmt = (n: number) => n.toLocaleString('en-US');
  const stages = t.raw('stages') as Array<{k: string; label: string; days: number}>;
  const totalDays = stages.reduce((s, p) => s + p.days, 0);

  return (
    <div className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className="min-h-full flex items-start justify-center p-3 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-[1100px] bg-sand-100 rounded-sm overflow-hidden border border-ink-12 my-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 z-10 p-2 rounded-full bg-sand-100/90 text-ink hover:text-clay-700 transition-colors shadow-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Hero */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <div style={{background: artTreatments[study.conceptArt]?.bg}} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-sand-100">
              <div className="max-w-[760px] flex flex-col gap-3">
                <span
                  className="self-start font-sans uppercase px-3 py-1 rounded-full bg-clay-700/40 backdrop-blur-sm"
                  style={{fontSize: '11px', letterSpacing: '0.22em'}}
                >
                  {study.conceptName}
                </span>
                <h2 className="font-serif font-bold" style={{fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1}}>
                  {isAr ? study.titleAr : study.titleEn}
                </h2>
                <p className="font-sans uppercase opacity-80" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                  {isAr ? study.clientLabelAr : study.clientLabelEn}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Story */}
            <article className="lg:col-span-7 flex flex-col gap-6">
              <p className="lede !text-ink">{isAr ? study.taglineAr : study.taglineEn}</p>
              <p className="body-text text-ink-60">{isAr ? study.storyAr : study.storyEn}</p>

              {/* Palette */}
              <div className="flex gap-1.5 mt-2">
                {study.paletteHex.map((c) => (
                  <span key={c} className="flex-1 h-9 rounded-sm" style={{background: c, maxWidth: '92px'}} />
                ))}
              </div>

              {/* Inspirations */}
              <div className="flex flex-col gap-3 mt-4">
                <h3 className="font-sans uppercase text-ink-60 inline-flex items-center gap-2" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                  <Sparkles className="h-3 w-3" />
                  {t('labels.inspirations')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {study.inspirations.map((ins, i) => (
                    <figure key={i} className="flex flex-col gap-1.5">
                      <div
                        style={{background: artTreatments[ins.art]?.bg}}
                        className="aspect-[4/5] rounded-sm"
                      />
                      <figcaption className="font-sans text-ink-60 leading-snug" style={{fontSize: '11px'}}>
                        {isAr ? ins.captionAr : ins.captionEn}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Room views */}
              <div className="flex flex-col gap-3 mt-4">
                <h3 className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                  Rooms designed
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {study.roomViews.map((r, i) => (
                    <figure key={i} className="flex flex-col gap-1.5">
                      <div
                        style={{background: artTreatments[r.art]?.bg}}
                        className="aspect-[4/3] rounded-sm relative overflow-hidden"
                      >
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/70 to-transparent" />
                        <span className="absolute bottom-2 start-2 font-sans uppercase text-sand-100" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                          {isAr ? r.nameAr : r.nameEn}
                        </span>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-3 mt-4">
                <h3 className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                  {t('labels.highlightItems')}
                </h3>
                <ul className="flex flex-col gap-2">
                  {(isAr ? study.highlightItemsAr : study.highlightItemsEn).map((it, i) => (
                    <li key={i} className="flex items-center gap-3 body-text" style={{fontSize: '15px'}}>
                      <Check className="h-4 w-4 text-clay-700 flex-shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verdict */}
              <blockquote className="mt-4 border-s-2 border-clay-700 ps-5 py-2">
                <p className="font-serif italic text-ink" style={{fontSize: '18px', lineHeight: 1.45}}>
                  &ldquo;{isAr ? study.verdictAr : study.verdictEn}&rdquo;
                </p>
                <footer className="mt-2 font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                  — {isAr ? study.clientLabelAr : study.clientLabelEn}
                </footer>
              </blockquote>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-bone border border-ink-12 rounded-sm p-6 flex flex-col">
                <Row label={t('labels.client')}    value={isAr ? study.clientLabelAr : study.clientLabelEn} />
                <Row label={t('labels.city')}      value={`${study.district}, ${study.city}`} icon={<MapPin className="h-3 w-3" />} />
                <Row label={t('labels.area')}      value={`${study.areaM2} m²`} />
                <Row label={t('labels.rooms')}     value={`${study.rooms}`} />
                <Row label={t('labels.concept')}   value={study.conceptName} />
                <Row label={t('labels.delivered')} value={`${study.deliveredDays} days`} icon={<Calendar className="h-3 w-3" />} />
                <Row label={t('labels.items')}     value={`${study.itemCount}`} />
                <Row label={t('labels.suppliers')} value={`${study.supplierCount}`} />
              </div>

              <div className="bg-bone border border-ink-12 rounded-sm p-6 flex flex-col gap-3">
                <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                  {t('labels.budget')}
                </span>
                <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1}}>
                  SAR {fmt(study.budget)}
                </span>
                <hr className="rule" />
                <div className="flex justify-between font-sans text-ink-60" style={{fontSize: '13px'}}>
                  <span>Retail equivalent</span>
                  <span className="tabular line-through">SAR {fmt(study.retailEquivalent)}</span>
                </div>
                <div className="flex justify-between font-sans text-success" style={{fontSize: '13px'}}>
                  <span>{t('labels.savings')}</span>
                  <span className="tabular">SAR {fmt(study.retailEquivalent - study.budget)}</span>
                </div>
              </div>

              {/* Timeline bar */}
              <div className="flex flex-col gap-3">
                <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
                  {t('labels.timeline')}
                </span>
                <div className="relative h-2.5 bg-ink-12 rounded-full overflow-hidden">
                  {(() => {
                    let cursor = 0;
                    const colors = ['#B89968', '#B8552E', '#3D4A6B', '#5C8A5C'];
                    return stages.map((p, i) => {
                      const startPct = (cursor / totalDays) * 100;
                      cursor += p.days;
                      const widthPct = (p.days / totalDays) * 100;
                      return (
                        <div
                          key={p.k}
                          className="absolute top-0 h-full"
                          style={{insetInlineStart: `${startPct}%`, width: `${widthPct}%`, background: colors[i]}}
                        />
                      );
                    });
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stages.map((p, i) => (
                    <div key={p.k} className="flex items-center gap-2 font-sans" style={{fontSize: '11px'}}>
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{background: ['#B89968', '#B8552E', '#3D4A6B', '#5C8A5C'][i]}} />
                      <span className="text-ink-60">{p.label}</span>
                      <span className="ms-auto tabular">{p.days}d</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({label, value, icon}: {label: string; value: string; icon?: React.ReactNode}) {
  return (
    <div className="flex justify-between items-baseline py-2 gap-4 border-b border-ink-12 last:border-0">
      <span className="font-sans uppercase text-ink-60 inline-flex items-center gap-1.5" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
        {icon}
        {label}
      </span>
      <span className="font-serif font-bold text-end" style={{fontSize: '14px'}}>
        {value}
      </span>
    </div>
  );
}
