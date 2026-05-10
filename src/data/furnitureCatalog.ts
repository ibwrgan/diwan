// Furniture catalog — 400+ items generated from category templates.
// Each template defines a base piece (e.g. "3-seat Majlis sofa") and
// gets exploded across material × style × colorway combinations to
// produce realistic catalog density.
//
// AR-ready: each item has a `glb` URL. Real .glb/.usdz files belong in
// /public/furniture/<id>/{model.glb, model.usdz}; until those exist we
// rotate through a pool of public CDN sample models so the UI demos
// end-to-end.

export type FurnitureCategory =
  | 'seating'
  | 'tables'
  | 'beds'
  | 'storage'
  | 'lighting'
  | 'rugs'
  | 'wall-decor'
  | 'kitchen'
  | 'bath'
  | 'textiles'
  | 'plants'
  | 'accents';

export type FurnitureStyle =
  | 'Modern Najdi'
  | 'Heritage Najdi'
  | 'Hijazi Coastal'
  | 'Contemporary'
  | 'Industrial'
  | 'Minimalist'
  | 'Cocoon'
  | 'Open Living';

export type FurnitureItem = {
  id: string;
  category: FurnitureCategory;
  style: FurnitureStyle;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  priceSAR: number;
  dimensionsCm: {w: number; d: number; h: number};
  glb: string;
  usdz?: string;
  poster?: string;
  tags: string[];        // material, finish, room flags
  paletteHex: string[];
};

// ── Public CDN sample models (used as placeholders until you drop real
//    .glb files into /public/furniture/<id>/model.glb).
//    These are Khronos / Sketchfab sample assets that work cross-origin
//    with model-viewer's ar-modes="scene-viewer quick-look webxr".
const CDN_MODELS = [
  'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/glTF-Binary/BoomBox.glb',
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
];

// Posters cycle through real project closeups so each card shows real
// material texture instead of an empty placeholder.
const POSTER_POOL = [
  '/projects/najdi-villa-nakheel/closeups/01.jpg',
  '/projects/najdi-villa-nakheel/closeups/02.jpg',
  '/projects/najdi-villa-nakheel/closeups/03.jpg',
  '/projects/coastal-jeddah-corniche/closeups/01.jpg',
  '/projects/coastal-jeddah-corniche/closeups/02.jpg',
  '/projects/coastal-jeddah-corniche/closeups/03.jpg',
  '/projects/riyadh-contemporary-penthouse/closeups/01.jpg',
  '/projects/riyadh-contemporary-penthouse/closeups/02.jpg',
  '/projects/riyadh-contemporary-penthouse/closeups/03.jpg',
  '/projects/cocoon-family-compound/closeups/01.jpg',
  '/projects/cocoon-family-compound/closeups/02.jpg',
  '/projects/cocoon-family-compound/closeups/03.jpg',
  '/projects/open-living-3br-villa/closeups/01.jpg',
  '/projects/open-living-3br-villa/closeups/02.jpg',
  '/projects/open-living-3br-villa/closeups/03.jpg',
  '/projects/boutique-cafe-dq/closeups/01.jpg',
  '/projects/boutique-cafe-dq/closeups/02.jpg',
  '/projects/boutique-cafe-dq/closeups/03.jpg',
  '/projects/workshop-dental-clinic/closeups/01.jpg',
  '/projects/workshop-dental-clinic/closeups/02.jpg',
  '/projects/workshop-dental-clinic/closeups/03.jpg',
  '/projects/kafd-coworking-floor/closeups/01.jpg',
  '/projects/kafd-coworking-floor/closeups/02.jpg',
  '/projects/kafd-coworking-floor/closeups/03.jpg',
  '/projects/hittin-townhouse-riyadh/closeups/01.jpg',
  '/projects/hittin-townhouse-riyadh/closeups/02.jpg',
  '/projects/hittin-townhouse-riyadh/closeups/03.jpg',
  '/projects/olaya-roastery-riyadh/closeups/01.jpg',
  '/projects/olaya-roastery-riyadh/closeups/02.jpg',
  '/projects/olaya-roastery-riyadh/closeups/03.jpg',
  '/projects/bujairi-heritage-cafe/closeups/01.jpg',
  '/projects/bujairi-heritage-cafe/closeups/02.jpg',
  '/projects/bujairi-heritage-cafe/closeups/03.jpg',
  '/projects/kafd-private-office/closeups/01.jpg',
  '/projects/kafd-private-office/closeups/02.jpg',
  '/projects/kafd-private-office/closeups/03.jpg',
];

