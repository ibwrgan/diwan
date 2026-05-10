'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {Camera, Eye, Plus, X, Check, Search, SlidersHorizontal, Maximize} from 'lucide-react';
import type * as THREE from 'three';
import {
  FURNITURE_CATALOG,
  ALL_STYLES,
  ALL_STYLES_AR,
  ALL_MATERIALS,
  PRICE_BRACKETS,
  fmtPriceSAR,
  type FurnitureItem,
  type FurnitureCategory,
  type FurnitureStyle,
  type PriceBracket,
} from '@/data/furnitureCatalog';

// Procedural Three.js preview — composes real furniture geometry per
// category and exports it to a runtime GLB for AR handoff.
const FurniturePreview3D = dynamic(
  () => import('./FurniturePreview3D').then((m) => m.FurniturePreview3D),
  {ssr: false, loading: () => <div className="absolute inset-0 flex items-center justify-center text-ink-60 font-sans" style={{fontSize: '12px', letterSpacing: '0.18em'}}>LOADING 3D…</div>},
);

// Webcam-based AR fallback for devices without Scene Viewer / Quick Look /
// WebXR. Opens the device camera and overlays the procedural model.
const CameraARFallback = dynamic(
  () => import('./CameraARFallback').then((m) => m.CameraARFallback),
  {ssr: false},
);

// Lazy-load model-viewer (web component) only on the client. We use it
// purely for the AR handoff — the in-page 3D preview is the procedural
// Three.js Canvas. The model-viewer's `src` is set to a runtime-built
// GLB blob URL so AR shows the actual furniture, not a Khronos sample.
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
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
        },
        HTMLElement
      >;
    }
  }
}

const CATEGORIES: Array<{key: FurnitureCategory | 'all'; ar: string; en: string}> = [
  {key: 'all',        ar: 'الكل',       en: 'All'},
  {key: 'seating',    ar: 'جلوس',       en: 'Seating'},
  {key: 'tables',     ar: 'طاولات',     en: 'Tables'},
  {key: 'beds',       ar: 'أَسِرَّة',     en: 'Beds'},
  {key: 'storage',    ar: 'تخزين',      en: 'Storage'},
  {key: 'lighting',   ar: 'إنارة',      en: 'Lighting'},
  {key: 'rugs',       ar: 'سجّاد',       en: 'Rugs'},
  {key: 'wall-decor', ar: 'زخرفة جدران',en: 'Wall decor'},
  {key: 'kitchen',    ar: 'مطبخ',       en: 'Kitchen'},
  {key: 'bath',       ar: 'حمّام',       en: 'Bath'},
  {key: 'textiles',   ar: 'منسوجات',    en: 'Textiles'},
  {key: 'plants',     ar: 'نباتات',     en: 'Plants'},
  {key: 'accents',    ar: 'إكسسوارات',  en: 'Accents'},
];

const PAGE_SIZE = 24;

