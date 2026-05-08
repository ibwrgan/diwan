import {Link} from '@/i18n/navigation';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  inverse?: boolean;
  showMark?: boolean;
};

const sizeMap = {
  sm: {text: 'text-[14px]', mark: 'h-6 w-6'},
  md: {text: 'text-[16px]', mark: 'h-7 w-7'},
  lg: {text: 'text-[22px]', mark: 'h-9 w-9'},
};

export function Wordmark({size = 'md', asLink = true, inverse = false, showMark = true}: Props) {
  const s = sizeMap[size];
  const cls = `wordmark ${s.text} ${inverse ? 'text-sand-100' : 'text-ink'}`;
  const inner = (
    <>
      {showMark && (
        <span className={`${s.mark} ${inverse ? 'text-clay-400' : 'text-clay-700'}`} aria-hidden>
          <DiwanMark />
        </span>
      )}
      <span className="tracking-[0.2em] font-semibold">DIWAN</span>
      <span className={`ar font-bold ${inverse ? '!text-clay-400' : ''}`}>ديوان</span>
    </>
  );
  if (asLink) {
    return (
      <Link href="/" className={cls} aria-label="Diwan home">
        {inner}
      </Link>
    );
  }
  return <span className={cls}>{inner}</span>;
}

function DiwanMark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-full w-full">
      <path d="M10 56 V28 a22 22 0 0 1 44 0 V56" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path d="M20 56 V32 a12 12 0 0 1 24 0 V56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M27 46 q5 -2 10 0 q-1 4 -5 4 q-4 0 -5 -4 z" fill="currentColor" />
      <line x1="6" y1="56" x2="58" y2="56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
