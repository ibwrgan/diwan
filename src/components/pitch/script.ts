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
      {at: 0,   text: 'ديوان'},
      {at: 2,   text: 'حيث تأخذ الفضاءات شكلها'},
      {at: 5,   text: 'بيوت ومحلّات سعوديّة'},
      {at: 7.5, text: 'تُسلَّم خلال ثلاثين يوماً'},
    ],
    visual: {kind: 'title', lineAr: 'ديوان', lineEn: 'DIWAN'},
  },
  {
    start: 10,
    end: 30,
    ar: 'تتسلّم العائلة السعودية مفتاح بيتها — صندوقاً فارغاً. ثم تبدأ الرحلة: ستّة أشهر، ثمانية موردين، ثلاثة مقاولين بوعود متضاربة، ولا شخص واحد مسؤول عن النتيجة.',
    en: 'A Saudi family receives the keys to their home — an empty box. Then begins six months, eight suppliers, three contractors with conflicting promises, and not one person accountable for the result.',
    segments: [
      {at: 10,   text: 'تتسلّم العائلة مفتاح بيتها'},
      {at: 12.5, text: 'صندوقاً فارغاً'},
      {at: 14.5, text: 'ثم تبدأ الرحلة'},
      {at: 16.5, text: 'ستّة أشهر'},
      {at: 18.5, text: 'ثمانية موردين'},
      {at: 20.5, text: 'ثلاثة مقاولين بوعود متضاربة'},
      {at: 24,   text: 'ولا شخص واحد مسؤول'},
      {at: 27,   text: 'عن النتيجة النهائيّة'},
    ],
    visual: {kind: 'photoPair', left: '/projects/najdi-villa-nakheel/exterior.jpg', right: '/projects/cocoon-family-compound/exterior.jpg'},
  },
  {
    start: 30,
    end: 46,
    ar: 'وُجد ديوان لأنّ التصميم والتنفيذ قرار واحد — لا ثمانية. توقيع واحد. رقم هاتف واحد. ضمان واحد على كامل التجهيز لمدّة اثني عشر شهراً.',
    en: 'Diwan exists because design and execution is one decision — not eight. One signature. One phone number. One twelve-month warranty across the entire fit-out.',
    segments: [
      {at: 30,   text: 'وُجد ديوان'},
      {at: 32,   text: 'ليجمع التصميم والتنفيذ'},
      {at: 34.5, text: 'في قرار واحد — لا ثمانية'},
      {at: 37.5, text: 'توقيع واحد'},
      {at: 39.5, text: 'رقم هاتف واحد'},
      {at: 41.5, text: 'ضمان واحد على كامل التجهيز'},
      {at: 44,   text: 'لاثني عشر شهراً'},
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
      {at: 46,   text: 'ائتنا بإلهامات Pinterest'},
      {at: 48.5, text: 'أو لوحة هويّة لعلامتك'},
      {at: 51,   text: 'أو صور من الجوّال'},
      {at: 53.5, text: 'ذكاء ديوان يحوّلها'},
      {at: 56,   text: 'إلى تصاميم أوّليّة خلال ثوانٍ'},
      {at: 59.5, text: 'ثم يأتي فريقنا للقياس'},
      {at: 62.5, text: 'مجاناً — وبالملّيمتر'},
      {at: 65.5, text: 'أو نقبل ملفّك الهندسي'},
      {at: 68.5, text: 'إن كان جاهزاً'},
    ],
    visual: {kind: 'photoPair', left: '/projects/hittin-townhouse-riyadh/rooms/01.jpg', right: '/projects/hittin-townhouse-riyadh/hero.jpg'},
  },
  {
    start: 71,
    end: 94,
    ar: 'كلّ مشروع يخرج بمخطّط هندسي ثنائي الأبعاد مختوم — مجلس، وصالة عائلة، ومُصلَّى بقبلة دقيقة، ومطبخ، وغرف نوم — مرسوم بمنطقنا السعودي. توقّع مرّة واحدة على هذا الرّسم — يبدأ الإنتاج في اليوم نفسه.',
    en: 'Every project ships with a stamped 2D engineering layout — majlis, family living, prayer room aligned to qibla, kitchen, bedrooms — drawn with Saudi spatial logic. Sign once on this drawing — production starts the same day.',
    segments: [
      {at: 71,   text: 'كلّ مشروع يخرج بمخطّط هندسي'},
      {at: 74,   text: 'ثنائي الأبعاد، مختوم'},
      {at: 76.5, text: 'مجلس وصالة عائلة'},
      {at: 79,   text: 'ومُصلَّى بقبلة دقيقة'},
      {at: 81.5, text: 'مطبخ وغرف نوم'},
      {at: 84,   text: 'مرسوم بمنطقنا السعودي'},
      {at: 87,   text: 'توقّع مرّة واحدة'},
      {at: 89.5, text: 'يبدأ الإنتاج في اليوم نفسه'},
    ],
    visual: {kind: 'plan', planId: 'villa-4br', label: 'Stamped 2D engineering layout'},
  },
  {
    start: 94,
    end: 123,
    ar: 'نحدّد كلّ مادّة على حِدة — أرز محفور، نُحاس مَطْروق، حجر كلسي، طين مصبوب يدوياً، صوف وكتّان. شبكة موردينا من ستّة إلى أحد عشر موردًا تُورِّد تحت أمر شراء واحد بإسم ديوان. نُدير التركيب، والكهرباء، والسباكة، والقبول النهائي. أنت لا تتعامل إلا معنا.',
    en: 'We specify every material — carved cedar, hammered brass, limestone, hand-poured mud plaster, wool and linen. Our six-to-eleven-supplier network ships under one Diwan PO. We manage installation, electrical, plumbing, and final sign-off. You only deal with us.',
    segments: [
      {at:  94,   text: 'نحدّد كلّ مادّة على حِدة'},
      {at:  96.5, text: 'أرز محفور'},
      {at:  98.5, text: 'نُحاس مَطْروق'},
      {at: 100.5, text: 'حجر كلسي'},
      {at: 102.5, text: 'طين مصبوب يدوياً'},
      {at: 104.5, text: 'صوف وكتّان'},
      {at: 106.5, text: 'شبكة من ستّة إلى أحد عشر موردًا'},
      {at: 110,   text: 'تحت أمر شراء واحد بإسم ديوان'},
      {at: 113.5, text: 'نُدير التركيب والكهرباء والسباكة'},
      {at: 117,   text: 'والقبول النهائي'},
      {at: 119.5, text: 'أنت لا تتعامل إلا معنا'},
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
      {at: 123,   text: 'اثنا عشر مشروعاً مُسلَّماً'},
      {at: 125.5, text: 'عبر المملكة'},
      {at: 127.5, text: 'فيلا نجديّة في النخيل'},
      {at: 130,   text: 'طابق استثماري في KAFD'},
      {at: 132.5, text: 'محمصة قهوة على العُلَيّا'},
      {at: 135,   text: 'مقهى تراثي بالبُجَيْري'},
      {at: 137.5, text: 'تاون هاوس في حِطّين'},
      {at: 140,   text: 'بيوت، مكاتب، ومحلّات'},
      {at: 142.5, text: 'كلّها تحت ديوان'},
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
      {at: 145,   text: 'ما يميّز ديوان'},
      {at: 147.5, text: 'ثلاثون يوماً'},
      {at: 149.5, text: 'متوسّط التسليم'},
      {at: 151.5, text: 'أرخص بأربعة عشر بالمائة'},
      {at: 155,   text: 'من المجموع التجزئة'},
      {at: 157.5, text: 'ضمان موحَّد لاثني عشر شهراً'},
      {at: 161,   text: 'رقم واحد للمشروع كلّه'},
      {at: 164,   text: 'هويّة سعوديّة بيد متخصّصين'},
      {at: 167.5, text: 'ابدأ فضاءك'},
      {at: 170,   text: 'diwan.sa'},
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
