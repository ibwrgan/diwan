import fs from 'node:fs/promises';
import path from 'node:path';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {Sparkles} from 'lucide-react';
import {artTreatments} from '@/data/quiz';

// Auto-discover inspiration sets from /public/inspirations/{slug}/.
//
// Convention (any of these can be present):
//   public/inspirations/<slug>/
//     <any number of images>           ← the customer's Pinterest captures
//     source.{jpg|png|webp}            ← (optional) primary source — pinned hero
//     title.txt        / titleAr.txt    ← bilingual row title (1 line each)
//     source.txt                        ← optional caption under the source image
//     interp.txt       / interpAr.txt   ← bilingual Diwan interpretation paragraph
//     concept.txt                       ← key from artTreatments (e.g. najdi-warm)
//                                          for the Diwan gradient response
//     diwan-1.jpg, diwan-2.jpg ...     ← optional AI-generated Diwan responses

export const dynamic = 'force-dynamic';

type InspirationSet = {
  slug: string;
  title: string;
  titleAr: string;
  caption: string;
  interp: string;
  interpAr: string;
  concept: string | null;
  // Customer-brought sources (Pinterest captures, photos)
  sources: string[];
  // Optional Diwan-generated responses (added later via Replicate)
  diwanResponses: string[];
};

async function loadInspirations(): Promise<InspirationSet[]> {
  const root = path.join(process.cwd(), 'public', 'inspirations');
  try {
    const entries = await fs.readdir(root, {withFileTypes: true});
    const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
    const out: InspirationSet[] = [];
    for (const slug of folders) {
      const folderPath = path.join(root, slug);
      const files = await fs.readdir(folderPath);
      const isImage = (f: string) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f);
      const images = files.filter(isImage);

      // Diwan responses are explicitly named "diwan-*.{jpg,png,...}"
      const diwanResponses = images
        .filter((f) => /^diwan[-_]/i.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
        .map((f) => `/inspirations/${slug}/${f}`);

      // Source images = everything else
      const sources = images
        .filter((f) => !/^diwan[-_]/i.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
        .map((f) => `/inspirations/${slug}/${f}`);

      const readText = async (name: string): Promise<string> => {
        const f = files.find((x) => x.toLowerCase() === name.toLowerCase());
        if (!f) return '';
        try {
          return (await fs.readFile(path.join(folderPath, f), 'utf8')).trim();
        } catch { return ''; }
      };

      const title    = (await readText('title.txt'))    || prettify(slug);
      const titleAr  =  await readText('titleAr.txt');
      const caption  =  await readText('source.txt');
      const interp   =  await readText('interp.txt');
      const interpAr =  await readText('interpAr.txt');
      const concept  =  (await readText('concept.txt')) || null;

      if (sources.length === 0 && diwanResponses.length === 0) continue;
      out.push({slug, title, titleAr, caption, interp, interpAr, concept, sources, diwanResponses});
    }
    return out;
  } catch {
    return [];
  }
}

function prettify(slug: string): string {
  return slug.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
}

export default async function InspirationsPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Inspirations');
  const sets = await loadInspirations();
  const isAr = locale === 'ar';

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-24 md:pt-32 pb-12 border-b border-ink-12">
          <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <span className="eyebrow">{t('hero.eyebrow')}</span>
              <h1 className="h-display">{t('hero.title')}</h1>
            </div>
            <div className="lg:col-span-5 flex items-end">
              <p className="lede max-w-[480px]">{t('hero.lede')}</p>
            </div>
          </div>
        </section>

        {/* Sets */}
        <section className="py-14 md:py-20">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-28">
            {sets.length === 0 ? (
              <EmptyState
                title={t('labels.noInspirationsTitle')}
                body={t('labels.noInspirationsBody')}
              />
            ) : (
              sets.map((s, idx) => <InspirationSection key={s.slug} set={s} idx={idx} t={t} isAr={isAr} />)
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InspirationSection({set, idx, t, isAr}: {set: InspirationSet; idx: number; t: any; isAr: boolean}) {
  const title = isAr && set.titleAr ? set.titleAr : set.title;
  const interp = isAr && set.interpAr ? set.interpAr : set.interp;
  const conceptBg = set.concept ? artTreatments[set.concept]?.bg : undefined;

  return (
    <article className="flex flex-col gap-8">
      {/* Section header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-sans uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
            {String(idx + 1).padStart(2, '0')} · {t('labels.source')}
          </span>
          <h2 className="h-section flex items-baseline gap-4 flex-wrap">
            <span>{title}</span>
            {!isAr && set.titleAr && (
              <span className="font-arabic font-bold text-clay-700" style={{fontSize: '24px', letterSpacing: 0}}>
                {set.titleAr}
              </span>
            )}
          </h2>
          {set.caption && (
            <p className="font-serif italic text-ink-60 max-w-[640px]" style={{fontSize: '15px', lineHeight: 1.5}}>
              &ldquo;{set.caption}&rdquo;
            </p>
          )}
        </div>
        <span className="font-sans uppercase text-ink-60 inline-flex items-center gap-2 self-start md:self-end" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
          <Sparkles className="h-3 w-3" />
          {set.sources.length} customer references
        </span>
      </header>

      {/* Customer source masonry */}
      {set.sources.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {set.sources.map((src, i) => (
            <figure
              key={i}
              className="aspect-[4/5] rounded-sm overflow-hidden bg-limestone-200 relative group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{backgroundImage: `url('${src}')`}}
              />
              <div className="absolute top-2 start-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand-100/85 backdrop-blur-sm text-ink" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                PINTEREST
              </div>
            </figure>
          ))}
        </div>
      )}

      {/* Diwan response */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2">
        {/* Diwan visual response — gradient art (or AI-generated photos when present) */}
        <div className="lg:col-span-5">
          {set.diwanResponses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {set.diwanResponses.map((src, i) => (
                <div key={i} className="aspect-[4/5] rounded-sm overflow-hidden bg-limestone-200 relative">
                  <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${src}')`}} />
                  <div className="absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-clay-400 text-midnight-950" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                    DIWAN · {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="aspect-[4/5] rounded-sm relative overflow-hidden"
              style={{background: conceptBg ?? 'linear-gradient(135deg,#B8552E 0%,#B89968 100%)'}}
            >
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-sand-100">
                <span className="font-sans uppercase opacity-80" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
                  Diwan · response
                </span>
                <h3 className="font-serif font-bold mt-1" style={{fontSize: '24px', lineHeight: 1.1}}>
                  {title}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Diwan text response */}
        <div className="lg:col-span-7">
          <div className="bg-bone border border-ink-12 rounded-sm p-7 md:p-9 flex flex-col gap-4 h-full">
            <span className="font-sans uppercase text-clay-700 inline-flex items-center gap-2" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
              <Sparkles className="h-3 w-3" />
              {t('labels.interpretation')}
            </span>
            <p className="lede !text-ink" style={{fontSize: '20px', lineHeight: 1.55}}>
              {interp || 'Diwan interpretation pending.'}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({title, body}: {title: string; body: string}) {
  return (
    <div className="border border-dashed border-ink-20 rounded-sm bg-bone p-10 md:p-16 text-center max-w-[820px] mx-auto flex flex-col items-center gap-4">
      <Sparkles className="h-8 w-8 text-clay-700" />
      <h2 className="font-serif font-bold" style={{fontSize: '24px'}}>{title}</h2>
      <p className="font-sans text-ink-60 max-w-[560px]" style={{fontSize: '14px', lineHeight: 1.6}}>
        {body}
      </p>
    </div>
  );
}