// Material / finish tags + their hex palettes
const MATERIALS = {
  'carved-cedar':     {ar: 'أرز محفور',         en: 'Carved cedar',         hex: ['#7A4A2A', '#B89968']},
  'walnut':           {ar: 'جوز',                en: 'Walnut',               hex: ['#5C3A24', '#B89968']},
  'oak':              {ar: 'بلوط',               en: 'Oak',                  hex: ['#A88259', '#DDD3C3']},
  'ash':              {ar: 'حُور',                en: 'Ash',                  hex: ['#D4C5AA', '#FAFAF7']},
  'hammered-brass':   {ar: 'نُحاس مَطْروق',     en: 'Hammered brass',      hex: ['#B89968', '#1F1A14']},
  'brushed-bronze':   {ar: 'برونز مَفْرُوش',    en: 'Brushed bronze',      hex: ['#9B7A3F', '#DDD3C3']},
  'limestone':        {ar: 'حجر كلسي',           en: 'Limestone',           hex: ['#DDD3C3', '#B89968']},
  'travertine':       {ar: 'تُرافِرتين',         en: 'Travertine',          hex: ['#E5D9C2', '#B89968']},
  'marble':           {ar: 'رخام',                en: 'Marble',               hex: ['#F0EBE4', '#B89968']},
  'mud-plaster':      {ar: 'طين مصبوب',          en: 'Mud plaster',         hex: ['#B58A60', '#7A4A2A']},
  'clay-velvet':      {ar: 'مخمل لون الطين',     en: 'Clay velvet',         hex: ['#B8552E', '#D9886B']},
  'midnight-velvet':  {ar: 'مخمل ليلي',           en: 'Midnight velvet',     hex: ['#1A1F2E', '#3D4A6B']},
  'wool':             {ar: 'صوف',                  en: 'Wool',                hex: ['#B8552E', '#DDD3C3']},
  'linen':            {ar: 'كتّان',                en: 'Linen',                hex: ['#DDD3C3', '#FAFAF7']},
  'leather':          {ar: 'جلد',                  en: 'Leather',              hex: ['#5C3A24', '#1F1A14']},
  'rattan':           {ar: 'خَيْزُران',           en: 'Rattan',                hex: ['#A88259', '#DDD3C3']},
  'ceramic':          {ar: 'سيراميك',             en: 'Ceramic',              hex: ['#B89968', '#FAFAF7']},
  'glass':            {ar: 'زجاج',                en: 'Glass',                hex: ['#E8EDF2', '#DDD3C3']},
};

type MatKey = keyof typeof MATERIALS;

const STYLES: FurnitureStyle[] = [
  'Modern Najdi',
  'Heritage Najdi',
  'Hijazi Coastal',
  'Contemporary',
  'Industrial',
  'Minimalist',
  'Cocoon',
  'Open Living',
];

const STYLES_AR: Record<FurnitureStyle, string> = {
  'Modern Najdi':   'نجدي عصري',
  'Heritage Najdi': 'نجدي تراثي',
  'Hijazi Coastal': 'حجازي ساحلي',
  'Contemporary':   'معاصر',
  'Industrial':     'صناعي',
  'Minimalist':     'بساطة',
  'Cocoon':         'كوكون',
  'Open Living':    'معيشة مفتوحة',
};

// Template rows. Each row is one piece-type that gets exploded across
// `materials × styles` to produce a number of variants.
type Tpl = {
  category: FurnitureCategory;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  basePrice: number;       // SAR — base; varies ±20% across variants
  dim: {w: number; d: number; h: number};
  materials: MatKey[];     // candidate materials
  styles?: FurnitureStyle[]; // optional restriction; defaults to all
};

