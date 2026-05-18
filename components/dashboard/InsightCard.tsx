interface InsightCardProps {
  locked: boolean;
  currentCount: number;
  requiredCount: number;
  insight: string | null;
}

function InsightCard({ locked, currentCount, requiredCount, insight }: InsightCardProps) {
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
