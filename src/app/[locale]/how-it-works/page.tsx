import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {PageHero} from '@/components/PageHero';
import {CTABand} from '@/components/CTABand';

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HIW');

  const steps = t.raw('steps.items') as Array<{n: string; duration: string; t: string; b: string}>;
  const slas = t.raw('sla.items') as Array<{v: string; l: string}>;
  const faqs = t.raw('faq.items') as Array<{q: string; a: string}>;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.lede')}
        />

        {/* Process timeline */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="flex flex-col gap-5 mb-16">
              <span className="eyebrow">{t('steps.eyebrow')}</span>
              <h2 className="h-display max-w-[680px]">{t('steps.title')}</h2>
            </div>
            <ol className="flex flex-col">
              {steps.map((s, i) => (
                <li
                  key={s.n}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 ${i !== steps.length - 1 ? 'border-b border-ink-12' : ''}`}
                >
                  <div className="md:col-span-2 flex md:flex-col items-baseline md:items-start gap-3">
                    <span className="num-marker !text-[52px]">{s.n}</span>
                    <span className="tag !border-clay-700/30 !text-clay-700 mt-1">{s.duration}</span>
                  </div>
                  <div className="md:col-span-4 lg:col-span-3">
                    <h3 className="h-section">{s.t}</h3>
                  </div>
                  <div className="md:col-span-6 lg:col-span-7 flex items-start">
                    <p className="body-text text-ink-60 max-w-[640px]" style={{fontSize: '17px'}}>{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SLA grid */}
        <section className="midnight">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32">
            <div className="flex flex-col gap-5 mb-14 max-w-[640px]">
              <span className="eyebrow">{t('sla.eyebrow')}</span>
              <h2 className="h-display">{t('sla.title')}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {slas.map((s, i) => (
                <div key={i} className="flex flex-col gap-4 border-t border-cream-20 pt-6">
                  <span className="font-serif font-bold tabular text-clay-400" style={{fontSize: '64px', lineHeight: 1}}>{s.v}</span>
                  <p className="body-text !text-sand-100/80 max-w-[240px]" style={{fontSize: '15px'}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col gap-5">
              <span className="eyebrow">{t('faq.eyebrow')}</span>
              <h2 className="h-display">{t('faq.title')}</h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className={`group py-6 ${i !== faqs.length - 1 ? 'border-b border-ink-12' : ''}`}
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <h3 className="font-serif font-bold flex-1" style={{fontSize: '22px', lineHeight: 1.3}}>{f.q}</h3>
                    <span className="font-serif text-clay-700 transition-transform group-open:rotate-45 leading-none" style={{fontSize: '28px'}}>+</span>
                  </summary>
                  <p className="body-text text-ink-60 mt-4 max-w-[640px]" style={{fontSize: '16px'}}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
    </>
  );
}
