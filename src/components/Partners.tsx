import {useTranslations} from 'next-intl';

export function Partners() {
  const t = useTranslations('Partners');
  const labels = t.raw('labels') as string[];

  return (
    <section className="py-20 md:py-28 border-t border-ink-12 bg-bone/40">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col gap-5 items-center">
          <span className="eyebrow !text-ink-60 before:!bg-ink-60">{t('eyebrow')}</span>
          <h3 className="h-section max-w-[680px] text-balance">{t('title')}</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-10 gap-y-8 items-center w-full max-w-[960px]">
          {labels.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-center font-serif font-bold text-ink/40 hover:text-clay-700 transition-colors text-center"
              style={{fontSize: '20px', letterSpacing: '0.08em'}}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
