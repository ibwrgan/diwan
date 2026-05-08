import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {DesignsPreview} from '@/components/designs/DesignsPreview';

export default async function DesignsPage({
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
        <DesignsPreview locale={locale} />
      </main>
      <Footer />
    </>
  );
}
