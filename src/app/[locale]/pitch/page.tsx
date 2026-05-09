import {setRequestLocale} from 'next-intl/server';
import {PitchReel} from '@/components/pitch/PitchReel';

export default async function PitchPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <PitchReel locale={locale} />;
}
