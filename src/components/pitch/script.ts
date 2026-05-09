// Diwan pitch reel — 8 scenes, faster cadence (~120s).
// Subtitles are time-synced to the visual scene boundaries; each scene's
// first subtitle appears AT or AFTER its `start` so captions never lead
// the visual.

export type PitchVisual =
  | {kind: 'title'; lineAr: string; lineEn: string}
  | {kind: 'photo'; src: string; zoom: 'in' | 'out'; pan?: 'l' | 'r'}
  | {kind: 'photoPair'; left: string; right: string}
  | {kind: 'plan'; planId: string; label: string}
  | {kind: 'closeups'; sources: string[]}
  | {kind: 'montage'; sources: Array<{src: string; tagAr: string; tagEn: string}>}
  | {kind: 'numbers'; rows: Array<{numAr: string; numEn: string; labelAr: string; labelEn: string}>}
  | {kind: 'cta'; lineAr: string; lineEn: string; url: string}
  | {kind: 'illustrated'; scene: 'service' | 'install'};

export type SubtitleSegment = {
  at: number;
  text: string;
};

export type PitchScene = {
  start: number;
  end: number;
  ar: string;
  en: string;
  segments: SubtitleSegment[];
  visual: PitchVisual;
};

export const PITCH_SCRIPT: PitchScene[] = [
  // 1 — Title (8s)
  {
    start: 0,
    end: 8,
    ar: 'ديوان — حيث تأخذ الفضاءات شكلها. بيوت ومحلّات سعوديّة، تُسلَّم خلال ثلاثين يوماً.',
    en: 'Diwan — where spaces take shape. Saudi homes and businesses, delivered in thirty days.',
    segments: [
      {at: 0,   text: 'ديوان'},
      {at: 2,   text: 'حيث تأخذ الفضاءات شكلها'},
      {at: 5,   text: 'بيوت ومحلّات تُسلَّم في ثلاثين يوماً'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },

  // 2 — The problem (12s) — raw shell + chaos, NOT delivered Diwan projects
  {
    start: 8,
    end: 20,
    ar: 'تتسلّم العائلة مفتاح بيتها — صندوقاً فارغاً. ستّة أشهر، عشرات الموردين، ومقاولون بوعود متضاربة. ولا أحد مسؤول عن النتيجة.',
    en: 'A Saudi family receives the keys — an empty box. Six months, dozens of suppliers, contractors with conflicting promises. No one accountable.',
    segments: [
      {at: 8,    text: 'تتسلّم مفتاح بيتك — صندوقاً فارغاً'},
      {at: 11,   text: 'ستّة أشهر من المتابعة'},
      {at: 13.5, text: 'عشرات الموردين'},
      {at: 15.5, text: 'مقاولون بوعود متضاربة'},
      {at: 18,   text: 'ولا أحد مسؤول'},
    ],
    visual: {kind: 'photoPair', left: '/pitch/problem-shell.jpg', right: '/pitch/problem-chaos.jpg'},
  },

  // 3 — The Diwan promise (8s) — short, doesn't repeat scene 8
  {
    start: 20,
    end: 28,
    ar: 'ديوان يجمع التصميم والتنفيذ والصيانة في قرار واحد.',
    en: 'Diwan brings design, execution, and aftercare under one decision.',
    segments: [
      {at: 20, text: 'ديوان يجمعها كلّها'},
      {at: 23, text: 'تصميم · تنفيذ · صيانة'},
      {at: 26, text: 'في قرار واحد'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/kafd-private-office/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/01.jpg',
      '/projects/najdi-villa-nakheel/closeups/03.jpg',
    ]},
  },

  // 4 — AI design + free measurement (20s)
  {
    start: 28,
    end: 48,
    ar: 'صمّم بيتك بالذكاء الاصطناعي. ائتنا بإلهامات Pinterest أو لوحة هويّة، فيحوّلها ذكاؤنا إلى تصاميم خلال ثوانٍ. ثمّ يأتي فريقنا للقياس مجاناً، أو نقبل ملفّك الهندسي.',
    en: 'Design your home with AI. Bring Pinterest or a brand brief — Diwan AI turns it into early designs in seconds. Then our team measures your space for free, or we accept your engineering file.',
    segments: [
      {at: 28,   text: 'صمّم بيتك بالذكاء الاصطناعي'},
      {at: 31,   text: 'ائتنا بإلهامات Pinterest'},
      {at: 33.5, text: 'أو لوحة هويّة'},
      {at: 35.5, text: 'يحوّلها ذكاؤنا إلى تصاميم'},
      {at: 38.5, text: 'خلال ثوانٍ'},
      {at: 41,   text: 'فريقنا يأتي ويقيس فضاءك'},
      {at: 44,   text: 'مجاناً — وبدقّة'},
      {at: 46,   text: 'أو نقبل ملفّك الهندسي'},
    ],
    visual: {kind: 'illustrated', scene: 'service'},
  },

  // 5 — 2D engineering layout (14s)
  {
    start: 48,
    end: 62,
    ar: 'كلّ مشروع يخرج بمخطّط هندسي ثنائي الأبعاد مختوم — مرسوم بمنطقنا السعودي. توقّع مرّة واحدة، يبدأ الإنتاج في اليوم نفسه.',
    en: 'Every project ships with a stamped 2D engineering layout, drawn with Saudi spatial logic. Sign once and production starts the same day.',
    segments: [
      {at: 48,   text: 'مخطّط هندسي ثنائي الأبعاد مختوم'},
      {at: 51,   text: 'مجلس · صالة عائلة · مُصلَّى'},
      {at: 54,   text: 'مطبخ · غرف نوم · بقبلة دقيقة'},
      {at: 57,   text: 'بمنطقنا السعودي'},
      {at: 59.5, text: 'توقّع مرّة، يبدأ الإنتاج فوراً'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },

  // 6 — Materials, supplier network, installation, MAINTENANCE (22s)
  {
    start: 62,
    end: 84,
    ar: 'نختار كلّ مادّة بدقّة — أرز محفور، نُحاس مَطْروق، حجر كلسي، طين مصبوب يدوياً، صوف وكتّان. شبكة موردين واسعة تُناسب كلّ فكرة، تُورِّد تحت أمر شراء واحد بإسم ديوان. نُدير التركيب والكهرباء والسباكة، ثمّ خدمة الصيانة لاثني عشر شهراً.',
    en: 'We curate every material — carved cedar, hammered brass, limestone, hand-poured mud plaster, wool and linen. A wide supplier network suited to any idea, ordered under a single Diwan PO. We manage installation, electrical, plumbing, and twelve months of maintenance service.',
    segments: [
      {at: 62,   text: 'نختار كلّ مادّة بدقّة'},
      {at: 64.5, text: 'أرز محفور · نُحاس مَطْروق'},
      {at: 67,   text: 'حجر كلسي · طين مصبوب'},
      {at: 69.5, text: 'صوف وكتّان'},
      {at: 71.5, text: 'شبكة موردين واسعة'},
      {at: 74,   text: 'تُناسب كلّ فكرة'},
      {at: 76.5, text: 'أمر شراء واحد بإسم ديوان'},
      {at: 79,   text: 'تركيب · كهرباء · سباكة'},
      {at: 81.5, text: 'وصيانة لاثني عشر شهراً'},
    ],
    visual: {kind: 'illustrated', scene: 'install'},
  },

  // 7 — Examples reel (16s)
  {
    start: 84,
    end: 100,
    ar: 'اثنا عشر مشروعاً مُسلَّماً عبر المملكة — بيوت، ومكاتب، ومحلّات. كلّها تحت ديوان.',
    en: 'Twelve delivered projects across the Kingdom — homes, offices, and businesses. All under Diwan.',
    segments: [
      {at: 84,   text: 'اثنا عشر مشروعاً مُسلَّماً'},
      {at: 86.5, text: 'فيلا نجديّة · النخيل'},
      {at: 89,   text: 'طابق استثماري · KAFD'},
      {at: 91.5, text: 'محمصة قهوة · العُلَيّا'},
      {at: 94,   text: 'مقهى تراثي · البُجَيْري'},
      {at: 96.5, text: 'تاون هاوس · حِطّين'},
      {at: 98.5, text: 'كلّها تحت ديوان'},
    ],
    visual: {kind: 'montage', sources: [
      {src: '/projects/najdi-villa-nakheel/hero.jpg',     tagAr: 'فيلا نجديّة · النخيل',    tagEn: 'Najdi Villa · Al-Nakheel'},
      {src: '/projects/kafd-private-office/hero.jpg',     tagAr: 'طابق استثماري · KAFD',   tagEn: 'Investment Floor · KAFD'},
      {src: '/projects/olaya-roastery-riyadh/hero.jpg',   tagAr: 'محمصة قهوة · العُلَيّا',   tagEn: 'Roastery · Olaya'},
      {src: '/projects/bujairi-heritage-cafe/hero.jpg',   tagAr: 'مقهى تراثي · البُجَيْري', tagEn: 'Heritage Cafe · Al-Bujairi'},
      {src: '/projects/hittin-townhouse-riyadh/hero.jpg', tagAr: 'تاون هاوس · حِطّين',     tagEn: 'Townhouse · Hittin'},
    ]},
  },

  // 8 — Differentiators + CTA (20s)
  {
    start: 100,
    end: 120,
    ar: 'ما يميّز ديوان: ثلاثون يوماً متوسّط التسليم. أرخص بأربعة عشر بالمائة. صيانة موحَّدة لاثني عشر شهراً. هويّة سعوديّة بيد متخصّصين. ابدأ فضاءك على diwan.sa',
    en: 'What sets Diwan apart: 30-day average delivery, 14% below retail, twelve-month single-source maintenance, Saudi heritage by specialists. Start your space at diwan.sa',
    segments: [
      {at: 100,   text: 'ما يميّز ديوان'},
      {at: 102.5, text: 'ثلاثون يوماً متوسّط التسليم'},
      {at: 106,   text: 'أرخص بأربعة عشر بالمائة'},
      {at: 109.5, text: 'صيانة موحَّدة لاثني عشر شهراً'},
      {at: 113,   text: 'هويّة سعوديّة بيد متخصّصين'},
      {at: 116,   text: 'ابدأ فضاءك'},
      {at: 118,   text: 'diwan.sa'},
    ],
    visual: {kind: 'numbers', rows: [
      {numAr: '30',  numEn: '30',  labelAr: 'يوماً متوسّط التسليم', labelEn: 'days · average delivery'},
      {numAr: '14%', numEn: '14%', labelAr: 'أرخص من التجزئة',     labelEn: 'below retail aggregate'},
      {numAr: '12',  numEn: '12',  labelAr: 'شهراً صيانة موحَّدة',  labelEn: 'months · single-source maintenance'},
      {numAr: '1',   numEn: '1',   labelAr: 'رقم لكل المشروع',     labelEn: 'number for the whole project'},
    ]},
  },
];

export const TOTAL_DURATION = PITCH_SCRIPT[PITCH_SCRIPT.length - 1].end;

// Flat segment list for fast time-based lookup in PitchReel.
export const ALL_SEGMENTS = PITCH_SCRIPT.flatMap((s) => s.segments);