const TEMPLATES: Tpl[] = [
  // ── SEATING ────────────────────────────────────────────────────────────
  {category: 'seating', nameEn: '3-Seat Majlis Sofa', nameAr: 'كنبة مجلس بثلاثة مقاعد', descEn: 'Low-line sofa with brass legs.', descAr: 'كنبة منخفضة بأرجل نُحاسيّة.', basePrice: 14500, dim: {w: 220, d: 92, h: 78}, materials: ['clay-velvet', 'midnight-velvet', 'linen', 'wool']},
  {category: 'seating', nameEn: 'L-shape Sectional', nameAr: 'كنبة بشكل L', descEn: 'Generous L sectional for family rooms.', descAr: 'كنبة عائليّة كبيرة.', basePrice: 22000, dim: {w: 320, d: 200, h: 80}, materials: ['clay-velvet', 'linen', 'wool', 'leather']},
  {category: 'seating', nameEn: 'Carved Armchair', nameAr: 'كرسي محفور', descEn: 'Hand-carved frame, velvet seat.', descAr: 'إطار محفور يدويّاً بمقعد مخمل.', basePrice: 6800, dim: {w: 78, d: 82, h: 86}, materials: ['walnut', 'carved-cedar', 'oak', 'ash']},
  {category: 'seating', nameEn: 'Lounge Chair', nameAr: 'كرسي استرخاء', descEn: 'Sculptural lounge chair.', descAr: 'كرسي استرخاء نحتي.', basePrice: 5400, dim: {w: 80, d: 90, h: 78}, materials: ['leather', 'wool', 'linen', 'rattan']},
  {category: 'seating', nameEn: 'Reading Chair with Ottoman', nameAr: 'كرسي قراءة مع أوطمان', descEn: 'Reading chair + matching ottoman.', descAr: 'كرسي قراءة مع أوطمان متطابق.', basePrice: 7200, dim: {w: 85, d: 95, h: 100}, materials: ['leather', 'linen', 'midnight-velvet']},
  {category: 'seating', nameEn: 'Floor Cushion (Pouf)', nameAr: 'وسادة أرضيّة', descEn: 'Stuffed floor cushion for majlis.', descAr: 'وسادة أرضيّة محشوّة.', basePrice: 1200, dim: {w: 70, d: 70, h: 30}, materials: ['clay-velvet', 'linen', 'wool', 'leather']},
  {category: 'seating', nameEn: 'Long Bench', nameAr: 'مقعد طويل', descEn: 'Solid wood entryway bench.', descAr: 'مقعد دخول من خشب صلب.', basePrice: 3800, dim: {w: 160, d: 40, h: 46}, materials: ['walnut', 'oak', 'carved-cedar']},
  {category: 'seating', nameEn: 'Bar Stool', nameAr: 'كرسي بار', descEn: 'Counter-height bar stool.', descAr: 'كرسي بار بارتفاع ضدّ.', basePrice: 1700, dim: {w: 42, d: 42, h: 75}, materials: ['rattan', 'leather', 'walnut', 'hammered-brass']},
  {category: 'seating', nameEn: 'Cinema Recliner', nameAr: 'كرسي سينما متّكئ', descEn: 'Powered recliner for cinema rooms.', descAr: 'كرسي متّكئ كهربائي لغرف السينما.', basePrice: 9500, dim: {w: 95, d: 110, h: 95}, materials: ['leather', 'midnight-velvet']},
  {category: 'seating', nameEn: 'Wing Chair', nameAr: 'كرسي بأجنحة', descEn: 'Classic wing chair, contemporary fabric.', descAr: 'كرسي كلاسيكي بأقمشة معاصرة.', basePrice: 5800, dim: {w: 80, d: 88, h: 110}, materials: ['linen', 'wool', 'leather']},

  // ── TABLES ─────────────────────────────────────────────────────────────
  {category: 'tables', nameEn: 'Travertine Coffee Table', nameAr: 'طاولة قهوة تُرافِرتين', descEn: 'Travertine top with metal legs.', descAr: 'سطح تُرافِرتين بأرجل معدنيّة.', basePrice: 9200, dim: {w: 110, d: 60, h: 38}, materials: ['travertine', 'marble', 'limestone']},
  {category: 'tables', nameEn: 'Dining Table for 8', nameAr: 'طاولة طعام لثمانية', descEn: 'Seats 8, solid wood base.', descAr: 'تتسع لثمانية بقاعدة خشب صلب.', basePrice: 18500, dim: {w: 240, d: 100, h: 76}, materials: ['walnut', 'oak', 'marble']},
  {category: 'tables', nameEn: 'Dining Table for 12', nameAr: 'طاولة طعام لاثني عشر', descEn: 'Long ceremonial dining table.', descAr: 'طاولة طعام احتفاليّة طويلة.', basePrice: 28500, dim: {w: 360, d: 110, h: 76}, materials: ['walnut', 'oak', 'marble']},
  {category: 'tables', nameEn: 'Round Side Table', nameAr: 'طاولة جانبيّة دائريّة', descEn: 'Round side table, sculptural base.', descAr: 'طاولة جانبيّة دائريّة بقاعدة نحتيّة.', basePrice: 1900, dim: {w: 50, d: 50, h: 55}, materials: ['hammered-brass', 'travertine', 'walnut', 'oak']},
  {category: 'tables', nameEn: 'Console Table', nameAr: 'طاولة كونسول', descEn: 'Slim entryway console.', descAr: 'كونسول دخول نحيف.', basePrice: 4400, dim: {w: 160, d: 35, h: 80}, materials: ['walnut', 'travertine', 'hammered-brass']},
  {category: 'tables', nameEn: 'Writing Desk', nameAr: 'مكتب كتابة', descEn: 'Compact writing desk with drawer.', descAr: 'مكتب كتابة مدمج بدُرج.', basePrice: 6200, dim: {w: 140, d: 65, h: 76}, materials: ['walnut', 'oak', 'ash']},
  {category: 'tables', nameEn: 'Executive Desk', nameAr: 'مكتب تنفيذي', descEn: 'Large executive desk for partner offices.', descAr: 'مكتب تنفيذي كبير لمكاتب الشركاء.', basePrice: 15800, dim: {w: 220, d: 95, h: 76}, materials: ['walnut', 'leather']},
  {category: 'tables', nameEn: 'Nesting Tables, set of 3', nameAr: 'طاولات متداخلة، طقم 3', descEn: 'Set of 3 nesting tables.', descAr: 'طقم ثلاث طاولات متداخلة.', basePrice: 3200, dim: {w: 60, d: 40, h: 50}, materials: ['hammered-brass', 'walnut', 'travertine']},

  // ── BEDS ───────────────────────────────────────────────────────────────
  {category: 'beds', nameEn: 'King Bed with Carved Headboard', nameAr: 'سرير كنغ بظهرية محفورة', descEn: 'King bed, hand-carved headboard.', descAr: 'سرير كنغ بظهرية محفورة يدويّاً.', basePrice: 16500, dim: {w: 200, d: 220, h: 130}, materials: ['walnut', 'carved-cedar', 'oak']},
  {category: 'beds', nameEn: 'Upholstered King Bed', nameAr: 'سرير كنغ مكسو', descEn: 'King bed with full upholstery.', descAr: 'سرير كنغ مكسو بالكامل.', basePrice: 14200, dim: {w: 200, d: 220, h: 110}, materials: ['linen', 'midnight-velvet', 'clay-velvet']},
  {category: 'beds', nameEn: 'Queen Bed', nameAr: 'سرير كوين', descEn: 'Queen-size bed, simple frame.', descAr: 'سرير مقاس كوين بإطار بسيط.', basePrice: 9800, dim: {w: 165, d: 210, h: 95}, materials: ['walnut', 'oak', 'linen']},
  {category: 'beds', nameEn: 'Single Kids Bed', nameAr: 'سرير أطفال مفرد', descEn: 'Single kids bed with rails.', descAr: 'سرير أطفال مفرد بحواجز.', basePrice: 4800, dim: {w: 100, d: 200, h: 90}, materials: ['oak', 'ash', 'walnut']},
  {category: 'beds', nameEn: 'Daybed', nameAr: 'سرير نهاري', descEn: 'Daybed for guest rooms or majlis.', descAr: 'سرير نهاري لغرف الضيوف أو المجلس.', basePrice: 7400, dim: {w: 200, d: 90, h: 80}, materials: ['linen', 'wool', 'rattan']},
  {category: 'beds', nameEn: 'Bunk Bed', nameAr: 'سرير دورين', descEn: 'Bunk bed for kids rooms.', descAr: 'سرير دورين لغرف الأطفال.', basePrice: 8600, dim: {w: 100, d: 200, h: 165}, materials: ['oak', 'ash']},
  {category: 'beds', nameEn: 'Floating Headboard, Wall-mount', nameAr: 'ظهرية معلّقة على الجدار', descEn: 'Wall-mounted upholstered headboard.', descAr: 'ظهرية مكسوة معلّقة على الجدار.', basePrice: 4400, dim: {w: 220, d: 12, h: 110}, materials: ['linen', 'midnight-velvet', 'clay-velvet']},

  // ── STORAGE ────────────────────────────────────────────────────────────
  {category: 'storage', nameEn: 'Walnut Credenza', nameAr: 'خزانة جانبيّة جوز', descEn: '3-door credenza, brass pulls.', descAr: 'خزانة جانبيّة بثلاثة أبواب ومقابض نُحاس.', basePrice: 11800, dim: {w: 200, d: 48, h: 76}, materials: ['walnut', 'oak', 'carved-cedar']},
  {category: 'storage', nameEn: 'Tall Wardrobe', nameAr: 'خزانة طويلة', descEn: 'Floor-to-ceiling wardrobe.', descAr: 'خزانة من الأرض للسقف.', basePrice: 18500, dim: {w: 240, d: 60, h: 240}, materials: ['walnut', 'oak', 'ash']},
  {category: 'storage', nameEn: 'Sideboard', nameAr: 'بوفيه', descEn: '2-door sideboard with shelving.', descAr: 'بوفيه بابَين ورفوف.', basePrice: 8200, dim: {w: 180, d: 45, h: 90}, materials: ['walnut', 'oak', 'ash']},
  {category: 'storage', nameEn: 'Bookshelf, 5-tier', nameAr: 'مكتبة بخمسة رفوف', descEn: '5-tier bookshelf.', descAr: 'مكتبة بخمسة رفوف.', basePrice: 5400, dim: {w: 100, d: 35, h: 200}, materials: ['oak', 'walnut', 'ash']},
  {category: 'storage', nameEn: 'Open Shelving Unit', nameAr: 'وحدة رفوف مفتوحة', descEn: 'Open shelving with brass frame.', descAr: 'رفوف مفتوحة بإطار نُحاسي.', basePrice: 6800, dim: {w: 200, d: 40, h: 220}, materials: ['hammered-brass', 'walnut']},
  {category: 'storage', nameEn: 'Dresser, 6-drawer', nameAr: 'كومود بستّة أدراج', descEn: '6-drawer dresser.', descAr: 'كومود بستّة أدراج.', basePrice: 8400, dim: {w: 150, d: 50, h: 90}, materials: ['walnut', 'oak', 'ash']},
  {category: 'storage', nameEn: 'Nightstand', nameAr: 'كومودينو', descEn: '2-drawer nightstand.', descAr: 'كومودينو بدُرجَين.', basePrice: 2800, dim: {w: 50, d: 40, h: 55}, materials: ['walnut', 'oak', 'carved-cedar']},
  {category: 'storage', nameEn: 'Display Cabinet', nameAr: 'فترينة عرض', descEn: 'Display cabinet with glass doors.', descAr: 'فترينة بأبواب زجاجيّة.', basePrice: 9800, dim: {w: 110, d: 40, h: 200}, materials: ['glass', 'walnut', 'ash']},

  // ── LIGHTING ───────────────────────────────────────────────────────────
  {category: 'lighting', nameEn: 'Hammered-brass Pendant', nameAr: 'إنارة معلّقة نُحاسيّة', descEn: 'Hand-hammered brass pendant.', descAr: 'إنارة معلّقة بنُحاس مَطْروق.', basePrice: 2200, dim: {w: 36, d: 36, h: 32}, materials: ['hammered-brass', 'brushed-bronze']},
  {category: 'lighting', nameEn: 'Cluster Pendant, 5 lights', nameAr: 'إنارة عنقوديّة بخمسة أضواء', descEn: 'Cluster of 5 pendants on a brass tray.', descAr: 'عنقود من خمسة إنارات على صينيّة نُحاس.', basePrice: 6400, dim: {w: 80, d: 80, h: 40}, materials: ['hammered-brass', 'brushed-bronze', 'glass']},
  {category: 'lighting', nameEn: 'Najdi Lantern', nameAr: 'فانوس نجدي', descEn: 'Carved wooden lantern with brass detail.', descAr: 'فانوس خشب محفور بتفاصيل نُحاسيّة.', basePrice: 1800, dim: {w: 28, d: 28, h: 60}, materials: ['carved-cedar', 'hammered-brass']},
  {category: 'lighting', nameEn: 'Floor Lamp', nameAr: 'إنارة أرضيّة', descEn: 'Tall floor lamp with linen shade.', descAr: 'إنارة أرضيّة طويلة بغطاء كتّان.', basePrice: 3200, dim: {w: 35, d: 35, h: 165}, materials: ['linen', 'hammered-brass', 'brushed-bronze']},
  {category: 'lighting', nameEn: 'Table Lamp', nameAr: 'إنارة طاولة', descEn: 'Ceramic-base table lamp.', descAr: 'إنارة طاولة بقاعدة سيراميك.', basePrice: 1400, dim: {w: 28, d: 28, h: 50}, materials: ['ceramic', 'linen']},
  {category: 'lighting', nameEn: 'Wall Sconce', nameAr: 'إنارة جداريّة', descEn: 'Brass wall sconce.', descAr: 'إنارة جداريّة نُحاسيّة.', basePrice: 950, dim: {w: 18, d: 14, h: 30}, materials: ['hammered-brass', 'brushed-bronze']},
  {category: 'lighting', nameEn: 'Chandelier', nameAr: 'ثريّا', descEn: 'Statement chandelier for entryways.', descAr: 'ثريّا مميّزة لصالات الدخول.', basePrice: 12800, dim: {w: 120, d: 120, h: 90}, materials: ['hammered-brass', 'glass']},
  {category: 'lighting', nameEn: 'Reading Light, Adjustable', nameAr: 'إنارة قراءة قابلة للضبط', descEn: 'Adjustable reading light, brass arm.', descAr: 'إنارة قراءة بذراع نُحاسيّة قابلة للضبط.', basePrice: 1100, dim: {w: 20, d: 50, h: 90}, materials: ['hammered-brass', 'brushed-bronze']},

  // ── RUGS ───────────────────────────────────────────────────────────────
  {category: 'rugs', nameEn: 'Najdi-pattern Wool Rug 240×170', nameAr: 'سجّاد صوف بنقش نجدي 240×170', descEn: 'Hand-knotted Najdi wool rug.', descAr: 'سجّاد صوف منسوج يدويّاً بنقش نجدي.', basePrice: 5400, dim: {w: 240, d: 170, h: 2}, materials: ['wool']},
  {category: 'rugs', nameEn: 'Najdi-pattern Wool Rug 300×200', nameAr: 'سجّاد صوف بنقش نجدي 300×200', descEn: 'Larger Najdi wool rug.', descAr: 'سجّاد صوف بنقش نجدي أكبر.', basePrice: 7800, dim: {w: 300, d: 200, h: 2}, materials: ['wool']},
  {category: 'rugs', nameEn: 'Hijazi Geometric Rug', nameAr: 'سجّاد حجازي هندسي', descEn: 'Hijazi geometric pattern rug.', descAr: 'سجّاد بنقش حجازي هندسي.', basePrice: 4800, dim: {w: 220, d: 160, h: 2}, materials: ['wool', 'cotton' as MatKey]},
  {category: 'rugs', nameEn: 'Modern Solid Rug', nameAr: 'سجّاد عصري سادة', descEn: 'Solid colour modern rug.', descAr: 'سجّاد عصري بلون سادة.', basePrice: 3200, dim: {w: 200, d: 150, h: 2}, materials: ['wool', 'linen']},
  {category: 'rugs', nameEn: 'Hallway Runner', nameAr: 'سجّاد ممرّات', descEn: 'Long hallway runner.', descAr: 'سجّاد طويل للممرّات.', basePrice: 2400, dim: {w: 80, d: 300, h: 2}, materials: ['wool', 'linen']},
  {category: 'rugs', nameEn: 'Round Rug', nameAr: 'سجّاد دائري', descEn: 'Round area rug, 200 cm diameter.', descAr: 'سجّاد دائري بقطر 200 سم.', basePrice: 3600, dim: {w: 200, d: 200, h: 2}, materials: ['wool']},
  {category: 'rugs', nameEn: 'Kids Play Rug', nameAr: 'سجّاد لعب أطفال', descEn: 'Soft play rug for kids rooms.', descAr: 'سجّاد لعب ناعم لغرف الأطفال.', basePrice: 1400, dim: {w: 160, d: 110, h: 2}, materials: ['cotton' as MatKey, 'wool']},
  {category: 'rugs', nameEn: 'Outdoor Patio Rug', nameAr: 'سجّاد فناء خارجي', descEn: 'Weather-resistant patio rug.', descAr: 'سجّاد فناء مقاوم للطقس.', basePrice: 2200, dim: {w: 230, d: 160, h: 2}, materials: ['cotton' as MatKey, 'linen']},

  // ── WALL DECOR ─────────────────────────────────────────────────────────
  {category: 'wall-decor', nameEn: 'Carved Cedar Mashrabiya Screen', nameAr: 'مشربية أرز محفورة', descEn: 'Hand-carved cedar wall screen.', descAr: 'مشربية أرز محفورة يدويّاً.', basePrice: 8400, dim: {w: 180, d: 4, h: 220}, materials: ['carved-cedar']},
  {category: 'wall-decor', nameEn: 'Najdi-pattern Wall Panel', nameAr: 'لوحة جداريّة بنقش نجدي', descEn: 'Wall panel with Najdi geometric carving.', descAr: 'لوحة جداريّة بنقش نجدي محفور.', basePrice: 5200, dim: {w: 120, d: 4, h: 80}, materials: ['carved-cedar', 'walnut']},
  {category: 'wall-decor', nameEn: 'Brass Wall Sculpture', nameAr: 'منحوتة جداريّة نُحاسيّة', descEn: 'Hammered-brass abstract sculpture.', descAr: 'منحوتة نُحاس مَطْروق مجرّدة.', basePrice: 4400, dim: {w: 90, d: 8, h: 110}, materials: ['hammered-brass', 'brushed-bronze']},
  {category: 'wall-decor', nameEn: 'Round Mirror, Brass Frame', nameAr: 'مرآة دائريّة بإطار نُحاس', descEn: 'Round mirror with hammered-brass frame.', descAr: 'مرآة دائريّة بإطار نُحاس مَطْروق.', basePrice: 2800, dim: {w: 90, d: 4, h: 90}, materials: ['hammered-brass', 'glass']},
  {category: 'wall-decor', nameEn: 'Full-length Mirror', nameAr: 'مرآة طويلة', descEn: 'Full-length mirror, leather strap.', descAr: 'مرآة طويلة بحزام جلدي.', basePrice: 3800, dim: {w: 70, d: 4, h: 200}, materials: ['leather', 'walnut']},
  {category: 'wall-decor', nameEn: 'Calligraphy Panel — Surat al-Ikhlas', nameAr: 'لوحة خط — سورة الإخلاص', descEn: 'Hand-carved Arabic calligraphy.', descAr: 'لوحة خط عربي محفورة يدويّاً.', basePrice: 6800, dim: {w: 100, d: 6, h: 60}, materials: ['walnut', 'hammered-brass']},
  {category: 'wall-decor', nameEn: 'Calligraphy Panel — Bismillah', nameAr: 'لوحة خط — بسم الله', descEn: 'Carved bismillah calligraphy.', descAr: 'لوحة بسم الله محفورة.', basePrice: 4400, dim: {w: 80, d: 6, h: 30}, materials: ['walnut', 'hammered-brass']},
  {category: 'wall-decor', nameEn: 'Saudi-art Print, Framed', nameAr: 'طبعة فنّية سعوديّة مؤطّرة', descEn: 'Limited-run print by a Saudi artist.', descAr: 'طبعة محدودة لفنّان سعودي.', basePrice: 1800, dim: {w: 60, d: 4, h: 80}, materials: ['oak', 'walnut']},
  {category: 'wall-decor', nameEn: 'Geometric Tile Composition', nameAr: 'تركيبة بلاط هندسيّة', descEn: 'Wall-mounted ceramic-tile composition.', descAr: 'تركيبة بلاط سيراميك معلّقة.', basePrice: 6800, dim: {w: 120, d: 4, h: 120}, materials: ['ceramic']},
  {category: 'wall-decor', nameEn: 'Mud-plaster Feature Wall Panel', nameAr: 'لوحة جدار طين مصبوب', descEn: 'Modular mud-plaster panel for feature walls.', descAr: 'لوحة طين مصبوب وحداتيّة لجدران مميّزة.', basePrice: 3200, dim: {w: 100, d: 8, h: 100}, materials: ['mud-plaster']},

  // ── KITCHEN ────────────────────────────────────────────────────────────
  {category: 'kitchen', nameEn: 'Kitchen Island', nameAr: 'جزيرة مطبخ', descEn: 'Stone-top kitchen island with seating.', descAr: 'جزيرة مطبخ بسطح حجري وجلوس.', basePrice: 32000, dim: {w: 280, d: 110, h: 92}, materials: ['marble', 'travertine', 'walnut']},
  {category: 'kitchen', nameEn: 'Bar Counter', nameAr: 'بار', descEn: 'Tall bar counter for entertaining.', descAr: 'بار طويل للضيافة.', basePrice: 18500, dim: {w: 200, d: 70, h: 110}, materials: ['walnut', 'marble']},
  {category: 'kitchen', nameEn: 'Pantry Cabinet', nameAr: 'خزانة مُؤونة', descEn: 'Tall pantry cabinet with shelving.', descAr: 'خزانة مُؤونة طويلة برفوف.', basePrice: 14200, dim: {w: 80, d: 60, h: 240}, materials: ['oak', 'walnut']},
  {category: 'kitchen', nameEn: 'Open-shelf Wine Rack', nameAr: 'حامل نبيذ بأرفف', descEn: 'Wall-mounted wine + glass rack.', descAr: 'حامل نبيذ معلّق بكأسات.', basePrice: 4800, dim: {w: 100, d: 35, h: 120}, materials: ['walnut', 'hammered-brass']},

  // ── BATH ───────────────────────────────────────────────────────────────
  {category: 'bath', nameEn: 'Free-standing Tub', nameAr: 'حوض استحمام حرّ', descEn: 'Free-standing soaking tub.', descAr: 'حوض استحمام حرّ.', basePrice: 18500, dim: {w: 170, d: 80, h: 65}, materials: ['ceramic', 'marble']},
  {category: 'bath', nameEn: 'Vanity, Double Sink', nameAr: 'فانيتي بحوضَين', descEn: 'Stone-top vanity with double sink.', descAr: 'فانيتي بسطح حجري وحوضَين.', basePrice: 16200, dim: {w: 200, d: 55, h: 90}, materials: ['marble', 'travertine', 'walnut']},
  {category: 'bath', nameEn: 'Vanity, Single Sink', nameAr: 'فانيتي بحوض مفرد', descEn: 'Compact stone-top vanity.', descAr: 'فانيتي مدمج بسطح حجري.', basePrice: 8400, dim: {w: 120, d: 55, h: 90}, materials: ['marble', 'travertine']},
  {category: 'bath', nameEn: 'Shower Bench, Carved Cedar', nameAr: 'مقعد دش أرز محفور', descEn: 'Water-resistant carved cedar shower bench.', descAr: 'مقعد دش أرز محفور مقاوم للماء.', basePrice: 2400, dim: {w: 60, d: 35, h: 45}, materials: ['carved-cedar']},

  // ── TEXTILES ───────────────────────────────────────────────────────────
  {category: 'textiles', nameEn: 'Linen Drapes, full-height', nameAr: 'ستائر كتّان طويلة', descEn: 'Full-height linen drapes (per pair).', descAr: 'ستائر كتّان طويلة (للزوج).', basePrice: 1800, dim: {w: 280, d: 2, h: 280}, materials: ['linen']},
  {category: 'textiles', nameEn: 'Velvet Drapes', nameAr: 'ستائر مخمل', descEn: 'Heavy velvet drapes (per pair).', descAr: 'ستائر مخمل ثقيلة (للزوج).', basePrice: 2400, dim: {w: 280, d: 2, h: 280}, materials: ['clay-velvet', 'midnight-velvet']},
  {category: 'textiles', nameEn: 'Throw Cushion 50×50', nameAr: 'وسادة 50×50', descEn: 'Decorative throw cushion.', descAr: 'وسادة زينة.', basePrice: 380, dim: {w: 50, d: 15, h: 50}, materials: ['linen', 'wool', 'clay-velvet', 'midnight-velvet']},
  {category: 'textiles', nameEn: 'Bolster Cushion', nameAr: 'وسادة أسطوانيّة', descEn: 'Cylindrical bolster cushion.', descAr: 'وسادة أسطوانيّة.', basePrice: 480, dim: {w: 60, d: 22, h: 22}, materials: ['linen', 'wool', 'clay-velvet']},
  {category: 'textiles', nameEn: 'Wool Throw Blanket', nameAr: 'بطّانية صوف', descEn: 'Hand-loomed wool throw.', descAr: 'بطّانية صوف منسوجة يدويّاً.', basePrice: 950, dim: {w: 130, d: 1, h: 180}, materials: ['wool']},
  {category: 'textiles', nameEn: 'Bedding Set, King', nameAr: 'طقم سرير كنغ', descEn: 'Linen bedding set, King size.', descAr: 'طقم سرير كتّان مقاس كنغ.', basePrice: 1800, dim: {w: 240, d: 2, h: 280}, materials: ['linen']},

  // ── PLANTS ─────────────────────────────────────────────────────────────
  {category: 'plants', nameEn: 'Date Palm, Indoor', nameAr: 'نخلة تمر داخليّة', descEn: 'Indoor date palm, 180 cm.', descAr: 'نخلة تمر داخليّة بارتفاع 180 سم.', basePrice: 1400, dim: {w: 80, d: 80, h: 180}, materials: ['ceramic']},
  {category: 'plants', nameEn: 'Olive Tree, Indoor', nameAr: 'شجرة زيتون داخليّة', descEn: 'Indoor olive tree, 150 cm.', descAr: 'شجرة زيتون داخليّة بارتفاع 150 سم.', basePrice: 1100, dim: {w: 70, d: 70, h: 150}, materials: ['ceramic']},
  {category: 'plants', nameEn: 'Fiddle-leaf Fig', nameAr: 'تين أوراق الكمان', descEn: 'Fiddle-leaf fig, 130 cm.', descAr: 'تين أوراق الكمان بارتفاع 130 سم.', basePrice: 750, dim: {w: 60, d: 60, h: 130}, materials: ['ceramic']},
  {category: 'plants', nameEn: 'Ceramic Planter, Large', nameAr: 'حوض سيراميك كبير', descEn: 'Hand-thrown ceramic planter.', descAr: 'حوض سيراميك مصنوع يدويّاً.', basePrice: 380, dim: {w: 45, d: 45, h: 50}, materials: ['ceramic']},
  {category: 'plants', nameEn: 'Brass Planter Stand', nameAr: 'حامل أحواض نُحاس', descEn: 'Tripod brass planter stand.', descAr: 'حامل ثلاثي القوائم نُحاسي.', basePrice: 480, dim: {w: 35, d: 35, h: 60}, materials: ['hammered-brass']},

  // ── ACCENTS ────────────────────────────────────────────────────────────
  {category: 'accents', nameEn: 'Brass Tray, Round', nameAr: 'صينيّة نُحاس دائريّة', descEn: 'Hand-engraved round brass tray.', descAr: 'صينيّة نُحاس دائريّة منقوشة يدويّاً.', basePrice: 580, dim: {w: 50, d: 50, h: 4}, materials: ['hammered-brass', 'brushed-bronze']},
  {category: 'accents', nameEn: 'Dallah Coffee Pot', nameAr: 'دلّة قهوة', descEn: 'Traditional Saudi dallah, polished brass.', descAr: 'دلّة قهوة سعوديّة تقليديّة بنُحاس مصقول.', basePrice: 380, dim: {w: 18, d: 18, h: 32}, materials: ['hammered-brass']},
  {category: 'accents', nameEn: 'Ceramic Vase, Tall', nameAr: 'مزهريّة سيراميك طويلة', descEn: 'Tall hand-thrown ceramic vase.', descAr: 'مزهريّة سيراميك طويلة مصنوعة يدويّاً.', basePrice: 280, dim: {w: 22, d: 22, h: 50}, materials: ['ceramic']},
  {category: 'accents', nameEn: 'Wooden Sculpture', nameAr: 'منحوتة خشبيّة', descEn: 'Sculpted wooden object.', descAr: 'منحوتة خشبيّة.', basePrice: 1200, dim: {w: 25, d: 25, h: 40}, materials: ['walnut', 'carved-cedar']},
  {category: 'accents', nameEn: 'Candle Holder, Hammered Brass', nameAr: 'حامل شمع نُحاس', descEn: 'Hammered-brass candle holder.', descAr: 'حامل شمع نُحاس مَطْروق.', basePrice: 220, dim: {w: 12, d: 12, h: 30}, materials: ['hammered-brass']},
  {category: 'accents', nameEn: 'Coffee Table Books, Set', nameAr: 'كتب طاولة قهوة، طقم', descEn: 'Curated set of 5 design books.', descAr: 'طقم خمسة كتب تصميم منتقاة.', basePrice: 480, dim: {w: 28, d: 28, h: 12}, materials: ['linen']},
  {category: 'accents', nameEn: 'Bowl, Travertine', nameAr: 'وعاء تُرافِرتين', descEn: 'Decorative travertine bowl.', descAr: 'وعاء تُرافِرتين زخرفي.', basePrice: 380, dim: {w: 30, d: 30, h: 10}, materials: ['travertine', 'marble']},
];

