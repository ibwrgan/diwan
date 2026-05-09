// Eight delivered case studies — five homes, three businesses.
// Hero treatments reuse the gradient art vocabulary (artTreatments
// from /data/quiz.ts) so the cards stay brand-consistent.

import {artTreatments} from './quiz';

export type Inspiration = {
  source: 'pinterest' | 'upload' | 'board';
  art: string;     // gradient key from artTreatments
  caption: string; // bilingual: "key" — replaced via messages later, kept inline for ease
};

export type CaseStudy = {
  id: string;
  category: 'residential' | 'commercial';
  vertical?: 'cafe' | 'clinic' | 'office' | 'salon' | 'retail' | 'home';
  city: 'Riyadh' | 'Jeddah' | 'Dammam' | 'AlKhobar';
  district: string;
  areaM2: number;
  rooms: number;
  budget: number;          // SAR (project total)
  retailEquivalent: number;
  deliveredDays: number;
  itemCount: number;
  supplierCount: number;
  conceptName: string;
  conceptArt: string;      // primary hero gradient
  paletteHex: string[];

  // Bilingual content
  titleEn: string;
  titleAr: string;
  clientLabelEn: string;
  clientLabelAr: string;
  taglineEn: string;
  taglineAr: string;
  storyEn: string;
  storyAr: string;
  verdictEn: string;
  verdictAr: string;

  // Pinterest-style inspirations the client brought (3-5 each)
  inspirations: Array<{art: string; captionEn: string; captionAr: string}>;

  // Signature pieces (3-4)
  highlightItemsEn: string[];
  highlightItemsAr: string[];

  // Room thumbnails (4-6 per project, each a gradient)
  roomViews: Array<{art: string; nameEn: string; nameAr: string}>;
};

