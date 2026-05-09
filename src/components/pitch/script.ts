// Diwan pitch reel — 5 narrative scenes + CTA, 8 visual scenes (~2:05).
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
  // VO Scene 1 — Intro + problem (0:00 → 0:30)
  // Visual A — Title (0–8s)
  {
    start: 0,
    end: 8,
    ar: 'ديوان... حيث تأخذ المساحات شكلها.',
    en: 'Diwan... where spaces take shape.',
    segments: [
      {at: 0,   text: 'ديوان'},
      {at: 2.5, text: 'حيث تأخذ المساحات شكلها'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },
  // Visual B — Problem photos (8–30s)
  {
    start: 8,
    end: 30,
    ar: 'مع رؤية 2030، تملّكت كثير من العائلات السعودية منازلها، لكن رحلة التشطيب لا تزال مرهقة. أشهر من الانتظار، زيارات لا تنتهي للمعارض، رسائل متواصلة مع مقاولين بوعود متضاربة، ولا شخص واحد يتحمّل مسؤولية النتيجة.',
    en: 'With Vision 2030, many Saudi families have come to own their homes, but the fit-out journey remains exhausting. Months of waiting, endless showroom visits, constant messages with contractors making conflicting promises, and no one accountable.',
    segments: [
      {at: 8,    text: 'مع رؤية 2030'},
      {at: 10,   text: 'تملّكت كثير من العائلات السعودية منازلها'},
      {at: 13.5, text: 'لكن رحلة التشطيب لا تزال مرهقة'},
      {at: 17,   text: 'أشهر من الانتظار'},
      {at: 19,   text: 'زيارات لا تنتهي للمعارض'},
      {at: 21,   text: 'رسائل متواصلة مع مقاولين بوعود متضاربة'},
      {at: 24.5, text: 'ولا شخص واحد يتحمّل المسؤوليّة'},
      {at: 27.5, text: 'فضاؤك يجب أن يتماشى مع ذوقك — بلا متاعب'},
    ],
    visual: {kind: 'photoPair', left: '/pitch/problem-shell.jpg', right: '/pitch/problem-chaos.jpg'},
  },

  // VO Scene 2 — The Diwan promise (0:30 → 0:55)
  // Visual C — Promise closeups
  {
    start: 30,
    end: 55,
    ar: 'من هنا، وُجدت منصّة ديوان. منصّة سعوديّة لتجهيز المنازل والمشاريع التجاريّة وأماكن العمل المشتركة، تحت سقف واحد، وفي مدّة قياسيّة. التصميم والتنفيذ والصيانة ليست ثمانية قرارات — بل قرار واحد. علاقتك معنا، وعلاقة الموردين معنا، ونحن من يتحمّل الفارق.',
    en: 'From here, Diwan was created. A Saudi platform fitting out homes, businesses, and co-working spaces under one roof, in record time. Design, execution, and maintenance are not eight decisions — they are one. Your relationship is with us, the supplier relationships are with us, and we own the gap.',
    segments: [
      {at: 30,   text: 'من هنا، وُجدت منصّة ديوان'},
      {at: 33.5, text: 'منصّة سعوديّة لتجهيز المنازل والمشاريع'},
      {at: 37,   text: 'وأماكن العمل المشتركة'},
      {at: 39.5, text: 'تحت سقف واحد، وفي مدّة قياسيّة'},
      {at: 43,   text: 'التصميم والتنفيذ والصيانة'},
      {at: 46.5, text: 'قرار واحد — لا ثمانية'},
      {at: 50,   text: 'علاقتك معنا، وعلاقة الموردين معنا'},
      {at: 52.5, text: 'ونحن من يتحمّل الفارق'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/kafd-private-office/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/01.jpg',
      '/projects/najdi-villa-nakheel/closeups/03.jpg',
    ]},
  },

  // VO Scene 3 — Tech & ease of starting (0:55 → 1:25)
  // Visual D — AI design + measurement (illustrated)
  {
    start: 55,
    end: 72,
    ar: 'كيف نبدأ؟ تبدأ الرحلة بإلهامك. صورة من الإنترنت، أو مساحة تعكس ذوقك. في ثوانٍ، يحوّلها ذكاء ديوان إلى تصاميم أوّليّة مع تكلفة تقديريّة. ثمّ يأتي فريقنا لرفع المقاسات بدقّة الملّيمتر، مجاناً.',
    en: 'How do we start? Your inspiration. A photo from the internet, or a space that reflects your taste. In seconds, Diwan AI turns it into early designs with cost estimates. Then our team measures to the millimeter, for free.',
    segments: [
      {at: 55,   text: 'كيف نبدأ؟ بإلهامك'},
      {at: 57,   text: 'صورة من الإنترنت'},
      {at: 59,   text: 'أو مساحة تعكس ذوقك'},
      {at: 61,   text: 'يحوّلها ذكاء ديوان إلى تصاميم'},
      {at: 64,   text: 'مع تكلفة تقديريّة'},
      {at: 66.5, text: 'فريقنا يرفع المقاسات'},
      {at: 69,   text: 'بدقّة الملّيمتر، مجاناً'},
    ],
    visual: {kind: 'illustrated', scene: 'service'},
  },
  // Visual E — Stamped 2D engineering layout (72–85s)
  {
    start: 72,
    end: 85,
    ar: 'عبر خطوات بسيطة، يخرج مشروعك بمخطّط هندسي معتمد — مجلس، صالة، مطبخ، وغرف نوم. بتوقيع واحد منك، يبدأ الإنتاج في اليوم نفسه.',
    en: 'In a few simple steps, your project ships with a stamped engineering layout — majlis, family living, kitchen, bedrooms. One signature from you, and production starts the same day.',
    segments: [
      {at: 72,   text: 'مشروعك يخرج بمخطّط هندسي معتمد'},
      {at: 75,   text: 'مجلس · صالة · مطبخ · غرف نوم'},
      {at: 78.5, text: 'بتوقيع واحد منك'},
      {at: 81,   text: 'يبدأ الإنتاج في اليوم نفسه'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },

  // VO Scene 4 — Quality + execution (1:25 → 1:45)
  // Visual F — Materials + supplier network + install + maintenance (illustrated)
  {
    start: 85,
    end: 105,
    ar: 'نختار كلّ مادّة بشغف — أرز محفور، نُحاس مَطْروق، حجر كلسي، وطين مصبوب يدوياً. عبر شبكة موردين واسعة، نُدير كلّ شيء: التركيب، والكهرباء، والسباكة، والتسليم النهائي. لا حوارات في السعر، ولا ضمان مفقود — وصيانة موحَّدة لاثني عشر شهراً برقم تواصل واحد.',
    en: 'We curate every material — carved cedar, hammered brass, limestone, hand-poured mud plaster. Through a wide supplier network, we manage everything: installation, electrical, plumbing, final delivery. No pricing arguments, no missing warranty — and twelve months of single-source maintenance with one number to call.',
    segments: [
      {at:  85,   text: 'نختار كلّ مادّة بشغف'},
      {at:  87.5, text: 'أرز محفور · نُحاس مَطْروق'},
      {at:  90,   text: 'حجر كلسي · طين مصبوب يدوياً'},
      {at:  92.5, text: 'شبكة موردين واسعة'},
      {at:  95,   text: 'تركيب · كهرباء · سباكة · تسليم'},
      {at:  98.5, text: 'لا حوارات سعر، ولا ضمان مفقود'},
      {at: 101.5, text: 'صيانة موحَّدة لاثني عشر شهراً'},
    ],
    visual: {kind: 'illustrated', scene: 'install'},
  },

  // VO Scene 5 — Achievements + close (1:45 → 2:00)
  // Visual G — Project montage
  {
    start: 105,
    end: 120,
    ar: 'أكثر من ثلاثين مشروعاً سلّمناها حول المملكة. فيلا نجديّة في النخيل، مقرّ استثماري في المركز المالي، ومقهى تراثي في البُجَيْري. كلّها تحت ديوان.',
    en: 'More than thirty projects delivered across the Kingdom. A Najdi villa in Al-Nakheel, an investment headquarters in KAFD, a heritage cafe in Al-Bujairi. All under Diwan.',
    segments: [
      {at: 105,   text: 'أكثر من ثلاثين مشروعاً مُسلَّماً'},
      {at: 107.5, text: 'فيلا نجديّة · النخيل'},
      {at: 110,   text: 'مقرّ استثماري · المركز المالي'},
      {at: 113,   text: 'مقهى تراثي · البُجَيْري'},
      {at: 116,   text: 'كلّها تحت ديوان'},
    ],
    visual: {kind: 'montage', sources: [
      {src: '/projects/najdi-villa-nakheel/hero.jpg',     tagAr: 'فيلا نجديّة · النخيل',       tagEn: 'Najdi Villa · Al-Nakheel'},
      {src: '/projects/kafd-private-office/hero.jpg',     tagAr: 'مقرّ استثماري · المركز المالي', tagEn: 'Investment HQ · KAFD'},
      {src: '/projects/olaya-roastery-riyadh/hero.jpg',   tagAr: 'محمصة قهوة · العُلَيّا',       tagEn: 'Roastery · Olaya'},
      {src: '/projects/bujairi-heritage-cafe/hero.jpg',   tagAr: 'مقهى تراثي · البُجَيْري',     tagEn: 'Heritage Cafe · Al-Bujairi'},
      {src: '/projects/hittin-townhouse-riyadh/hero.jpg', tagAr: 'تاون هاوس · حِطّين',         tagEn: 'Townhouse · Hittin'},
    ]},
  },

  // CTA + differentiators (2:00 → 2:25)
  // Visual H — Numbers + CTA
  {
    start: 120,
    end: 145,
    ar: 'سرعة في التسليم، أوفر بأربعة عشر بالمائة من السوق، وهويّة سعوديّة بأيدي متخصّصين. ديوان — لا قوالب جاهزة. ابدأ فضاءك على diwan.sa',
    en: 'Speed in delivery, 14% cheaper than the market, and Saudi heritage in expert hands. Diwan — no ready-made templates. Start your space at diwan.sa',
    segments: [
      {at: 120,   text: 'سرعة في التسليم'},
      {at: 124,   text: 'أوفر بأربعة عشر بالمائة من السوق'},
      {at: 128.5, text: 'هويّة سعوديّة بأيدي متخصّصين'},
      {at: 133,   text: 'ديوان — لا قوالب جاهزة'},
      {at: 138,   text: 'ابدأ فضاءك على diwan.sa'},
    ],
    visual: {kind: 'numbers', rows: [
      {numAr: '30',  numEn: '30',  labelAr: 'يوماً متوسّط التسليم',  labelEn: 'days · average delivery'},
      {numAr: '14%', numEn: '14%', labelAr: 'أوفر من السوق',         labelEn: 'cheaper than market'},
      {numAr: '12',  numEn: '12',  labelAr: 'شهراً صيانة موحَّدة',   labelEn: 'months · single-source maintenance'},
      {numAr: '1',   numEn: '1',   labelAr: 'رقم لكل المشروع',       labelEn: 'number for the whole project'},
    ]},
  },
];

export const TOTAL_DURATION = PITCH_SCRIPT[PITCH_SCRIPT.length - 1].end;

// Flat segment list for fast time-based lookup in PitchReel.
export const ALL_SEGMENTS = PITCH_SCRIPT.flatMap((s) => s.segments);
