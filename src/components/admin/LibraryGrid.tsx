'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Sparkles, RefreshCw} from 'lucide-react';
import {artTreatments} from '@/data/quiz';

type Filter = 'all' | 'najdi' | 'hijazi' | 'contemporary' | 'warm' | 'cool' | 'minimal' | 'layered';

type Reference = {
  id: string;
  art: string;
  title: string;
  tags: Filter[];
  region: 'najdi' | 'hijazi' | 'contemporary';
  warmth: 'warm' | 'cool';
  density: 'minimal' | 'layered';
  addedDays: number;
};

// Procedurally generate ~120 references using the existing art-panel vocabulary.
// In production this is a live database refreshed weekly by the design team.
function generateReferences(): Reference[] {
  const arts = Object.keys(artTreatments);
  const out: Reference[] = [];
  const titles = [
    'Riyadh majlis · evening',
    'Hijazi courtyard · midday',
    'Carved cedar screen detail',
    'Travertine kitchen · daylight',
    'Linen bedroom · winter sun',
    'Brass pendant cluster · close',
    'Wool rug · pattern study',
    'Mashrabiya shadow play',
    'Cocoon bedroom · evening',
    'Spare living room · morning',
    'Open plan family · afternoon',
    'Dining · long evening',
    'Reading nook · oak',
    'Outdoor terrace · spring',
    'Children\'s room · soft',
    'Boutique cafe · workday',
    'Salon · pale wood',
    'Hotel suite · serene',
    'Office study · concrete',
    'Bath · stone vanity',
  ];
  for (let i = 0; i < 120; i++) {
    const art = arts[i % arts.length];
    const title = titles[i % titles.length] + (i > 19 ? ` · ${Math.floor(i / 20)}` : '');
    const tags: Filter[] = [];
    const region: Reference['region'] = (['najdi', 'hijazi', 'contemporary'] as const)[i % 3];
    const warmth: Reference['warmth'] = i % 2 === 0 ? 'warm' : 'cool';
    const density: Reference['density'] = i % 3 === 0 ? 'minimal' : 'layered';
    tags.push(region, warmth, density);
    out.push({
      id: `ref-${i.toString().padStart(3, '0')}`,
      art,
      title,
      tags,
      region,
      warmth,
      density,
      addedDays: Math.floor((i / 120) * 90),
    });
  }
  return out;
}

const ALL_REFS = generateReferences();

export function LibraryGrid({locale}: {locale: string}) {
  const t = useTranslations('Library');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return ALL_REFS;
    return ALL_REFS.filter((r) => r.tags.includes(filter));
  }, [filter]);

  const fmt = (n: number) => n.toLocaleString('en-US');
  const addedThisWeek = ALL_REFS.filter((r) => r.addedDays < 7).length;

  const filterKeys: Filter[] = ['all', 'najdi', 'hijazi', 'contemporary', 'warm', 'cool', 'minimal', 'layered'];

  return (
    <>
      {/* Stats strip */}
      <section className="py-10 border-b border-ink-12 bg-bone/40">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value={fmt(ALL_REFS.length)} label={t('stats.totalLabel')} />
          <Stat value={addedThisWeek > 0 ? `${addedThisWeek}` : '—'} label={t('stats.addedThisWeekLabel')} accent />
          <Stat value="3 days ago" label={t('stats.refreshLabel')} icon={<RefreshCw className="h-3 w-3" />} />
          <Stat value="5" label={t('stats.axesLabel')} />
        </div>
      </section>

      {/* Filters */}
      <section className="py-10 border-b border-ink-12">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">{t('grid.title')}</span>
            <p className="font-sans text-ink-60 max-w-[640px]" style={{fontSize: '14px'}}>{t('grid.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterKeys.map((f) => {
              const isAll = f === 'all';
              const count = isAll ? ALL_REFS.length : ALL_REFS.filter((r) => r.tags.includes(f)).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-sans uppercase transition-all',
                    filter === f ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
                  ].join(' ')}
                  style={{fontSize: '11px', letterSpacing: '0.16em'}}
                >
                  {t(`filters.${f}`)}
                  <span className="tabular">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reference grid */}
      <section className="py-10 pb-24">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((r) => (
              <article key={r.id} className="group flex flex-col gap-2">
                <div
                  style={{background: artTreatments[r.art]?.bg}}
                  className="aspect-[4/5] rounded-sm relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {r.addedDays < 7 && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-clay-400 text-midnight-950 px-2 py-0.5 rounded-full" style={{fontSize: '9px', letterSpacing: '0.12em'}}>
                      <Sparkles className="h-2.5 w-2.5" />
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-0.5 px-0.5">
                  <p className="font-serif font-bold truncate" style={{fontSize: '12px'}}>{r.title}</p>
                  <p className="font-sans uppercase text-ink-60" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                    {r.region} · {r.warmth} · {r.density}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({value, label, accent, icon}: {value: string; label: string; accent?: boolean; icon?: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-serif font-bold tabular text-clay-700 inline-flex items-baseline gap-2" style={{fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1}}>
        {value}
        {accent && <Sparkles className="h-4 w-4 text-clay-400" />}
        {icon}
      </span>
      <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{label}</span>
    </div>
  );
}
