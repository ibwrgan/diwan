import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Dashboard} from '@/components/space/Dashboard';

export default async function DashboardPage({
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
        <Dashboard locale={locale} />
      </main>
      <Footer />
    </>
  );
}
