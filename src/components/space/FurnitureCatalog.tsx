'use client';

import {useEffect, useRef, useState} from 'react';
import {Camera, Eye, Plus, X, Check, Maximize} from 'lucide-react';
import {FURNITURE_CATALOG, fmtPriceSAR, type FurnitureItem, type FurnitureCategory} from '@/data/furnitureCatalog';

// Lazy-load model-viewer (web component) only on the client. It registers
// the <model-viewer> custom element which renders a 3D model with built-in
// camera orbit + AR ('view in your room') support. On Android this hands
// off to Scene Viewer; on iOS it uses Quick Look (USDZ); on desktop it
// renders the GLB inline with mouse controls.
let modelViewerLoaded = false;
function ensureModelViewer() {
  if (typeof window === 'undefined' || modelViewerLoaded) return;
  if (customElements.get('model-viewer')) {
    modelViewerLoaded = true;
    return;
  }
  const s = document.createElement('script');
  s.type = 'module';
  s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
  document.head.appendChild(s);
  modelViewerLoaded = true;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        ar?: boolean | string;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'camera-controls'?: boolean | string;
        'auto-rotate'?: boolean | string;
        'shadow-intensity'?: string | number;
        'environment-image'?: string;
        'skybox-image'?: string;
        'tone-mapping'?: string;
        exposure?: string | number;
        poster?: string;
        alt?: string;
        loading?: string;
        reveal?: string;
        scale?: string;
      }, HTMLElement>;
    }
  }
}

const CATEGORIES: Array<{key: FurnitureCategory | 'all'; ar: string; en: string}> = [
  {key: 'all',      ar: 'الكل',         en: 'All'},
  {key: 'seating',  ar: 'جلوس',         en: 'Seating'},
  {key: 'tables',   ar: 'طاولات',       en: 'Tables'},
  {key: 'beds',     ar: 'أَسِرَّة',       en: 'Beds'},
  {key: 'lighting', ar: 'إنارة',        en: 'Lighting'},
  {key: 'rugs',     ar: 'سجّاد',         en: 'Rugs'},
  {key: 'storage',  ar: 'تخزين',        en: 'Storage'},
  {key: 'decor',    ar: 'إكسسوارات',    en: 'Decor'},
];

