'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Menu, X} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Wordmark} from './Wordmark';
import {LocaleSwitcher} from './LocaleSwitcher';

export function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);

  // Close the menu on Escape, lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const navLinks: Array<{href: string; label: string}> = [
    {href: '/how-it-works',  label: t('howItWorks')},
    {href: '/for-businesses', label: t('forBusinesses')},
    {href: '/for-suppliers',  label: t('forSuppliers')},
    {href: '/about',          label: t('about')},
  ];

  return (
    <>
    <header className="sticky top-0 z-50 backdrop-blur-md bg-sand-100/80 border-b border-ink-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-6">
        <Wordmark size="md" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-[14px] text-ink hover:text-clay-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <LocaleSwitcher />
          <Link href="/start" className="btn-primary !py-2.5 !px-5 text-[12px] hidden sm:inline-flex">
            {t('start')}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="md:hidden p-2 -me-2 text-ink hover:text-clay-700 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile drawer — rendered as sibling so the header's backdrop-filter
        doesn't create a containing block that clips fixed positioning. */}
    {open && (
      <div className="md:hidden fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          {/* Panel — slides in from the inline-end side */}
          <div className="absolute top-0 bottom-0 end-0 w-[88%] max-w-[380px] bg-sand-100 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-ink-12">
              <Wordmark size="sm" asLink={false} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="p-2 -me-2 text-ink hover:text-clay-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
              <ul className="flex flex-col">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 px-4 rounded-sm font-serif font-bold text-ink hover:bg-clay-700/5 transition-colors"
                      style={{fontSize: '20px'}}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="px-4 py-5 border-t border-ink-12 flex flex-col gap-3 bg-bone/40">
              <Link
                href="/start"
                onClick={() => setOpen(false)}
                className="btn-primary justify-center"
              >
                {t('start')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
