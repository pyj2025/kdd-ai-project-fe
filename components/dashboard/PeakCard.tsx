function PeakCard() {
  return (
    <div className="bg-[#e8eef4] rounded-2xl p-6 flex flex-col gap-4 flex-1">
      <p className="text-sm font-semibold text-[#0d1f35]">Avg. Distance from Peak</p>
      <span className="text-5xl font-bold text-red-500">-18.4%</span>
      <p className="text-xs text-[#6b7280] mt-auto">Median sell timing efficiency.</p>
    </div>
  );
}

export default PeakCard;
