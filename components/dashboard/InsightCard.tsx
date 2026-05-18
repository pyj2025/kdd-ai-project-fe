interface InsightCardProps {
  locked: boolean;
  currentCount: number;
  requiredCount: number;
  insight: string | null;
  loading?: boolean;
  errorMsg?: string;
  onRetry?: () => void;
}

function InsightCard({
  locked,
  currentCount,
  requiredCount,
  insight,
  loading,
  errorMsg,
  onRetry,
}: InsightCardProps) {
  if (errorMsg) {
    return (
      <div className="bg-[#1e3a52] rounded-2xl p-6 flex flex-col gap-3 flex-1">
        <p className="text-xs text-[#93abbe] uppercase tracking-wide font-semibold">
          Behavioral Insight
        </p>
        <p className="text-sm text-white/70 leading-relaxed flex-1">
          Couldn&apos;t load right now.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="self-start text-xs font-medium text-white border border-white/40 rounded-full px-3 py-1 hover:bg-white/10"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1e3a52] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-xs text-[#93abbe] uppercase tracking-wide font-semibold">
          Behavioral Insight
        </p>
        <p className="text-sm text-white/60 leading-relaxed animate-pulse">Loading...</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="bg-[#1e3a52] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-xs text-[#93abbe] uppercase tracking-wide font-semibold">
          Behavioral Insight
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          Log {Math.max(0, requiredCount - currentCount)} more reflection
          {requiredCount - currentCount === 1 ? "" : "s"} to unlock pattern analysis.
        </p>
        <div className="mt-auto">
          <span className="text-xs text-[#93abbe]">
            {currentCount} / {requiredCount} logged
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e3a52] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-xs text-[#93abbe] uppercase tracking-wide font-semibold">
        Behavioral Insight
      </p>
      <p className="text-sm text-white leading-relaxed">
        {insight ?? "No insight available right now. Try again later."}
      </p>
    </div>
  );
}

export default InsightCard;
