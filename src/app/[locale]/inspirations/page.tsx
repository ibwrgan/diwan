import fs from 'node:fs/promises';
import path from 'node:path';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {ArrowRight, ArrowLeft, Sparkles} from 'lucide-react';

// Auto-discover inspiration sets from /public/inspirations/{slug}/.
// Convention:
//   public/inspirations/<slug>/source.jpg          ← the Pinterest / reference image
//   public/inspirations/<slug>/source.txt          ← optional caption (1 line)
//   public/inspirations/<slug>/1.jpg, 2.jpg, ...   ← Diwan responses
//   public/inspirations/<slug>/title.txt           ← optional row title (1 line)
//   public/inspirations/<slug>/interp.txt          ← optional "how we translated it" (1 paragraph)

export const dynamic = 'force-dynamic';

type InspirationSet = {
  slug: string;
  title: string;
  source: string | null;
  caption: string;
  interpretation: string;
  diwan: string[];
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
      const sourceFile = files.find((f) => /^source\.(jpe?g|png|webp|avif|gif)$/i.test(f));
      const diwanFiles = files
        .filter((f) => isImage(f) && !/^source\./i.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
      const captionFile = files.find((f) => /^source\.txt$/i.test(f));
      const titleFile = files.find((f) => /^title\.txt$/i.test(f));
      const interpFile = files.find((f) => /^interp\.txt$/i.test(f));
      const caption = captionFile
        ? (await fs.readFile(path.join(folderPath, captionFile), 'utf8')).trim()
        : '';
      const title = titleFile
        ? (await fs.readFile(path.join(folderPath, titleFile), 'utf8')).trim()
        : slug.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
      const interpretation = interpFile
        ? (await fs.readFile(path.join(folderPath, interpFile), 'utf8')).trim()
        : '';
      // Skip rows with no source image at all
      if (!sourceFile && diwanFiles.length === 0) continue;
      out.push({
        slug,
        title,
        source: sourceFile ? `/inspirations/${slug}/${sourceFile}` : null,
        caption,
        interpretation,
        diwan: diwanFiles.map((f) => `/inspirations/${slug}/${f}`),
      });
    }
    return out;
  } catch {
    return [];
  }
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

        {/* Rows */}
        <section className="py-14 md:py-20">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">
            {sets.length === 0 ? (
              <EmptyState
                title={t('labels.noInspirationsTitle')}
                body={t('labels.noInspirationsBody')}
              />
            ) : (
              sets.map((s, idx) => <InspirationRow key={s.slug} set={s} idx={idx} t={t} />)
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InspirationRow({set, idx, t}: {set: InspirationSet; idx: number; t: any}) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
      {/* Source */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <span className="font-sans uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
          {String(idx + 1).padStart(2, '0')} · {t('labels.source')}
        </span>
        <div className="aspect-[4/5] rounded-sm overflow-hidden bg-limestone-200 relative">
          {set.source ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{backgroundImage: `url('${set.source}')`}}
              role="img"
              aria-label={set.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-serif italic text-ink-40 px-4 text-center" style={{fontSize: '13px'}}>
              source.jpg missing
            </div>
          )}
        </div>
        {set.title && (
          <h2 className="font-serif font-bold" style={{fontSize: '22px', lineHeight: 1.2}}>
            {set.title}
          </h2>
        )}
        {set.caption && (
          <p className="font-serif italic text-ink-60" style={{fontSize: '14px', lineHeight: 1.5}}>
            &ldquo;{set.caption}&rdquo;
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="lg:col-span-1 flex items-center justify-center pt-12">
        <span className="inline-flex h-12 w-12 rounded-full bg-clay-700 text-sand-100 items-center justify-center shadow-md">
          <ArrowRight className="rtl:hidden h-5 w-5" />
          <ArrowLeft className="hidden rtl:inline h-5 w-5" />
        </span>
      </div>

      {/* Diwan responses */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <span className="font-sans uppercase text-clay-700 inline-flex items-center gap-2" style={{fontSize: '11px', letterSpacing: '0.22em'}}>
          <Sparkles className="h-3 w-3" />
          {t('labels.diwanResponse')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {set.diwan.length === 0 ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-sm bg-limestone-200/40 border border-dashed border-ink-20 flex items-center justify-center text-ink-40 font-serif italic" style={{fontSize: '12px'}}>
                {`${i + 1}.jpg`}
              </div>
            ))
          ) : (
            set.diwan.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-sm overflow-hidden bg-limestone-200 relative group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{backgroundImage: `url('${src}')`}}
                />
                <div className="absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-clay-400 text-midnight-950" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                  DIWAN · {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))
          )}
        </div>
        {set.interpretation && (
          <div className="mt-2 border-s-2 border-clay-700 ps-5 py-1">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              {t('labels.interpretation')}
            </span>
            <p className="font-serif italic text-ink mt-1" style={{fontSize: '15px', lineHeight: 1.55}}>
              {set.interpretation}
            </p>
          </div>
        )}
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
