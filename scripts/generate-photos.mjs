#!/usr/bin/env node
// Generates Diwan-styled photos for case studies and inspiration sets
// using Replicate (Flux). Reads keys from .env.local.
//
// Usage:  npm run generate-photos
//         npm run generate-photos -- --force            (regenerate even if files exist)
//         npm run generate-photos -- --only=projects    (just case-study heroes)
//         npm run generate-photos -- --only=exteriors   (building exteriors)
//         npm run generate-photos -- --only=rooms       (per-room photos)
//         npm run generate-photos -- --only=closeups    (material macro detail shots)
//         npm run generate-photos -- --only=inspirations
//         npm run generate-photos -- --id=hittin-townhouse-riyadh   (one project across all passes)
//
// Cost at current Replicate pricing (12 case studies):
//   Flux 1.1 Pro  ≈ $0.04/image (heroes 12 + exteriors 12 = $0.96)
//   Flux Schnell  ≈ $0.003/image (rooms ≈70, closeups 36, inspirations 18 ≈ $0.37)
//   Total ≈ $1.35

import Replicate from 'replicate';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname} from 'node:path';

const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) {
  console.error('\n❌  REPLICATE_API_TOKEN not set.\n   Add it to .env.local in the project root, then re-run.\n');
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const ONLY = [...args].find((a) => a.startsWith('--only='))?.split('=')[1];
const ONLY_ID = [...args].find((a) => a.startsWith('--id='))?.split('=')[1];
const matchesId = (id) => !ONLY_ID || id === ONLY_ID;

const replicate = new Replicate({auth: TOKEN});

// -----------------------------------------------------------------------------
// Case studies — one hero photo each (used on /projects cards + modal hero)
// -----------------------------------------------------------------------------

const PROJECTS = [
  {
    id: 'najdi-villa-nakheel',
    prompt:
      "Editorial photograph of a contemporary Saudi villa men's majlis in Modern Najdi style. " +
      "Layered low seating in clay velvet around the perimeter. Carved cedar mashrabiya screens. " +
      "Najdi-pattern wool rug in the centre. Brass pendant cluster overhead. Walnut and travertine. " +
      "Warm directional natural light from a single high window. Architectural interior photography, " +
      "35mm, soft contrast, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'coastal-jeddah-corniche',
    prompt:
      "Editorial photograph of a Hijazi-coastal apartment living interior in Jeddah. " +
      "Pale ash floors. Travertine 6-seat dining table beside an open kitchen. Linen sofa in bone. " +
      "Hijazi pale-wood shutters in front of a Red Sea view. Brass-tip ash kitchen pulls. " +
      "Soft daylight, sea breeze ambience. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'riyadh-contemporary-penthouse',
    prompt:
      "Editorial photograph of a high-floor penthouse interior in Riyadh, twenty stories above Olaya. " +
      "Limestone floors throughout. Travertine 4m sectional sofa. A single Najdi-craft sculptural bench " +
      "by the entrance. Floor-to-ceiling Hijazi shutters. Minimal, composed, quiet. " +
      "Soft directional daylight. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'cocoon-family-compound',
    prompt:
      "Editorial photograph of a Saudi family compound men's majlis interior. " +
      "16-seat ceremonial seating in deep midnight velvet. Walnut everywhere. Heavy wool rugs. " +
      "Brass-inlay accent panels behind the seating. Warm-tone evening lighting. Najdi craft details. " +
      "Architectural interior photography, dramatic shadows, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'open-living-3br-villa',
    prompt:
      "Editorial photograph of a Saudi family open-plan living interior. " +
      "3-metre oak kitchen island as social anchor with seating for six. Stain-resistant linen sectional " +
      "in family-room area. Pale ash floors. Hijazi shutters across windows. Bright morning light. " +
      "Family-first, soft boundaries. Architectural interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'boutique-cafe-dq',
    prompt:
      "Editorial photograph of a boutique specialty coffee cafe interior in Riyadh's Diplomatic Quarter. " +
      "Walnut bar, 4 metres linear, with a brass espresso machine. 8 banquette seats in clay velvet. " +
      "Brass pendant cluster over a long communal table. Najdi-pattern wool rugs in the seating zone. " +
      "Late-afternoon golden light. Interior photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'workshop-dental-clinic',
    prompt:
      "Editorial photograph of a boutique dental clinic reception interior in Olaya, Riyadh. " +
      "Limestone reception desk, 4 metres custom. Ash slat acoustic ceiling. Brass-tip task lighting. " +
      "Stone vanity in a treatment room visible through a half-open doorway. " +
      "Warm 2700K LED lighting throughout. Calming, hospitality-grade quiet — no fluorescent tubes, " +
      "no plastic, no clinical sterility. Interior architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'kafd-coworking-floor',
    prompt:
      "Editorial photograph of a boutique co-working floor interior in Riyadh's KAFD. " +
      "Limestone open-plan workspace. Walnut phone rooms with acoustic linen panels visible. " +
      "Communal limestone table for fourteen. Soft daylight from full-height windows. " +
      "Brass and ash detailing throughout. Quiet, focused, brand-coherent. " +
      "Interior architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'hittin-townhouse-riyadh',
    prompt:
      "Editorial photograph of a young Saudi family's family-living interior in a Hittin townhouse, Riyadh. " +
      "Bone-toned walls, clay-velvet 3-seat sofa, a single carved cedar mashrabiya feature wall in the entry, " +
      "white-oak cabinetry visible at the kitchen edge, soft Najdi-pattern rug. Calm, refined, low-key. " +
      "Soft morning light. Interior architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'olaya-roastery-riyadh',
    prompt:
      "Editorial photograph of a specialty-coffee roastery cafe interior on Olaya Street, Riyadh. " +
      "9-seat brass-and-walnut bar, polished concrete floor with a brass inlay marking the queue, " +
      "Najdi-geometric acoustic ceiling treatment overhead, glass-walled roasting room visible at the back, " +
      "small whole-bean retail wall on one side. Industrial-Najdi mood. Late-afternoon directional light. " +
      "Interior architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'bujairi-heritage-cafe',
    prompt:
      "Editorial photograph of a heritage cafe interior near Al-Bujairi, Riyadh. " +
      "Hand-poured mud-plaster walls in three custom Najdi tones, low-majlis seating in clay-wool cushions, " +
      "copper-clad dallah pour station as focal point, carved cedar mashrabiya screens on the windows, " +
      "warm earth palette. Late-afternoon golden light. Interior architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'kafd-private-office',
    prompt:
      "Editorial photograph of a private investment-firm boardroom interior on a single-tenant KAFD floor, Riyadh. " +
      "Limestone floor, midnight-wool upholstered walls, walnut boardroom table for twelve, brushed-bronze " +
      "linear pendants, no logos, no glass partitions. Calm, grown-up, ceremonial weight. " +
      "Soft late-morning daylight from full-height windows. Interior architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
];

// -----------------------------------------------------------------------------
// Building exteriors (1 per project)
// -----------------------------------------------------------------------------

const EXTERIORS = [
  {
    id: 'najdi-villa-nakheel',
    prompt:
      "Editorial architectural photograph of a contemporary Saudi family villa exterior in Riyadh's Al-Nakheel district. " +
      "Sand-coloured stone walls with carved geometric Najdi patterns, modest arched windows with brass-detail frames, " +
      "low date palms in the front, a paved limestone driveway. Golden-hour light. Architectural photography, " +
      "35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'coastal-jeddah-corniche',
    prompt:
      "Editorial architectural photograph of a modern Jeddah apartment building exterior near the Red Sea corniche. " +
      "Pale travertine cladding, recessed Hijazi-style wood shutters on every floor, generous balconies overlooking " +
      "the sea. Soft afternoon light. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'riyadh-contemporary-penthouse',
    prompt:
      "Editorial architectural photograph at twilight from a penthouse balcony in Riyadh's Olaya district, looking " +
      "across the city skyline. Limestone parapet, glass railing, the building's brass-trimmed roof structure visible. " +
      "Sunset over the city below. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'cocoon-family-compound',
    prompt:
      "Editorial architectural photograph of a large Saudi multi-generational family compound exterior in Riyadh's " +
      "Diplomatic Quarter. Two-storey villa, sand-stone walls, deep-set windows, a covered entrance with carved cedar " +
      "mashrabiya screen, mature trees in the courtyard. Late-afternoon golden light. Architectural photography, " +
      "35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'open-living-3br-villa',
    prompt:
      "Editorial architectural photograph of a modern Saudi 3-bedroom family villa exterior in Riyadh's Al-Yasmin. " +
      "White stucco facade, full-height Hijazi shutters, low-key entrance with a single olive tree in the front yard, " +
      "warm afternoon light. Architectural photography, 35mm, ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'boutique-cafe-dq',
    prompt:
      "Editorial architectural photograph of a boutique specialty coffee cafe storefront in Riyadh's Diplomatic " +
      "Quarter at dusk. Walnut-framed glass facade, warm brass-tinted interior visible through the windows, a single " +
      "minimal Arabic-and-Latin wordmark on the wall, low banquette seating glimpsed inside, a small outdoor terrace " +
      "with two cane chairs. Late-afternoon golden light. Architectural photography, 35mm, ultra-sharp, no text " +
      "watermark, no people.",
  },
  {
    id: 'workshop-dental-clinic',
    prompt:
      "Editorial architectural photograph of a boutique dental clinic exterior in Olaya, Riyadh. Limestone facade, " +
      "frosted glass entry, a single ash-wood door with brass handle, a small olive tree planter, calm refined " +
      "presence. No clinical signage, no medical iconography. Soft daylight. Architectural photography, 35mm, " +
      "ultra-sharp, no text, no people, no watermark.",
  },
  {
    id: 'kafd-coworking-floor',
    prompt:
      "Editorial architectural photograph of the entrance lobby on the second floor of a boutique co-working space " +
      "in Riyadh's KAFD. Warm walnut reception desk, limestone floor, large picture window overlooking the KAFD " +
      "skyline, brass and ash detailing. Soft late-morning daylight. Architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'hittin-townhouse-riyadh',
    prompt:
      "Editorial architectural photograph of a contemporary Saudi family townhouse exterior in Riyadh's Hittin " +
      "district. Bone-stucco facade, recessed Hijazi shutters, a small olive tree in a stone planter, brass-trimmed " +
      "entry door, low-key restrained presence. Late-afternoon light. Architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
  {
    id: 'olaya-roastery-riyadh',
    prompt:
      "Editorial architectural photograph of a specialty-coffee roastery storefront on Olaya Street, Riyadh, at dusk. " +
      "Walnut-and-brass framed glass facade, warm interior glow visible through the windows, a single minimal " +
      "Arabic-and-Latin wordmark, polished concrete spilling out to the pavement, two cane stools at the threshold. " +
      "Golden-hour light. Architectural photography, 35mm, ultra-sharp, no text watermark, no people.",
  },
  {
    id: 'bujairi-heritage-cafe',
    prompt:
      "Editorial architectural photograph of a heritage cafe storefront near Al-Bujairi, Riyadh. " +
      "Hand-poured mud-plaster facade in warm Najdi tones, recessed carved-cedar door, carved-cedar window screens, " +
      "low date palms in stone planters, lantern wall sconces, soft pavement seating. Late-afternoon golden light. " +
      "Architectural photography, 35mm, ultra-sharp, no text watermark, no people.",
  },
  {
    id: 'kafd-private-office',
    prompt:
      "Editorial architectural photograph from inside a single-tenant KAFD floor entry vestibule, Riyadh. " +
      "Limestone floor, walnut-paneled vestibule walls, brushed-bronze elevator surround visible, no signage, " +
      "city skyline through a tall window. Soft late-morning daylight. Architectural photography, 35mm, ultra-sharp, " +
      "no text, no people, no watermark.",
  },
];

// -----------------------------------------------------------------------------
// Per-room photos for each project (saved as rooms/01.jpg, 02.jpg, ...)
// Order matches study.roomViews in src/data/projects.ts
// -----------------------------------------------------------------------------

const ROOM_PROMPTS = {
  'najdi-villa-nakheel': {
    style: "Modern Najdi style. Carved cedar mashrabiya, brass pendants, walnut and travertine, layered Najdi-pattern wool rugs, warm clay velvet upholstery",
    rooms: [
      "Men's majlis with low ceremonial seating around the perimeter",
      "Family living room with sectional sofa and TV unit",
      "Dining room with long walnut table for eight under a brass pendant cluster",
      "Master bedroom with upholstered headboard and warm clay tones",
      "Prayer niche with a wool rug and recessed mihrab",
      "Family kitchen with walnut cabinetry and a 3-metre travertine island",
    ],
  },
  'coastal-jeddah-corniche': {
    style: "Coastal Hijazi style. Pale ash floors, travertine surfaces, bone-linen upholstery, Hijazi pale-wood shutters, brass-tip ash detailing",
    rooms: [
      "Living room with a bone-linen 3-seat sofa and a sea view",
      "Dining nook with cane chairs around a travertine table",
      "Open kitchen with travertine island and pale ash cabinetry",
      "Master bedroom with linen headboard and ivory walls",
      "Bathroom with a travertine vanity and brass fixtures",
    ],
  },
  'riyadh-contemporary-penthouse': {
    style: "Riyadh Contemporary minimalism. Limestone floors, travertine sectional, Hijazi shutters, single sculptural objects per room, no rugs, brushed brass detailing",
    rooms: [
      "Living room with a 4-metre travertine sectional and a single Najdi-craft entrance bench",
      "Master suite with midnight wall and brushed-brass fittings",
      "Concealed kitchen with stone surfaces and walnut detailing",
      "Library with built-in walnut shelves and a single armchair",
      "Guest bathroom with limestone vanity and minimal fittings",
    ],
  },
  'cocoon-family-compound': {
    style: "Cocoon style. Deep midnight velvet, walnut everywhere, heavy wool rugs, brass-inlay accent panels, layered cushions, warm evening lighting",
    rooms: [
      "Men's majlis with 16-seat deep-velvet ceremonial seating",
      "Women's majlis with softer-velvet seating and brass details",
      "Family dining for fourteen with a long walnut table and brass pendants",
      "Family living with deep-clay sectional and walnut media unit",
      "Master suite with upholstered headboard wall in deep velvet",
      "Family kitchen with walnut cabinetry and a long communal island",
    ],
  },
  'open-living-3br-villa': {
    style: "Open Living style. Pale oak floors, white-oak kitchen island, stain-resistant linen sectional, Hijazi shutters across windows, soft boundaries",
    rooms: [
      "Open living-dining-kitchen volume with a 3-metre oak island",
      "Pale-oak kitchen island with seating for six",
      "Family dining table next to the kitchen island",
      "Master bedroom with linen headboard and pale oak floor",
      "Kids' room with built-in storage and a small desk",
    ],
  },
  'boutique-cafe-dq': {
    style: "Boutique cafe in Modern Najdi mood. Walnut bar, brass espresso machine, layered Najdi rugs, banquette seating in clay velvet, brass pendants",
    rooms: [
      "Walnut bar 4 metres linear with a brass espresso machine centre stage",
      "Banquette seating zone with clay-velvet seats and Najdi-pattern wool rug",
      "Long communal table under a brass pendant cluster",
      "Behind-the-bar working kitchen with stainless surfaces and walnut detailing",
      "Outdoor terrace with low cane seating and brass side tables",
    ],
  },
  'workshop-dental-clinic': {
    style: "Boutique dental clinic in Workshop Quiet style. Limestone reception, ash slat ceiling, brass-tip task lighting, warm 2700K LED, no fluorescent tubes, no clinical iconography",
    rooms: [
      "Limestone reception desk 4 metres custom with brass-tip lamp",
      "Treatment room 1 with stone vanity and ash-wood chair",
      "Consult room with walnut writing desk and two ash armchairs",
      "Recovery room with linen drapes and warm soft light",
      "Patient bathroom with travertine vanity and brass fittings",
    ],
  },
  'kafd-coworking-floor': {
    style: "Boutique co-working in Open Living style. Limestone floors, walnut phone rooms, communal limestone table, full-height windows, brass and ash detailing",
    rooms: [
      "Open-plan workspace with limestone floor and full-height windows",
      "Walnut phone room with acoustic linen panels and brass desk lamp",
      "Boardroom with built-in walnut media wall and limestone table",
      "Pantry with walnut cabinetry, travertine counter, integrated coffee station",
      "Prayer room with Najdi-craft mashrabiya screen and a wool rug",
      "Director's office with walnut desk and a single ash armchair",
    ],
  },
  'hittin-townhouse-riyadh': {
    style: "Soft Najdi townhouse style for a young Riyadh family. Bone-toned walls, clay-velvet seating, white-oak cabinetry, a single carved cedar feature, soft Najdi rugs",
    rooms: [
      "Family living with clay-velvet 3-seat sofa and bone walls",
      "Majlis with 8-seat clay-velvet seating around a Najdi rug",
      "Quiet white-oak kitchen with bone-quartz island",
      "Dining nook with walnut table for six and brass pendant",
      "Master bedroom with linen-upholstered headboard wall",
      "Prayer corner with a small wool rug and recessed niche",
    ],
  },
  'olaya-roastery-riyadh': {
    style: "Industrial-Najdi specialty roastery cafe. Brass-and-walnut bar, polished concrete with brass inlay queue, Najdi-geometric acoustic ceiling, glass-walled roasting room",
    rooms: [
      "9-seat brass-and-walnut coffee bar centre stage",
      "Cafe seating zone with cane chairs on polished concrete",
      "Glass-walled roasting room with venting and a Loring-style roaster",
      "Whole-bean retail wall with magnetic price tags",
      "Najdi-geometric acoustic ceiling close-up overhead",
    ],
  },
  'bujairi-heritage-cafe': {
    style: "Najdi heritage cafe near Diriyah. Hand-poured mud-plaster walls in three tones, low-majlis seating in clay wool, copper-clad coffee station, carved cedar window screens",
    rooms: [
      "Low majlis with clay-wool cushions and mud-plaster walls",
      "Copper-clad coffee station with dallah pour ritual",
      "Tasting corner with a custom palm-leaf tray on a low cedar table",
      "Family booth with carved cedar dividers and warm sconces",
      "Carved cedar window screens with afternoon light filtering through",
      "Pastry counter with palm-leaf trays and stoneware",
    ],
  },
  'kafd-private-office': {
    style: "Private KAFD floor for an investment firm. Limestone, walnut, midnight wool, brushed bronze; no logos, no glass partitions, no plastic",
    rooms: [
      "Client boardroom with midnight-wool walls and limestone floor",
      "Partner office in walnut and brushed bronze",
      "Associate bench in a single 14-metre walnut run",
      "Reception with limestone wall and a single Saudi-art commission",
      "Chef pantry with walnut cabinetry and travertine counter",
      "Prayer suite with carved cedar mihrab and wool rug",
    ],
  },
};

// -----------------------------------------------------------------------------
// Material close-ups (3 per project) — saved as closeups/01.jpg, 02.jpg, 03.jpg
// Tight macro / detail shots that demystify the build quality and the budget.
// -----------------------------------------------------------------------------

const CLOSEUPS = {
  'najdi-villa-nakheel': [
    "Tight macro photograph of a hand-carved cedar mashrabiya panel showing a Najdi geometric pattern. Warm directional light grazing the surface, sharp shadows in the carving. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a brass pendant detail with a warm glow and patina. Aged brass, hand-finished. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a clay-coloured velvet weave with a subtle nap and a hand-stitched seam at the corner of a majlis cushion. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'coastal-jeddah-corniche': [
    "Tight macro photograph of a travertine slab edge with a soft honed finish and a single drop of sea-spray light reflecting at the corner. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of pale ash flooring grain with a single strand of natural light crossing it. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of bone-coloured linen weave on a sectional sofa, showing the warp-and-weft and a piped seam. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'riyadh-contemporary-penthouse': [
    "Tight macro photograph of a honed limestone floor edge meeting a brushed-brass threshold strip. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a brushed-brass cabinet pull on a deep walnut drawer front. Warm reflected light. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a deep midnight-painted wall corner meeting a limestone floor with a single shadow line. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'cocoon-family-compound': [
    "Tight macro photograph of deep midnight velvet weave with a hand-finished piped seam and a single brass-button detail. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a walnut grain panel with hand-rubbed oil finish, showing the rays in the wood. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a brass-inlay strip set into a walnut wall panel. Hand-fitted, polished. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'open-living-3br-villa': [
    "Tight macro photograph of pale-oak floor grain with a small Hijazi-shutter shadow falling across it. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a white-oak kitchen cabinet front with a recessed pull and a quartz countertop edge. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a stain-resistant linen weave on a family-room sectional, showing a hand-piped corner seam. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'boutique-cafe-dq': [
    "Tight macro photograph of a walnut bar top with a hand-rubbed oil finish, showing the grain and a small brass dowel inlay. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a polished brass espresso machine boiler with steam catching the warm afternoon light. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a Najdi-pattern wool rug weave under a banquette, showing the colour layering. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'workshop-dental-clinic': [
    "Tight macro photograph of a limestone reception-desk edge with a brass-tip lamp casting warm light across it. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of an ash-slat acoustic ceiling looking up, showing the spacing rhythm and warm 2700K LED glow. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a brass-tip task-lamp head on a stone-vanity treatment-room counter. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'kafd-coworking-floor': [
    "Tight macro photograph of an acoustic-linen panel inside a walnut phone room, showing the weave and a hand-fitted brass corner trim. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a limestone communal-table edge with a brass-tip pen tray catching the light. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a brass-and-ash detail on a phone-room door pull. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'hittin-townhouse-riyadh': [
    "Tight macro photograph of a clay-velvet sofa weave with a hand-piped seam in bone linen. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a white-oak kitchen cabinet front with a finger-pull detail and a bone-quartz countertop edge. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a small carved cedar mashrabiya feature wall with afternoon light through it. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'olaya-roastery-riyadh': [
    "Tight macro photograph of a brass-and-walnut bar corner with the brass espresso group head visible. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a polished concrete floor with a brass inlay strip marking the queue. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a Najdi-geometric acoustic ceiling tile from below, with warm pendant glow at the edge. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'bujairi-heritage-cafe': [
    "Tight macro photograph of a hand-poured mud-plaster wall surface in three Najdi tones, showing the trowel marks. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a copper-clad coffee station with a dallah resting on it, hand-hammered patina. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a custom palm-leaf tasting tray weave with a date and a small ceramic cup on it. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
  'kafd-private-office': [
    "Tight macro photograph of a walnut partner-desk corner with a brushed-bronze edge inlay. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of midnight-wool boardroom wall upholstery with a hand-piped seam. 35mm macro, ultra-sharp, editorial, no text, no people.",
    "Tight macro photograph of a carved cedar mihrab arch detail in a private prayer suite, soft warm light. 35mm macro, ultra-sharp, editorial, no text, no people.",
  ],
};

// -----------------------------------------------------------------------------
// Inspiration sets — three Diwan-styled responses each (saved as diwan-1/2/3.jpg)
// -----------------------------------------------------------------------------

const INSPIRATIONS = [
  {
    slug: '01-najdi-souls',
    prompts: [
      "Editorial photograph of a contemporary Najdi men's majlis. Carved cedar wall panels, layered seating in earth-tone velvet, brass pendants, wool rug. Warm directional light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Najdi family living room. Brass-inlay accent wall, walnut media unit, layered ottomans, cream linen sectional. Soft afternoon light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Najdi prayer corner with mashrabiya screen. Wool rug, recessed niche, warm lantern light. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '02-grammar-of-space',
    prompts: [
      "Top-down architectural floor plan of a 4-bedroom Saudi villa with separated men's and women's majlis, prayer room aligned to qibla, family living, kitchen, master suite. Clean line drawing, labelled rooms in Arabic and English, parchment background. No text watermark.",
      "Editorial photograph of a Saudi villa entrance hallway showing the spatial logic — men's majlis door on one side, family-living vista on the other, prayer-room door visible at end of hall. Limestone floors, walnut door frames. 35mm, ultra-sharp, no text, no people.",
      "Aerial editorial photograph of a Saudi villa interior at night, lit from within, showing the spatial flow between men's majlis, family living, dining, and outdoor terrace. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '03-the-third-place',
    prompts: [
      "Editorial photograph of a boutique co-working floor in Riyadh. Limestone open plan, walnut phone rooms, communal table for 14, full-height windows. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a single walnut phone room with acoustic linen panels, brass desk lamp, and a single ash chair. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a co-working pantry with walnut cabinetry, travertine counter, brass tap, integrated coffee station. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '04-kitchen-as-stage',
    prompts: [
      "Editorial photograph of a boutique specialty coffee bar in Riyadh — walnut bar 4m linear, brass espresso machine centre stage, leather barstools, layered Najdi-pattern rug behind the seating zone. Late afternoon light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a cafe long communal table under a brass pendant cluster, eight cane chairs, walnut floor, terrazzo accent wall. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a cafe outdoor terrace, low banquette seating in clay velvet, brass side tables, planters, evening string lights. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '05-clinic-as-hospitality',
    prompts: [
      "Editorial photograph of a boutique dental clinic reception in Riyadh — limestone reception desk, ash slat ceiling, brass task lighting, calming earth tones, no fluorescent lighting, no plastic. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a dental treatment room — stone vanity, ash chair, brass-tip lamp, soft warm 2700K LED light, no clinical sterility. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a clinic consult room — walnut writing desk, two ash armchairs, soft linen drapes, framed Saudi art. 35mm, ultra-sharp, no text, no people.",
    ],
  },
  {
    slug: '06-rooms-that-hold',
    prompts: [
      "Editorial photograph of a Saudi family compound men's majlis — 16-seat deep-velvet seating, walnut everywhere, heavy wool rugs, brass-inlay panels. Evening light. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Saudi family dining for fourteen — long walnut table, brass pendant cluster, layered rugs underfoot. Warm winter evening. 35mm, ultra-sharp, no text, no people.",
      "Editorial photograph of a Saudi family living — sectional in deep clay velvet, walnut media unit, layered cushions, brass coffee table. 35mm, ultra-sharp, no text, no people.",
    ],
  },
];

// -----------------------------------------------------------------------------
// Generation helpers
// -----------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate({prompt, outPath, model = 'black-forest-labs/flux-1.1-pro', aspect = '4:3'}) {
  if (!FORCE && existsSync(outPath)) {
    console.log(`× skip (exists)  ${outPath}`);
    return;
  }
  console.log(`→ generating    ${outPath}`);

  // Replicate throttles to 6/min when credit < $5, so we retry on 429 with the
  // server-supplied retry_after (plus a small cushion).
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const output = await replicate.run(model, {
        input: {prompt, aspect_ratio: aspect, output_format: 'jpg', output_quality: 92, safety_tolerance: 2},
      });
      const url = Array.isArray(output) ? String(output[0]) : String(output);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      mkdirSync(dirname(outPath), {recursive: true});
      writeFileSync(outPath, buf);
      console.log(`  ✓ saved ${(buf.length / 1024).toFixed(0)} KB`);
      // Pace requests to stay under the 6-per-minute throttle
      await sleep(11_000);
      return;
    } catch (err) {
      const msg = err?.message ?? String(err);
      const m429 = msg.match(/429/);
      const retryMatch = msg.match(/retry_after"?:\s*(\d+)/i);
      const retryAfter = retryMatch ? Number(retryMatch[1]) + 2 : 12;
      if (m429 && attempt < maxAttempts) {
        console.log(`  · throttled, retrying in ${retryAfter}s (attempt ${attempt}/${maxAttempts})`);
        await sleep(retryAfter * 1000);
        continue;
      }
      console.error(`  ✗ ${msg}`);
      return;
    }
  }
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

const start = Date.now();
console.log('\nDiwan photo generator\n=====================\n');

if (!ONLY || ONLY === 'projects') {
  console.log('Case studies — interior heroes (Flux 1.1 Pro)');
  console.log('---------------------------------------------');
  for (const p of PROJECTS) {
    if (!matchesId(p.id)) continue;
    await generate({
      prompt: p.prompt,
      outPath: `public/projects/${p.id}/hero.jpg`,
      model: 'black-forest-labs/flux-1.1-pro',
      aspect: '4:3',
    });
  }
}

if (!ONLY || ONLY === 'exteriors') {
  console.log('\nCase studies — building exteriors (Flux 1.1 Pro)');
  console.log('------------------------------------------------');
  for (const e of EXTERIORS) {
    if (!matchesId(e.id)) continue;
    await generate({
      prompt: e.prompt,
      outPath: `public/projects/${e.id}/exterior.jpg`,
      model: 'black-forest-labs/flux-1.1-pro',
      aspect: '16:9',
    });
  }
}

if (!ONLY || ONLY === 'rooms') {
  console.log('\nCase studies — per-room photos (Flux Schnell)');
  console.log('---------------------------------------------');
  for (const [id, data] of Object.entries(ROOM_PROMPTS)) {
    if (!matchesId(id)) continue;
    for (let i = 0; i < data.rooms.length; i++) {
      const room = data.rooms[i];
      const prompt =
        `Editorial interior photograph of a ${room}. ${data.style}. ` +
        `Architectural photography, 35mm, soft directional natural light, ultra-sharp, no text, no people, no watermark.`;
      await generate({
        prompt,
        outPath: `public/projects/${id}/rooms/${String(i + 1).padStart(2, '0')}.jpg`,
        model: 'black-forest-labs/flux-schnell',
        aspect: '4:3',
      });
    }
  }
}

if (!ONLY || ONLY === 'closeups') {
  console.log('\nCase studies — material close-ups (Flux Schnell)');
  console.log('-------------------------------------------------');
  for (const [id, prompts] of Object.entries(CLOSEUPS)) {
    if (!matchesId(id)) continue;
    for (let i = 0; i < prompts.length; i++) {
      await generate({
        prompt: prompts[i],
        outPath: `public/projects/${id}/closeups/${String(i + 1).padStart(2, '0')}.jpg`,
        model: 'black-forest-labs/flux-schnell',
        aspect: '1:1',
      });
    }
  }
}

if (!ONLY || ONLY === 'inspirations') {
  console.log('\nInspiration responses (Flux Schnell)');
  console.log('------------------------------------');
  for (const set of INSPIRATIONS) {
    for (let i = 0; i < set.prompts.length; i++) {
      await generate({
        prompt: set.prompts[i],
        outPath: `public/inspirations/${set.slug}/diwan-${i + 1}.jpg`,
        model: 'black-forest-labs/flux-schnell',
        aspect: '4:5',
      });
    }
  }
}

const seconds = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\n✓ Done in ${seconds}s\n`);
