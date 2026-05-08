import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Hero} from '@/components/Hero';
import {Pillars} from '@/components/Pillars';
import {Partners} from '@/components/Partners';
import {CTABand} from '@/components/CTABand';
import {Footer} from '@/components/Footer';

export default async function Home({
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
        <Hero />
        <Pillars />
        <Partners />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
