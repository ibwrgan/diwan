// Diwan pitch reel — 8 scenes, ~125 seconds total.
// Arabic VO timing matches `start` and `end` (seconds). Subtitles render in
// the active locale. Visuals are keyed off `kind` and the asset paths.

export type PitchVisual =
  | {kind: 'title'; lineAr: string; lineEn: string}
  | {kind: 'photo'; src: string; zoom: 'in' | 'out'; pan?: 'l' | 'r'}
  | {kind: 'photoPair'; left: string; right: string}
  | {kind: 'plan'; planId: string; label: string}
  | {kind: 'closeups'; sources: string[]}
  | {kind: 'montage'; sources: Array<{src: string; tagAr: string; tagEn: string}>}
  | {kind: 'numbers'; rows: Array<{numAr: string; numEn: string; labelAr: string; labelEn: string}>}
  | {kind: 'cta'; lineAr: string; lineEn: string; url: string};

export type SubtitleSegment = {
  at: number;        // absolute time in seconds when this caption appears
  text: string;      // Arabic caption — kept short enough to fit 2 lines max
};

export type PitchScene = {
  start: number;
  end: number;
  ar: string;        // full narration line (used by the teleprompter)
  en: string;        // English reference (used by the teleprompter)
  segments: SubtitleSegment[];  // on-screen Arabic captions, max 2 lines each
  visual: PitchVisual;
};

// Scene timings match the actual measured duration of the macOS Majed VO
// at 165 wpm + 0.6s inter-scene pauses. If you replace the audio file with
// your own recording, retime these to match.

