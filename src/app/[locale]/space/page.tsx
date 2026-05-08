import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {SpaceFlow} from '@/components/space/SpaceFlow';

export default async function SpacePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Space');

  return (
    <>
      <Header />
      <main>
        <section className="pt-20 md:pt-28 pb-10 border-b border-ink-12">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="eyebrow">{t('header.eyebrow')}</span>
              <h1 className="h-display">{t('header.title')}</h1>
            </div>
            <div className="lg:col-span-5 flex items-end">
              <p className="lede max-w-[420px]">{t('header.lede')}</p>
            </div>
          </div>
        </section>
        <SpaceFlow locale={locale} />
      </main>
      <Footer />
    </>
  );
}
