// Eight sample KSA floor plans for the demo. Each plan is rendered as a clean
// SVG by <FloorPlanSVG />. Customers either pick from these or upload their own.
// Coordinates are in plan units (1 unit = 0.5 m). Origin top-left.

import type {RoomType} from './roomTypes';

export type PlanRoom = {
  id: string;
  defaultType: RoomType;
  label: string;        // shown by default; user can re-tag
  // axis-aligned rectangle in plan units
  x: number;
  y: number;
  w: number;
  h: number;
};

export type FloorPlan = {
  id: string;
  name: string;          // bilingual key in messages
  category: 'residential' | 'commercial';
  area: number;          // m² (rough)
  bedrooms: number;
  size: {w: number; h: number};
  rooms: PlanRoom[];
};

export const SAMPLE_PLANS: FloorPlan[] = [
  // 1) 1-bed apartment ~ 90 m²
  {
    id: 'apt-1br',
    name: 'apt1br',
    category: 'residential',
    area: 90,
    bedrooms: 1,
    size: {w: 24, h: 16},
    rooms: [
      {id: 'r1', defaultType: 'majlis-men',     label: 'Majlis',           x: 0,  y: 0,  w: 10, h: 8},
      {id: 'r2', defaultType: 'family-living',  label: 'Family Living',    x: 10, y: 0,  w: 8,  h: 8},
      {id: 'r3', defaultType: 'kitchen',        label: 'Kitchen',          x: 18, y: 0,  w: 6,  h: 6},
      {id: 'r4', defaultType: 'dining',         label: 'Dining',           x: 18, y: 6,  w: 6,  h: 4},
      {id: 'r5', defaultType: 'master-bedroom', label: 'Master Bedroom',   x: 0,  y: 8,  w: 10, h: 8},
      {id: 'r6', defaultType: 'bathroom',       label: 'Bath',             x: 10, y: 8,  w: 4,  h: 4},
      {id: 'r7', defaultType: 'prayer',         label: 'Prayer',           x: 14, y: 8,  w: 4,  h: 4},
      {id: 'r8', defaultType: 'storage',        label: 'Storage',          x: 18, y: 10, w: 6,  h: 6},
      {id: 'r9', defaultType: 'bathroom',       label: 'Powder',           x: 10, y: 12, w: 8,  h: 4},
    ],
  },
  // 2) 2-bed apartment ~ 130 m²
  {
    id: 'apt-2br',
    name: 'apt2br',
    category: 'residential',
    area: 130,
    bedrooms: 2,
    size: {w: 28, h: 18},
    rooms: [
      {id: 'r1',  defaultType: 'majlis-men',     label: 'Majlis (M)',     x: 0,  y: 0,  w: 12, h: 9},
      {id: 'r2',  defaultType: 'majlis-women',   label: 'Majlis (W)',     x: 12, y: 0,  w: 8,  h: 9},
      {id: 'r3',  defaultType: 'kitchen',        label: 'Kitchen',        x: 20, y: 0,  w: 8,  h: 6},
      {id: 'r4',  defaultType: 'dining',         label: 'Dining',         x: 20, y: 6,  w: 8,  h: 4},
      {id: 'r5',  defaultType: 'family-living',  label: 'Family Living',  x: 0,  y: 9,  w: 10, h: 9},
      {id: 'r6',  defaultType: 'master-bedroom', label: 'Master Bedroom', x: 10, y: 9,  w: 10, h: 9},
      {id: 'r7',  defaultType: 'kids-bedroom',   label: 'Kids Bedroom',   x: 20, y: 10, w: 8,  h: 5},
      {id: 'r8',  defaultType: 'prayer',         label: 'Prayer',         x: 20, y: 15, w: 4,  h: 3},
      {id: 'r9',  defaultType: 'bathroom',       label: 'Bath',           x: 24, y: 15, w: 4,  h: 3},
    ],
  },
  // 3) 3-bed apartment ~ 180 m²
  {
    id: 'apt-3br',
    name: 'apt3br',
    category: 'residential',
    area: 180,
    bedrooms: 3,
    size: {w: 30, h: 22},
    rooms: [
      {id: 'r1',  defaultType: 'majlis-men',     label: 'Majlis (M)',     x: 0,  y: 0,  w: 14, h: 10},
      {id: 'r2',  defaultType: 'majlis-women',   label: 'Majlis (W)',     x: 14, y: 0,  w: 10, h: 10},
      {id: 'r3',  defaultType: 'dining',         label: 'Dining',         x: 24, y: 0,  w: 6,  h: 6},
      {id: 'r4',  defaultType: 'kitchen',        label: 'Kitchen',        x: 24, y: 6,  w: 6,  h: 8},
      {id: 'r5',  defaultType: 'family-living',  label: 'Family Living',  x: 0,  y: 10, w: 10, h: 12},
      {id: 'r6',  defaultType: 'master-bedroom', label: 'Master Bedroom', x: 10, y: 10, w: 8,  h: 8},
      {id: 'r7',  defaultType: 'kids-bedroom',   label: 'Kids Bedroom 1', x: 18, y: 10, w: 6,  h: 6},
      {id: 'r8',  defaultType: 'kids-bedroom',   label: 'Kids Bedroom 2', x: 18, y: 16, w: 6,  h: 6},
      {id: 'r9',  defaultType: 'bathroom',       label: 'Bath',           x: 10, y: 18, w: 4,  h: 4},
      {id: 'r10', defaultType: 'prayer',         label: 'Prayer',         x: 14, y: 18, w: 4,  h: 4},
      {id: 'r11', defaultType: 'storage',        label: 'Storage',        x: 24, y: 14, w: 6,  h: 8},
    ],
  },
  // 4) 4-bed villa ~ 280 m²
  {
    id: 'villa-4br',
    name: 'villa4br',
    category: 'residential',
    area: 280,
    bedrooms: 4,
    size: {w: 36, h: 24},
    rooms: [
      {id: 'r1',  defaultType: 'majlis-men',     label: 'Majlis (M)',       x: 0,  y: 0,  w: 16, h: 10},
      {id: 'r2',  defaultType: 'majlis-women',   label: 'Majlis (W)',       x: 16, y: 0,  w: 10, h: 10},
      {id: 'r3',  defaultType: 'dining',         label: 'Dining',           x: 26, y: 0,  w: 10, h: 6},
      {id: 'r4',  defaultType: 'kitchen',        label: 'Kitchen',          x: 26, y: 6,  w: 10, h: 8},
      {id: 'r5',  defaultType: 'family-living',  label: 'Family Living',    x: 0,  y: 10, w: 12, h: 14},
      {id: 'r6',  defaultType: 'master-bedroom', label: 'Master Bedroom',   x: 12, y: 10, w: 10, h: 10},
      {id: 'r7',  defaultType: 'kids-bedroom',   label: "Kids Bedroom 1",   x: 22, y: 10, w: 7,  h: 7},
      {id: 'r8',  defaultType: 'kids-bedroom',   label: "Kids Bedroom 2",   x: 29, y: 10, w: 7,  h: 7},
      {id: 'r9',  defaultType: 'office',         label: 'Office',           x: 22, y: 17, w: 7,  h: 7},
      {id: 'r10', defaultType: 'gaming',         label: 'Gaming',           x: 29, y: 17, w: 7,  h: 7},
      {id: 'r11', defaultType: 'prayer',         label: 'Prayer',           x: 12, y: 20, w: 5,  h: 4},
      {id: 'r12', defaultType: 'bathroom',       label: 'Bath',             x: 17, y: 20, w: 5,  h: 4},
    ],
  },
  // 5) 5-bed villa ~ 360 m²
  {
    id: 'villa-5br',
    name: 'villa5br',
    category: 'residential',
    area: 360,
    bedrooms: 5,
    size: {w: 40, h: 28},
    rooms: [
      {id: 'r1',  defaultType: 'majlis-men',     label: 'Majlis (M)',     x: 0,  y: 0,  w: 18, h: 12},
      {id: 'r2',  defaultType: 'majlis-women',   label: 'Majlis (W)',     x: 18, y: 0,  w: 12, h: 12},
      {id: 'r3',  defaultType: 'dining',         label: 'Dining',         x: 30, y: 0,  w: 10, h: 7},
      {id: 'r4',  defaultType: 'kitchen',        label: 'Kitchen',        x: 30, y: 7,  w: 10, h: 8},
      {id: 'r5',  defaultType: 'family-living',  label: 'Family Living',  x: 0,  y: 12, w: 14, h: 16},
      {id: 'r6',  defaultType: 'master-bedroom', label: 'Master Bedroom', x: 14, y: 12, w: 10, h: 10},
      {id: 'r7',  defaultType: 'kids-bedroom',   label: 'Kids Bedroom 1', x: 24, y: 12, w: 8,  h: 8},
      {id: 'r8',  defaultType: 'kids-bedroom',   label: 'Kids Bedroom 2', x: 32, y: 15, w: 8,  h: 7},
      {id: 'r9',  defaultType: 'guest',          label: 'Guest Suite',    x: 24, y: 20, w: 8,  h: 8},
      {id: 'r10', defaultType: 'office',         label: 'Office',         x: 32, y: 22, w: 8,  h: 6},
      {id: 'r11', defaultType: 'prayer',         label: 'Prayer',         x: 14, y: 22, w: 5,  h: 6},
      {id: 'r12', defaultType: 'bathroom',       label: 'Bath',           x: 19, y: 22, w: 5,  h: 6},
      {id: 'r13', defaultType: 'outdoor',        label: 'Terrace',        x: 0,  y: 0,  w: 0,  h: 0}, // placeholder, hidden until tagged
    ].filter((r) => r.w > 0),
  },
  // 6) Cafe ~ 120 m²
  {
    id: 'cafe-120',
    name: 'cafe120',
    category: 'commercial',
    area: 120,
    bedrooms: 0,
    size: {w: 24, h: 20},
    rooms: [
      {id: 'r1', defaultType: 'family-living', label: 'Seating',  x: 0,  y: 0,  w: 14, h: 14},
      {id: 'r2', defaultType: 'kitchen',       label: 'Bar',      x: 14, y: 0,  w: 10, h: 6},
      {id: 'r3', defaultType: 'kitchen',       label: 'Kitchen',  x: 14, y: 6,  w: 10, h: 8},
      {id: 'r4', defaultType: 'storage',       label: 'Storage',  x: 14, y: 14, w: 5,  h: 6},
      {id: 'r5', defaultType: 'bathroom',      label: 'Bath',     x: 19, y: 14, w: 5,  h: 6},
      {id: 'r6', defaultType: 'outdoor',       label: 'Terrace',  x: 0,  y: 14, w: 14, h: 6},
    ],
  },
  // 7) Clinic ~ 150 m²
  {
    id: 'clinic-150',
    name: 'clinic150',
    category: 'commercial',
    area: 150,
    bedrooms: 0,
    size: {w: 26, h: 18},
    rooms: [
      {id: 'r1', defaultType: 'family-living', label: 'Reception',     x: 0,  y: 0,  w: 12, h: 9},
      {id: 'r2', defaultType: 'office',        label: 'Consult 1',     x: 12, y: 0,  w: 7,  h: 6},
      {id: 'r3', defaultType: 'office',        label: 'Consult 2',     x: 19, y: 0,  w: 7,  h: 6},
      {id: 'r4', defaultType: 'office',        label: 'Treatment',     x: 12, y: 6,  w: 14, h: 6},
      {id: 'r5', defaultType: 'storage',       label: 'Pharmacy',      x: 0,  y: 9,  w: 8,  h: 9},
      {id: 'r6', defaultType: 'office',        label: 'Lab',           x: 8,  y: 12, w: 6,  h: 6},
      {id: 'r7', defaultType: 'bathroom',      label: 'Bath',          x: 14, y: 12, w: 6,  h: 6},
      {id: 'r8', defaultType: 'storage',       label: 'Staff',         x: 20, y: 12, w: 6,  h: 6},
    ],
  },
  // 8) Office ~ 200 m²
  {
    id: 'office-200',
    name: 'office200',
    category: 'commercial',
    area: 200,
    bedrooms: 0,
    size: {w: 30, h: 20},
    rooms: [
      {id: 'r1', defaultType: 'family-living', label: 'Reception',  x: 0,  y: 0,  w: 10, h: 8},
      {id: 'r2', defaultType: 'office',        label: 'Open Plan',  x: 10, y: 0,  w: 14, h: 12},
      {id: 'r3', defaultType: 'office',        label: 'Director',   x: 24, y: 0,  w: 6,  h: 8},
      {id: 'r4', defaultType: 'dining',        label: 'Boardroom',  x: 0,  y: 8,  w: 10, h: 8},
      {id: 'r5', defaultType: 'kitchen',       label: 'Pantry',     x: 24, y: 8,  w: 6,  h: 6},
      {id: 'r6', defaultType: 'office',        label: 'Phone Room', x: 10, y: 12, w: 6,  h: 4},
      {id: 'r7', defaultType: 'office',        label: 'Phone Room', x: 16, y: 12, w: 6,  h: 4},
      {id: 'r8', defaultType: 'prayer',        label: 'Prayer',     x: 22, y: 14, w: 4,  h: 6},
      {id: 'r9', defaultType: 'bathroom',      label: 'Bath',       x: 26, y: 14, w: 4,  h: 6},
      {id: 'r10',defaultType: 'storage',       label: 'Storage',    x: 0,  y: 16, w: 16, h: 4},
    ],
  },
];