export const CASE_STUDIES: CaseStudy[] = [
  // 1 — Najdi villa
  {
    id: 'najdi-villa-nakheel',
    category: 'residential',
    vertical: 'home',
    city: 'Riyadh',
    district: 'Al-Nakheel',
    areaM2: 380,
    rooms: 12,
    budget: 285_000,
    retailEquivalent: 332_400,
    deliveredDays: 28,
    itemCount: 47,
    supplierCount: 6,
    conceptName: 'Modern Najdi',
    conceptArt: 'najdi-warm',
    paletteHex: ['#B8552E', '#B89968', '#1A1F2E', '#F4EFE6', '#1F1A14'],
    titleEn: 'A Najdi Villa Reimagined',
    titleAr: 'فيلا نجدية، مُعاد تخيُّلها',
    clientLabelEn: 'M Family · 4-bedroom villa',
    clientLabelAr: 'عائلة م. · فيلا بأربع غرف',
    taglineEn: 'Carved geometry, warm earth, and ceremonial weight — the Najdi vocabulary made livable.',
    taglineAr: 'هندسة محفورة، ألوان ترابية، ووقار احتفالي — لغة نجدية مُعاشة.',
    storyEn: 'The family came with forty-seven Pinterest pins, three trips to Diriyah, and a clear love of carved cedar mashrabiya. They wanted a home that read Najdi without becoming a museum. We anchored the majlis around layered seating and a brass-pendant cluster, kept the family living open and informal, and threaded clay tones through the bedrooms.',
    storyAr: 'جاءت العائلة بسبعة وأربعين من إلهامات Pinterest، وزيارات للدرعية، وعشق واضح للمشربيات النجدية. أرادوا بيتاً يُقرأ نجدياً دون أن يتحوّل إلى متحف. ركّزنا المجلس حول جلوس متعدّد الطبقات وعنقود إنارة نُحاسي، وأبقينا الصالة العائلية مفتوحة وغير رسمية، ومدّدنا ألوان الطين عبر غرف النوم.',
    verdictEn: 'They walked us through every supplier brief and signed once. We delivered keys six days early.',
    verdictAr: 'مرّوا معنا على كل وثيقة مورّد ووقّعوا مرّة واحدة. سلّمنا المفاتيح قبل ستة أيام من الموعد.',
    inspirations: [
      {art: 'najdi-warm',  captionEn: 'Najdi geometric majlis from Diriyah heritage',     captionAr: 'مجلس نجدي هندسي من تراث الدرعية'},
      {art: 'clay-brass',  captionEn: 'Clay-and-brass dining lighting cluster',           captionAr: 'تجمّع إضاءة بألوان الطين والنُحاس'},
      {art: 'najdi-geom',  captionEn: 'Carved cedar mashrabiya pattern study',            captionAr: 'دراسة نقش مشربية أرز محفورة'},
      {art: 'long-evening',captionEn: 'Long-table dining with brass pendants',            captionAr: 'طاولة طعام طويلة بإنارات نُحاسية'},
    ],
    highlightItemsEn: ['Custom 12-seat majlis set in clay velvet', 'Carved cedar mashrabiya screens', 'Walnut + travertine dining table for 8', 'Brass-inlay accent wall'],
    highlightItemsAr: ['طقم مجلس مخصّص لاثني عشر شخصاً بمخمل لون الطين', 'مشربيات أرز محفورة', 'طاولة طعام جوز وحجر طبيعي لثمانية', 'جدار مميّز بمطعّمات نُحاسية'],
    roomViews: [
      {art: 'najdi-warm',     nameEn: 'Men\'s Majlis',   nameAr: 'مجلس الرجال'},
      {art: 'clay-brass',     nameEn: 'Family Living',   nameAr: 'صالة العائلة'},
      {art: 'long-evening',   nameEn: 'Dining',          nameAr: 'الطعام'},
      {art: 'cocoon',         nameEn: 'Master Bedroom',  nameAr: 'غرفة النوم الرئيسية'},
      {art: 'najdi-geom',     nameEn: 'Prayer Niche',    nameAr: 'المُصلَّى'},
      {art: 'warm-hub',       nameEn: 'Kitchen',         nameAr: 'المطبخ'},
    ],
  },

  // 2 — Jeddah corniche apartment
  {
    id: 'coastal-jeddah-corniche',
    category: 'residential',
    vertical: 'home',
    city: 'Jeddah',
    district: 'Al-Hamra',
    areaM2: 165,
    rooms: 8,
    budget: 145_000,
    retailEquivalent: 168_500,
    deliveredDays: 26,
    itemCount: 32,
    supplierCount: 5,
    conceptName: 'Coastal Hijazi',
    conceptArt: 'hijazi-light',
    paletteHex: ['#DDD3C3', '#B89968', '#3D4A6B', '#FAFAF7', '#1F1A14'],
    titleEn: 'Sea Air, Pale Wood, Open Plan',
    titleAr: 'هواء بحري، خشب فاتح، مخطّط مفتوح',
    clientLabelEn: 'Couple · 2-bedroom apartment',
    clientLabelAr: 'زوجان · شقّة بغرفتي نوم',
    taglineEn: 'A second-floor view of the Red Sea translated into linen, ash, and travertine.',
    taglineAr: 'إطلالة من الطابق الثاني على البحر الأحمر، مُترجَمة إلى كتّان، وحُور، وحجر طبيعي.',
    storyEn: 'A young couple just back from Stockholm, with a corniche apartment and a Pinterest board heavy on Scandinavian airiness. We grounded their Nordic sensibility in Hijazi materiality — pale ash floors, travertine kitchen, woven cotton, brass-tip handles. Hijazi shutters keep the morning sun in check.',
    storyAr: 'زوجان شابان عادا للتوّ من ستوكهولم، بشقّة على الكورنيش ولوحة Pinterest مُثقلة بالرحابة الإسكندنافية. أرسينا حساسيّتهما الشمالية في الموادّ الحجازية — أرضيات حُور فاتح، مطبخ حجر طبيعي، قطن منسوج، مقابض نُحاسية. تُهدِّئ الشيش الحجازي شمسَ الصباح.',
    verdictEn: 'Move-in day was the first time the apartment felt like home — within thirty days of signing.',
    verdictAr: 'يوم الانتقال كان أوّل مرّة شعرنا فيها بأنّ الشقّة بيت — خلال ثلاثين يوماً من التوقيع.',
    inspirations: [
      {art: 'hijazi-light',  captionEn: 'Stockholm-meets-Jeddah: pale wood and linen',  captionAr: 'ستوكهولم تلتقي جدة: خشب فاتح وكتّان'},
      {art: 'bright-morn',   captionEn: 'Cane chairs around a travertine table',         captionAr: 'كراسي قش حول طاولة حجر طبيعي'},
      {art: 'open-living',   captionEn: 'Open plan living, slatted Hijazi shutters',     captionAr: 'صالة مفتوحة، مع شيش حجازي'},
      {art: 'daylight-bed',  captionEn: 'Linen bedroom, ivory walls, brass mirror',      captionAr: 'غرفة نوم كتّان، جدران عاج، مرآة نُحاس'},
    ],
    highlightItemsEn: ['Bone-linen 3-seat sofa with hidden storage', 'Travertine 6-seat dining table', 'Hijazi pale-wood shutter set, 4 windows', 'Brass-tip ash kitchen pulls'],
    highlightItemsAr: ['أريكة كتّان لون العاج بثلاثة مقاعد ومخزن مخفي', 'طاولة طعام حجر طبيعي لستّة', 'طقم شيش حجازي بخشب فاتح لأربع نوافذ', 'مقابض مطبخ حُور بأطراف نُحاسية'],
    roomViews: [
      {art: 'hijazi-light',   nameEn: 'Living Room',    nameAr: 'الصالة'},
      {art: 'bright-morn',    nameEn: 'Dining Nook',    nameAr: 'ركن الطعام'},
      {art: 'quiet-workshop', nameEn: 'Kitchen',        nameAr: 'المطبخ'},
      {art: 'daylight-bed',   nameEn: 'Master Bedroom', nameAr: 'غرفة النوم الرئيسية'},
      {art: 'stone-cool',     nameEn: 'Bathroom',       nameAr: 'الحمّام'},
    ],
  },

  // 3 — Olaya penthouse
  {
    id: 'riyadh-contemporary-penthouse',
    category: 'residential',
    vertical: 'home',
    city: 'Riyadh',
    district: 'Olaya',
    areaM2: 290,
    rooms: 10,
    budget: 420_000,
    retailEquivalent: 488_900,
    deliveredDays: 30,
    itemCount: 58,
    supplierCount: 7,
    conceptName: 'Riyadh Contemporary',
    conceptArt: 'stone-cool',
    paletteHex: ['#F4EFE6', '#DDD3C3', '#3D4A6B', '#1A1F2E', '#1F1A14'],
    titleEn: 'A Penthouse of Quiet Discipline',
    titleAr: 'بنتهاوس بانضباط هادئ',
    clientLabelEn: 'Executive · 3-bedroom penthouse',
    clientLabelAr: 'تنفيذي · بنتهاوس بثلاث غرف',
    taglineEn: 'Linen, limestone, and the discipline of negative space, twenty floors above Olaya.',
    taglineAr: 'كتّان، حجر، وانضباط الفراغ، عشرون طابقاً فوق العليا.',
    storyEn: 'A returning expat who had spent twelve years between Geneva and London. He came in saying "no clutter, no carpet, no mood-boards" and meant it. We delivered an interior that disappears in service of the view: limestone floor through every public room, three pieces of art chosen by his wife, a single Najdi-craft bench by the entrance as the only visible nod to place.',
    storyAr: 'عائد من الاغتراب أمضى اثني عشر عاماً بين جنيف ولندن. دخل قائلاً "بلا فوضى، بلا سجاد، بلا لوحات إلهام" وقصد ما قال. سلّمنا داخلاً يختفي في خدمة الإطلالة: أرضية حجرية موحّدة عبر كل الغرف العامّة، وثلاث قطع فنّ اختارتها زوجته، ومقعد نجدي حِرفي عند المدخل كإشارة وحيدة ظاهرة إلى المكان.',
    verdictEn: 'Diwan understood that for me design is what you don\'t see. They gave me back the view.',
    verdictAr: 'فهم ديوان أنّ التصميم عندي هو ما لا تراه. أعادوا لي الإطلالة.',
    inspirations: [
      {art: 'stone-cool',     captionEn: 'Limestone living, no rugs',                      captionAr: 'صالة حجرية، بلا سجاد'},
      {art: 'spare-craft',    captionEn: 'A single sculptural object per room',             captionAr: 'قطعة نحتية واحدة في كل غرفة'},
      {art: 'ink-stone',      captionEn: 'Midnight master suite, brushed brass fittings',   captionAr: 'جناح نوم بلون الليل، تجهيزات نُحاس مفروش'},
      {art: 'quiet-workshop', captionEn: 'Concealed kitchen, stone surfaces',               captionAr: 'مطبخ مخفيّ بأسطح حجرية'},
    ],
    highlightItemsEn: ['Custom limestone island with concealed bar', 'Najdi-craft entrance bench', 'Travertine 4m sectional', 'Floor-to-ceiling Hijazi shutters'],
    highlightItemsAr: ['جزيرة حجرية مخصّصة ببار مخفيّ', 'مقعد مدخل نجدي حِرفي', 'كنبة حجرية مقاسها أربعة أمتار', 'شيش حجازي من الأرض إلى السقف'],
    roomViews: [
      {art: 'stone-cool',   nameEn: 'Living',         nameAr: 'الصالة'},
      {art: 'ink-stone',    nameEn: 'Master Suite',   nameAr: 'الجناح الرئيسي'},
      {art: 'quiet-workshop',nameEn: 'Kitchen',       nameAr: 'المطبخ'},
      {art: 'spare-craft',  nameEn: 'Library',        nameAr: 'المكتبة'},
      {art: 'stone-cool',   nameEn: 'Guest Bath',     nameAr: 'حمّام الضيوف'},
    ],
  },

  // 4 — Cocoon family compound
  {
    id: 'cocoon-family-compound',
    category: 'residential',
    vertical: 'home',
    city: 'Riyadh',
    district: 'Diplomatic Quarter',
    areaM2: 520,
    rooms: 14,
    budget: 540_000,
    retailEquivalent: 628_900,
    deliveredDays: 32,
    itemCount: 68,
    supplierCount: 8,
    conceptName: 'Cocoon',
    conceptArt: 'cocoon',
    paletteHex: ['#1A1F2E', '#B8552E', '#B89968', '#F4EFE6', '#1F1A14'],
    titleEn: 'A Family Compound, Built to Hold',
    titleAr: 'مجمّع عائلي، مبنيّ ليحتوي',
    clientLabelEn: 'Established family · 5-bedroom villa',
    clientLabelAr: 'عائلة قائمة · فيلا بخمس غرف',
    taglineEn: 'Deep tones, heavy textiles, and rooms that hold a long evening — six children, three generations, one home.',
    taglineAr: 'ألوان عميقة، أقمشة ثقيلة، وغرف تحتوي أمسية طويلة — ستّة أبناء، ثلاثة أجيال، بيت واحد.',
    storyEn: 'The brief was the opposite of "spare." Three generations, six children, weekly extended-family dinners. We built every room to absorb sound, hold many bodies, and survive a decade of teenagers. Deep velvet, heavy wool rugs, walnut everywhere it could go. The men\'s majlis seats sixteen.',
    storyAr: 'كان الطلب نقيض "المُقتضب". ثلاثة أجيال، ستّة أبناء، عشاءات عائلية ممتدّة أسبوعياً. بنينا كل غرفة لتمتصّ الصوت، وتحتوي أجساداً كثيرة، وتنجو من عقد من المراهقين. مخمل عميق، سجاد صوف ثقيل، جوز في كل ما يتقبّله. مجلس الرجال يتّسع لستّة عشر.',
    verdictEn: 'Six months later, three couches still smell like new. The children destroyed nothing. That is the test.',
    verdictAr: 'بعد ستّة أشهر، ثلاث أرائك ما زالت برائحة الجديد. لم يُتلِف الأبناء شيئاً. هذا هو الاختبار.',
    inspirations: [
      {art: 'cocoon',       captionEn: 'Deep tones, heavy textiles, evening light',     captionAr: 'ألوان عميقة، أقمشة ثقيلة، إنارة مسائية'},
      {art: 'long-evening', captionEn: 'Long dining for the whole extended family',    captionAr: 'طاولة طعام طويلة للعائلة الممتدّة'},
      {art: 'najdi-warm',   captionEn: 'Najdi-craft accents in the men\'s majlis',     captionAr: 'لمسات نجدية حِرفية في مجلس الرجال'},
      {art: 'clay-brass',   captionEn: 'Brass details, walnut everywhere',              captionAr: 'تفاصيل نُحاسية، جوز في كل مكان'},
    ],
    highlightItemsEn: ['16-seat men\'s majlis in deep velvet', 'Walnut family dining for 14', 'Wool runners in three corridors', 'Najdi-craft brass-inlay panels'],
    highlightItemsAr: ['مجلس رجال لستّة عشر بمخمل عميق', 'طاولة طعام عائلية جوز لأربعة عشر', 'ممرات سجاد صوف في ثلاثة مماشي', 'ألواح نجدية بمطعّمات نُحاسية'],
    roomViews: [
      {art: 'cocoon',       nameEn: 'Men\'s Majlis',     nameAr: 'مجلس الرجال'},
      {art: 'najdi-warm',   nameEn: 'Women\'s Majlis',   nameAr: 'مجلس النساء'},
      {art: 'long-evening', nameEn: 'Family Dining',     nameAr: 'مأكل العائلة'},
      {art: 'clay-brass',   nameEn: 'Family Living',     nameAr: 'صالة العائلة'},
      {art: 'cocoon',       nameEn: 'Master Suite',      nameAr: 'الجناح الرئيسي'},
      {art: 'warm-hub',     nameEn: 'Kitchen',           nameAr: 'المطبخ'},
    ],
  },

  // 5 — Riyadh open-living villa (small/mid)
  {
    id: 'open-living-3br-villa',
    category: 'residential',
    vertical: 'home',
    city: 'Riyadh',
    district: 'Al-Yasmin',
    areaM2: 230,
    rooms: 9,
    budget: 196_000,
    retailEquivalent: 226_400,
    deliveredDays: 27,
    itemCount: 38,
    supplierCount: 5,
    conceptName: 'Open Living',
    conceptArt: 'open-living',
    paletteHex: ['#F4EFE6', '#FAFAF7', '#DDD3C3', '#B8552E', '#1F1A14'],
    titleEn: 'A First Family Home, Made for Sundays',
    titleAr: 'أوّل بيت عائلي، مصنوع للأحد',
    clientLabelEn: 'Young family · 3-bedroom villa',
    clientLabelAr: 'عائلة شابّة · فيلا بثلاث غرف',
    taglineEn: 'Soft boundaries, family-first, bright — the kitchen is where everything happens.',
    taglineAr: 'حدود ناعمة، عائلة أولاً، مُشرقة — المطبخ هو حيث يحدث كل شيء.',
    storyEn: 'Their first home together. Two children under five and a third on the way. They wanted "where everyone can see each other." We collapsed the kitchen, dining, and family living into one open volume, with a 3-metre island as the social anchor. Hijazi shutters in every room let the light in but keep the heat out.',
    storyAr: 'بيتهم الأوّل معاً. طفلان دون الخامسة وثالثٌ في الطريق. أرادوا "حيث يرى الجميع بعضهم". دمجنا المطبخ والطعام والصالة في فضاء مفتوح واحد، مع جزيرة بثلاثة أمتار كمحور اجتماعي. شيش حجازي في كل غرفة يُدخل النور ويحجز الحرّ.',
    verdictEn: 'The kitchen island has held breakfasts, homework, three birthday parties, and a baptism dinner. It is the house.',
    verdictAr: 'حملت جزيرة المطبخ فطوراً، وواجبات بيت، وثلاثة حفلات ميلاد، وعشاء عميد. هي البيت.',
    inspirations: [
      {art: 'open-living',  captionEn: 'Open kitchen-living-dining',           captionAr: 'مطبخ-صالة-طعام مفتوح'},
      {art: 'bright-morn',  captionEn: 'Pale oak floors, white-oak island',    captionAr: 'أرضيات بلوط فاتح، جزيرة بلوط أبيض'},
      {art: 'spare-craft',  captionEn: 'Sturdy furniture for sticky fingers',  captionAr: 'أثاث متين للأصابع اللزجة'},
      {art: 'daylight-bed', captionEn: 'Soft, calm bedrooms',                   captionAr: 'غرف نوم ناعمة وهادئة'},
    ],
    highlightItemsEn: ['3m oak kitchen island with seating for 6', 'Stain-resistant linen sectional', 'Built-in playroom storage', 'Hijazi shutters across 7 windows'],
    highlightItemsAr: ['جزيرة مطبخ بلوط بثلاثة أمتار وستّة مقاعد', 'كنبة كتّان مقاوم للبقع', 'تخزين مدمج في غرفة الألعاب', 'شيش حجازي عبر سبع نوافذ'],
    roomViews: [
      {art: 'open-living',   nameEn: 'Open Living',     nameAr: 'الصالة المفتوحة'},
      {art: 'warm-hub',      nameEn: 'Kitchen Island',  nameAr: 'جزيرة المطبخ'},
      {art: 'bright-morn',   nameEn: 'Family Dining',   nameAr: 'مأكل العائلة'},
      {art: 'daylight-bed',  nameEn: 'Master Bedroom',  nameAr: 'غرفة النوم الرئيسية'},
      {art: 'najdi-warm',    nameEn: 'Kids\' Room',     nameAr: 'غرفة الأطفال'},
    ],
  },

  // 6 — Cafe (commercial)
  {
    id: 'boutique-cafe-dq',
    category: 'commercial',
    vertical: 'cafe',
    city: 'Riyadh',
    district: 'Diplomatic Quarter',
    areaM2: 120,
    rooms: 6,
    budget: 380_000,
    retailEquivalent: 442_000,
    deliveredDays: 26,
    itemCount: 52,
    supplierCount: 6,
    conceptName: 'Modern Najdi · Cafe',
    conceptArt: 'clay-brass',
    paletteHex: ['#B8552E', '#B89968', '#1A1F2E', '#F4EFE6', '#1F1A14'],
    titleEn: 'Boutique Cafe — Specialty Coffee, Najdi Mood',
    titleAr: 'مقهى بوتيك — قهوة مختصّة، روح نجدية',
    clientLabelEn: 'Specialty coffee chain · second branch',
    clientLabelAr: 'سلسلة قهوة مختصّة · الفرع الثاني',
    taglineEn: 'A second branch where the brand grows up — Najdi geometry meets coffee bar craft.',
    taglineAr: 'فرع ثانٍ تنضج فيه العلامة — هندسة نجدية تلتقي حِرفة بار القهوة.',
    storyEn: 'Their first cafe was a college-town success — bright, casual, Instagram-friendly. The DQ branch needed to feel grown-up: diplomats at lunch, families at sunset. We anchored the bar in walnut, layered Najdi-pattern wool rugs in the sit-down area, and used brass pendants to mark the social heart. Their full brand profile was locked before design started.',
    storyAr: 'فرعهم الأوّل كان نجاحاً جامعياً — مُشرقاً، عفوياً، مناسباً للإنستغرام. احتاج فرع الحيّ الدبلوماسي روحاً أنضج: دبلوماسيون عند الغداء، عائلات عند الغروب. ركّزنا البار بخشب الجوز، طبّقنا سجادات نجدية النقش في منطقة الجلوس، واستخدمنا إنارات نُحاسية لتمييز القلب الاجتماعي. أُقفل ملفّ علامتهم قبل بدء التصميم.',
    verdictEn: 'Sales per square metre on day thirty matched our flagship at year two. We have already signed for branches three and four.',
    verdictAr: 'مبيعاتنا للمتر المربّع في اليوم الثلاثين سارت في الفرع الرئيسي في عامه الثاني. وقّعنا فعلاً للفرعين الثالث والرابع.',
    inspirations: [
      {art: 'clay-brass',     captionEn: 'Walnut bar, brass espresso machine',     captionAr: 'بار جوز، آلة إسبريسو نُحاس'},
      {art: 'najdi-warm',     captionEn: 'Najdi-pattern wool rugs in seating zone', captionAr: 'سجاد صوف نجدي النقش في الجلسات'},
      {art: 'long-evening',   captionEn: 'Pendant cluster over the long table',     captionAr: 'تجمّع إنارات فوق الطاولة الطويلة'},
      {art: 'open-living',    captionEn: 'Outdoor terrace with low seating',        captionAr: 'تراس خارجي بجلسة منخفضة'},
    ],
    highlightItemsEn: ['Walnut bar — 4m linear', '8 banquette seats in clay velvet', 'Brass-pendant cluster over the long table', 'Najdi-pattern wool rugs (×3)'],
    highlightItemsAr: ['بار جوز بطول أربعة أمتار', 'ثمانية مقاعد بانكيت بمخمل لون الطين', 'تجمّع إنارات نُحاسية فوق الطاولة الطويلة', 'سجاد صوف نجدي النقش (×3)'],
    roomViews: [
      {art: 'clay-brass',    nameEn: 'Bar',           nameAr: 'البار'},
      {art: 'najdi-warm',    nameEn: 'Seating',       nameAr: 'الجلسات'},
      {art: 'long-evening',  nameEn: 'Long Table',    nameAr: 'الطاولة الطويلة'},
      {art: 'warm-hub',      nameEn: 'Kitchen',       nameAr: 'المطبخ'},
      {art: 'open-living',   nameEn: 'Terrace',       nameAr: 'التراس'},
    ],
  },

  // 7 — Dental clinic (commercial)
  {
    id: 'workshop-dental-clinic',
    category: 'commercial',
    vertical: 'clinic',
    city: 'Riyadh',
    district: 'Olaya',
    areaM2: 150,
    rooms: 8,
    budget: 420_000,
    retailEquivalent: 488_000,
    deliveredDays: 30,
    itemCount: 44,
    supplierCount: 7,
    conceptName: 'Workshop Quiet · Clinic',
    conceptArt: 'quiet-workshop',
    paletteHex: ['#DDD3C3', '#FAFAF7', '#3D4A6B', '#B8552E', '#1F1A14'],
    titleEn: 'A Dental Clinic That Doesn\'t Smell Like One',
    titleAr: 'عيادة أسنان لا تشبه عيادة',
    clientLabelEn: 'Boutique dental practice · Olaya',
    clientLabelAr: 'عيادة أسنان بوتيك · العليا',
    taglineEn: 'Clinical-grade hygiene under crafted, hospitality-grade calm.',
    taglineAr: 'تعقيم بمستوى طبّي، تحت هدوء وحرفة بمستوى الضيافة.',
    storyEn: 'A dentist who hated his old practice — fluorescent lighting, plastic chairs, the smell. He wanted patients to walk in and not realize where they were until the chair reclined. We built reception around limestone and ash, treatment rooms with discreet stone vanities, and warm-temp LED lighting throughout. Brand profile locked twice — once for visual, once for the consult-room voice.',
    storyAr: 'طبيب يكره عيادته القديمة — إنارة فلوريسنت، كراسي بلاستيك، الرائحة. أراد أن يدخل المريض ولا يدرك أين هو حتى يميل الكرسي. بنينا الاستقبال حول الحجر والحُور، وغرف العلاج بأحواض حجرية متحفّظة، وإنارة LED بدرجة دافئة في الكل. أُقفل ملفّ العلامة مرّتين — مرّة للبصر، ومرّة لصوت غرفة الاستشارة.',
    verdictEn: 'Patient bookings doubled in the first quarter. Three referrals came specifically because of the space.',
    verdictAr: 'تضاعف عدد الحجوزات في الربع الأوّل. ثلاث إحالات جاءت تحديداً بسبب المكان.',
    inspirations: [
      {art: 'quiet-workshop', captionEn: 'Limestone reception, no plastic',          captionAr: 'استقبال حجري، بلا بلاستيك'},
      {art: 'stone-cool',     captionEn: 'Treatment-room stone vanities',             captionAr: 'أحواض حجرية في غرف العلاج'},
      {art: 'spare-craft',    captionEn: 'Brass + ash detailing throughout',          captionAr: 'تفاصيل نُحاس وحُور في كامل المساحة'},
      {art: 'daylight-bed',   captionEn: 'Warm LED at 2700K, calming',                captionAr: 'إنارة LED دافئة 2700K، مُهدِّئة'},
    ],
    highlightItemsEn: ['Limestone reception desk, custom 4m', 'Stone vanity in 4 treatment rooms', 'Acoustic ash-slat ceiling', 'Brass-tip task lighting'],
    highlightItemsAr: ['مكتب استقبال حجري مخصّص بطول أربعة أمتار', 'حوض حجري في أربع غرف علاج', 'سقف صوتي بألواح حُور', 'إنارة عمل بأطراف نُحاسية'],
    roomViews: [
      {art: 'quiet-workshop', nameEn: 'Reception',      nameAr: 'الاستقبال'},
      {art: 'stone-cool',     nameEn: 'Treatment 1',    nameAr: 'علاج 1'},
      {art: 'spare-craft',    nameEn: 'Consult Room',   nameAr: 'غرفة الاستشارة'},
      {art: 'daylight-bed',   nameEn: 'Recovery',       nameAr: 'الاستشفاء'},
      {art: 'stone-cool',     nameEn: 'Bath',           nameAr: 'الحمّام'},
    ],
  },

  // 8 — Co-working office floor (commercial)
  {
    id: 'kafd-coworking-floor',
    category: 'commercial',
    vertical: 'office',
    city: 'Riyadh',
    district: 'KAFD',
    areaM2: 200,
    rooms: 11,
    budget: 580_000,
    retailEquivalent: 671_000,
    deliveredDays: 35,
    itemCount: 64,
    supplierCount: 8,
    conceptName: 'Open Living · Office',
    conceptArt: 'open-living',
    paletteHex: ['#F4EFE6', '#DDD3C3', '#B89968', '#3D4A6B', '#1F1A14'],
    titleEn: 'A Co-working Floor That Feels Like a Living Room',
    titleAr: 'طابق عمل مشترك يشبه صالة منزلية',
    clientLabelEn: 'Boutique co-working operator · second floor',
    clientLabelAr: 'مُشغِّل مساحات عمل بوتيك · الطابق الثاني',
    taglineEn: 'Members expect a recognizable feel across every floor and city — we delivered the second one.',
    taglineAr: 'يتوقّع الأعضاء شعوراً مألوفاً عبر كل طابق ومدينة — سلّمنا الطابق الثاني.',
    storyEn: 'They had one beautiful floor in DQ and signed an aggressive expansion plan. Brand profile arrived on day one and never wavered. We delivered phone rooms in walnut and linen, an open-plan working zone with limestone floors, a director\'s office, a dedicated boardroom, a pantry that runs five hours a day, and a quiet prayer room — all on-brand.',
    storyAr: 'كان لديهم طابق جميل في الحيّ الدبلوماسي ووقّعوا خطّة توسّع طموحة. وصل ملفّ العلامة في اليوم الأوّل ولم يهتزّ. سلّمنا غرف هاتف بالجوز والكتّان، ومنطقة عمل مفتوحة بأرضيات حجرية، ومكتباً مديريّاً، وقاعة اجتماعات مخصّصة، ومُؤونة تعمل خمس ساعات يومياً، ومُصلَّى هادئاً — كلّها على الهويّة.',
    verdictEn: 'Member NPS of the second floor matched the first within forty-five days. Brand profile holds.',
    verdictAr: 'صافي ولاء الأعضاء في الطابق الثاني ساوى الأوّل خلال خمسة وأربعين يوماً. الملفّ ثابت.',
    inspirations: [
      {art: 'open-living',    captionEn: 'Limestone open plan, soft seating',         captionAr: 'فضاء مفتوح حجري، جلوس ناعم'},
      {art: 'spare-craft',    captionEn: 'Phone rooms — walnut and acoustic linen',   captionAr: 'غرف هاتف — جوز وكتّان صوتي'},
      {art: 'ink-stone',      captionEn: 'Boardroom · midnight wall, limestone',      captionAr: 'قاعة اجتماعات · جدار ليلي، حجر'},
      {art: 'najdi-geom',     captionEn: 'Najdi-craft prayer-room screen',            captionAr: 'مشربية مُصلَّى نجدية حِرفية'},
    ],
    highlightItemsEn: ['8 walnut phone rooms with acoustic linen', 'Limestone communal table for 14', 'Boardroom with built-in walnut media wall', 'Najdi-craft mashrabiya prayer-room screen'],
    highlightItemsAr: ['ثماني غرف هاتف بالجوز وكتّان صوتي', 'طاولة مشتركة حجرية لأربعة عشر', 'قاعة اجتماعات بجدار وسائط جوز مدمج', 'مشربية مُصلَّى نجدية حِرفية'],
    roomViews: [
      {art: 'open-living',    nameEn: 'Open Plan',      nameAr: 'مساحة العمل المفتوحة'},
      {art: 'spare-craft',    nameEn: 'Phone Rooms',    nameAr: 'غرف الهاتف'},
      {art: 'ink-stone',      nameEn: 'Boardroom',      nameAr: 'قاعة الاجتماعات'},
      {art: 'warm-hub',       nameEn: 'Pantry',         nameAr: 'المُؤونة'},
      {art: 'najdi-geom',     nameEn: 'Prayer Room',    nameAr: 'المُصلَّى'},
      {art: 'quiet-workshop', nameEn: 'Director\'s Office', nameAr: 'مكتب المدير'},
    ],
  },
];

export {artTreatments};
