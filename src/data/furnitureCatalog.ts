// Furniture catalog — the items the user can browse from /space and place
// in their room (via the in-page 3D preview) or "view in your room" via
// AR using model-viewer's `ar` attribute on supported devices.
//
// `glb` is the cross-platform format (Android Scene Viewer + WebXR).
// `usdz` (iOS Quick Look) is optional; if absent, model-viewer falls
// back to a 360 spin view on iOS.
//
// Drop real .glb/.usdz files into /public/furniture/ and update these
// paths. Until the user uploads real assets, we point at the public
// model-viewer demo CDN so the UI works end-to-end.

export type FurnitureCategory = 'seating' | 'tables' | 'beds' | 'lighting' | 'rugs' | 'storage' | 'decor';

export type FurnitureItem = {
  id: string;
  category: FurnitureCategory;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  priceSAR: number;
  dimensionsCm: {w: number; d: number; h: number};
  glb: string;          // Path to GLB model — used by model-viewer
  usdz?: string;        // Path to USDZ for iOS Quick Look AR
  poster?: string;      // Optional fallback image
  tags: string[];       // material / style tags
  paletteHex: string[]; // Brand-style swatches for the card
};

// Public CDN models (Khronos sample assets) — placeholders until you
// drop in real Diwan-curated furniture .glb files at /public/furniture/.
// Once real files exist there, update glb/usdz paths to /furniture/<file>.

const CDN = 'https://modelviewer.dev/shared-assets/models';

