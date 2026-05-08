import {useTranslations} from 'next-intl';

export function Pillars() {
  const t = useTranslations('Pillars');

  const pillars = [
    {n: t('p1Number'), title: t('p1Title'), body: t('p1Body')},
    {n: t('p2Number'), title: t('p2Title'), body: t('p2Body')},
    {n: t('p3Number'), title: t('p3Title'), body: t('p3Body')},
    {n: t('p4Number'), title: t('p4Title'), body: t('p4Body')},
  ];

  return (
    <section className="py-24 md:py-32 border-t border-ink-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 md:mb-24">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="h-display">{t('title')}</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 flex items-end">
            <p className="lede max-w-[520px]">{t('lede')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12">
          {pillars.map((p) => (
            <article key={p.n} className="flex flex-col gap-5">
              <div className="flex items-baseline gap-5 border-b border-ink-12 pb-4">
                <span className="num-marker">{p.n}</span>
                <h3 className="h-section flex-1">{p.title}</h3>
              </div>
              <p className="body-text text-ink-60 max-w-[460px]">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
