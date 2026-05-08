import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {PageHero} from '@/components/PageHero';

export default async function ForSuppliersPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Suppliers');

  const rows = t.raw('economics.rows') as Array<{k: string; walkin: string; diwan: string}>;
  const values = t.raw('values.items') as Array<{n: string; t: string; b: string}>;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.lede')}
        />

        {/* Economics comparison */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className="lg:col-span-5 flex flex-col gap-5">
                <span className="eyebrow">{t('economics.eyebrow')}</span>
                <h2 className="h-display">{t('economics.title')}</h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                <p className="lede max-w-[480px]">{t('economics.lede')}</p>
              </div>
            </div>

            {/* Comparison table */}
            <div className="border-t border-ink-12">
              {/* Header row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-5 border-b border-ink-12">
                <div className="md:col-span-4" />
                <div className="md:col-span-4">
                  <span className="font-sans font-semibold uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                    Walk-in retail
                  </span>
                </div>
                <div className="md:col-span-4">
                  <span className="font-sans font-semibold uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
                    Diwan-routed
                  </span>
                </div>
              </div>
              {rows.map((r, i) => (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-6 ${i !== rows.length - 1 ? 'border-b border-ink-12' : ''}`}>
                  <div className="md:col-span-4">
                    <p className="font-serif font-bold" style={{fontSize: '17px'}}>{r.k}</p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="body-text text-ink-60" style={{fontSize: '15px'}}>{r.walkin}</p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="body-text text-ink" style={{fontSize: '15px'}}>{r.diwan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="py-24 md:py-32 border-b border-ink-12 bg-bone/40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="flex flex-col gap-5 mb-16">
              <span className="eyebrow">{t('values.eyebrow')}</span>
              <h2 className="h-display max-w-[680px]">{t('values.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-12">
              {values.map((v) => (
                <article key={v.n} className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-4 border-b border-ink-12 pb-3">
                    <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '32px', lineHeight: 1}}>{v.n}</span>
                    <h3 className="font-serif font-bold flex-1" style={{fontSize: '20px', lineHeight: 1.3}}>{v.t}</h3>
                  </div>
                  <p className="body-text text-ink-60" style={{fontSize: '15px'}}>{v.b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Non-circumvention */}
        <section className="midnight">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col gap-5">
              <span className="eyebrow">{t('circumvention.eyebrow')}</span>
              <h2 className="h-display">{t('circumvention.title')}</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6">
              <p className="lede max-w-[640px]">{t('circumvention.p1')}</p>
              <p className="body-text !text-sand-100/80 max-w-[640px]" style={{fontSize: '16px'}}>{t('circumvention.p2')}</p>
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center flex flex-col items-center gap-6">
            <span className="eyebrow">{t('apply.eyebrow')}</span>
            <h2 className="h-display max-w-[760px]">{t('apply.title')}</h2>
            <p className="lede max-w-[560px]">{t('apply.lede')}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/apply-supplier" className="btn-primary">{t('apply.primary')}</Link>
              <Link href="/contact" className="btn-ghost">{t('apply.secondary')}</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
