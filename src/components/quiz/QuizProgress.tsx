type Props = {
  current: number; // 0-indexed
  total: number;
  answered: Set<number>;
};

export function QuizProgress({current, total, answered}: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({length: total}).map((_, i) => {
        const isCurrent = i === current;
        const isAnswered = answered.has(i);
        return (
          <span
            key={i}
            className={[
              'h-1 rounded-full transition-all duration-300',
              isCurrent ? 'w-8 bg-clay-700' : isAnswered ? 'w-4 bg-clay-700/50' : 'w-4 bg-ink-12',
            ].join(' ')}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
