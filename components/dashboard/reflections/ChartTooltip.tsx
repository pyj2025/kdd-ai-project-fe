import { formatUsd } from "./utils";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1f35] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
      <p className="text-[#93abbe] mb-0.5">{label}</p>
      <p className="font-semibold">{formatUsd(payload[0].value)}</p>
    </div>
  );
}

export default ChartTooltip;
