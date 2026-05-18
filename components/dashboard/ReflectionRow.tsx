import Link from "next/link";
import Image from "next/image";

export type OutcomeTag = "favorable" | "unfavorable" | "neutral";

const tagStyles: Record<OutcomeTag, string> = {
  favorable: "bg-emerald-500 text-white",
  unfavorable: "bg-red-400 text-white",
  neutral: "bg-[#9ca3af] text-white",
};

const tagLabels: Record<OutcomeTag, string> = {
  favorable: "Favorable",
  unfavorable: "Unfavorable",
  neutral: "Neutral",
};

function ReflectionRow({
  id,
  title,
  date,
  emotion,
  tag,
}: {
  id: string;
  title: string;
  date: string;
  emotion: string | null;
  tag: OutcomeTag | null;
}) {
  return (
    <Link href={`/dashboard/reflections/${id}`}>
      <div className="flex items-center gap-4 py-5 border-b border-slate-100 last:border-0">
        <div className="w-12 h-12 rounded-xl bg-[#f3f5f7] flex items-center justify-center shrink-0">
          <Image src="/icons/Version-1.png" alt="charts" width={800} height={500} priority />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0d1f35] truncate">{title}</p>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {date}
            {emotion ? <>&nbsp;&nbsp;|&nbsp;&nbsp;Emotion: {emotion}</> : null}
          </p>
        </div>
        {tag && (
          <span
            className={`text-xs font-semibold px-4 py-1.5 rounded-full shrink-0 ${tagStyles[tag]}`}
          >
            {tagLabels[tag]}
          </span>
        )}
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
    </Link>
  );
}

export default ReflectionRow;
