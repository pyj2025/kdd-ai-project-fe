"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FilterDialog, { Filters } from "@/components/dashboard/reflections/FilterDialog";
import Pagination from "@/components/dashboard/reflections/Pagination";
import ReflectionRow, { OutcomeTag } from "@/components/dashboard/ReflectionRow";
import { apiGet } from "@/lib/api";

const PAGE_SIZE = 8;

const SCENARIO_LABEL: Record<string, string> = {
  no_buy: "No Buy",
  no_sell: "No Sell",
  sold_too_early: "Sold Early",
};

type DecisionRow = {
  id: string;
  ticker: string;
  scenario_type: string;
  decision_date: string;
  title: string | null;
  emotion: string | null;
  outcome: OutcomeTag | null;
};

type DisplayReflection = {
  id: string;
  title: string;
  date: string;
  emotion: string | null;
  tag: OutcomeTag | null;
  rawEmotion: string | null;
};

function buildTitle(d: DecisionRow): string {
  if (d.title && d.title.trim().length > 0) return d.title;
  const scenario = SCENARIO_LABEL[d.scenario_type] ?? d.scenario_type;
  return `${d.ticker} · ${scenario}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ReflectionsClient() {
  const [reflections, setReflections] = useState<DisplayReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({ tag: "all", emotion: "all" });

  const fetchReflections = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/decisions?sort=-decision_date")
      .then(res => {
        if (cancelled) return;
        const items: DecisionRow[] = res.items ?? [];
        const mapped: DisplayReflection[] = items.map(d => ({
          id: d.id,
          title: buildTitle(d),
          date: formatDate(d.decision_date),
          emotion: d.emotion ? capitalize(d.emotion) : null,
          tag: d.outcome,
          rawEmotion: d.emotion,
        }));
        setReflections(mapped);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your reflections right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = fetchReflections();
    return cancel;
  }, [fetchReflections]);

  const filtered = useMemo(
    () =>
      reflections.filter(r => {
        if (filters.tag !== "all" && r.tag !== filters.tag) return false;
        if (filters.emotion !== "all" && r.rawEmotion !== filters.emotion) return false;
        return true;
      }),
    [reflections, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (f: Filters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight">Recent Reflections</h1>
        <FilterDialog filters={filters} onApply={handleFilter} />
      </div>

      {/* Body */}
      <div className="flex-1">
        {loading ? (
          <p className="text-sm text-[#6b7280] py-10 text-center">Loading...</p>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-sm text-[#6b7280]">{error}</p>
            <button
              type="button"
              onClick={fetchReflections}
              className="mt-3 text-xs font-medium text-[#0d1f35] border border-[#d1d5db] rounded-full px-4 py-1.5 hover:bg-[#f3f5f7]"
            >
              Retry
            </button>
          </div>
        ) : paginated.length === 0 ? (
          <p className="text-sm text-[#6b7280] py-10 text-center">No Reflections</p>
        ) : (
          paginated.map(item => (
            <ReflectionRow
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              emotion={item.emotion}
              tag={item.tag}
            />
          ))
        )}
      </div>

      <div className="pt-4 min-h-[48px] flex justify-center items-center">
        {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
      </div>
    </div>
  );
}

export default ReflectionsClient;
