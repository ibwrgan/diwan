// KSA-defaults for the room-type dropdown. Translations live in messages/*.json
// under Space.roomTypes.<key>.

export type RoomType =
  | 'majlis-men'
  | 'majlis-women'
  | 'family-living'
  | 'master-bedroom'
  | 'kids-bedroom'
  | 'kitchen'
  | 'dining'
  | 'office'
  | 'prayer'
  | 'gaming'
  | 'guest'
  | 'outdoor'
  | 'bathroom'
  | 'storage';

export const ROOM_TYPES: RoomType[] = [
  'majlis-men',
  'majlis-women',
  'family-living',
  'master-bedroom',
  'kids-bedroom',
  'kitchen',
  'dining',
  'office',
  'prayer',
  'gaming',
  'guest',
  'outdoor',
  'bathroom',
  'storage',
];

// Each room type gets a small clay accent + brass icon style on the floor plan.
export const ROOM_COLOR: Record<RoomType, string> = {
  'majlis-men':     '#B8552E',
  'majlis-women':   '#D9886B',
  'family-living':  '#B89968',
  'master-bedroom': '#3D4A6B',
  'kids-bedroom':   '#5C8A5C',
  'kitchen':        '#C9994A',
  'dining':         '#A84432',
  'office':         '#4A6B7C',
  'prayer':         '#B89968',
  'gaming':         '#3D4A6B',
  'guest':          '#D9886B',
  'outdoor':        '#5C8A5C',
  'bathroom':       '#4A6B7C',
  'storage':        '#DDD3C3',
};
