import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {PortalGate} from '@/components/portal/PortalGate';

export default async function PortalPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main>
        <PortalGate locale={locale} />
      </main>
      <Footer />
    </>
  );
}
