type TagVariant = "deviation" | "plan-aligned" | "manual";

const tagStyles: Record<TagVariant, string> = {
  deviation: "bg-red-400 text-white",
  "plan-aligned": "bg-emerald-500 text-white",
  manual: "bg-[#9ca3af] text-white",
};

const tagLabels: Record<TagVariant, string> = {
  deviation: "Deviation",
  "plan-aligned": "Plan-aligned",
  manual: "Manual Entry",
};

function ReflectionRow({
  title,
  date,
  emotion,
  tag,
}: {
  title: string;
  date: string;
  emotion: string;
  tag: TagVariant;
}) {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-[#e8eaed] last:border-0">
      <div className="w-12 h-12 rounded-xl bg-[#f3f5f7] flex items-center justify-center shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="8" width="20" height="14" rx="2" fill="#d1d5db" />
          <rect x="8" y="5" width="12" height="4" rx="1" fill="#9ca3af" />
          <rect x="7" y="12" width="14" height="1.5" rx="0.75" fill="#fff" />
          <rect x="7" y="15.5" width="10" height="1.5" rx="0.75" fill="#fff" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0d1f35] truncate">{title}</p>
        <p className="text-xs text-[#6b7280] mt-0.5">
          {date}&nbsp;&nbsp;|&nbsp;&nbsp;Emotion: {emotion}
        </p>
      </div>
      <span className={`text-xs font-semibold px-4 py-1.5 rounded-full shrink-0 ${tagStyles[tag]}`}>
        {tagLabels[tag]}
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-[#9ca3af]"
      >
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default ReflectionRow;
