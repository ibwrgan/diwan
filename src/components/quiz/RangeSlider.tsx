'use client';

type Props = {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  rangeLabel: {min: string; max: string};
};

export function RangeSlider({value, onChange, min, max, step, formatValue, rangeLabel}: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-center">
        <span
          className="font-serif font-bold tabular text-clay-700"
          style={{fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: 1}}
        >
          {formatValue(value)}
        </span>
      </div>

      <div className="relative pt-2 pb-4">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-ink-12 rounded-full" />
        {/* Fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-clay-700 rounded-full rtl:right-0 ltr:left-0"
          style={{width: `${pct}%`}}
        />
        {/* Native input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-8 appearance-none bg-transparent cursor-grab active:cursor-grabbing
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-clay-700
                     [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-sand-100
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-clay-700
                     [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-sand-100
                     [&::-moz-range-thumb]:cursor-grab"
        />
      </div>

      <div className="flex justify-between font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
        <span>{rangeLabel.min}</span>
        <span>{rangeLabel.max}</span>
      </div>
    </div>
  );
}
