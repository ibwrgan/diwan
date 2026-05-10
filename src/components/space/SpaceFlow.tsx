'use client';

import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {ArrowLeft, ArrowRight, Check, Plus, Trash2, Upload, Image as ImageIcon, Calendar, Ruler, FileUp} from 'lucide-react';
import {SAMPLE_PLANS} from '@/data/floorPlans';
import {ROOM_TYPES, type RoomType} from '@/data/roomTypes';
import {INSPIRATION_BOARDS, artTreatments} from '@/data/inspirationBoards';
import {loadSpace, saveSpace, type SpaceState, type TaggedRoom, type MeasurementMode, SPACE_INITIAL} from '@/lib/spaceStore';
import {FloorPlanSVG} from './FloorPlanSVG';
import {FreeVisitModal} from './FreeVisitModal';
import {FurnitureCatalog} from './FurnitureCatalog';

const PLAN_UNIT_M = 0.5;

export function SpaceFlow({locale}: {locale: string}) {
  const t = useTranslations('Space');
  const tRoom = useTranslations('Space.roomTypes');
  const tPlan = useTranslations('Space.plans');
  const tBoard = useTranslations('Space.boards');
  const router = useRouter();

  const [state, setState] = useState<SpaceState>(SPACE_INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [step4Tab, setStep4Tab] = useState<'boards' | 'pinterest' | 'upload'>('boards');
  const [step2Tab, setStep2Tab] = useState<'samples' | 'upload'>('samples');
  const [pinterestInput, setPinterestInput] = useState('');

  useEffect(() => {
    setState(loadSpace());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSpace(state);
  }, [state, hydrated]);

  const totalArea = useMemo(
    () => state.rooms.reduce((sum, r) => sum + r.widthM * r.heightM, 0),
    [state.rooms]
  );

  if (!hydrated) return <div className="min-h-[60vh]" />;

  function setStep(s: 1 | 2 | 3 | 4) {
    setState((p) => ({...p, step: s}));
  }
  function setMode(m: MeasurementMode) {
    setState((p) => ({...p, measurementMode: m}));
    if (m === 'visit') setVisitModalOpen(true);
  }
  function pickPlan(planId: string) {
    const plan = SAMPLE_PLANS.find((p) => p.id === planId);
    if (!plan) return;
    const rooms: TaggedRoom[] = plan.rooms.map((r) => ({
      id: r.id,
      type: r.defaultType,
      label: r.label,
      x: r.x, y: r.y, w: r.w, h: r.h,
      widthM: r.w * PLAN_UNIT_M,
      heightM: r.h * PLAN_UNIT_M,
    }));
    setState((p) => ({...p, planId, planSize: plan.size, rooms}));
  }
  function uploadCustom() {
    // For the demo: synthesize a rough 5x4 grid plan; real product would
    // run computer vision over the uploaded file.
    const w = 28, h = 20;
    const rooms: TaggedRoom[] = [
      {id: 'r1', type: 'majlis-men',     label: tRoom('majlis-men'),     x: 0,  y: 0,  w: 12, h: 9,  widthM: 6, heightM: 4.5},
      {id: 'r2', type: 'kitchen',        label: tRoom('kitchen'),        x: 12, y: 0,  w: 8,  h: 6,  widthM: 4, heightM: 3},
      {id: 'r3', type: 'dining',         label: tRoom('dining'),         x: 20, y: 0,  w: 8,  h: 6,  widthM: 4, heightM: 3},
      {id: 'r4', type: 'family-living',  label: tRoom('family-living'),  x: 0,  y: 9,  w: 12, h: 11, widthM: 6, heightM: 5.5},
      {id: 'r5', type: 'master-bedroom', label: tRoom('master-bedroom'), x: 12, y: 6,  w: 10, h: 8,  widthM: 5, heightM: 4},
      {id: 'r6', type: 'bathroom',       label: tRoom('bathroom'),       x: 22, y: 6,  w: 6,  h: 4,  widthM: 3, heightM: 2},
      {id: 'r7', type: 'kids-bedroom',   label: tRoom('kids-bedroom'),   x: 12, y: 14, w: 8,  h: 6,  widthM: 4, heightM: 3},
      {id: 'r8', type: 'prayer',         label: tRoom('prayer'),         x: 20, y: 14, w: 8,  h: 6,  widthM: 4, heightM: 3},
    ];
    setState((p) => ({...p, planId: 'upload', planSize: {w, h}, rooms}));
  }

  const fmt = (n: number) => n.toLocaleString('en-US', {maximumFractionDigits: 1});
  const currentRoom = state.rooms.find((r) => r.id === selectedRoom);

  function updateRoom(id: string, patch: Partial<TaggedRoom>) {
    setState((p) => ({...p, rooms: p.rooms.map((r) => (r.id === id ? {...r, ...patch} : r))}));
  }
  function toggleBoard(id: string) {
    setState((p) => {
      const has = p.inspirations.boardIds.includes(id);
      return {
        ...p,
        inspirations: {
          ...p.inspirations,
          boardIds: has ? p.inspirations.boardIds.filter((b) => b !== id) : [...p.inspirations.boardIds, id],
        },
      };
    });
  }
  function addPin(url: string) {
    if (!url) return;
    setState((p) => ({...p, inspirations: {...p.inspirations, pinterestUrls: [...p.inspirations.pinterestUrls, url].slice(0, 10)}}));
    setPinterestInput('');
  }
  function removePin(idx: number) {
    setState((p) => ({...p, inspirations: {...p.inspirations, pinterestUrls: p.inspirations.pinterestUrls.filter((_, i) => i !== idx)}}));
  }
  function bumpUploadCount(n: number) {
    setState((p) => ({...p, inspirations: {...p.inspirations, uploadCount: Math.min(10, p.inspirations.uploadCount + n)}}));
  }
  function toggleFurniture(id: string) {
    setState((p) => {
      const has = (p.furnitureIds ?? []).includes(id);
      return {
        ...p,
        furnitureIds: has
          ? (p.furnitureIds ?? []).filter((x) => x !== id)
          : [...(p.furnitureIds ?? []), id],
      };
    });
  }

  const canProceedFrom: Record<1 | 2 | 3 | 4, boolean> = {
    1: state.measurementMode !== null,
    2: state.planId !== null && state.rooms.length > 0,
    3: state.rooms.length > 0,
    4: true,
  };

  function next() {
    if (state.step < 4) setStep((state.step + 1) as 1 | 2 | 3 | 4);
    else router.push('/dashboard');
  }
  function back() {
    if (state.step > 1) setStep((state.step - 1) as 1 | 2 | 3 | 4);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Top bar */}
      <div className="sticky top-16 md:top-20 z-30 border-b border-ink-12 bg-sand-100/85 backdrop-blur-md">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="eyebrow !text-ink-60 before:!bg-ink-60">{t('header.eyebrow')}</span>
          <StepNav step={state.step} setStep={setStep} canGoTo={(s) => s <= state.step || canProceedFrom[(s - 1) as 1 | 2 | 3 | 4]} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-[1100px] w-full mx-auto px-6 md:px-12 py-10 md:py-14 flex flex-col gap-10">
        {state.step === 1 && (
          <Step1
            mode={state.measurementMode}
            onPick={setMode}
            visitBookedAt={state.visitBooking?.bookedAt ?? null}
          />
        )}

        {state.step === 2 && (
          <section className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
              <h1 className="h-section">{t('step2.title')}</h1>
              <p className="lede !text-ink-60 max-w-[640px]">{t('step2.subtitle')}</p>
            </header>
            <div className="flex gap-3">
              <TabBtn active={step2Tab === 'samples'} onClick={() => setStep2Tab('samples')}>
                {t('step2.tabSamples')}
              </TabBtn>
              <TabBtn active={step2Tab === 'upload'} onClick={() => setStep2Tab('upload')}>
                {t('step2.tabUpload')}
              </TabBtn>
            </div>
            {step2Tab === 'samples' ? (
              <PlanGrid
                selectedId={state.planId}
                onPick={pickPlan}
                tPlan={tPlan}
                t={t}
              />
            ) : (
              <UploadPlanZone t={t} onUploaded={uploadCustom} active={state.planId === 'upload'} />
            )}
          </section>
        )}

        {state.step === 3 && state.planSize && (
          <section className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
              <h1 className="h-section">{t('step3.title')}</h1>
              <p className="lede !text-ink-60 max-w-[640px]">{t('step3.subtitle')}</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <FloorPlanSVG
                  size={state.planSize}
                  rooms={state.rooms.map((r) => ({id: r.id, type: r.type, label: tRoom(r.type), x: r.x, y: r.y, w: r.w, h: r.h}))}
                  selectedId={selectedRoom}
                  onSelect={setSelectedRoom}
                  height={520}
                />
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 font-sans text-ink-60" style={{fontSize: '12px'}}>
                  <span><strong className="text-ink">{t('step3.totalArea')}:</strong> {fmt(totalArea)} {t('step2.areaUnit')}</span>
                  <span>{state.rooms.length} rooms</span>
                </div>
              </div>
              <aside className="lg:col-span-4">
                <RoomEditor
                  room={currentRoom}
                  tRoom={tRoom}
                  t={t}
                  onChange={(patch) => currentRoom && updateRoom(currentRoom.id, patch)}
                />
              </aside>
            </div>

            {/* Furniture catalog — pick pieces and (on supported devices)
                see them placed in your room via camera AR. */}
            <div className="flex flex-col gap-5 mt-10 pt-10 border-t border-ink-12">
              <header className="flex flex-col gap-2 max-w-[680px]">
                <span className="eyebrow">{t('step3.catalogEyebrow')}</span>
                <h2 className="h-section">{t('step3.catalogTitle')}</h2>
                <p className="lede !text-ink-60" style={{fontSize: '15px'}}>
                  {t('step3.catalogLede')}
                </p>
              </header>
              <FurnitureCatalog
                locale={locale}
                selectedIds={state.furnitureIds ?? []}
                onToggle={toggleFurniture}
              />
              {(state.furnitureIds ?? []).length > 0 && (
                <p className="font-mono text-ink-60 tabular self-end" style={{fontSize: '12px'}}>
                  {(state.furnitureIds ?? []).length} {t('step3.itemsSelected')}
                </p>
              )}
            </div>
          </section>
        )}

        {state.step === 4 && (
          <section className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
              <h1 className="h-section">{t('step4.title')}</h1>
              <p className="lede !text-ink-60 max-w-[640px]">{t('step4.subtitle')}</p>
            </header>
            <div className="flex flex-wrap gap-3">
              <TabBtn active={step4Tab === 'boards'} onClick={() => setStep4Tab('boards')}>{t('step4.tabBoards')}</TabBtn>
              <TabBtn active={step4Tab === 'pinterest'} onClick={() => setStep4Tab('pinterest')}>{t('step4.tabPinterest')}</TabBtn>
              <TabBtn active={step4Tab === 'upload'} onClick={() => setStep4Tab('upload')}>{t('step4.tabUpload')}</TabBtn>
            </div>

            {step4Tab === 'boards' && (
              <div className="flex flex-col gap-5">
                <p className="body-text text-ink-60">{t('step4.boardsPrompt')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {INSPIRATION_BOARDS.map((b) => {
                    const sel = state.inspirations.boardIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleBoard(b.id)}
                        className={[
                          'flex flex-col gap-3 p-4 rounded-sm border-2 text-start transition-all',
                          sel ? 'border-clay-700 bg-clay-700/5' : 'border-ink-12 hover:border-ink-40 bg-bone',
                        ].join(' ')}
                      >
                        <div className="flex gap-1.5">
                          {b.artKeys.map((k) => (
                            <div
                              key={k}
                              style={{background: artTreatments[k]?.bg}}
                              className="aspect-[3/4] flex-1 rounded-sm"
                            />
                          ))}
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-serif font-bold" style={{fontSize: '17px'}}>{tBoard(`${b.name}.name`)}</h3>
                          {sel && <Check className="h-4 w-4 text-clay-700 flex-shrink-0" />}
                        </div>
                        <p className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>{tBoard(`${b.name}.tag`)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step4Tab === 'pinterest' && (
              <div className="flex flex-col gap-5 max-w-[640px]">
                <p className="body-text text-ink-60">{t('step4.pinterestPrompt')}</p>
                <div className="flex gap-3">
                  <input
                    value={pinterestInput}
                    onChange={(e) => setPinterestInput(e.target.value)}
                    placeholder={t('step4.pinterestPlaceholder')}
                    className="flex-1 px-3 py-3 bg-bone border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none"
                  />
                  <button onClick={() => addPin(pinterestInput)} className="btn-primary !py-2.5 !px-5" style={{fontSize: '12px'}}>
                    <Plus className="h-4 w-4" /> {t('step4.pinterestAdd')}
                  </button>
                </div>
                <ul className="flex flex-col gap-2">
                  {state.inspirations.pinterestUrls.map((u, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-bone rounded-sm border border-ink-12">
                      <ImageIcon className="h-4 w-4 text-clay-700 flex-shrink-0" />
                      <span className="font-mono truncate flex-1" style={{fontSize: '13px'}}>{u}</span>
                      <button onClick={() => removePin(i)} className="text-ink-60 hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step4Tab === 'upload' && (
              <div className="flex flex-col gap-5 max-w-[640px]">
                <UploadDropZone
                  prompt={t('step4.uploadPrompt')}
                  onFiles={(n) => bumpUploadCount(n)}
                  count={state.inspirations.uploadCount}
                />
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer nav */}
      <div className="border-t border-ink-12 bg-bone/40">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-4">
          <button onClick={back} disabled={state.step === 1} className="btn-ghost !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed" style={{fontSize: '12px'}}>
            <ArrowLeft className="rtl:hidden h-4 w-4" />
            <ArrowRight className="hidden rtl:inline h-4 w-4" />
            {t('stepNav.back')}
          </button>
          <button
            onClick={next}
            disabled={!canProceedFrom[state.step]}
            className="btn-primary !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{fontSize: '12px'}}
          >
            {state.step === 4 ? t('stepNav.finish') : t('stepNav.next')}
            <ArrowRight className="rtl:hidden h-4 w-4" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4" />
          </button>
        </div>
      </div>

      <FreeVisitModal
        open={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        onConfirm={(b) => setState((p) => ({...p, visitBooking: b}))}
      />
    </div>
  );
}

/* ---------- helpers / sub-components ---------- */

function StepNav({step, setStep, canGoTo}: {step: 1 | 2 | 3 | 4; setStep: (s: 1 | 2 | 3 | 4) => void; canGoTo: (s: 1 | 2 | 3 | 4) => boolean}) {
  const t = useTranslations('Space.stepNav');
  const labels = [t('step1'), t('step2'), t('step3'), t('step4')];
  return (
    <ol className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
      {labels.map((l, i) => {
        const idx = (i + 1) as 1 | 2 | 3 | 4;
        const isActive = idx === step;
        const isDone = idx < step;
        const enabled = canGoTo(idx);
        return (
          <li key={l} className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => enabled && setStep(idx)}
              disabled={!enabled}
              className={[
                'flex items-center gap-2 px-2.5 py-1.5 rounded-sm transition-all',
                isActive ? 'text-clay-700' : isDone ? 'text-ink' : 'text-ink-60',
                enabled ? 'cursor-pointer hover:text-clay-700' : 'cursor-not-allowed opacity-50',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex items-center justify-center h-6 w-6 rounded-full font-sans tabular',
                  isActive ? 'bg-clay-700 text-sand-100' : isDone ? 'bg-clay-700/15 text-clay-700' : 'border border-ink-20 text-ink-60',
                ].join(' ')}
                style={{fontSize: '11px', fontWeight: 600}}
              >
                {isDone ? <Check className="h-3 w-3" /> : idx}
              </span>
              <span className="font-sans uppercase hidden sm:inline" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{l}</span>
            </button>
            {idx < 4 && <span className="hidden sm:inline w-5 h-px bg-ink-20" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function Step1({mode, onPick, visitBookedAt}: {mode: MeasurementMode | null; onPick: (m: MeasurementMode) => void; visitBookedAt: number | null}) {
  const t = useTranslations('Space.step1');
  const opts = [
    {key: 'diy' as const,   icon: Ruler,   ...readOpt(t, 'diy')},
    {key: 'visit' as const, icon: Calendar, ...readOpt(t, 'visit')},
    {key: 'later' as const, icon: FileUp,  ...readOpt(t, 'later')},
  ];

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="h-section">{t('title')}</h1>
        <p className="lede !text-ink-60 max-w-[640px]">{t('subtitle')}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {opts.map((o) => {
          const sel = mode === o.key;
          const isVisit = o.key === 'visit';
          return (
            <button
              key={o.key}
              onClick={() => onPick(o.key)}
              className={[
                'flex flex-col gap-4 p-6 md:p-7 rounded-sm border-2 text-start transition-all',
                sel ? 'border-clay-700 bg-clay-700/5' : 'border-ink-12 hover:border-ink-40 bg-bone',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2.5 rounded-full ${sel ? 'bg-clay-700 text-sand-100' : 'bg-clay-700/10 text-clay-700'}`}>
                  <o.icon className="h-5 w-5" />
                </span>
                {sel && <Check className="h-5 w-5 text-clay-700" />}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-serif font-bold" style={{fontSize: '20px', lineHeight: 1.25}}>{o.title}</h3>
                <span className={`font-sans uppercase ${isVisit ? 'text-clay-700' : 'text-ink-60'}`} style={{fontSize: '10px', letterSpacing: '0.18em'}}>
                  {o.tag}
                </span>
              </div>
              <p className="body-text text-ink-60" style={{fontSize: '14px'}}>{o.body}</p>
              {isVisit && visitBookedAt && (
                <span className="font-sans uppercase text-success mt-1" style={{fontSize: '11px', letterSpacing: '0.18em'}}>✓ Booked</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
function readOpt(t: ReturnType<typeof useTranslations>, k: 'diy' | 'visit' | 'later') {
  return {title: t(`options.${k}.title`), body: t(`options.${k}.body`), tag: t(`options.${k}.tag`)};
}

function TabBtn({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-4 py-2 rounded-sm border font-sans uppercase transition-all',
        active ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
      ].join(' ')}
      style={{fontSize: '11px', letterSpacing: '0.18em'}}
    >
      {children}
    </button>
  );
}

function PlanGrid({selectedId, onPick, tPlan, t}: {selectedId: string | null; onPick: (id: string) => void; tPlan: ReturnType<typeof useTranslations>; t: ReturnType<typeof useTranslations>}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SAMPLE_PLANS.map((p) => {
        const sel = selectedId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className={[
              'flex flex-col gap-3 p-3 rounded-sm border-2 text-start transition-all',
              sel ? 'border-clay-700 bg-clay-700/5' : 'border-ink-12 hover:border-ink-40 bg-bone',
            ].join(' ')}
          >
            <FloorPlanSVG
              size={p.size}
              rooms={p.rooms.map((r) => ({id: r.id, type: r.defaultType, label: '', x: r.x, y: r.y, w: r.w, h: r.h}))}
              showLabels={false}
              height={150}
            />
            <div className="flex flex-col gap-1 px-1 pb-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-serif font-bold" style={{fontSize: '16px'}}>{tPlan(p.name)}</h3>
                {sel && <Check className="h-4 w-4 text-clay-700" />}
              </div>
              <div className="flex flex-wrap gap-x-3 font-sans text-ink-60" style={{fontSize: '11px'}}>
                <span>{p.area} {t('step2.areaUnit')}</span>
                <span>·</span>
                <span className="uppercase" style={{letterSpacing: '0.12em'}}>{t(`step2.category${p.category === 'residential' ? 'Residential' : 'Commercial'}`)}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function UploadPlanZone({t, onUploaded, active}: {t: ReturnType<typeof useTranslations>; onUploaded: () => void; active: boolean}) {
  const [file, setFile] = useState<string | null>(null);

  function handleFile(f?: File) {
    if (!f) return;
    setFile(f.name);
    onUploaded();
  }

  return (
    <div className="flex flex-col gap-4 max-w-[640px]">
      <label
        className={[
          'flex flex-col items-center justify-center gap-4 p-12 rounded-sm border-2 border-dashed cursor-pointer transition-all bg-bone',
          active ? 'border-clay-700 bg-clay-700/5' : 'border-ink-20 hover:border-clay-700',
        ].join(' ')}
      >
        <Upload className="h-8 w-8 text-clay-700" />
        <span className="font-serif" style={{fontSize: '17px'}}>{file ?? t('step2.uploadPrompt')}</span>
        <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.dwg,image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
      </label>
    </div>
  );
}

function RoomEditor({room, tRoom, t, onChange}: {room: TaggedRoom | undefined; tRoom: ReturnType<typeof useTranslations>; t: ReturnType<typeof useTranslations>; onChange: (p: Partial<TaggedRoom>) => void}) {
  if (!room) {
    return (
      <div className="rounded-sm border border-ink-12 bg-bone p-6 flex items-center justify-center min-h-[200px] text-center">
        <p className="font-serif italic text-ink-60">{t('step3.selectRoom')}</p>
      </div>
    );
  }
  return (
    <div className="rounded-sm border border-ink-12 bg-bone p-6 flex flex-col gap-5">
      <header className="flex flex-col gap-1 pb-3 border-b border-ink-12">
        <span className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
          {room.label}
        </span>
        <h3 className="font-serif font-bold" style={{fontSize: '20px'}}>{tRoom(room.type)}</h3>
      </header>

      <div className="flex flex-col gap-2">
        <label className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
          Type
        </label>
        <select
          value={room.type}
          onChange={(e) => onChange({type: e.target.value as RoomType})}
          className="w-full px-3 py-2.5 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none"
        >
          {ROOM_TYPES.map((rt) => (
            <option key={rt} value={rt}>{tRoom(rt)}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
          {t('step3.dimensionsLabel')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={room.widthM}
              onChange={(e) => onChange({widthM: Number(e.target.value)})}
              className="w-full px-3 py-2.5 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none tabular pr-10"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 font-sans text-ink-60" style={{fontSize: '12px'}}>{t('step3.metersAbbr')}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={room.heightM}
              onChange={(e) => onChange({heightM: Number(e.target.value)})}
              className="w-full px-3 py-2.5 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none tabular pr-10"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 font-sans text-ink-60" style={{fontSize: '12px'}}>{t('step3.metersAbbr')}</span>
          </div>
        </div>
        <p className="font-sans text-ink-60 mt-1" style={{fontSize: '12px'}}>
          {(room.widthM * room.heightM).toFixed(1)} {t('step2.areaUnit')}
        </p>
      </div>
    </div>
  );
}

function UploadDropZone({prompt, onFiles, count}: {prompt: string; onFiles: (n: number) => void; count: number}) {
  return (
    <label className="flex flex-col items-center justify-center gap-3 p-10 rounded-sm border-2 border-dashed border-ink-20 hover:border-clay-700 cursor-pointer bg-bone transition-all">
      <Upload className="h-7 w-7 text-clay-700" />
      <span className="font-serif text-center" style={{fontSize: '15px'}}>{prompt}</span>
      {count > 0 && (
        <span className="font-sans uppercase text-clay-700" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
          {count} files added
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files?.length ?? 0)}
      />
    </label>
  );
}
