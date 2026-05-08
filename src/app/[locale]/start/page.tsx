import {setRequestLocale} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {QuizContainer} from '@/components/quiz/QuizContainer';

export default async function StartPage({
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
        <QuizContainer locale={locale} />
      </main>
      <Footer />
    </>
  );
}