type Props = {
  locale: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function FurnitureCatalog({locale, selectedIds, onToggle}: Props) {
  const isAr = locale === 'ar';
  const [activeCat, setActiveCat] = useState<FurnitureCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [activeStyles, setActiveStyles] = useState<Set<FurnitureStyle>>(new Set());
  const [activeBrackets, setActiveBrackets] = useState<Set<PriceBracket>>(new Set());
  const [activeMaterials, setActiveMaterials] = useState<Set<string>>(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<FurnitureItem | null>(null);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [activeCat, search, activeStyles, activeBrackets, activeMaterials]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FURNITURE_CATALOG.filter((it) => {
      if (activeCat !== 'all' && it.category !== activeCat) return false;
      if (activeStyles.size && !activeStyles.has(it.style)) return false;
      if (activeBrackets.size) {
        const inBracket = Array.from(activeBrackets).some((bk) => {
          const b = PRICE_BRACKETS.find((x) => x.key === bk);
          return b && it.priceSAR >= b.min && it.priceSAR < b.max;
        });
        if (!inBracket) return false;
      }
      if (activeMaterials.size && !it.tags.some((t) => activeMaterials.has(t))) return false;
      if (q) {
        const blob = `${it.nameEn} ${it.nameAr} ${it.descEn} ${it.tags.join(' ')}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [activeCat, activeStyles, activeBrackets, activeMaterials, search]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const toggleSet = <T,>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    setter(next);
  };

  const clearAll = () => {
    setActiveCat('all');
    setSearch('');
    setActiveStyles(new Set());
    setActiveBrackets(new Set());
    setActiveMaterials(new Set());
  };

  const activeFilterCount =
    (activeCat === 'all' ? 0 : 1) +
    (search ? 1 : 0) +
    activeStyles.size +
    activeBrackets.size +
    activeMaterials.size;

  return (
    <div className="flex flex-col gap-5" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Search + advanced toggle + count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-ink-60 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن أي قطعة، خامة، أو طراز…' : 'Search 1,500+ pieces, materials, styles…'}
            className="w-full ps-10 pe-3 py-3 bg-bone border border-ink-12 rounded-sm focus:border-clay-700 focus:outline-none font-sans"
            style={{fontSize: '14px'}}
          />
        </div>
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={[
            'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-3 font-sans uppercase border transition-colors',
            showAdvanced || activeFilterCount > 0
              ? 'bg-clay-700 text-bone border-clay-700'
              : 'bg-bone border-ink-12 text-ink hover:border-ink-40',
          ].join(' ')}
          style={{fontSize: '11px', letterSpacing: '0.18em'}}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {isAr ? 'فلاتر' : 'Filters'}
          {activeFilterCount > 0 && (
            <span className="bg-bone text-clay-700 rounded-full px-2 py-0.5 font-mono" style={{fontSize: '10px'}}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Category chips — always visible */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={[
              'whitespace-nowrap px-3.5 py-2 rounded-full font-sans uppercase transition-colors',
              activeCat === c.key
                ? 'bg-clay-700 text-bone'
                : 'bg-bone border border-ink-12 text-ink-60 hover:border-ink-40',
            ].join(' ')}
            style={{fontSize: '10px', letterSpacing: '0.18em'}}
          >
            {isAr ? c.ar : c.en}
          </button>
        ))}
      </div>

      {/* Advanced filters — collapsible */}
      {showAdvanced && (
        <div className="bg-bone border border-ink-12 rounded-sm p-5 flex flex-col gap-5">
          {/* Styles */}
          <div className="flex flex-col gap-2">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              {isAr ? 'الطراز' : 'Style'}
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_STYLES.map((s) => {
                const sel = activeStyles.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSet(activeStyles, s, setActiveStyles)}
                    className={[
                      'px-3 py-1.5 rounded-full font-sans transition-colors',
                      sel ? 'bg-midnight-950 text-bone' : 'bg-sand-100 text-ink hover:bg-ink-12',
                    ].join(' ')}
                    style={{fontSize: '11px'}}
                  >
                    {isAr ? ALL_STYLES_AR[s] : s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price brackets */}
          <div className="flex flex-col gap-2">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              {isAr ? 'السعر' : 'Price'}
            </span>
            <div className="flex flex-wrap gap-2">
              {PRICE_BRACKETS.map((b) => {
                const sel = activeBrackets.has(b.key);
                return (
                  <button
                    key={b.key}
                    onClick={() => toggleSet(activeBrackets, b.key, setActiveBrackets)}
                    className={[
                      'px-3 py-1.5 rounded-full font-sans tabular transition-colors',
                      sel ? 'bg-midnight-950 text-bone' : 'bg-sand-100 text-ink hover:bg-ink-12',
                    ].join(' ')}
                    style={{fontSize: '11px'}}
                  >
                    {isAr ? b.labelAr : b.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials */}
          <div className="flex flex-col gap-2">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              {isAr ? 'الخامة' : 'Material'}
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ALL_MATERIALS) as Array<keyof typeof ALL_MATERIALS>).map((m) => {
                const sel = activeMaterials.has(m as string);
                const matInfo = ALL_MATERIALS[m];
                return (
                  <button
                    key={m as string}
                    onClick={() => toggleSet(activeMaterials, m as string, setActiveMaterials)}
                    className={[
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans transition-colors',
                      sel ? 'bg-midnight-950 text-bone' : 'bg-sand-100 text-ink hover:bg-ink-12',
                    ].join(' ')}
                    style={{fontSize: '11px'}}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{background: matInfo.hex[0]}} />
                    {isAr ? matInfo.ar : matInfo.en}
                  </button>
                );
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="self-start font-sans uppercase text-clay-700 hover:underline"
              style={{fontSize: '11px', letterSpacing: '0.18em'}}
            >
              {isAr ? 'مسح كل الفلاتر' : 'Clear all filters'}
            </button>
          )}
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between font-sans text-ink-60" style={{fontSize: '13px'}}>
        <span>
          {isAr
            ? `يعرض ${visible.length} من ${filtered.length}`
            : `Showing ${visible.length} of ${filtered.length}`}
          {filtered.length === 0 && (isAr ? ' — لا توجد نتائج' : ' — no results')}
        </span>
        {selectedIds.length > 0 && (
          <span className="text-clay-700 font-mono tabular" style={{fontSize: '12px'}}>
            {selectedIds.length} {isAr ? 'مُختارة' : 'selected'}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((it) => (
          <FurnitureCard
            key={it.id}
            item={it}
            isAr={isAr}
            selected={selectedIds.includes(it.id)}
            onToggle={() => onToggle(it.id)}
            onPreview={() => setPreviewItem(it)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-14">
          <p className="font-serif text-ink-60 mb-3" style={{fontSize: '17px'}}>
            {isAr
              ? 'لم نجد قطعاً تطابق هذه الفلاتر.'
              : 'No pieces match these filters.'}
          </p>
          <button onClick={clearAll} className="btn-ghost">
            {isAr ? 'مسح كل الفلاتر' : 'Clear all filters'}
          </button>
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="self-center inline-flex items-center gap-2 bg-bone border border-ink-20 rounded-sm px-6 py-3 font-sans uppercase hover:border-clay-700 hover:text-clay-700 transition-colors"
          style={{fontSize: '11px', letterSpacing: '0.18em'}}
        >
          {isAr
            ? `عرض ${Math.min(PAGE_SIZE, filtered.length - visible.length)} قطعة أخرى`
            : `Load ${Math.min(PAGE_SIZE, filtered.length - visible.length)} more`}
        </button>
      )}

      {previewItem && <PreviewModal item={previewItem} isAr={isAr} onClose={() => setPreviewItem(null)} />}
    </div>
  );
}

function FurnitureCard({
  item,
  isAr,
  selected,
  onToggle,
  onPreview,
}: {
  item: FurnitureItem;
  isAr: boolean;
  selected: boolean;
  onToggle: () => void;
  onPreview: () => void;
}) {
  return (
    <article
      className={[
        'flex flex-col rounded-sm border-2 overflow-hidden transition-all bg-bone',
        selected ? 'border-clay-700 ring-2 ring-clay-700/15' : 'border-ink-12 hover:border-ink-40',
      ].join(' ')}
    >
      <div className="relative aspect-[4/3] bg-sand-100 overflow-hidden">
        {item.poster ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${item.poster}')`}} />
        ) : (
          <div
            className="absolute inset-0"
            style={{background: `linear-gradient(135deg, ${item.paletteHex[0]}, ${item.paletteHex[1] ?? item.paletteHex[0]})`}}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/55 to-transparent" />
        <div className="absolute top-3 start-3 flex gap-1">
          {item.paletteHex.slice(0, 3).map((c, i) => (
            <span key={i} className="w-3 h-3 rounded-full ring-2 ring-bone" style={{background: c}} />
          ))}
        </div>
        <button
          onClick={onPreview}
          className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 bg-bone/95 hover:bg-bone text-ink rounded-full font-sans px-3 py-1.5 transition-colors"
          style={{fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase'}}
          aria-label={isAr ? 'معاينة ثلاثية الأبعاد' : '3D preview'}
        >
          <Eye className="h-3.5 w-3.5" />
          {isAr ? 'معاينة 3D' : '3D · AR'}
        </button>
        <span className="absolute top-3 end-3 bg-midnight-950/80 text-bone rounded-full px-2.5 py-1 font-mono uppercase" style={{fontSize: '9px', letterSpacing: '0.18em'}}>
          {item.style}
        </span>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif font-bold leading-tight" style={{fontSize: '15px'}}>
            {isAr ? item.nameAr : item.nameEn}
          </h3>
          <span className="font-mono tabular text-clay-700 whitespace-nowrap" style={{fontSize: '12px'}}>
            {fmtPriceSAR(item.priceSAR)}
          </span>
        </div>
        <p className="font-sans text-ink-60 leading-snug line-clamp-2" style={{fontSize: '12px'}}>
          {isAr ? item.descAr : item.descEn}
        </p>
        <div className="font-mono text-ink-60 tabular" style={{fontSize: '10px'}}>
          {item.dimensionsCm.w}×{item.dimensionsCm.d}×{item.dimensionsCm.h} cm
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={onToggle}
            className={[
              'flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm py-2 font-sans transition-colors',
              selected
                ? 'bg-clay-700 text-bone hover:bg-clay-400'
                : 'border border-ink-20 text-ink hover:border-clay-700 hover:text-clay-700',
            ].join(' ')}
            style={{fontSize: '11px', letterSpacing: '0.06em'}}
          >
            {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {selected ? (isAr ? 'في غرفتك' : 'In your room') : (isAr ? 'أضف' : 'Add')}
          </button>
          <button
            onClick={onPreview}
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
}

function PreviewModal({item, isAr, onClose}: {item: FurnitureItem; isAr: boolean; onClose: () => void}) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mvRef = useRef<HTMLElement | null>(null);
  const [arBlobUrl, setArBlobUrl] = useState<string | null>(null);
  const [arBusy, setArBusy] = useState(false);
  const [showCameraFallback, setShowCameraFallback] = useState(false);

  useEffect(() => {
    ensureModelViewer();
  }, []);

  // Free the blob URL when the modal closes.
  useEffect(() => {
    return () => {
      if (arBlobUrl) URL.revokeObjectURL(arBlobUrl);
    };
  }, [arBlobUrl]);

  async function exportSceneToGLB(): Promise<string> {
    const live = sceneRef.current;
    if (!live) throw new Error('Scene not ready');
    const THREE = await import('three');
    const mod = await import('three/examples/jsm/exporters/GLTFExporter.js');

    // Build a clean scene with ONLY the furniture meshes — no HDR
    // environment, no lights, no contact shadows, no floor plane. Lights
    // and the apartment env map can't be safely serialized to GLB and
    // weren't part of the piece anyway. World transforms are baked in
    // so the cloned hierarchy preserves the on-screen pose.
    live.updateMatrixWorld(true);
    const clean = new THREE.Scene();
    clean.name = item.id;

    live.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // Skip the big floor planes — they'd dominate the AR placement
      const geomType = obj.geometry?.type ?? '';
      if (geomType === 'PlaneGeometry') return;
      // Skip ContactShadows' internal mesh (drei tags these as 'contact-shadows')
      if (obj.parent && obj.parent.type === 'Group' && obj.parent.name?.toLowerCase().includes('contact')) return;

      const cloned = new THREE.Mesh(obj.geometry, obj.material);
      // Bake the world transform onto the new mesh so the AR pose matches.
      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      obj.matrixWorld.decompose(pos, quat, scale);
      cloned.position.copy(pos);
      cloned.quaternion.copy(quat);
      cloned.scale.copy(scale);
      cloned.castShadow = false;
      cloned.receiveShadow = false;
      clean.add(cloned);
    });

    const exporter = new mod.GLTFExporter();
    return new Promise((resolve, reject) => {
      exporter.parse(
        clean,
        (out) => {
          if (out instanceof ArrayBuffer) {
            const blob = new Blob([out], {type: 'model/gltf-binary'});
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Expected binary GLB output'));
          }
        },
        (err) => reject(err),
        {binary: true},
      );
    });
  }

  async function handleViewInRoom() {
    if (arBusy) return;
    setArBusy(true);
    try {
      const url = await exportSceneToGLB();
      setArBlobUrl(url);
      // Wait for the model-viewer to load the new src + decide if AR is
      // supported by the device.
      await new Promise((r) => setTimeout(r, 350));
      const mv = mvRef.current as (HTMLElement & {canActivateAR?: boolean; activateAR?: () => Promise<void>}) | null;
      if (mv?.canActivateAR && mv.activateAR) {
        // Real AR path: hand off to Scene Viewer / Quick Look / WebXR.
        await mv.activateAR();
      } else {
        // Fallback: open the device camera in-page and overlay the model.
        setShowCameraFallback(true);
      }
    } catch (err) {
      console.warn('AR export failed', err);
      // Even if export fails, still open the camera fallback so the user
      // sees something in their room.
      setShowCameraFallback(true);
    } finally {
      setArBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-bone rounded-sm w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-ink-12">
          <div className="flex flex-col">
            <h2 className="font-serif font-bold" style={{fontSize: '20px'}}>{isAr ? item.nameAr : item.nameEn}</h2>
            <span className="font-mono text-ink-60 tabular" style={{fontSize: '12px'}}>
              {fmtPriceSAR(item.priceSAR)} · {item.dimensionsCm.w}×{item.dimensionsCm.d}×{item.dimensionsCm.h} cm · {item.style}
            </span>
          </div>
          <button onClick={onClose} className="text-ink-60 hover:text-ink p-1.5 rounded-full hover:bg-ink-12 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 relative bg-sand-100 min-h-[420px] overflow-hidden">
          <FurniturePreview3D
            item={item}
            onSceneReady={(scene) => {
              sceneRef.current = scene;
            }}
          />
          <span className="absolute top-3 start-3 inline-flex items-center gap-1.5 bg-bone/90 text-ink-60 rounded-full px-3 py-1 font-mono uppercase" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
            <Eye className="h-3 w-3" />
            {isAr ? 'دوّر بالماوس · قرّب بالعجلة' : 'Drag to rotate · scroll to zoom'}
          </span>
          {/* Hidden model-viewer used purely for the AR handoff. Its
              src is set to a runtime-built GLB blob exported from the
              live Three.js scene above, so AR shows real geometry. */}
          {arBlobUrl && (
            // @ts-expect-error - model-viewer is a custom element registered via CDN
            <model-viewer
              ref={mvRef}
              src={arBlobUrl}
              ar
              ar-modes="webxr scene-viewer"
              ar-scale="auto"
              ar-placement="floor"
              style={{position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', bottom: 0, right: 0}}
            />
          )}
        </div>

        <footer className="p-5 flex flex-wrap items-center gap-3 border-t border-ink-12">
          <p className="flex-1 min-w-[200px] font-sans text-ink-60 leading-snug" style={{fontSize: '13px'}}>
            {isAr ? item.descAr : item.descEn}
          </p>
          <button
            onClick={handleViewInRoom}
            disabled={arBusy}
            className={[
              'inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-sans transition-colors',
              arBusy
                ? 'bg-ink-12 text-ink-60 cursor-wait'
                : 'bg-clay-700 text-bone hover:bg-clay-400',
            ].join(' ')}
            style={{fontSize: '13px', letterSpacing: '0.04em'}}
            title={isAr ? 'وجّه كاميرتك على غرفتك' : 'Open your camera and place the piece in your room'}
          >
            <Maximize className="h-4 w-4" />
            {arBusy
              ? isAr
                ? 'يجهّز…'
                : 'Opening camera…'
              : isAr
              ? 'شاهد في غرفتك'
              : 'View in your room'}
          </button>
        </footer>
      </div>
      {showCameraFallback && (
        <CameraARFallback item={item} onClose={() => setShowCameraFallback(false)} />
      )}
    </div>
  );
}
