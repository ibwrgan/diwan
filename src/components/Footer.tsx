import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Wordmark} from './Wordmark';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-ink-12 bg-bone/40 pt-16 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <Wordmark size="md" asLink={false} />
          <p className="font-serif italic text-ink-60 max-w-[220px]" style={{fontSize: '14px', lineHeight: 1.5}}>
            {t('tag')}
          </p>
        </div>

        <FooterCol title={t('navCol')}>
          <FooterLink href="/about">{t('linkAbout')}</FooterLink>
          <FooterLink href="/how-it-works">{t('linkHowItWorks')}</FooterLink>
          <FooterLink href="/for-suppliers">{t('linkForSuppliers')}</FooterLink>
        </FooterCol>

        <FooterCol title={t('legalCol')}>
          <FooterLink href="/privacy">{t('linkPrivacy')}</FooterLink>
          <FooterLink href="/terms">{t('linkTerms')}</FooterLink>
          <FooterLink href="/sharia">{t('linkSharia')}</FooterLink>
        </FooterCol>

        <FooterCol title={t('contactCol')}>
          <p className="body-text !text-ink-60" style={{fontSize: '14px'}}>{t('address')}</p>
          <a href={`mailto:${t('email')}`} className="body-text !text-ink-60 hover:text-clay-700 transition-colors" style={{fontSize: '14px'}}>
            {t('email')}
          </a>
        </FooterCol>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6 border-t border-ink-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="font-sans text-ink-60 uppercase" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
          {t('rights')}
        </p>
        <p className="font-serif italic text-ink-60" style={{fontSize: '13px'}}>
          {t('tagAr')}
        </p>
      </div>
    </footer>
  );
}

function FooterCol({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-sans font-semibold uppercase text-ink" style={{fontSize: '12px', letterSpacing: '0.22em'}}>
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({href, children}: {href: string; children: React.ReactNode}) {
  return (
    <Link href={href} className="body-text !text-ink-60 hover:text-clay-700 transition-colors" style={{fontSize: '14px'}}>
      {children}
    </Link>
  );
}
