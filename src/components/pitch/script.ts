// Diwan pitch reel — timed to the actual recorded VO (158.3s).
// Scene boundaries discovered by silence-detection on voiceover-ar.m4a:
//   Title narration : 0:00 – 0:06
//   Problem         : 0:06 – 0:28
//   Promise         : 0:28 – 0:56
//   AI + measurement: 0:56 – 1:22
//   2D layout       : 1:22 – 1:38
//   Materials/install: 1:38 – 2:06
//   Achievements    : 2:06 – 2:25
//   CTA             : 2:25 – 2:38

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
  // Visual A — Title (0–6s)
  {
    start: 0,
    end: 6,
    ar: 'ديوان... حيث تأخذ المساحات شكلها.',
    en: 'Diwan... where spaces take shape.',
    segments: [
      {at: 2,   text: 'ديوان'},
      {at: 3.5, text: 'حيث تأخذ المساحات شكلها'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },

  // Visual B — Problem photos (6–28s)
  {
    start: 6,
    end: 28,
    ar: 'مع رؤية 2030، تملّكت كثير من العائلات السعودية منازلها، لكن رحلة التشطيب لا تزال مرهقة. أشهر من الانتظار، زيارات لا تنتهي للمعارض، رسائل متواصلة مع مقاولين بوعود متضاربة، ولا شخص واحد يتحمّل مسؤوليّة النتيجة.',
    en: 'With Vision 2030, many Saudi families have come to own their homes, but the fit-out journey remains exhausting. Months of waiting, endless showroom visits, constant messages with contractors making conflicting promises, and no one accountable.',
    segments: [
      {at: 6,    text: 'مع رؤية 2030'},
      {at: 8,    text: 'تملّكت كثير من العائلات منازلها'},
      {at: 11.5, text: 'لكن رحلة التشطيب لا تزال مرهقة'},
      {at: 15,   text: 'أشهر من الانتظار'},
      {at: 17,   text: 'زيارات لا تنتهي للمعارض'},
      {at: 19,   text: 'رسائل مع مقاولين بوعود متضاربة'},
      {at: 22.5, text: 'ولا شخص واحد يتحمّل المسؤوليّة'},
      {at: 25.5, text: 'فضاؤك يجب أن يتماشى مع ذوقك'},
    ],
    visual: {kind: 'photoPair', left: '/pitch/problem-shell.jpg', right: '/pitch/problem-chaos.jpg'},
  },

  // Visual C — Promise closeups (28–56s)
  {
    start: 28,
    end: 56,
    ar: 'من هنا، وُجدت منصّة ديوان. منصّة سعوديّة لتجهيز المنازل والمشاريع التجاريّة وأماكن العمل المشتركة، تحت سقف واحد، وفي مدّة قياسيّة. التصميم والتنفيذ والصيانة ليست ثمانية قرارات — بل قرار واحد. علاقتك معنا، وعلاقة الموردين معنا، ونحن من يتحمّل الفارق.',
    en: 'From here, the Diwan platform was created. A Saudi platform fitting out homes, businesses, and co-working spaces under one roof, in record time. Design, execution, and maintenance are not eight decisions — they are one. Your relationship is with us, the supplier relationships are with us, and we own the gap.',
    segments: [
      {at: 28,   text: 'من هنا، وُجدت منصّة ديوان'},
      {at: 31,   text: 'منصّة سعوديّة لتجهيز المنازل'},
      {at: 34,   text: 'والمشاريع التجاريّة'},
      {at: 37,   text: 'وأماكن العمل المشتركة'},
      {at: 40,   text: 'تحت سقف واحد، وفي مدّة قياسيّة'},
      {at: 43.5, text: 'التصميم والتنفيذ والصيانة'},
      {at: 47,   text: 'قرار واحد — لا ثمانية'},
      {at: 50.5, text: 'علاقتك معنا، وعلاقة الموردين معنا'},
      {at: 53.5, text: 'ونحن من يتحمّل الفارق'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/kafd-private-office/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/01.jpg',
      '/projects/najdi-villa-nakheel/closeups/03.jpg',
    ]},
  },

  // Visual D — AI design + measurement (illustrated, 56–82s)
  {
    start: 56,
    end: 82,
    ar: 'كيف نبدأ؟ تبدأ الرحلة بإلهامك. صورة من الإنترنت، أو مساحة تعكس ذوقك. في ثوانٍ، يحوّلها ذكاء ديوان إلى تصاميم أوّليّة مع تكلفة تقديريّة. ثمّ يأتي فريقنا لرفع المقاسات بدقّة الملّيمتر، مجاناً.',
    en: 'How do we start? Your inspiration. A photo from the internet, or a space that reflects your taste. In seconds, Diwan AI turns it into early designs with cost estimates. Then our team measures to the millimeter, for free.',
    segments: [
      {at: 56,   text: 'كيف نبدأ؟ بإلهامك'},
      {at: 58.5, text: 'صورة من الإنترنت'},
      {at: 61,   text: 'أو مساحة تعكس ذوقك'},
      {at: 63,   text: 'يحوّلها ذكاء ديوان إلى تصاميم'},
      {at: 67,   text: 'مع تكلفة تقديريّة'},
      {at: 70,   text: 'ثمّ يأتي فريقنا لرفع المقاسات'},
      {at: 75,   text: 'بدقّة الملّيمتر، مجاناً'},
    ],
    visual: {kind: 'illustrated', scene: 'service'},
  },

  // Visual E — Stamped 2D engineering layout (82–98s)
  {
    start: 82,
    end: 98,
    ar: 'عبر خطوات بسيطة، يخرج مشروعك بمخطّط هندسي معتمد — مجلس، صالة، مطبخ، وغرف نوم. بتوقيع واحد منك، يبدأ الإنتاج في اليوم نفسه.',
    en: 'In a few simple steps, your project ships with a stamped engineering layout — majlis, family living, kitchen, bedrooms. One signature from you, and production starts the same day.',
    segments: [
      {at: 82,   text: 'مشروعك يخرج بمخطّط هندسي معتمد'},
      {at: 85.5, text: 'مجلس · صالة · مطبخ · غرف نوم'},
      {at: 89,   text: 'بتوقيع واحد منك'},
      {at: 92,   text: 'يبدأ الإنتاج في اليوم نفسه'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },

  // Visual F — Materials + install + maintenance (illustrated, 98–126s)
  {
    start: 98,
    end: 126,
    ar: 'نختار كلّ مادّة بشغف — أرز محفور، نُحاس مَطْروق، حجر كلسي، وطين مصبوب يدوياً. عبر شبكة موردين واسعة، نُدير كلّ شيء: التركيب، والكهرباء، والسباكة، والتسليم النهائي. لا حوارات في السعر، ولا ضمان مفقود — وصيانة موحَّدة لاثني عشر شهراً برقم تواصل واحد.',
    en: 'We curate every material — carved cedar, hammered brass, limestone, hand-poured mud plaster. Through a wide supplier network, we manage everything: installation, electrical, plumbing, final delivery. No pricing arguments, no missing warranty — and twelve months of single-source maintenance with one number to call.',
    segments: [
      {at:  98,   text: 'نختار كلّ مادّة بشغف'},
      {at: 101,   text: 'أرز محفور · نُحاس مَطْروق'},
      {at: 104,   text: 'حجر كلسي · طين مصبوب يدوياً'},
      {at: 107,   text: 'شبكة موردين واسعة'},
      {at: 110,   text: 'تركيب · كهرباء · سباكة · تسليم'},
      {at: 115,   text: 'لا حوارات سعر، ولا ضمان مفقود'},
      {at: 119,   text: 'صيانة موحَّدة لاثني عشر شهراً'},
      {at: 122.5, text: 'برقم تواصل واحد'},
    ],
    visual: {kind: 'illustrated', scene: 'install'},
  },

  // Visual G — Project montage (126–145s)
  {
    start: 126,
    end: 145,
    ar: 'أكثر من ثلاثين مشروعاً سلّمناها حول المملكة. فيلا نجديّة في النخيل، مقرّ استثماري في المركز المالي، ومقهى تراثي في البُجَيْري. كلّها تحت ديوان.',
    en: 'More than thirty projects delivered across the Kingdom. A Najdi villa in Al-Nakheel, an investment headquarters in KAFD, a heritage cafe in Al-Bujairi. All under Diwan.',
    segments: [
      {at: 126,   text: 'أكثر من ثلاثين مشروعاً مُسلَّماً'},
      {at: 129.5, text: 'فيلا نجديّة · النخيل'},
      {at: 132.5, text: 'مقرّ استثماري · المركز المالي'},
      {at: 136,   text: 'مقهى تراثي · البُجَيْري'},
      {at: 140,   text: 'كلّها تحت ديوان'},
    ],
    visual: {kind: 'montage', sources: [
      {src: '/projects/najdi-villa-nakheel/hero.jpg',     tagAr: 'فيلا نجديّة · النخيل',          tagEn: 'Najdi Villa · Al-Nakheel'},
      {src: '/projects/kafd-private-office/hero.jpg',     tagAr: 'مقرّ استثماري · المركز المالي',   tagEn: 'Investment HQ · KAFD'},
      {src: '/projects/olaya-roastery-riyadh/hero.jpg',   tagAr: 'محمصة قهوة · العُلَيّا',         tagEn: 'Roastery · Olaya'},
      {src: '/projects/bujairi-heritage-cafe/hero.jpg',   tagAr: 'مقهى تراثي · البُجَيْري',       tagEn: 'Heritage Cafe · Al-Bujairi'},
      {src: '/projects/hittin-townhouse-riyadh/hero.jpg', tagAr: 'تاون هاوس · حِطّين',           tagEn: 'Townhouse · Hittin'},
    ]},
  },

  // Visual H — Numbers + CTA (145–159s)
  {
    start: 145,
    end: 159,
    ar: 'سرعة في التسليم، أوفر بأربعة عشر بالمائة من السوق، وهويّة سعوديّة بأيدي متخصّصين. ديوان — لا قوالب جاهزة. ابدأ فضاءك على diwan.sa',
    en: 'Speed in delivery, 14% cheaper than the market, and Saudi heritage in expert hands. Diwan — no ready-made templates. Start your space at diwan.sa',
    segments: [
      {at: 145,   text: 'سرعة في التسليم'},
      {at: 147.5, text: 'أوفر بأربعة عشر بالمائة من السوق'},
      {at: 151,   text: 'هويّة سعوديّة بأيدي متخصّصين'},
      {at: 154,   text: 'ديوان — لا قوالب جاهزة'},
      {at: 156.5, text: 'ابدأ فضاءك على diwan.sa'},
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
