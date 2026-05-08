import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowRight, ArrowLeft} from 'lucide-react';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative pt-16 md:pt-24 pb-24 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: copy */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <span className="eyebrow">{t('eyebrow')}</span>

          <h1 className="h-display-xl">
            <span className="block">{t('headlineLine1')}</span>
            <span className="block italic font-normal text-ink-60">{t('headlineLine2')}</span>
            <span className="block">{t('headlineLine3')}</span>
          </h1>

          <p className="lede max-w-[560px] mt-2">{t('lede')}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link href="/start" className="btn-primary group">
              <span>{t('ctaPrimary')}</span>
              <CtaArrow />
            </Link>
            <Link href="/how-it-works" className="btn-ghost">
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Right: hero metric block on midnight */}
        <div className="lg:col-span-5 lg:pt-20">
          <div className="midnight rounded-sm overflow-hidden">
            <div className="p-10 md:p-12 flex flex-col gap-8">
              <Metric
                value={t('metrics.m1Value')}
                unit={t('metrics.m1Unit')}
                label={t('metrics.m1Label')}
              />
              <hr className="rule" />
              <Metric
                value={t('metrics.m2Value')}
                unit={t('metrics.m2Unit')}
                label={t('metrics.m2Label')}
              />
              <hr className="rule" />
              <Metric
                value={t('metrics.m3Value')}
                unit={t('metrics.m3Unit')}
                label={t('metrics.m3Label')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({value, unit, label}: {value: string; unit: string; label: string}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <span className="font-serif font-bold tabular text-clay-400" style={{fontSize: '64px', lineHeight: 1}}>
          {value}
        </span>
        {unit && <span className="font-sans text-sand-100/70 uppercase text-[12px] tracking-[0.18em]">{unit}</span>}
      </div>
      <p className="body-text !text-sand-100/80 max-w-[280px]" style={{fontSize: '14px'}}>{label}</p>
    </div>
  );
}

function CtaArrow() {
  return (
    <>
      <ArrowRight className="rtl:hidden h-4 w-4 transition-transform group-hover:translate-x-1" />
      <ArrowLeft className="hidden rtl:inline h-4 w-4 transition-transform group-hover:-translate-x-1" />
    </>
  );
}
