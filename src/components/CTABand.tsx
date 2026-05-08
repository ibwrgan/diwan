import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowRight, ArrowLeft} from 'lucide-react';

export function CTABand() {
  const t = useTranslations('CTA');

  return (
    <section className="midnight">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-display">{t('title')}</h2>
          <p className="lede max-w-[560px]">{t('lede')}</p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-4 items-start">
          <Link
            href="/start"
            className="btn-primary w-full sm:w-auto group !bg-clay-700 hover:!bg-clay-400"
          >
            <span>{t('button')}</span>
            <ArrowRight className="rtl:hidden h-4 w-4 transition-transform group-hover:translate-x-1" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Link>
          <Link href="/contact" className="btn-ghost w-full sm:w-auto">
            {t('secondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
