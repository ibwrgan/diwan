'use client';

import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useTransition} from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Nav');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === 'ar' ? 'en' : 'ar';

  const handleClick = () => {
    startTransition(() => {
      router.replace(pathname, {locale: otherLocale});
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="font-sans font-medium uppercase text-ink-60 hover:text-clay-700 transition-colors disabled:opacity-60"
      style={{fontSize: '12px', letterSpacing: '0.18em'}}
      aria-label={`Switch to ${otherLocale === 'ar' ? 'Arabic' : 'English'}`}
    >
      {t('switchTo')}
    </button>
  );
}
