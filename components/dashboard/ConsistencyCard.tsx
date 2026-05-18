interface ConsistencyCardProps {
  locked: boolean;
  currentCount: number;
  requiredCount: number;
  score: number | null;
  loading?: boolean;
  errorMsg?: string;
  onRetry?: () => void;
}

function ConsistencyCard({
  locked,
  currentCount,
  requiredCount,
  score,
  loading,
  errorMsg,
  onRetry,
}: ConsistencyCardProps) {
  if (errorMsg) {
    return (
      <div className="bg-[#f3f5f7] rounded-2xl p-6 flex flex-col gap-3 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Consistency Score</p>
        <p className="text-sm text-[#6b7280] flex-1">Couldn&apos;t load right now.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start text-xs font-medium text-[#0d1f35] border border-[#d1d5db] rounded-full px-3 py-1 hover:bg-white"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#f3f5f7] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Consistency Score</p>
        <span className="text-2xl font-medium text-[#9ca3af] animate-pulse">Loading...</span>
        <div className="w-full bg-[#d1d5db] rounded-full h-1.5 mt-1 overflow-hidden">
          <div className="bg-[#9ca3af] h-1.5 rounded-full w-1/3 animate-pulse" />
        </div>
      </div>
    );
  }

  if (locked || score == null) {
    const pct = Math.min(100, (currentCount / requiredCount) * 100);
    return (
      <div className="bg-[#f3f5f7] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Consistency Score</p>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-[#9ca3af]">Locked</span>
        </div>
        <div className="w-full bg-[#d1d5db] rounded-full h-1.5 mt-1">
          <div
            className="bg-[#0d1f35] h-1.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#6b7280]">
          {currentCount} / {requiredCount} reflections logged to unlock.
        </p>
      </div>
    );
  }

  const pct = Math.round(score * 100);
  const blurb =
    score >= 0.75
      ? "Highly consistent with your stated strategy."
      : score >= 0.5
        ? "Moderately consistent with your stated strategy."
        : "Inconsistent. Your outcomes vary widely.";

  return (
    <div className="bg-[#f3f5f7] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-sm font-semibold text-[#0d1f35]">Consistency Score</p>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-bold text-[#0d1f35]">{score.toFixed(2)}</span>
        <span className="text-base text-[#6b7280]">/ 1.0</span>
      </div>
      <div className="w-full bg-[#d1d5db] rounded-full h-1.5 mt-1">
        <div className="bg-[#0d1f35] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-[#6b7280]">{blurb}</p>
    </div>
  );
}

export default ConsistencyCard;
