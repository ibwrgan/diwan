// Mini SKU catalog + framework pricing per supplier. This is the
// "express tier" data referenced in the brief — locked unit prices
// from each supplier, queried instantly when a customer's design is
// approved. Real product would be a Postgres table; this is plenty for
// the pitch demo.

import type {RoomType} from './roomTypes';

export type Supplier = {
  id: string;
  name: string;        // bilingual key in messages.Suppliers.network.<id>
  city: 'Riyadh' | 'Jeddah' | 'Dammam';
  diwanExclusive: boolean;
  leadTimeDays: number;
  category: string[];  // categories supplied
};

export const SUPPLIERS: Supplier[] = [
  {id: 'almutlaq',  name: 'Almutlaq',     city: 'Riyadh', diwanExclusive: true,  leadTimeDays: 12, category: ['sofa', 'majlis-set', 'bed', 'wardrobe']},
  {id: 'alrugaib',  name: 'Al-Rugaib',    city: 'Riyadh', diwanExclusive: true,  leadTimeDays: 14, category: ['dining-table', 'dining-chair', 'sideboard', 'desk']},
  {id: 'home-fix',  name: 'Home Fix',     city: 'Riyadh', diwanExclusive: false, leadTimeDays: 7,  category: ['lighting', 'mirror', 'art']},
  {id: 'ikea-pro',  name: 'IKEA Pro',     city: 'Riyadh', diwanExclusive: false, leadTimeDays: 5,  category: ['storage', 'kids-furniture', 'rug']},
  {id: 'extra',     name: 'Extra',        city: 'Riyadh', diwanExclusive: false, leadTimeDays: 4,  category: ['appliance', 'electronics']},
  {id: 'saco',      name: 'SACO',         city: 'Riyadh', diwanExclusive: false, leadTimeDays: 6,  category: ['hardware', 'finishes', 'paint']},
  {id: 'najdi-craft', name: 'Najdi Craft', city: 'Riyadh', diwanExclusive: true,  leadTimeDays: 21, category: ['screens', 'panels', 'rugs', 'craft']},
  {id: 'hijazi-wood', name: 'Hijazi Wood', city: 'Jeddah', diwanExclusive: true,  leadTimeDays: 18, category: ['shutters', 'doors', 'cabinetry']},
];

export type SKU = {
  id: string;
  category: string;
  name: string;          // English name; Arabic via messages
  supplierId: string;
  retailPrice: number;   // SAR — visible "estimated retail"
  diwanPrice: number;    // SAR — what customer actually pays
  diwanCost: number;     // SAR — what Diwan pays the supplier (margin = price - cost)
  forRooms: RoomType[];  // rooms where this SKU is recommended
  styleTags: string[];   // 'najdi' | 'hijazi' | 'contemporary' | 'minimal' | 'layered' | 'warm' | 'cool'
};

