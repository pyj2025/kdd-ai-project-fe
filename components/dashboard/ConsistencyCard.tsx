function ConsistencyCard() {
  return (
    <div className="bg-[#f3f5f7] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-sm font-semibold text-[#0d1f35]">Consistency Score</p>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-bold text-[#0d1f35]">0.62</span>
        <span className="text-base text-[#6b7280]">/ 1.0</span>
      </div>
      <div className="w-full bg-[#d1d5db] rounded-full h-1.5 mt-1">
        <div className="bg-[#0d1f35] h-1.5 rounded-full" style={{ width: "62%" }} />
      </div>
      <p className="text-xs text-[#6b7280]">Moderately consistent with your stated strategy.</p>
    </div>
  );
}

export default ConsistencyCard;
