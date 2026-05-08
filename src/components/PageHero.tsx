type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  variant?: 'sand' | 'midnight';
};

export function PageHero({eyebrow, title, lede, variant = 'sand'}: Props) {
  const isMidnight = variant === 'midnight';
  return (
    <section className={`${isMidnight ? 'midnight' : ''} pt-28 md:pt-36 pb-20 md:pb-28 ${!isMidnight ? 'border-b border-ink-12' : ''}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="h-display">{title}</h1>
        </div>
        <div className="lg:col-span-5 flex items-end">
          <p className="lede max-w-[520px]">{lede}</p>
        </div>
      </div>
    </section>
  );
}
