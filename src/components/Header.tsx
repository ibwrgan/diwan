import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Wordmark} from './Wordmark';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header() {
  const t = useTranslations('Nav');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-sand-100/80 border-b border-ink-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-6">
        <Wordmark size="md" />

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/how-it-works"   className="font-sans text-[14px] text-ink hover:text-clay-700 transition-colors">{t('howItWorks')}</Link>
          <Link href="/for-businesses" className="font-sans text-[14px] text-ink hover:text-clay-700 transition-colors">{t('forBusinesses')}</Link>
          <Link href="/for-suppliers"  className="font-sans text-[14px] text-ink hover:text-clay-700 transition-colors">{t('forSuppliers')}</Link>
          <Link href="/about"          className="font-sans text-[14px] text-ink hover:text-clay-700 transition-colors">{t('about')}</Link>
        </nav>

        <div className="flex items-center gap-5">
          <LocaleSwitcher />
          <Link href="/start" className="btn-primary !py-2.5 !px-5 text-[12px] hidden sm:inline-flex">
            {t('start')}
          </Link>
        </div>
      </div>
    </header>
  );
}
