'use client';

import {Suspense} from 'react';
import dynamic from 'next/dynamic';
import {X, Smartphone, Move3d} from 'lucide-react';
import type {DesignBrief} from '@/lib/ai/types';

const RoomScene3D = dynamic(() => import('./RoomScene3D').then((m) => m.RoomScene3D), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-sand-100">
      <span className="font-sans uppercase text-ink-60 animate-pulse" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
        Loading 3D scene…
      </span>
    </div>
  ),
});

type Props = {
  open: boolean;
  onClose: () => void;
  room: (DesignBrief['rooms'][number] & {widthM?: number; heightM?: number}) | null;
  designName: string;
  palette: string[];
};

export function Room3DModal({open, onClose, room, designName, palette}: Props) {
  if (!open || !room) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
      <div className="relative w-full max-w-[1320px] h-[85vh] bg-sand-100 rounded-sm overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-ink-12 bg-bone">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.22em'}}>
              {designName} · 3D walkthrough
            </span>
            <h3 className="font-serif font-bold" style={{fontSize: '20px'}}>{room.roomLabel}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 btn-ghost !py-2 !px-4"
              style={{fontSize: '11px'}}
              onClick={() => alert('AR walkthrough launches on iOS Safari and Android Chrome from a mobile device.')}
            >
              <Smartphone className="h-4 w-4" />
              View in AR
            </button>
            <button onClick={onClose} className="p-2 text-ink-60 hover:text-clay-700 transition-colors" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* 3D canvas */}
        <div className="flex-1 relative bg-sand-100">
          <Suspense fallback={null}>
            <RoomScene3D room={room} palette={palette} />
          </Suspense>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-ink/70 text-sand-100 px-4 py-2 rounded-full pointer-events-none" style={{fontSize: '12px'}}>
            <Move3d className="h-4 w-4" />
            Click and drag to orbit · Scroll to zoom · Right-click to pan
          </div>
        </div>
      </div>
    </div>
  );
}
