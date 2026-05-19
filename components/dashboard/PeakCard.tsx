interface PeakCardProps {
  locked: boolean;
  currentCount: number;
  requiredCount: number;
  avgDistance: number | null;
  loading?: boolean;
  errorMsg?: string;
  onRetry?: () => void;
}

function PeakCard({
  locked,
  currentCount,
  requiredCount,
  avgDistance,
  loading,
  errorMsg,
  onRetry,
}: PeakCardProps) {
  if (errorMsg) {
    return (
      <div className="bg-[#e8eef4] rounded-2xl p-6 flex flex-col gap-3 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Avg. Distance from Peak</p>
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
      <div className="bg-[#e8eef4] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Avg. Distance from Peak</p>
        <span className="text-2xl font-medium text-[#9ca3af] animate-pulse">Loading...</span>
      </div>
    );
  }

  if (locked || avgDistance == null) {
    return (
      <div className="bg-[#e8eef4] rounded-2xl p-6 flex flex-col gap-4 flex-1">
        <p className="text-sm font-semibold text-[#0d1f35]">Avg. Distance from Peak</p>
        <span className="text-5xl font-bold text-[#9ca3af]">Locked</span>
        <p className="text-xs text-[#6b7280] mt-auto">
          {currentCount} / {requiredCount} reflections logged to unlock.
        </p>
      </div>
    );
  }

  const formatted = `${avgDistance > 0 ? "+" : ""}${avgDistance.toFixed(1)}%`;
  const color = avgDistance < 0 ? "text-red-500" : "text-emerald-600";

  return (
    <div className="bg-[#e8eef4] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-sm font-semibold text-[#0d1f35]">Avg. Distance from Peak</p>
      <span className={`text-5xl font-bold ${color}`}>{formatted}</span>
      <p className="text-xs text-[#6b7280] mt-auto">Mean across all your logged decisions.</p>
    </div>
  );
}

export default PeakCard;
