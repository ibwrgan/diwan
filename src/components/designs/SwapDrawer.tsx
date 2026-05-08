'use client';

import {X, ArrowLeftRight, Check} from 'lucide-react';
import {SKUS, skuById, supplierById, type SKU} from '@/data/products';
import type {RoomType} from '@/data/roomTypes';

type Props = {
  open: boolean;
  onClose: () => void;
  skuId: string | null;        // currently-selected SKU we're swapping out
  roomType: RoomType;
  budget: number;              // remaining budget cap (soft)
  onSwap: (oldSkuId: string, newSkuId: string) => void;
};

export function SwapDrawer({open, onClose, skuId, roomType, budget, onSwap}: Props) {
  if (!open || !skuId) return null;
  const current = skuById(skuId);
  if (!current) return null;

  // Alternatives in same category, fitting the room
  const alternatives = SKUS.filter(
    (s) => s.id !== current.id && s.category === current.category && s.forRooms.includes(roomType),
  ).slice(0, 8);

  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="fixed inset-0 z-[110] bg-ink/70 backdrop-blur-sm flex items-end sm:items-center justify-end">
      <aside className="w-full sm:max-w-[480px] h-full sm:h-[88vh] bg-sand-100 sm:rounded-sm flex flex-col border-s border-ink-12 shadow-2xl">
        <header className="px-6 py-5 border-b border-ink-12 bg-bone flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              Swap an item
            </span>
            <h3 className="font-serif font-bold" style={{fontSize: '18px'}}>{current.name}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-ink-60 hover:text-clay-700">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-6 py-4 border-b border-ink-12 bg-clay-700/5">
          <div className="flex items-center gap-3 text-clay-700">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="font-sans uppercase" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
              {alternatives.length} alternatives in this category
            </span>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto divide-y divide-ink-12">
          {alternatives.map((alt) => {
            const sup = supplierById(alt.supplierId);
            const delta = alt.diwanPrice - current.diwanPrice;
            return (
              <li key={alt.id}>
                <button
                  onClick={() => {
                    onSwap(current.id, alt.id);
                    onClose();
                  }}
                  className="w-full text-start p-5 hover:bg-bone/60 transition-colors flex items-start justify-between gap-4 group"
                >
                  <div className="flex-1 flex flex-col gap-1.5">
                    <h4 className="font-serif font-bold" style={{fontSize: '15px'}}>{alt.name}</h4>
                    <p className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                      {sup?.name} · {alt.styleTags[0] ?? alt.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '15px'}}>
                      SAR {fmt(alt.diwanPrice)}
                    </span>
                    <span
                      className={`font-sans tabular ${delta > 0 ? 'text-warning' : delta < 0 ? 'text-success' : 'text-ink-60'}`}
                      style={{fontSize: '11px'}}
                    >
                      {delta > 0 ? `+SAR ${fmt(delta)}` : delta < 0 ? `-SAR ${fmt(Math.abs(delta))}` : 'Same price'}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
          {alternatives.length === 0 && (
            <li className="p-8 text-center text-ink-60 italic font-serif">
              No alternatives available in this category yet.
            </li>
          )}
        </ul>

        <footer className="px-6 py-4 border-t border-ink-12 bg-bone text-center">
          <p className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
            Quotes update live · Diwan keeps your taste vector locked
          </p>
        </footer>
      </aside>
    </div>
  );
}