type Props = {
  locale: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function FurnitureCatalog({locale, selectedIds, onToggle}: Props) {
  const isAr = locale === 'ar';
  const [activeCat, setActiveCat] = useState<FurnitureCategory | 'all'>('all');
  const [previewItem, setPreviewItem] = useState<FurnitureItem | null>(null);

  useEffect(() => {
    ensureModelViewer();
  }, []);

  const filtered =
    activeCat === 'all' ? FURNITURE_CATALOG : FURNITURE_CATALOG.filter((it) => it.category === activeCat);

  return (
    <div className="flex flex-col gap-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={[
              'px-4 py-2 rounded-full font-sans uppercase transition-colors',
              activeCat === c.key
                ? 'bg-clay-700 text-bone'
                : 'bg-bone border border-ink-12 text-ink-60 hover:border-ink-40',
            ].join(' ')}
            style={{fontSize: '11px', letterSpacing: '0.18em'}}
          >
            {isAr ? c.ar : c.en}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((it) => {
          const sel = selectedIds.includes(it.id);
          return (
            <article
              key={it.id}
              className={[
                'flex flex-col rounded-sm border-2 overflow-hidden transition-all bg-bone',
                sel ? 'border-clay-700 ring-2 ring-clay-700/15' : 'border-ink-12 hover:border-ink-40',
              ].join(' ')}
            >
              {/* 3D / poster preview */}
              <div className="relative aspect-[4/3] bg-sand-100 overflow-hidden">
                {it.poster ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{backgroundImage: `url('${it.poster}')`}}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${it.paletteHex[0]}, ${it.paletteHex[1] ?? it.paletteHex[0]})`,
                    }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" />
                <div className="absolute top-3 start-3 flex gap-1">
                  {it.paletteHex.slice(0, 3).map((c, i) => (
                    <span key={i} className="w-3 h-3 rounded-full ring-2 ring-bone" style={{background: c}} />
                  ))}
                </div>
                <button
                  onClick={() => setPreviewItem(it)}
                  className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 bg-bone/95 hover:bg-bone text-ink rounded-full font-sans px-3 py-1.5 transition-colors"
                  style={{fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase'}}
                  aria-label={isAr ? 'معاينة ثلاثية الأبعاد' : '3D preview'}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {isAr ? 'معاينة 3D' : '3D · AR'}
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col p-4 gap-3">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif font-bold leading-tight" style={{fontSize: '17px'}}>
                    {isAr ? it.nameAr : it.nameEn}
                  </h3>
                  <span className="font-mono tabular text-clay-700 whitespace-nowrap" style={{fontSize: '13px'}}>
                    {fmtPriceSAR(it.priceSAR)}
                  </span>
                </div>
                <p className="font-sans text-ink-60 leading-snug" style={{fontSize: '13px'}}>
                  {isAr ? it.descAr : it.descEn}
                </p>
                <div className="font-mono text-ink-60 tabular" style={{fontSize: '11px'}}>
                  {it.dimensionsCm.w}cm × {it.dimensionsCm.d}cm × {it.dimensionsCm.h}cm
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {it.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-ink-60 bg-sand-100 rounded-full px-2 py-0.5" style={{fontSize: '10px'}}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => onToggle(it.id)}
                    className={[
                      'flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm py-2 font-sans transition-colors',
                      sel
                        ? 'bg-clay-700 text-bone hover:bg-clay-400'
                        : 'border border-ink-20 text-ink hover:border-clay-700 hover:text-clay-700',
                    ].join(' ')}
                    style={{fontSize: '12px', letterSpacing: '0.06em'}}
                  >
                    {sel ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {sel ? (isAr ? 'مُضاف للغرفة' : 'In your room') : (isAr ? 'أضف للغرفة' : 'Add to room')}
                  </button>
                  <button
                    onClick={() => setPreviewItem(it)}
                    className="inline-flex items-center justify-center bg-midnight-950 text-bone rounded-sm px-3 py-2 hover:bg-clay-700 transition-colors"
                    aria-label={isAr ? 'شاهد في غرفتك' : 'View in your room'}
                    title={isAr ? 'شاهد في غرفتك بالكاميرا' : 'View in your room (camera AR)'}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {previewItem && (
        <PreviewModal item={previewItem} isAr={isAr} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}

function PreviewModal({item, isAr, onClose}: {item: FurnitureItem; isAr: boolean; onClose: () => void}) {
  const mvRef = useRef<HTMLElement | null>(null);

  // model-viewer fires `ar-status` events; if AR isn't available we hide
  // the AR button so we don't ship a dead-end action.
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const mv = mvRef.current as (HTMLElement & {canActivateAR?: boolean; activateAR?: () => Promise<void>}) | null;
    if (!mv) return;
    const checkAr = () => setArSupported(Boolean(mv.canActivateAR));
    const t = setTimeout(checkAr, 500);
    return () => clearTimeout(t);
  }, []);

  function activateAR() {
    const mv = mvRef.current as (HTMLElement & {activateAR?: () => Promise<void>}) | null;
    mv?.activateAR?.()?.catch?.(() => {});
  }

  return (
    <div className="fixed inset-0 z-[80] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-bone rounded-sm w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-ink-12">
          <div className="flex flex-col">
            <h2 className="font-serif font-bold" style={{fontSize: '20px'}}>{isAr ? item.nameAr : item.nameEn}</h2>
            <span className="font-mono text-ink-60 tabular" style={{fontSize: '12px'}}>
              {fmtPriceSAR(item.priceSAR)} · {item.dimensionsCm.w}×{item.dimensionsCm.d}×{item.dimensionsCm.h} cm
            </span>
          </div>
          <button onClick={onClose} className="text-ink-60 hover:text-ink p-1.5 rounded-full hover:bg-ink-12 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 relative bg-sand-100 min-h-[420px] overflow-hidden">
          {/* @ts-expect-error - model-viewer is a custom element registered via CDN */}
          <model-viewer
            ref={mvRef}
            src={item.glb}
            ios-src={item.usdz}
            poster={item.poster}
            alt={isAr ? item.nameAr : item.nameEn}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            ar-placement="floor"
            camera-controls
            auto-rotate
            shadow-intensity="1.2"
            tone-mapping="aces"
            exposure="1.0"
            environment-image="neutral"
            loading="eager"
            reveal="auto"
            style={{width: '100%', height: '100%', backgroundColor: '#F4EFE6'}}
          />
        </div>

        <footer className="p-5 flex flex-wrap items-center gap-3 border-t border-ink-12">
          <p className="flex-1 min-w-[200px] font-sans text-ink-60 leading-snug" style={{fontSize: '13px'}}>
            {isAr ? item.descAr : item.descEn}
          </p>
          <button
            onClick={activateAR}
            disabled={arSupported === false}
            className={[
              'inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-sans transition-colors',
              arSupported === false
                ? 'bg-ink-12 text-ink-60 cursor-not-allowed'
                : 'bg-clay-700 text-bone hover:bg-clay-400',
            ].join(' ')}
            style={{fontSize: '13px', letterSpacing: '0.04em'}}
            title={
              arSupported === false
                ? isAr
                  ? 'الواقع المعزّز غير مدعوم على هذا الجهاز'
                  : 'AR not supported on this device'
                : isAr
                ? 'وجّه كاميرتك على غرفتك'
                : 'Point your camera at the room'
            }
          >
            <Maximize className="h-4 w-4" />
            {isAr ? 'شاهد في غرفتك' : 'View in your room'}
          </button>
        </footer>
      </div>
    </div>
  );
}
