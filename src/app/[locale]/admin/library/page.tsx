import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {LibraryGrid} from '@/components/admin/LibraryGrid';

export default async function LibraryPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Library');

  return (
    <>
      <Header />
      <main>
        <section className="pt-24 md:pt-32 pb-12 border-b border-ink-12">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <span className="eyebrow">{t('hero.eyebrow')}</span>
              <h1 className="h-display">{t('hero.title')}</h1>
            </div>
            <div className="lg:col-span-5 flex items-end">
              <p className="lede max-w-[480px]">{t('hero.lede')}</p>
            </div>
          </div>
        </section>

        <LibraryGrid locale={locale} />
      </main>
      <Footer />
    </>
  );
}
