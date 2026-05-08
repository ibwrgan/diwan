'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {ArrowLeft, ArrowRight, Sparkles, Truck, Shield, Calendar, CreditCard, Phone, Box, ArrowLeftRight} from 'lucide-react';
import {SKUS, SUPPLIERS, skuById, supplierById, type SKU} from '@/data/products';
import {artTreatments} from '@/data/quiz';
import type {DesignBrief} from '@/lib/ai/types';
import {FloorPlanSVG} from '@/components/space/FloorPlanSVG';
import {loadSpace} from '@/lib/spaceStore';
import {Room3DModal} from './Room3DModal';
import {SwapDrawer} from './SwapDrawer';
import {loadDesigns, saveDesigns} from '@/lib/designStore';

type Props = {
  design: DesignBrief;
  conceptIndex: number;
  totalConcepts: number;
  onBack: () => void;
  onSwitchConcept: (idx: number) => void;
  locale: string;
};

// 10% of items get marked "bespoke" deterministically (seeded by id) so the
// pitch shows the express/bespoke routing in action without randomness.
function isBespoke(skuId: string): boolean {
  let h = 0;
  for (const c of skuId) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h) % 10 === 0;
}

export function ConceptDetail({design, conceptIndex, totalConcepts, onBack, onSwitchConcept, locale}: Props) {
  const t = useTranslations('Designs');
  const tDash = useTranslations('Dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(design.rooms[0]?.roomId ?? null);
  const [open3D, setOpen3D] = useState(false);
  const [swapTarget, setSwapTarget] = useState<{skuId: string; roomId: string} | null>(null);
  const space = useMemo(() => loadSpace(), []);
  const fmt = (n: number) => n.toLocaleString('en-US');

  // Swap handler — replaces the SKU on the design and persists to localStorage
  function handleSwap(oldId: string, newId: string) {
    if (!swapTarget) return;
    const stored = loadDesigns();
    if (!stored) return;
    const next = {
      ...stored,
      designs: stored.designs.map((d, idx) => {
        if (idx !== conceptIndex) return d;
        return {
          ...d,
          rooms: d.rooms.map((r) => {
            if (r.roomId !== swapTarget.roomId) return r;
            return {...r, skuIds: r.skuIds.map((id) => (id === oldId ? newId : id))};
          }),
        };
      }),
    };
    saveDesigns(next);
    // Force component rerender by reloading
    window.location.reload();
  }

  const selectedRoom = design.rooms.find((r) => r.roomId === selectedRoomId) ?? design.rooms[0];

  // Compute totals
  const totals = useMemo(() => {
    let diwanTotal = 0, retailTotal = 0;
    let bespokeCount = 0, expressCount = 0;
    const bySupplier = new Map<string, {items: SKU[]; subtotal: number; bespoke: boolean}>();
    for (const room of design.rooms) {
      for (const skuId of room.skuIds) {
        const sku = skuById(skuId);
        if (!sku) continue;
        diwanTotal += sku.diwanPrice;
        retailTotal += sku.retailPrice;
        const bespoke = isBespoke(skuId);
        if (bespoke) bespokeCount++; else expressCount++;
        const cur = bySupplier.get(sku.supplierId) ?? {items: [], subtotal: 0, bespoke: false};
        cur.items.push(sku);
        cur.subtotal += sku.diwanPrice;
        cur.bespoke = cur.bespoke || bespoke;
        bySupplier.set(sku.supplierId, cur);
      }
    }
    return {diwanTotal, retailTotal, savings: retailTotal - diwanTotal, bespokeCount, expressCount, bySupplier};
  }, [design]);

  const deposit = Math.round(totals.diwanTotal * 0.4);
  const remaining = totals.diwanTotal - deposit;

  // Build floor plan rooms (carry the space's geometry so plan navigator works)
  const planRooms = useMemo(() => {
    return design.rooms
      .map((dr) => {
        const sr = space.rooms.find((s) => s.id === dr.roomId);
        if (!sr) return null;
        return {id: dr.roomId, type: dr.roomType, label: dr.roomLabel, x: sr.x, y: sr.y, w: sr.w, h: sr.h};
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [design.rooms, space.rooms]);

  const heroArt = selectedRoom?.imageUrl?.startsWith('gradient:')
    ? selectedRoom.imageUrl.split(':')[1]
    : null;
  const heroUrl = !heroArt ? selectedRoom?.imageUrl : null;

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Back + concept tabs */}
        <div className="flex items-center justify-between gap-6 mb-8 flex-wrap">
          <button onClick={onBack} className="font-sans text-ink-60 hover:text-clay-700 inline-flex items-center gap-2" style={{fontSize: '13px'}}>
            <ArrowLeft className="rtl:hidden h-4 w-4" />
            <ArrowRight className="hidden rtl:inline h-4 w-4" />
            {t('detail.back')}
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({length: totalConcepts}).map((_, i) => (
              <button
                key={i}
                onClick={() => onSwitchConcept(i)}
                className={[
                  'px-3 py-1.5 rounded-full font-sans uppercase transition-all',
                  i === conceptIndex
                    ? 'bg-clay-700 text-sand-100'
                    : 'bg-ink-12 text-ink-60 hover:bg-ink-20',
                ].join(' ')}
                style={{fontSize: '11px', letterSpacing: '0.18em'}}
              >
                Concept 0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Concept hero */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 pb-10 border-b border-ink-12">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="eyebrow">Concept 0{conceptIndex + 1}</span>
              {design.styleAdjectives.slice(0, 4).map((a) => (
                <span key={a} className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                  {a}
                </span>
              ))}
            </div>
            <h1 className="h-display flex items-baseline gap-5 flex-wrap">
              <span>{design.name}</span>
              {design.nameAr && <span className="font-arabic font-bold text-clay-700" style={{fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: 0}}>{design.nameAr}</span>}
            </h1>
            <p className="lede !text-ink-60 max-w-[640px]">{design.tagline}</p>
            <div className="flex gap-1.5 mt-2">
              {design.paletteHex.map((c) => (
                <span key={c} className="flex-1 h-9 rounded-sm" style={{background: c, maxWidth: '90px'}} />
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5 flex flex-col gap-3 p-7 bg-bone border border-ink-12 rounded-sm">
            <div className="flex justify-between items-baseline">
              <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{t('detail.diwanPrice')}</span>
              <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: 1}}>SAR {fmt(totals.diwanTotal)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{t('detail.retailPrice')}</span>
              <span className="font-sans tabular text-ink-60 line-through" style={{fontSize: '17px'}}>SAR {fmt(totals.retailTotal)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-sans uppercase text-success" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{t('detail.youSave')}</span>
              <span className="font-sans tabular text-success" style={{fontSize: '17px'}}>SAR {fmt(totals.savings)} · {Math.round((totals.savings / totals.retailTotal) * 100)}%</span>
            </div>
            <hr className="rule my-2" />
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-sans text-ink-60" style={{fontSize: '12px'}}>
              <span><strong className="text-ink">{design.rooms.length}</strong> rooms</span>
              <span><strong className="text-ink">{design.rooms.reduce((s, r) => s + r.skuIds.length, 0)}</strong> items</span>
              <span><strong className="text-ink">{totals.bySupplier.size}</strong> suppliers</span>
            </div>
          </aside>
        </header>

        {/* Two-pane: Navigator + Room Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="eyebrow">{t('detail.ofRooms', {n: design.rooms.length})}</span>
            </div>
            {space.planSize && (
              <FloorPlanSVG
                size={space.planSize}
                rooms={planRooms}
                selectedId={selectedRoomId}
                onSelect={setSelectedRoomId}
                height={320}
              />
            )}
            {/* Room list */}
            <ul className="flex flex-col divide-y divide-ink-12 border border-ink-12 rounded-sm bg-bone">
              {design.rooms.map((r) => {
                const sel = r.roomId === selectedRoomId;
                const roomTotal = r.skuIds.reduce((s, id) => s + (skuById(id)?.diwanPrice ?? 0), 0);
                return (
                  <li key={r.roomId}>
                    <button
                      onClick={() => setSelectedRoomId(r.roomId)}
                      className={[
                        'w-full flex items-center justify-between gap-4 p-3.5 text-start transition-colors',
                        sel ? 'bg-clay-700/5 text-clay-700' : 'hover:bg-sand-100/50',
                      ].join(' ')}
                    >
                      <span className="font-serif font-bold flex-1" style={{fontSize: '14px'}}>{r.roomLabel}</span>
                      <span className="font-sans tabular text-ink-60" style={{fontSize: '12px'}}>SAR {fmt(roomTotal)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <article className="lg:col-span-8 flex flex-col gap-6">
            {selectedRoom && (
              <>
                {/* Room hero */}
                <div className="aspect-[16/10] relative overflow-hidden rounded-sm">
                  {heroArt ? (
                    <div style={{background: artTreatments[heroArt]?.bg}} className="absolute inset-0" />
                  ) : heroUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroUrl} alt={selectedRoom.roomLabel} className="absolute inset-0 w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-sand-100">
                    <span className="font-sans uppercase opacity-70" style={{fontSize: '10px', letterSpacing: '0.18em'}}>Room</span>
                    <h2 className="font-serif font-bold mt-1" style={{fontSize: '32px', lineHeight: 1.1}}>{selectedRoom.roomLabel}</h2>
                  </div>
                </div>

                {/* Description + 3D view button */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <p className="lede !text-ink-60 max-w-[640px] flex-1">{selectedRoom.description}</p>
                  <button
                    onClick={() => setOpen3D(true)}
                    className="btn-primary !py-2.5 !px-5 inline-flex items-center gap-2 group"
                    style={{fontSize: '12px'}}
                  >
                    <Box className="h-4 w-4" />
                    View in 3D
                  </button>
                </div>

                {/* Materials */}
                {selectedRoom.materials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.materials.map((m) => (
                      <span key={m} className="font-sans uppercase px-3 py-1 rounded-full bg-clay-700/10 text-clay-700" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Item list */}
                <div className="flex flex-col gap-3 mt-2">
                  <h3 className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.22em'}}>{t('detail.roomItems')}</h3>
                  <ul className="flex flex-col divide-y divide-ink-12 border border-ink-12 rounded-sm bg-bone">
                    {selectedRoom.skuIds.map((id) => {
                      const sku = skuById(id);
                      if (!sku) return null;
                      const sup = supplierById(sku.supplierId);
                      const bespoke = isBespoke(id);
                      return (
                        <li key={id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3 p-4">
                          <div className="sm:col-span-6 flex flex-col gap-1">
                            <span className="font-serif font-bold" style={{fontSize: '15px'}}>{sku.name}</span>
                            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                              {sup?.name ?? sku.supplierId} · {sku.category} · {t('detail.skuId')} {sku.id}
                            </span>
                          </div>
                          <div className="sm:col-span-3 flex flex-wrap gap-1.5">
                            {sku.styleTags.length > 0 && (
                              <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-ink-12 text-ink-60" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                                {sku.styleTags[0]}
                              </span>
                            )}
                            {sup?.diwanExclusive && (
                              <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-clay-700/15 text-clay-700" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                                <Sparkles className="inline h-2.5 w-2.5 me-1" />
                                exclusive
                              </span>
                            )}
                            {bespoke ? (
                              <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-warning/15 text-warning" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                                bespoke
                              </span>
                            ) : (
                              <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-success/15 text-success" style={{fontSize: '9px', letterSpacing: '0.14em'}}>
                                express
                              </span>
                            )}
                          </div>
                          <div className="sm:col-span-3 text-end flex flex-col gap-1 items-end">
                            <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '17px'}}>SAR {fmt(sku.diwanPrice)}</span>
                            <span className="font-sans tabular text-ink-60 line-through" style={{fontSize: '12px'}}>SAR {fmt(sku.retailPrice)}</span>
                            <button
                              onClick={() => setSwapTarget({skuId: sku.id, roomId: selectedRoom.roomId})}
                              className="font-sans uppercase text-ink-60 hover:text-clay-700 inline-flex items-center gap-1 mt-0.5"
                              style={{fontSize: '10px', letterSpacing: '0.16em'}}
                            >
                              <ArrowLeftRight className="h-3 w-3" />
                              Swap
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </article>
        </div>

        {/* Quote breakdown by supplier */}
        <section className="mb-12 pt-12 border-t border-ink-12">
          <header className="flex items-end justify-between gap-6 mb-8 flex-wrap">
            <div className="flex flex-col gap-3 max-w-[640px]">
              <span className="eyebrow">{t('quote.eyebrow')}</span>
              <h2 className="h-section">{t('quote.title')}</h2>
              <p className="body-text text-ink-60">{t('quote.subtitle')}</p>
            </div>
            <div className="flex flex-col gap-1 text-end">
              <div className="flex items-baseline gap-3">
                <span className="font-sans uppercase text-success" style={{fontSize: '10px', letterSpacing: '0.18em'}}>● {totals.expressCount} {t('quote.expressLabel')}</span>
              </div>
              {totals.bespokeCount > 0 && (
                <div className="flex items-baseline gap-3">
                  <span className="font-sans uppercase text-warning" style={{fontSize: '10px', letterSpacing: '0.18em'}}>● {totals.bespokeCount} {t('quote.bespokeLabel')}</span>
                </div>
              )}
            </div>
          </header>

          <ul className="flex flex-col gap-3">
            {[...totals.bySupplier.entries()].map(([supplierId, info]) => {
              const sup = supplierById(supplierId);
              return (
                <li key={supplierId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 border border-ink-12 rounded-sm bg-bone items-center">
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <span className="font-serif font-bold" style={{fontSize: '16px'}}>{sup?.name ?? supplierId}</span>
                    <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>{sup?.city} · {info.items.length} items</span>
                  </div>
                  <div className="md:col-span-4 flex flex-wrap gap-1.5">
                    {info.bespoke ? (
                      <span className="font-sans uppercase px-2.5 py-1 rounded-full bg-warning/15 text-warning" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                        {t('quote.bespokeLabel')}
                      </span>
                    ) : (
                      <span className="font-sans uppercase px-2.5 py-1 rounded-full bg-success/15 text-success" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                        {t('quote.expressLabel')}
                      </span>
                    )}
                    {sup?.diwanExclusive && (
                      <span className="font-sans uppercase px-2.5 py-1 rounded-full bg-clay-700/15 text-clay-700" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                        <Sparkles className="inline h-2.5 w-2.5 me-1" />
                        {t('detail.exclusive')}
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-2 font-sans text-ink-60 text-center md:text-start" style={{fontSize: '12px'}}>
                    <Truck className="inline h-3.5 w-3.5 me-1.5 text-clay-700" />
                    {sup?.leadTimeDays} d
                  </div>
                  <div className="md:col-span-2 text-end font-serif font-bold tabular" style={{fontSize: '17px'}}>
                    SAR {fmt(info.subtotal)}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Timeline */}
        <Timeline locale={locale} />

        {/* Approval */}
        <ApprovalBlock total={totals.diwanTotal} deposit={deposit} remaining={remaining} fmt={fmt} />
      </div>

      {/* Modals */}
      <Room3DModal
        open={open3D}
        onClose={() => setOpen3D(false)}
        room={selectedRoom ? {...selectedRoom, widthM: space.rooms.find((r) => r.id === selectedRoom.roomId)?.widthM, heightM: space.rooms.find((r) => r.id === selectedRoom.roomId)?.heightM} : null}
        designName={design.name}
        palette={design.paletteHex}
      />
      <SwapDrawer
        open={swapTarget !== null}
        onClose={() => setSwapTarget(null)}
        skuId={swapTarget?.skuId ?? null}
        roomType={selectedRoom?.roomType ?? 'family-living'}
        budget={totals.diwanTotal}
        onSwap={handleSwap}
      />
    </section>
  );
}

function Timeline({locale}: {locale: string}) {
  const t = useTranslations('Designs.timeline');
  const phases = t.raw('phases') as Array<{k: string; label: string; lengthDays: number}>;
  const totalDays = phases.reduce((s, p) => s + p.lengthDays, 0);

  // Cumulative starts (in days)
  let cursor = 0;
  const timeline = phases.map((p) => {
    const start = cursor;
    cursor += p.lengthDays;
    return {...p, startPct: (start / totalDays) * 100, widthPct: (p.lengthDays / totalDays) * 100};
  });

  // Phase colors (subtle clay scale)
  const phaseColor = ['#B89968', '#B8552E', '#3D4A6B', '#5C8A5C'];

  return (
    <section className="mb-12 pt-12 border-t border-ink-12">
      <header className="flex flex-col gap-3 mb-8">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="h-section">{t('title')}</h2>
        <p className="body-text text-ink-60">{t('subtitle', {weeks: Math.ceil(totalDays / 7)})}</p>
      </header>

      {/* Day axis */}
      <div className="flex justify-between font-sans uppercase text-ink-60 mb-2" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
        <span>{t('today')}</span>
        <span>Day {totalDays}</span>
        <span>{t('handover')}</span>
      </div>

      {/* Bars */}
      <div className="relative h-3 bg-ink-08 rounded-full overflow-visible mb-8">
        {timeline.map((p, i) => (
          <div
            key={p.k}
            className="absolute top-0 h-3 rounded-full"
            style={{
              [locale === 'ar' ? 'right' : 'left']: `${p.startPct}%`,
              width: `${p.widthPct}%`,
              background: phaseColor[i % phaseColor.length],
            }}
          />
        ))}
      </div>

      {/* Phase legend */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {timeline.map((p, i) => (
          <li key={p.k} className="flex flex-col gap-1.5 p-4 bg-bone rounded-sm border border-ink-12">
            <span className="inline-block w-8 h-1 rounded-full" style={{background: phaseColor[i % phaseColor.length]}} />
            <h4 className="font-serif font-bold" style={{fontSize: '15px'}}>{p.label}</h4>
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{p.lengthDays} days</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApprovalBlock({total, deposit, remaining, fmt}: {total: number; deposit: number; remaining: number; fmt: (n: number) => string}) {
  const t = useTranslations('Designs.approve');
  return (
    <section className="midnight rounded-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-10 md:p-14">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="h-display">{t('title')}</h2>
          <p className="lede max-w-[560px]">{t('subtitle')}</p>
        </div>
        <aside className="lg:col-span-5 flex flex-col gap-4 p-6 bg-cream-20 rounded-sm">
          <Row k="Total project" v={`SAR ${fmt(total)}`} big />
          <hr className="rule" />
          <Row k="Deposit (40%)" v={`SAR ${fmt(deposit)}`} accent />
          <Row k="Remaining" v={`SAR ${fmt(remaining)}`} muted />
          <button className="btn-primary !bg-clay-400 !text-midnight-950 hover:!bg-sand-100 mt-2 inline-flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t('depositPay', {n: fmt(deposit)})}
          </button>
          <button className="btn-ghost inline-flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {t('talk')}
          </button>
          <p className="font-sans uppercase text-cream-60 text-center" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
            <Shield className="inline h-3 w-3 me-1.5" />
            {t('paymentMethods')}
          </p>
        </aside>
      </div>
    </section>
  );
}

function Row({k, v, big, accent, muted}: {k: string; v: string; big?: boolean; accent?: boolean; muted?: boolean}) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="font-sans uppercase text-cream-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{k}</span>
      <span
        className={[
          'font-serif font-bold tabular',
          accent ? 'text-clay-400' : muted ? 'text-cream-60' : 'text-sand-100',
        ].join(' ')}
        style={{fontSize: big ? '24px' : '17px'}}
      >
        {v}
      </span>
    </div>
  );
}
