import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {ProjectsClient} from '@/components/projects/ProjectsClient';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects');

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

        <ProjectsClient locale={locale} />
      </main>
      <Footer />
    </>
  );
}
