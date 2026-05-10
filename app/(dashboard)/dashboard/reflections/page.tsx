"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import FilterDialog, { Filters } from "@/components/dashboard/reflections/FilterDialog";
import Pagination from "@/components/dashboard/reflections/Pagination";

// ─── Types ───────────────────────────────────────────────────────────────────
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

type Reflection = {
  id: number;
  title: string;
  date: string;
  emotion: string;
  tag: TagVariant;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DATA: Reflection[] = [
  {
    id: 1,
    title: "NVDIA Q3 Earnings Panic",
    date: "Oct 14, 2023",
    emotion: "High Anxiety",
    tag: "deviation",
  },
  {
    id: 2,
    title: "Treasury Yield Shift Rebalancing",
    date: "Oct 02, 2023",
    emotion: "Neutral",
    tag: "plan-aligned",
  },
  {
    id: 3,
    title: "S&P 500 Put Option Hedge",
    date: "Sep 21, 2023",
    emotion: "Cautious",
    tag: "manual",
  },
  {
    id: 4,
    title: "Apple Earnings Overreaction",
    date: "Sep 10, 2023",
    emotion: "Fear",
    tag: "deviation",
  },
  {
    id: 5,
    title: "Fed Rate Decision Hold",
    date: "Aug 30, 2023",
    emotion: "Neutral",
    tag: "plan-aligned",
  },
  {
    id: 6,
    title: "Tesla Dip Buy Hesitation",
    date: "Aug 18, 2023",
    emotion: "Greed",
    tag: "deviation",
  },
  {
    id: 7,
    title: "Gold Allocation Rebalance",
    date: "Aug 05, 2023",
    emotion: "Cautious",
    tag: "manual",
  },
  {
    id: 8,
    title: "Microsoft Cloud Beat",
    date: "Jul 28, 2023",
    emotion: "Optimistic",
    tag: "plan-aligned",
  },
  {
    id: 9,
    title: "Energy Sector Rotation",
    date: "Jul 15, 2023",
    emotion: "Neutral",
    tag: "manual",
  },
  {
    id: 10,
    title: "Crypto Volatility Exit",
    date: "Jul 01, 2023",
    emotion: "High Anxiety",
    tag: "deviation",
  },
  {
    id: 11,
    title: "Semiconductor Supply Signal",
    date: "Jun 20, 2023",
    emotion: "Optimistic",
    tag: "plan-aligned",
  },
  {
    id: 12,
    title: "Bond Ladder Adjustment",
    date: "Jun 08, 2023",
    emotion: "Neutral",
    tag: "manual",
  },
  {
    id: 13,
    title: "NVDA Pre-earnings Trim",
    date: "May 24, 2023",
    emotion: "Cautious",
    tag: "deviation",
  },
  {
    id: 14,
    title: "Dividend Reinvestment Check",
    date: "May 10, 2023",
    emotion: "Neutral",
    tag: "plan-aligned",
  },
  {
    id: 15,
    title: "Small Cap Value Tilt",
    date: "Apr 28, 2023",
    emotion: "Optimistic",
    tag: "manual",
  },
];

const PAGE_SIZE = 10;

// ─── Row ──────────────────────────────────────────────────────────────────────
function ReflectionRow({ item }: { item: Reflection }) {
  return (
    <div className="flex items-center gap-4 py-5 border-b border-[#e8eaed] last:border-0 cursor-pointer hover:bg-[#fafafa] px-2 -mx-2 rounded-xl transition-colors">
      <div className="w-12 h-12 rounded-xl bg-[#f3f5f7] flex items-center justify-center shrink-0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="8" width="20" height="14" rx="2" fill="#d1d5db" />
          <rect x="8" y="5" width="12" height="4" rx="1" fill="#9ca3af" />
          <rect x="7" y="12" width="14" height="1.5" rx="0.75" fill="#fff" />
          <rect x="7" y="15.5" width="10" height="1.5" rx="0.75" fill="#fff" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0d1f35] truncate">{item.title}</p>
        <p className="text-xs text-[#6b7280] mt-0.5">
          {item.date}&nbsp;&nbsp;|&nbsp;&nbsp;Emotion: {item.emotion}
        </p>
      </div>
      <span
        className={`text-xs font-semibold px-4 py-1.5 rounded-full shrink-0 ${tagStyles[item.tag]}`}
      >
        {tagLabels[item.tag]}
      </span>
      <ChevronRight className="w-4 h-4 shrink-0 text-[#9ca3af]" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function ReflectionsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({ tag: "all", emotion: "all" });

  const filtered = MOCK_DATA.filter(r => {
    if (filters.tag !== "all" && r.tag !== filters.tag) return false;
    if (filters.emotion !== "all" && r.emotion !== filters.emotion) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight">Recent Reflections</h1>
        <FilterDialog filters={filters} onApply={handleFilter} />
      </div>

      {/* List */}
      <div>
        {paginated.length === 0 ? (
          <p className="text-sm text-[#6b7280] py-10 text-center">조건에 맞는 리플렉션이 없어요.</p>
        ) : (
          paginated.map(item => <ReflectionRow key={item.id} item={item} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
    </div>
  );
}

export default ReflectionsPage;
