'use client';

import {ROOM_COLOR, type RoomType} from '@/data/roomTypes';

export type DisplayedRoom = {
  id: string;
  type: RoomType;
  label: string;
  x: number; y: number; w: number; h: number;
};

type Props = {
  size: {w: number; h: number};
  rooms: DisplayedRoom[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  showLabels?: boolean;
  height?: number; // px
};

// Renders an SVG floor plan. Plan units are arbitrary; we map them to a viewbox.
export function FloorPlanSVG({size, rooms, selectedId, onSelect, showLabels = true, height = 420}: Props) {
  const PAD = 1; // plan units
  const vw = size.w + PAD * 2;
  const vh = size.h + PAD * 2;

  return (
    <div className="relative w-full bg-bone border border-ink-12 rounded-sm overflow-hidden" style={{height}}>
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {/* Outer frame */}
        <rect
          x={PAD - 0.15} y={PAD - 0.15}
          width={size.w + 0.3} height={size.h + 0.3}
          fill="none" stroke="#1F1A14" strokeWidth="0.18"
        />

        {/* Rooms */}
        {rooms.map((r) => {
          const fill = ROOM_COLOR[r.type] ?? '#DDD3C3';
          const isSel = r.id === selectedId;
          return (
            <g
              key={r.id}
              onClick={() => onSelect?.(r.id)}
              className={onSelect ? 'cursor-pointer' : ''}
            >
              <rect
                x={r.x + PAD} y={r.y + PAD}
                width={r.w} height={r.h}
                fill={fill}
                fillOpacity={isSel ? 0.55 : 0.25}
                stroke={isSel ? '#B8552E' : '#1F1A14'}
                strokeWidth={isSel ? 0.25 : 0.1}
                style={{transition: 'fill-opacity 200ms, stroke 200ms'}}
              />
              {showLabels && r.w >= 4 && r.h >= 3 && (
                <text
                  x={r.x + PAD + r.w / 2}
                  y={r.y + PAD + r.h / 2 + 0.3}
                  fontSize={Math.min(0.9, Math.max(0.5, r.w * 0.06))}
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                  fontWeight={500}
                  fill="#1F1A14"
                  style={{pointerEvents: 'none'}}
                >
                  {r.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
