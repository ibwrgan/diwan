import {artTreatments} from '@/data/quiz';

type Props = {
  art: string;
  label: string;
  tags: string[];
  selected?: boolean;
};

// A branded "art panel" used for visual A/B questions. Day 5 can swap the
// gradient for an AI-generated reference photo without changing the API.
export function ArtPanel({art, label, tags, selected}: Props) {
  const t = artTreatments[art] ?? artTreatments['stone-cool'];

  return (
    <div
      style={{background: t.bg}}
      className={[
        'group relative aspect-[4/5] w-full overflow-hidden rounded-sm cursor-pointer',
        'transition-all duration-300',
        selected
          ? 'ring-2 ring-clay-700 ring-offset-4 ring-offset-sand-100 scale-[1.01]'
          : 'ring-1 ring-ink-12 hover:ring-ink-40',
      ].join(' ')}
    >
      {/* Decorative motif layer */}
      <Motif kind={t.motif} />

      {/* Bottom gradient for label legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent pointer-events-none" />

      {/* Selected check */}
      {selected && (
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-clay-700 text-sand-100 flex items-center justify-center font-serif font-bold text-lg shadow-lg">
          ✓
        </div>
      )}

      {/* Label + tags */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col gap-2.5 text-sand-100">
        <h3 className="font-serif font-bold leading-tight" style={{fontSize: 'clamp(20px, 2.6vw, 28px)'}}>
          {label}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-sand-100/15 backdrop-blur-sm font-sans uppercase"
              style={{fontSize: '10px', letterSpacing: '0.14em'}}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Motif({kind}: {kind: 'arch' | 'grid' | 'horizon' | 'rays' | 'block'}) {
  if (kind === 'arch') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d="M40 220 V120 a60 60 0 0 1 120 0 V220" stroke="currentColor" strokeWidth="0.6" fill="none" className="text-sand-100" />
        <path d="M60 220 V130 a40 40 0 0 1 80 0 V220" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-sand-100" />
        <path d="M80 220 V140 a20 20 0 0 1 40 0 V220" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-sand-100" />
      </svg>
    );
  }
  if (kind === 'grid') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="g1" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" />
            <path d="M0 0 L10 10 L0 20 M20 0 L10 10 L20 20" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-sand-100" />
          </pattern>
        </defs>
        <rect width="200" height="250" fill="url(#g1)" />
      </svg>
    );
  }
  if (kind === 'horizon') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <line x1="0" y1="80" x2="200" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-ink" />
        <line x1="0" y1="120" x2="200" y2="120" stroke="currentColor" strokeWidth="0.3" className="text-ink" />
        <line x1="0" y1="160" x2="200" y2="160" stroke="currentColor" strokeWidth="0.3" className="text-ink" />
      </svg>
    );
  }
  if (kind === 'rays') {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({length: 12}).map((_, i) => (
          <line
            key={i}
            x1="100" y1="100"
            x2={100 + Math.cos((i / 12) * Math.PI * 2) * 200}
            y2={100 + Math.sin((i / 12) * Math.PI * 2) * 200}
            stroke="currentColor" strokeWidth="0.3" className="text-sand-100"
          />
        ))}
      </svg>
    );
  }
  // block
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect x="40" y="40" width="120" height="170" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-sand-100" />
      <rect x="60" y="60" width="80" height="130" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-sand-100" />
    </svg>
  );
}
