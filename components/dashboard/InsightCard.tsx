function InsightCard() {
  return (
    <div className="bg-[#1e3a52] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-xs text-[#93abbe] uppercase tracking-wide font-semibold">
        Behavioral Insight
      </p>
      <p className="text-sm text-white leading-relaxed">
        You tend to increase position size by 40% when market volatility exceeds 12% — a sign of
        FOMO-driven entry.
      </p>
      <div className="mt-auto">
        <button className="text-xs text-white border border-white/40 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors">
          View Analysis Detail
        </button>
      </div>
    </div>
  );
}

export default InsightCard;
