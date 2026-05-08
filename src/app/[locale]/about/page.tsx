import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {PageHero} from '@/components/PageHero';
import {CTABand} from '@/components/CTABand';

export default async function AboutPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  const principles = t.raw('principles.items') as Array<{n: string; t: string; b: string}>;
  const team = t.raw('team.members') as Array<{name: string; role: string; bio: string}>;

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={t('hero.eyebrow')}
          title={t('hero.title')}
          lede={t('hero.lede')}
        />

        {/* Story */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 flex flex-col gap-5">
              <span className="eyebrow">{t('story.eyebrow')}</span>
              <h2 className="h-section">{t('story.title')}</h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-6 max-w-[640px]">
              <p className="lede">{t('story.p1')}</p>
              <p className="body-text text-ink-60">{t('story.p2')}</p>
              <p className="body-text text-ink-60">{t('story.p3')}</p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-24 md:py-32 border-b border-ink-12 bg-bone/40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              <div className="lg:col-span-5 flex flex-col gap-5">
                <span className="eyebrow">{t('principles.eyebrow')}</span>
                <h2 className="h-display">{t('principles.title')}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-12">
              {principles.map((p) => (
                <article key={p.n} className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-4 border-b border-ink-12 pb-3">
                    <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '34px', lineHeight: 1}}>{p.n}</span>
                    <h3 className="font-serif font-bold flex-1" style={{fontSize: '22px', lineHeight: 1.2}}>{p.t}</h3>
                  </div>
                  <p className="body-text text-ink-60" style={{fontSize: '15px'}}>{p.b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 md:py-32 border-b border-ink-12">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
              <div className="lg:col-span-5 flex flex-col gap-5">
                <span className="eyebrow">{t('team.eyebrow')}</span>
                <h2 className="h-display">{t('team.title')}</h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                <p className="lede max-w-[460px]">{t('team.lede')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((m, i) => (
                <article key={i} className="flex flex-col gap-3 border-t border-ink-12 pt-6">
                  <div className="aspect-[3/4] bg-limestone-200 rounded-sm relative overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-gradient-to-b from-limestone-200 to-brass-500/40" />
                    <span className="absolute bottom-3 left-3 font-serif font-bold text-clay-700/40 tabular" style={{fontSize: '52px', lineHeight: 1}}>0{i + 1}</span>
                  </div>
                  <h3 className="font-serif font-bold" style={{fontSize: '20px'}}>{m.name}</h3>
                  <p className="font-sans uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{m.role}</p>
                  <p className="body-text text-ink-60" style={{fontSize: '14px'}}>{m.bio}</p>
                </article>
              ))}
            </div>
            <p className="font-sans italic text-ink-60 mt-12 text-center" style={{fontSize: '13px'}}>{t('team.placeholderNote')}</p>
          </div>
        </section>

        <CTABand />
      </main>
      <Footer />
    </>
  );
}