export const PITCH_SCRIPT: PitchScene[] = [
  {
    start: 0,
    end: 10,
    ar: 'ديوان — حيث تأخذ الفضاءات شكلها. بيوت ومحلّات سعوديّة، تُسلَّم خلال ثلاثين يوماً.',
    en: 'Diwan — where spaces take shape. Saudi homes and businesses, delivered in thirty days.',
    segments: [
      {at: 0, text: 'ديوان — حيث تأخذ الفضاءات شكلها'},
      {at: 5, text: 'بيوت ومحلّات سعوديّة، تُسلَّم خلال ثلاثين يوماً'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },
  {
    start: 10,
    end: 30,
    ar: 'تتسلّم العائلة السعودية مفتاح بيتها — صندوقاً فارغاً. ثم تبدأ الرحلة: ستّة أشهر، ثمانية موردين، ثلاثة مقاولين بوعود متضاربة، ولا شخص واحد مسؤول عن النتيجة.',
    en: 'A Saudi family receives the keys to their home — an empty box. Then begins six months, eight suppliers, three contractors with conflicting promises, and not one person accountable for the result.',
    segments: [
      {at: 10, text: 'تتسلّم العائلة مفتاح بيتها — صندوقاً فارغاً'},
      {at: 16, text: 'ثم تبدأ الرحلة: ستّة أشهر وثمانية موردين'},
      {at: 22, text: 'ثلاثة مقاولين بوعود متضاربة'},
      {at: 26, text: 'ولا شخص واحد مسؤول عن النتيجة'},
    ],
    visual: {kind: 'photoPair', left: '/projects/najdi-villa-nakheel/exterior.jpg', right: '/projects/cocoon-family-compound/exterior.jpg'},
  },
  {
    start: 30,
    end: 46,
    ar: 'وُجد ديوان لأنّ التصميم والتنفيذ قرار واحد — لا ثمانية. توقيع واحد. رقم هاتف واحد. ضمان واحد على كامل التجهيز لمدّة اثني عشر شهراً.',
    en: 'Diwan exists because design and execution is one decision — not eight. One signature. One phone number. One twelve-month warranty across the entire fit-out.',
    segments: [
      {at: 30, text: 'وُجد ديوان لأنّ التصميم والتنفيذ قرار واحد'},
      {at: 36, text: 'توقيع واحد. رقم هاتف واحد'},
      {at: 41, text: 'ضمان واحد لمدّة اثني عشر شهراً'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/kafd-private-office/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/01.jpg',
      '/projects/najdi-villa-nakheel/closeups/03.jpg',
    ]},
  },
  {
    start: 46,
    end: 71,
    ar: 'ائتنا بإلهامات Pinterest، أو لوحة هويّة، أو حتى صور بيت ضيّقة من الجوّال. يحوّلها ذكاء ديوان إلى تصاميم أوّليّة خلال ثوانٍ. ثمّ يأتي فريقنا للقياس مجاناً — قياس دقيق بالملّيمتر — أو يقبل ديوان ملفّك الهندسي إن كان جاهزاً.',
    en: 'Bring us Pinterest, a brand brief, or even tight phone photos of an empty space. Diwan AI turns them into early designs in seconds. Then our team measures your space for free — to the millimeter — or we accept your engineering file if you have one.',
    segments: [
      {at: 46, text: 'ائتنا بإلهامات Pinterest أو لوحة هويّة'},
      {at: 52, text: 'حتى صور بيت ضيّقة من الجوّال'},
      {at: 58, text: 'يحوّلها ذكاء ديوان إلى تصاميم خلال ثوانٍ'},
      {at: 64, text: 'فريقنا يقيس البيت مجاناً — بالملّيمتر'},
    ],
    visual: {kind: 'photoPair', left: '/projects/hittin-townhouse-riyadh/rooms/01.jpg', right: '/projects/hittin-townhouse-riyadh/hero.jpg'},
  },
  {
    start: 71,
    end: 94,
    ar: 'كلّ مشروع يخرج بمخطّط هندسي ثنائي الأبعاد مختوم — مجلس، وصالة عائلة، ومُصلَّى بقبلة دقيقة، ومطبخ، وغرف نوم — مرسوم بمنطقنا السعودي. توقّع مرّة واحدة على هذا الرّسم — يبدأ الإنتاج في اليوم نفسه.',
    en: 'Every project ships with a stamped 2D engineering layout — majlis, family living, prayer room aligned to qibla, kitchen, bedrooms — drawn with Saudi spatial logic. Sign once on this drawing — production starts the same day.',
    segments: [
      {at: 71, text: 'كلّ مشروع يخرج بمخطّط هندسي ثنائي الأبعاد مختوم'},
      {at: 78, text: 'مجلس وصالة عائلة ومُصلَّى بقبلة دقيقة'},
      {at: 84, text: 'مرسوم بمنطقنا السعودي'},
      {at: 88, text: 'توقّع مرّة واحدة — يبدأ الإنتاج في اليوم نفسه'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },
  {
    start: 94,
    end: 123,
    ar: 'نحدّد كلّ مادّة على حِدة — أرز محفور، نُحاس مَطْروق، حجر كلسي، طين مصبوب يدوياً، صوف وكتّان. شبكة موردينا من ستّة إلى أحد عشر موردًا تُورِّد تحت أمر شراء واحد بإسم ديوان. نُدير التركيب، والكهرباء، والسباكة، والقبول النهائي. أنت لا تتعامل إلا معنا.',
    en: 'We specify every material — carved cedar, hammered brass, limestone, hand-poured mud plaster, wool and linen. Our six-to-eleven-supplier network ships under one Diwan PO. We manage installation, electrical, plumbing, and final sign-off. You only deal with us.',
    segments: [
      {at:  94, text: 'نحدّد كلّ مادّة على حِدة'},
      {at:  98, text: 'أرز محفور، نُحاس مَطْروق، حجر كلسي'},
      {at: 103, text: 'طين مصبوب يدوياً، صوف وكتّان'},
      {at: 108, text: 'شبكة من ستّة إلى أحد عشر موردًا'},
      {at: 113, text: 'تحت أمر شراء واحد بإسم ديوان'},
      {at: 117, text: 'نُدير التركيب والكهرباء والسباكة والقبول'},
      {at: 121, text: 'أنت لا تتعامل إلا معنا'},
    ],
    visual: {kind: 'closeups', sources: [
      '/projects/najdi-villa-nakheel/closeups/01.jpg',
      '/projects/olaya-roastery-riyadh/closeups/02.jpg',
      '/projects/bujairi-heritage-cafe/closeups/02.jpg',
      '/projects/kafd-private-office/closeups/03.jpg',
    ]},
  },
  {
    start: 123,
    end: 145,
    ar: 'اثنا عشر مشروعاً مُسلَّماً عبر المملكة. فيلا نجدية في النخيل، طابق استثماري خاص في KAFD، محمصة قهوة على شارع العُلَيّا، مقهى تراثي بمحاذاة البُجَيْري، تاون هاوس عائلي في حِطّين. كلّها تحت ديوان.',
    en: 'Twelve delivered projects across the Kingdom. A Najdi villa in Al-Nakheel, a private investment-firm floor in KAFD, a roastery on Olaya Street, a heritage cafe near Al-Bujairi, a family townhouse in Hittin. All under Diwan.',
    segments: [
      {at: 123, text: 'اثنا عشر مشروعاً مُسلَّماً عبر المملكة'},
      {at: 128, text: 'فيلا نجديّة في النخيل'},
      {at: 132, text: 'طابق استثماري خاص في KAFD'},
      {at: 136, text: 'محمصة قهوة على شارع العُلَيّا'},
      {at: 139, text: 'مقهى تراثي بمحاذاة البُجَيْري'},
      {at: 142, text: 'تاون هاوس في حِطّين — كلّها تحت ديوان'},
    ],
    visual: {kind: 'montage', sources: [
      {src: '/projects/najdi-villa-nakheel/hero.jpg',         tagAr: 'فيلا نجديّة · النخيل',         tagEn: 'Najdi Villa · Al-Nakheel'},
      {src: '/projects/kafd-private-office/hero.jpg',         tagAr: 'طابق استثماري · KAFD',         tagEn: 'Investment Floor · KAFD'},
      {src: '/projects/olaya-roastery-riyadh/hero.jpg',       tagAr: 'محمصة قهوة · العُلَيّا',         tagEn: 'Roastery · Olaya'},
      {src: '/projects/bujairi-heritage-cafe/hero.jpg',       tagAr: 'مقهى تراثي · البُجَيْري',       tagEn: 'Heritage Cafe · Al-Bujairi'},
      {src: '/projects/hittin-townhouse-riyadh/hero.jpg',     tagAr: 'تاون هاوس · حِطّين',           tagEn: 'Townhouse · Hittin'},
    ]},
  },
  {
    start: 145,
    end: 172,
    ar: 'ما يميّز ديوان: ثلاثون يوماً متوسّط التسليم. أرخص من المجموع التجزئة بأربعة عشر بالمائة. رقم واحد لمتابعة ما بعد البيع لاثني عشر شهراً. هويّة سعوديّة بيد متخصّصين. ابدأ فضاءك على diwan.sa',
    en: 'What sets Diwan apart: 30-day average delivery. 14% below retail aggregate. One number for twelve-month aftercare. Saudi heritage, by specialists. Start your space at diwan.sa',
    segments: [
      {at: 145, text: 'ما يميّز ديوان'},
      {at: 149, text: 'ثلاثون يوماً متوسّط التسليم'},
      {at: 154, text: 'أرخص من التجزئة بأربعة عشر بالمائة'},
      {at: 159, text: 'ضمان موحَّد لاثني عشر شهراً'},
      {at: 163, text: 'هويّة سعوديّة بيد متخصّصين'},
      {at: 167, text: 'ابدأ فضاءك على diwan.sa'},
    ],
    visual: {kind: 'numbers', rows: [
      {numAr: '30', numEn: '30',   labelAr: 'يوماً متوسّط التسليم',         labelEn: 'days · average delivery'},
      {numAr: '14%', numEn: '14%', labelAr: 'أرخص من التجزئة',              labelEn: 'below retail aggregate'},
      {numAr: '12', numEn: '12',   labelAr: 'شهراً ضمان موحَّد',             labelEn: 'months · single warranty'},
      {numAr: '1', numEn: '1',     labelAr: 'رقم لكل المشروع',              labelEn: 'number for the whole project'},
    ]},
  },
];

// Flat segment list for fast time-based lookup in PitchReel.
export const ALL_SEGMENTS = PITCH_SCRIPT.flatMap((s) => s.segments);

export const TOTAL_DURATION = PITCH_SCRIPT[PITCH_SCRIPT.length - 1].end;
