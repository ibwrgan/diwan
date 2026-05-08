import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {PageHero} from '@/components/PageHero';
import {Coffee, Stethoscope, Users, ShoppingBag, Hotel, Sparkles} from 'lucide-react';

export default async function ForBusinessesPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Business');

  const compareRows = t.raw('compare.rows') as Array<{k: string; b2c: string; b2b: string}>;
  const verticals = t.raw('verticals.items') as Array<{k: string; title: string; body: string}>;
  const steps = t.raw('brandFlow.steps') as Array<{n: string; title: string; body: string}>;
  const driftMetrics = t.raw('drift.metrics') as Array<{k: string; value: string; label: string}>;

  const verticalIcons: Record<string, any> = {
    cafes: Coffee, clinics: Stethoscope, coworking: Users, retail: ShoppingBag, hospitality: Hotel, salons: Sparkles,
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.lede')}
        />

        {/* Compare B2C vs B2B */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
              <div className="lg:col-span-5 flex flex-col gap-5">
                <span className="eyebrow">{t('compare.eyebrow')}</span>
                <h2 className="h-display">{t('compare.title')}</h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                <p className="lede !text-ink-60 max-w-[480px]">{t('compare.subtitle')}</p>
              </div>
            </div>
            <div className="border-t border-ink-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-5 border-b border-ink-12">
                <div className="md:col-span-4" />
                <div className="md:col-span-4">
                  <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>B2C — Homes</span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-sans uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.22em'}}>B2B — Brands</span>
                </div>
              </div>
              {compareRows.map((r, i) => (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-6 ${i !== compareRows.length - 1 ? 'border-b border-ink-12' : ''}`}>
                  <div className="md:col-span-4"><p className="font-serif font-bold" style={{fontSize: '17px'}}>{r.k}</p></div>
                  <div className="md:col-span-4"><p className="body-text text-ink-60" style={{fontSize: '15px'}}>{r.b2c}</p></div>
                  <div className="md:col-span-4"><p className="body-text text-ink" style={{fontSize: '15px'}}>{r.b2b}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verticals */}
        <section className="py-24 md:py-32 border-b border-ink-12 bg-bone/40">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12">
            <div className="flex flex-col gap-5 mb-14 max-w-[760px]">
              <span className="eyebrow">{t('verticals.eyebrow')}</span>
              <h2 className="h-display">{t('verticals.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
              {verticals.map((v) => {
                const Icon = verticalIcons[v.k] ?? Coffee;
                return (
                  <article key={v.k} className="flex flex-col gap-4">
                    <span className="inline-flex h-10 w-10 rounded-full bg-clay-700/10 text-clay-700 items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-serif font-bold" style={{fontSize: '22px', lineHeight: 1.2}}>{v.title}</h3>
                    <p className="body-text text-ink-60 max-w-[380px]" style={{fontSize: '15px'}}>{v.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brand flow steps */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12">
            <div className="flex flex-col gap-5 mb-14 max-w-[760px]">
              <span className="eyebrow">{t('brandFlow.eyebrow')}</span>
              <h2 className="h-display">{t('brandFlow.title')}</h2>
            </div>
            <ol className="flex flex-col">
              {steps.map((s, i) => (
                <li key={s.n} className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 ${i !== steps.length - 1 ? 'border-b border-ink-12' : ''}`}>
                  <div className="md:col-span-2"><span className="num-marker">{s.n}</span></div>
                  <div className="md:col-span-3"><h3 className="h-section">{s.title}</h3></div>
                  <div className="md:col-span-7 flex items-start"><p className="body-text text-ink-60 max-w-[640px]" style={{fontSize: '17px'}}>{s.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Brand drift dashboard */}
        <section className="midnight">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 flex flex-col gap-5">
              <span className="eyebrow">{t('drift.eyebrow')}</span>
              <h2 className="h-display">{t('drift.title')}</h2>
              <p className="lede max-w-[560px]">{t('drift.lede')}</p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-3">
              {driftMetrics.map((m) => (
                <div key={m.k} className="flex items-baseline justify-between gap-4 p-5 bg-cream-20 rounded-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-sans uppercase text-cream-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>{m.label.split(' ').slice(0, 4).join(' ')}…</span>
                    <span className="font-sans !text-sand-100/80" style={{fontSize: '13px'}}>{m.label}</span>
                  </div>
                  <span className="font-serif font-bold tabular text-clay-400" style={{fontSize: '32px', lineHeight: 1}}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center flex flex-col items-center gap-6">
            <span className="eyebrow">{t('apply.eyebrow')}</span>
            <h2 className="h-display max-w-[760px]">{t('apply.title')}</h2>
            <p className="lede max-w-[560px]">{t('apply.lede')}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 justify-center">
              <Link href="/contact" className="btn-primary">{t('apply.primary')}</Link>
              <Link href="/contact" className="btn-ghost">{t('apply.secondary')}</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