// 40 sample SKUs across categories. Prices in SAR. The AI matches these
// to designs by category + style tags.
export const SKUS: SKU[] = [
  // Majlis sets & sofas
  {id: 'maj-001', category: 'majlis-set',  name: 'Najdi geometric majlis set, 12-seat',     supplierId: 'almutlaq',    retailPrice: 32_400, diwanPrice: 27_900, diwanCost: 22_500, forRooms: ['majlis-men', 'majlis-women'], styleTags: ['najdi', 'warm', 'layered']},
  {id: 'maj-002', category: 'majlis-set',  name: 'Hijazi minimal majlis set, 10-seat',      supplierId: 'almutlaq',    retailPrice: 26_800, diwanPrice: 23_200, diwanCost: 18_900, forRooms: ['majlis-men', 'majlis-women'], styleTags: ['hijazi', 'cool', 'minimal']},
  {id: 'sof-001', category: 'sofa',        name: 'Travertine sectional, 4m',                supplierId: 'almutlaq',    retailPrice: 18_500, diwanPrice: 15_900, diwanCost: 12_800, forRooms: ['family-living'],              styleTags: ['contemporary', 'cool', 'minimal']},
  {id: 'sof-002', category: 'sofa',        name: 'Clay velvet sofa, 3m',                    supplierId: 'almutlaq',    retailPrice: 14_200, diwanPrice: 12_400, diwanCost: 9_800,  forRooms: ['family-living'],              styleTags: ['warm', 'layered']},
  {id: 'sof-003', category: 'sofa',        name: 'Bone linen 3-seater',                     supplierId: 'almutlaq',    retailPrice: 12_900, diwanPrice: 11_200, diwanCost: 8_900,  forRooms: ['family-living'],              styleTags: ['contemporary', 'cool', 'minimal']},

  // Beds
  {id: 'bed-001', category: 'bed',         name: 'Walnut platform king',                    supplierId: 'almutlaq',    retailPrice: 9_800,  diwanPrice: 8_400,  diwanCost: 6_700,  forRooms: ['master-bedroom'],            styleTags: ['warm', 'contemporary']},
  {id: 'bed-002', category: 'bed',         name: 'Upholstered linen king',                  supplierId: 'almutlaq',    retailPrice: 11_200, diwanPrice: 9_700,  diwanCost: 7_900,  forRooms: ['master-bedroom'],            styleTags: ['cool', 'minimal']},
  {id: 'bed-003', category: 'bed',         name: 'Kids twin frame with shelves',            supplierId: 'ikea-pro',    retailPrice: 2_400,  diwanPrice: 2_100,  diwanCost: 1_700,  forRooms: ['kids-bedroom'],              styleTags: ['contemporary']},
  {id: 'wrd-001', category: 'wardrobe',    name: '6-door fitted wardrobe',                  supplierId: 'almutlaq',    retailPrice: 13_400, diwanPrice: 11_600, diwanCost: 9_200,  forRooms: ['master-bedroom'],            styleTags: ['contemporary', 'warm']},

  // Dining
  {id: 'din-001', category: 'dining-table', name: 'Walnut 8-seat dining table',             supplierId: 'alrugaib',    retailPrice: 9_400,  diwanPrice: 8_100,  diwanCost: 6_400,  forRooms: ['dining'],                    styleTags: ['warm', 'contemporary']},
  {id: 'din-002', category: 'dining-table', name: 'Travertine 6-seat dining table',         supplierId: 'alrugaib',    retailPrice: 11_800, diwanPrice: 10_200, diwanCost: 8_300,  forRooms: ['dining'],                    styleTags: ['cool', 'minimal']},
  {id: 'din-003', category: 'dining-chair', name: 'Set of 8 cane dining chairs',            supplierId: 'alrugaib',    retailPrice: 6_400,  diwanPrice: 5_500,  diwanCost: 4_400,  forRooms: ['dining'],                    styleTags: ['hijazi', 'warm']},
  {id: 'din-004', category: 'dining-chair', name: 'Set of 8 ash dining chairs',             supplierId: 'alrugaib',    retailPrice: 7_200,  diwanPrice: 6_300,  diwanCost: 5_000,  forRooms: ['dining'],                    styleTags: ['contemporary']},
  {id: 'sid-001', category: 'sideboard',   name: 'Walnut credenza, 2.4m',                   supplierId: 'alrugaib',    retailPrice: 8_900,  diwanPrice: 7_700,  diwanCost: 6_100,  forRooms: ['dining', 'family-living'],   styleTags: ['warm', 'layered']},

  // Kitchen
  {id: 'kit-001', category: 'kitchen-island', name: 'Travertine 3m island',                 supplierId: 'alrugaib',    retailPrice: 22_400, diwanPrice: 19_400, diwanCost: 15_500, forRooms: ['kitchen'],                   styleTags: ['cool', 'minimal']},
  {id: 'kit-002', category: 'kitchen-cabinetry', name: 'Walnut cabinetry run, 6m',          supplierId: 'hijazi-wood', retailPrice: 38_900, diwanPrice: 33_400, diwanCost: 26_900, forRooms: ['kitchen'],                   styleTags: ['warm']},
  {id: 'app-001', category: 'appliance',   name: 'Built-in oven & cooktop set',             supplierId: 'extra',       retailPrice: 14_200, diwanPrice: 12_400, diwanCost: 9_900,  forRooms: ['kitchen'],                   styleTags: []},
  {id: 'app-002', category: 'appliance',   name: 'Integrated fridge-freezer',               supplierId: 'extra',       retailPrice: 18_900, diwanPrice: 16_400, diwanCost: 13_100, forRooms: ['kitchen'],                   styleTags: []},

  // Lighting
  {id: 'lig-001', category: 'lighting',    name: 'Brass pendant cluster, 5-light',          supplierId: 'home-fix',    retailPrice: 4_200,  diwanPrice: 3_600,  diwanCost: 2_800,  forRooms: ['dining', 'family-living'],   styleTags: ['warm']},
  {id: 'lig-002', category: 'lighting',    name: 'Linear pendant, 1.8m',                    supplierId: 'home-fix',    retailPrice: 3_400,  diwanPrice: 2_900,  diwanCost: 2_300,  forRooms: ['dining'],                    styleTags: ['cool', 'minimal']},
  {id: 'lig-003', category: 'lighting',    name: 'Set of 4 wall sconces',                   supplierId: 'home-fix',    retailPrice: 2_400,  diwanPrice: 2_100,  diwanCost: 1_700,  forRooms: ['family-living', 'master-bedroom'], styleTags: []},

  // Rugs & soft furnishings
  {id: 'rug-001', category: 'rug',         name: 'Najdi-pattern wool rug, 3x4m',            supplierId: 'najdi-craft', retailPrice: 8_400,  diwanPrice: 7_200,  diwanCost: 5_800,  forRooms: ['majlis-men', 'majlis-women', 'family-living'], styleTags: ['najdi', 'warm', 'layered']},
  {id: 'rug-002', category: 'rug',         name: 'Cream wool rug, 3x4m',                    supplierId: 'najdi-craft', retailPrice: 6_900,  diwanPrice: 5_900,  diwanCost: 4_700,  forRooms: ['family-living', 'master-bedroom'], styleTags: ['minimal', 'cool']},

  // Najdi-craft items
  {id: 'scr-001', category: 'screens',     name: 'Carved cedar mashrabiya screen',          supplierId: 'najdi-craft', retailPrice: 9_800,  diwanPrice: 8_400,  diwanCost: 6_700,  forRooms: ['majlis-men', 'family-living', 'dining'], styleTags: ['najdi', 'warm', 'layered']},
  {id: 'pan-001', category: 'panels',      name: 'Brass-inlay wall panel, 2x3m',            supplierId: 'najdi-craft', retailPrice: 12_400, diwanPrice: 10_700, diwanCost: 8_500,  forRooms: ['majlis-men'],                styleTags: ['najdi', 'warm', 'layered']},

  // Storage / kids
  {id: 'sto-001', category: 'storage',     name: 'Built-in playroom storage',               supplierId: 'ikea-pro',    retailPrice: 3_900,  diwanPrice: 3_400,  diwanCost: 2_700,  forRooms: ['kids-bedroom', 'gaming'],     styleTags: []},
  {id: 'sto-002', category: 'storage',     name: 'Office shelving, 3m',                     supplierId: 'alrugaib',    retailPrice: 5_400,  diwanPrice: 4_700,  diwanCost: 3_700,  forRooms: ['office'],                    styleTags: ['contemporary']},
  {id: 'des-001', category: 'desk',        name: 'Walnut writing desk',                     supplierId: 'alrugaib',    retailPrice: 6_900,  diwanPrice: 6_000,  diwanCost: 4_800,  forRooms: ['office'],                    styleTags: ['warm']},

  // Mirrors & art
  {id: 'mir-001', category: 'mirror',      name: 'Floor-length brass mirror',               supplierId: 'home-fix',    retailPrice: 2_900,  diwanPrice: 2_500,  diwanCost: 2_000,  forRooms: ['master-bedroom', 'bathroom'], styleTags: ['warm']},
  {id: 'art-001', category: 'art',         name: 'Curated Saudi art print set, 3 pieces',   supplierId: 'home-fix',    retailPrice: 3_400,  diwanPrice: 2_900,  diwanCost: 2_300,  forRooms: ['family-living', 'majlis-women'], styleTags: []},

  // Hijazi shutters
  {id: 'shu-001', category: 'shutters',    name: 'Pale-wood shutter set, 4 windows',        supplierId: 'hijazi-wood', retailPrice: 11_200, diwanPrice: 9_700,  diwanCost: 7_700,  forRooms: ['master-bedroom', 'family-living'], styleTags: ['hijazi', 'cool']},

  // Paint & finishes
  {id: 'pai-001', category: 'paint',       name: 'Premium paint package, 4 rooms',          supplierId: 'saco',        retailPrice: 4_400,  diwanPrice: 3_800,  diwanCost: 3_000,  forRooms: ['master-bedroom', 'kids-bedroom', 'family-living', 'office'], styleTags: []},
  {id: 'pai-002', category: 'paint',       name: 'Premium paint package, 2 rooms',          supplierId: 'saco',        retailPrice: 2_400,  diwanPrice: 2_100,  diwanCost: 1_700,  forRooms: ['master-bedroom', 'kids-bedroom'], styleTags: []},

  // Bathroom
  {id: 'bat-001', category: 'finishes',    name: 'Travertine vanity 1.6m',                  supplierId: 'saco',        retailPrice: 8_900,  diwanPrice: 7_700,  diwanCost: 6_100,  forRooms: ['bathroom'],                  styleTags: ['cool', 'minimal']},
  {id: 'bat-002', category: 'finishes',    name: 'Marble vanity 1.6m',                      supplierId: 'saco',        retailPrice: 11_400, diwanPrice: 9_900,  diwanCost: 7_900,  forRooms: ['bathroom'],                  styleTags: ['warm']},
];

export function skuById(id: string): SKU | undefined {
  return SKUS.find((s) => s.id === id);
}
export function supplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}
