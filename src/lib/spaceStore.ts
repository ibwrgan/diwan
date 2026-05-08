import type {RoomType} from '@/data/roomTypes';

export type MeasurementMode = 'diy' | 'visit' | 'later';

export type TaggedRoom = {
  id: string;
  type: RoomType;
  label: string;
  // dimensions in metres (1 plan unit = 0.5 m)
  widthM: number;
  heightM: number;
  // position on the source plan (plan units, top-left origin)
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VisitBooking = {
  city: string;
  address: string;
  phone: string;
  day: 'today' | 'tomorrow' | 'afterTomorrow';
  slot: 'morning' | 'afternoon' | 'evening';
  bookedAt: number;
} | null;

export type SpaceState = {
  measurementMode: MeasurementMode | null;
  visitBooking: VisitBooking;
  planId: string | null;     // sample plan id, or 'upload'
  planSize: {w: number; h: number} | null;
  rooms: TaggedRoom[];
  inspirations: {
    boardIds: string[];
    pinterestUrls: string[];
    uploadCount: number;
  };
  step: 1 | 2 | 3 | 4;
};

export const SPACE_INITIAL: SpaceState = {
  measurementMode: null,
  visitBooking: null,
  planId: null,
  planSize: null,
  rooms: [],
  inspirations: {boardIds: [], pinterestUrls: [], uploadCount: 0},
  step: 1,
};

const KEY = 'diwan.space.v1';

export function loadSpace(): SpaceState {
  if (typeof window === 'undefined') return SPACE_INITIAL;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SPACE_INITIAL;
    return {...SPACE_INITIAL, ...JSON.parse(raw)} as SpaceState;
  } catch {
    return SPACE_INITIAL;
  }
}

export function saveSpace(s: SpaceState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function clearSpace() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