// Brand-aware paletteHex for each variant: blends material hex with style hex.
const STYLE_PALETTE: Record<FurnitureStyle, string[]> = {
  'Modern Najdi':   ['#B8552E', '#B89968', '#FAFAF7'],
  'Heritage Najdi': ['#7A4A2A', '#B8552E', '#B89968'],
  'Hijazi Coastal': ['#DDD3C3', '#B89968', '#1A1F2E'],
  'Contemporary':   ['#1A1F2E', '#B89968', '#FAFAF7'],
  'Industrial':     ['#1F1A14', '#9B7A3F', '#DDD3C3'],
  'Minimalist':     ['#FAFAF7', '#DDD3C3', '#B89968'],
  'Cocoon':         ['#1A1F2E', '#B8552E', '#B89968'],
  'Open Living':    ['#FAFAF7', '#DDD3C3', '#B8552E'],
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function pseudo(seed: string): number {
  // Cheap deterministic hash → 0..1
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function expand(): FurnitureItem[] {
  const out: FurnitureItem[] = [];
  for (const tpl of TEMPLATES) {
    const styles = tpl.styles ?? STYLES;
    for (const matKey of tpl.materials) {
      const mat = MATERIALS[matKey];
      if (!mat) continue;
      for (const style of styles) {
        const id = slugify(`${tpl.nameEn}-${matKey}-${style}`);
        const seed = pseudo(id);
        // Price varies ±20% based on material premium
        const matMult = ['marble', 'walnut', 'carved-cedar', 'leather'].includes(matKey) ? 1.15
                      : ['hammered-brass', 'brushed-bronze', 'travertine'].includes(matKey) ? 1.08
                      : 0.95;
        const price = Math.round(tpl.basePrice * matMult * (0.9 + seed * 0.4) / 100) * 100;
        const styleHex = STYLE_PALETTE[style];
        const palette = [styleHex[0], mat.hex[0], mat.hex[1]];
        const nameAr = `${tpl.nameAr} · ${mat.ar}`;
        const nameEn = `${tpl.nameEn} · ${mat.en}`;
        const descAr = `${tpl.descAr} (${mat.ar}، ${STYLES_AR[style]})`;
        const descEn = `${tpl.descEn} (${mat.en}, ${style})`;
        const tags = [matKey, style.toLowerCase().replace(/\s+/g, '-'), tpl.category];
        const poster = POSTER_POOL[Math.floor(seed * POSTER_POOL.length)];
        const glb = CDN_MODELS[Math.floor(seed * CDN_MODELS.length)];

        out.push({
          id, category: tpl.category, style, nameAr, nameEn, descAr, descEn,
          priceSAR: price,
          dimensionsCm: tpl.dim,
          glb, poster, tags, paletteHex: palette,
        });
      }
    }
  }
  return out;
}

export const FURNITURE_CATALOG: FurnitureItem[] = expand();
export const ALL_STYLES = STYLES;
export const ALL_STYLES_AR = STYLES_AR;
export const ALL_MATERIALS = MATERIALS;

// Price brackets for the filter UI
export const PRICE_BRACKETS = [
  {key: 'under-1k',  min: 0,     max: 1000,  labelEn: 'Under SAR 1,000',  labelAr: 'أقل من 1,000 ريال'},
  {key: '1k-5k',     min: 1000,  max: 5000,  labelEn: 'SAR 1K – 5K',       labelAr: '1K – 5K ريال'},
  {key: '5k-15k',    min: 5000,  max: 15000, labelEn: 'SAR 5K – 15K',      labelAr: '5K – 15K ريال'},
  {key: '15k-50k',   min: 15000, max: 50000, labelEn: 'SAR 15K – 50K',     labelAr: '15K – 50K ريال'},
  {key: '50k-plus',  min: 50000, max: Infinity, labelEn: 'SAR 50K+',       labelAr: '50K+ ريال'},
] as const;

export type PriceBracket = typeof PRICE_BRACKETS[number]['key'];

export function fmtPriceSAR(n: number) {
  return `SAR ${n.toLocaleString('en-US')}`;
}
