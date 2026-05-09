// Diwan pitch reel — subtitle text + visual scene boundaries aligned to the
// recorded VO using Whisper word-level timestamps. Every `at` value below
// is the exact second when the spoken phrase begins in voiceover-ar.m4a.

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
  // Visual A — Title (0–5.5s)
  {
    start: 0,
    end: 5.5,
    ar: 'ديوان... حيث تأخذ المساحات شكلها.',
    en: 'Diwan... where spaces take shape.',
    segments: [
      {at: 1.4, text: 'ديوان'},
      {at: 2.5, text: 'حيث تأخذ المساحات شكلها'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },

  // Visual B — Problem photos (5.5–34s)
  {
    start: 5.5,
    end: 34,
    ar: 'مع رؤية 2030، تملّكت كثير من العائلات السعودية منازلها، لكن رحلة التشطيب لا تزال مرهقة. أشهر من الانتظار، زيارات لا تنتهي للمعارض، رسائل متواصلة مع مقاولين بوعود متضاربة، وفي النهاية... لا شخص واحد يتحمّل مسؤوليّة النتيجة. المكان الذي تقضي فيه وقتك، يجب أن يتماشى مع ذوقك... بلا متاعب.',
    en: 'With Vision 2030, many Saudi families have come to own their homes, but the fit-out journey remains exhausting. Months of waiting, endless showroom visits, constant messages with contractors making conflicting promises, and at the end — no one accountable. The space where you spend your time should reflect your taste — without the headache.',
    segments: [
      {at:  5.9, text: 'مع رؤية 2030'},
      {at:  7.4, text: 'تملّكت كثير من العائلات السعودية منازلها'},
      {at: 10.9, text: 'لكن رحلة التشطيب لا تزال مرهقة'},
      {at: 14.0, text: 'أشهر من الانتظار'},
      {at: 16.1, text: 'زيارات لا تنتهي للمعارض'},
      {at: 18.6, text: 'رسائل متواصلة مع مقاولين بوعود متضاربة'},
      {at: 23.2, text: 'وفي النهاية... لا شخص واحد يتحمّل المسؤوليّة'},
      {at: 28.1, text: 'المكان الذي تقضي فيه وقتك'},
      {at: 30.7, text: 'يجب أن يتماشى مع ذوقك — بلا متاعب'},
    ],
    visual: {kind: 'photoPair', left: '/pitch/problem-shell.jpg', right: '/pitch/problem-chaos.jpg'},
  },

  // Visual C — Promise closeups (34–61s)
  {
    start: 34,
    end: 61,
    ar: 'من هنا، وُجدت منصّة ديوان. منصّة سعوديّة لتجهيز المنازل والمشاريع التجاريّة وأماكن العمل المشتركة، تحت سقف واحد، وفي مدّة قياسيّة. في ديوان، التصميم والتنفيذ والصيانة ليسوا ثمانية قرارات... بل قرار واحد. علاقتك معنا، وعلاقة الموردين معنا، ونحن من يتحمّل الفارق.',
    en: 'From here, the Diwan platform was created. A Saudi platform fitting out homes, businesses, and co-working spaces, under one roof, in record time. At Diwan, design, execution, and maintenance are not eight decisions — they are one. Your relationship is with us, the supplier relationships are with us, and we own the gap.',
    segments: [
      {at: 34.4, text: 'من هنا، وُجدت منصّة ديوان'},
      {at: 37.6, text: 'منصّة سعوديّة لتجهيز المنازل والمشاريع'},
      {at: 42.3, text: 'وأماكن العمل المشتركة'},
      {at: 44.7, text: 'تحت سقف واحد، وفي مدّة قياسيّة'},
      {at: 48.2, text: 'في ديوان: التصميم والتنفيذ والصيانة'},
      {at: 52.5, text: 'ليسوا ثمانية قرارات — بل قرار واحد'},
      {at: 56.1, text: 'علاقتك معنا، وعلاقة الموردين معنا'},
      {at: 59.5, text: 'ونحن من يتحمّل الفارق'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/kafd-private-office/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/01.jpg',
      '/projects/najdi-villa-nakheel/closeups/03.jpg',
    ]},
  },

  // Visual D — AI design + measurement (illustrated, 61–82s)
  {
    start: 61,
    end: 82,
    ar: 'كيف نبدأ؟ تبدأ الرحلة بإلهامك. صورة من الإنترنت، أو مساحة تعكس ذوقك. في ثوانٍ، يحوّلها ذكاء ديوان إلى تصاميم أوّليّة مع تكلفة تقديريّة. ثمّ يأتي فريقنا لرفع المقاسات بدقّة الملّيمتر، مجاناً.',
    en: 'How do we start? The journey begins with your inspiration. A photo from the internet, or a space that reflects your taste. In seconds, Diwan AI turns it into early designs with cost estimates. Then our team measures to the millimeter, for free.',
    segments: [
      {at: 61.6, text: 'كيف نبدأ؟ تبدأ الرحلة بإلهامك'},
      {at: 65.4, text: 'صورة من الإنترنت، أو مساحة تعكس ذوقك'},
      {at: 69.8, text: 'يحوّلها ذكاء ديوان إلى تصاميم أوّليّة'},
      {at: 73.5, text: 'مع تكلفة تقديريّة'},
      {at: 76.3, text: 'ثمّ يأتي فريقنا لرفع المقاسات'},
      {at: 80.1, text: 'بدقّة الملّيمتر، مجاناً'},
    ],
    visual: {kind: 'illustrated', scene: 'service'},
  },

  // Visual E — Stamped 2D engineering layout (82–100s)
  {
    start: 82,
    end: 100,
    ar: 'عبر خطوات بسيطة، يخرج مشروعك بمخطّط هندسي معتمد — مجلس، صالة، مطبخ، أو غرف نوم. بتوقيع واحد منك... يبدأ الإنتاج في اليوم نفسه.',
    en: 'In a few simple steps, your project ships with a stamped engineering layout — majlis, family living, kitchen, or bedrooms. With one signature from you, production begins the same day.',
    segments: [
      {at: 82.9, text: 'عبر خطوات بسيطة'},
      {at: 85.0, text: 'يخرج مشروعك بمخطّط هندسي معتمد'},
      {at: 89.5, text: 'مجلس · صالة · مطبخ · غرف نوم'},
      {at: 94.0, text: 'بتوقيع واحد منك'},
      {at: 96.5, text: 'يبدأ الإنتاج في اليوم نفسه'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },

  // Visual F — Materials + suppliers + install + maintenance (illustrated, 100–125s)
  {
    start: 100,
    end: 125,
    ar: 'نختار كلّ مادّة بشغف — أرز محفور، نُحاس مَطْروق، حجر كلسي، وطين مصبوب يدوياً. عبر شبكة موردين واسعة، نُدير كلّ شيء: التركيب، الكهرباء، السباكة، والتسليم النهائي. لا حوارات في السعر، ولا ضمان مفقود... وصيانة موحَّدة لاثني عشر شهراً برقم تواصل واحد.',
    en: 'We curate every material with passion — carved cedar, hammered brass, limestone, and hand-poured mud plaster. Through a wide supplier network, we manage everything: installation, electrical, plumbing, final delivery. No pricing arguments, no missing warranty — and twelve months of single-source maintenance with one number to call.',
    segments: [
      {at: 100.0, text: 'نختار كلّ مادّة بشغف'},
      {at: 100.5, text: 'أرز محفور · نُحاس مَطْروق'},
      {at: 103.4, text: 'حجر كلسي · طين مصبوب يدوياً'},
      {at: 106.8, text: 'عبر شبكة موردين واسعة'},
      {at: 109.5, text: 'تركيب · كهرباء · سباكة · تسليم'},
      {at: 116.3, text: 'لا حوارات في السعر، ولا ضمان مفقود'},
      {at: 119.9, text: 'صيانة موحَّدة لاثني عشر شهراً'},
      {at: 123.7, text: 'برقم تواصل واحد'},
    ],
    visual: {kind: 'illustrated', scene: 'install'},
  },

  // Visual G — Project montage (125–139s)
  {
    start: 125,
    end: 139,
    ar: 'أكثر من 30 مشروعاً سلّمناها حول المملكة. فيلا نجديّة في النخيل، مقرّ استثماري في المركز المالي، ومقهى تراثي في البُجَيْري... كلّها تحت ديوان.',
    en: 'More than 30 projects delivered across the Kingdom. A Najdi villa in Al-Nakheel, an investment headquarters in KAFD, a heritage cafe in Al-Bujairi... all under Diwan.',
    segments: [
      {at: 125.1, text: 'أكثر من 30 مشروعاً سلّمناها حول المملكة'},
      {at: 129.9, text: 'فيلا نجديّة · النخيل'},
      {at: 132.0, text: 'مقرّ استثماري · المركز المالي'},
      {at: 134.8, text: 'مقهى تراثي · البُجَيْري'},
      {at: 137.3, text: 'كلّها تحت ديوان'},
    ],
    visual: {kind: 'montage', sources: [
      {src: '/projects/najdi-villa-nakheel/hero.jpg',     tagAr: 'فيلا نجديّة · النخيل',          tagEn: 'Najdi Villa · Al-Nakheel'},
      {src: '/projects/kafd-private-office/hero.jpg',     tagAr: 'مقرّ استثماري · المركز المالي',   tagEn: 'Investment HQ · KAFD'},
      {src: '/projects/olaya-roastery-riyadh/hero.jpg',   tagAr: 'محمصة قهوة · العُلَيّا',         tagEn: 'Roastery · Olaya'},
      {src: '/projects/bujairi-heritage-cafe/hero.jpg',   tagAr: 'مقهى تراثي · البُجَيْري',       tagEn: 'Heritage Cafe · Al-Bujairi'},
      {src: '/projects/hittin-townhouse-riyadh/hero.jpg', tagAr: 'تاون هاوس · حِطّين',           tagEn: 'Townhouse · Hittin'},
    ]},
  },

  // Visual H — Numbers + CTA (139–159s)
  {
    start: 139,
    end: 159,
    ar: 'سرعة في التسليم، أوفر بـ 14% من السوق، وهويّة سعوديّة بأيدي متخصّصين. ديوان... لا قوالب جاهزة. ابدأ فضاءك الآن على Diwan.sa',
    en: 'Speed in delivery, 14% cheaper than the market, and Saudi heritage in expert hands. Diwan — no ready-made templates. Start your space now at Diwan.sa',
    segments: [
      {at: 139.7, text: 'سرعة في التسليم'},
      {at: 141.6, text: 'أوفر بـ 14% من السوق'},
      {at: 145.8, text: 'وهويّة سعوديّة بأيدي متخصّصين'},
      {at: 149.0, text: 'ديوان... لا قوالب جاهزة'},
      {at: 152.5, text: 'ابدأ فضاءك على Diwan.sa'},
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