export const FURNITURE_CATALOG: FurnitureItem[] = [
  {
    id: 'majlis-clay-velvet-sofa',
    category: 'seating',
    nameAr: 'كنبة مجلس بمخمل لون الطين',
    nameEn: 'Clay-velvet Majlis Sofa',
    descAr: 'كنبة ثلاثة مقاعد بمخمل سعودي محلّي وأرجل نُحاسيّة. تأتي بأربعة طلاءات.',
    descEn: 'Three-seat low-line sofa in locally woven Saudi velvet, brass legs. Four colorways.',
    priceSAR: 14500,
    dimensionsCm: {w: 220, d: 92, h: 78},
    glb: `${CDN}/glTF/Duck/Duck.gltf`,
    poster: '/projects/najdi-villa-nakheel/closeups/03.jpg',
    tags: ['velvet', 'brass-legs', 'majlis', 'najdi'],
    paletteHex: ['#B8552E', '#D9886B', '#B89968'],
  },
  {
    id: 'oud-armchair',
    category: 'seating',
    nameAr: 'كرسي عُود مخصّص',
    nameEn: 'Oud Carved Armchair',
    descAr: 'كرسي بإطار خشب جوز محفور يدويّاً، وسائد مخمل، صناعة محلّية.',
    descEn: 'Hand-carved walnut frame, velvet cushions, locally crafted.',
    priceSAR: 6800,
    dimensionsCm: {w: 78, d: 82, h: 86},
    glb: `${CDN}/Astronaut.glb`,
    poster: '/projects/kafd-private-office/closeups/02.jpg',
    tags: ['walnut', 'carved', 'armchair'],
    paletteHex: ['#8B5A3C', '#D9886B', '#FAFAF7'],
  },
  {
    id: 'travertine-coffee-table',
    category: 'tables',
    nameAr: 'طاولة قهوة تُرافِرتين',
    nameEn: 'Travertine Coffee Table',
    descAr: 'طاولة قهوة بحجر تُرافِرتين طبيعي، أرجل برونزيّة مرشوقة.',
    descEn: 'Travertine top with brushed-bronze legs. 110×60 cm.',
    priceSAR: 9200,
    dimensionsCm: {w: 110, d: 60, h: 38},
    glb: `${CDN}/glTF-Binary/BoomBox.glb`,
    poster: '/projects/cocoon-family-compound/closeups/03.jpg',
    tags: ['travertine', 'bronze', 'coffee-table'],
    paletteHex: ['#DDD3C3', '#B89968', '#1F1A14'],
  },
  {
    id: 'najdi-pattern-rug',
    category: 'rugs',
    nameAr: 'سجّاد بنقش نجدي',
    nameEn: 'Najdi-pattern Wool Rug',
    descAr: 'سجّاد بصوف 100% بزخرفة نجديّة هندسيّة. أربعة مقاسات.',
    descEn: 'Hand-knotted, 100% wool. Geometric Najdi motif. 4 sizes.',
    priceSAR: 5400,
    dimensionsCm: {w: 240, d: 170, h: 2},
    glb: `${CDN}/Astronaut.glb`,
    poster: '/projects/najdi-villa-nakheel/closeups/01.jpg',
    tags: ['wool', 'najdi', 'rug'],
    paletteHex: ['#B8552E', '#1F1A14', '#FAFAF7'],
  },
  {
    id: 'brass-pendant',
    category: 'lighting',
    nameAr: 'إنارة معلّقة نُحاسيّة',
    nameEn: 'Hammered-brass Pendant',
    descAr: 'إنارة سقف نُحاس مَطْروق يدويّاً — من ورشة سعوديّة.',
    descEn: 'Hand-hammered brass pendant by a Saudi metalsmith. Single bulb E27.',
    priceSAR: 2200,
    dimensionsCm: {w: 36, d: 36, h: 32},
    glb: `${CDN}/Astronaut.glb`,
    poster: '/projects/bujairi-heritage-cafe/closeups/02.jpg',
    tags: ['brass', 'pendant', 'lighting'],
    paletteHex: ['#B89968', '#1A1F2E', '#FAFAF7'],
  },
  {
    id: 'walnut-credenza',
    category: 'storage',
    nameAr: 'خزانة جانبيّة جوز',
    nameEn: 'Walnut Credenza',
    descAr: 'خزانة جانبيّة بثلاثة أبواب جوز، مفاصل برونزيّة، مقابض مَطْروقة.',
    descEn: '3-door credenza in walnut with bronze hinges, hammered brass pulls.',
    priceSAR: 11800,
    dimensionsCm: {w: 200, d: 48, h: 76},
    glb: `${CDN}/glTF/Duck/Duck.gltf`,
    poster: '/projects/kafd-private-office/closeups/03.jpg',
    tags: ['walnut', 'storage', 'credenza'],
    paletteHex: ['#8B5A3C', '#B89968', '#FAFAF7'],
  },
  {
    id: 'bone-quartz-dining',
    category: 'tables',
    nameAr: 'طاولة طعام كوارتز عاجي',
    nameEn: 'Bone-quartz Dining Table',
    descAr: 'طاولة طعام لثمانية، سطح كوارتز عاجي، قاعدة جوز.',
    descEn: 'Seats 8. Bone-quartz top on solid walnut base.',
    priceSAR: 18500,
    dimensionsCm: {w: 240, d: 100, h: 76},
    glb: `${CDN}/glTF-Binary/BoomBox.glb`,
    poster: '/projects/hittin-townhouse-riyadh/closeups/02.jpg',
    tags: ['quartz', 'walnut', 'dining'],
    paletteHex: ['#FAFAF7', '#8B5A3C', '#B89968'],
  },
  {
    id: 'cedar-mashrabiya-screen',
    category: 'decor',
    nameAr: 'مشربيّة أرز محفورة',
    nameEn: 'Carved Cedar Mashrabiya Screen',
    descAr: 'مشربية أرز محفورة يدويّاً بنقش نجدي. خيار جدار أو فاصل.',
    descEn: 'Hand-carved cedar with Najdi geometric pattern. Wall-mount or partition.',
    priceSAR: 8400,
    dimensionsCm: {w: 180, d: 4, h: 220},
    glb: `${CDN}/Astronaut.glb`,
    poster: '/projects/najdi-villa-nakheel/closeups/01.jpg',
    tags: ['cedar', 'najdi', 'screen', 'decor'],
    paletteHex: ['#7A4A2A', '#B89968', '#FAFAF7'],
  },
];

export function fmtPriceSAR(n: number) {
  return `SAR ${n.toLocaleString('en-US')}`;
}
