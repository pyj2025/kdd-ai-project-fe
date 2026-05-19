"use client";

import { useCallback, useEffect, useState } from "react";
import ReflectionRow, { OutcomeTag } from "@/components/dashboard/ReflectionRow";
import { apiGet } from "@/lib/api";

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

function RecentReflections() {
  const [items, setItems] = useState<DisplayReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet("/decisions?sort=-decision_date")
      .then(res => {
        if (cancelled) return;
        const rows: DecisionRow[] = (res.items ?? []).slice(0, 3);
        setItems(
          rows.map(d => ({
            id: d.id,
            title: buildTitle(d),
            date: formatDate(d.decision_date),
            emotion: d.emotion ? capitalize(d.emotion) : null,
            tag: d.outcome,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load recent reflections.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cancel = fetchRecent();
    return cancel;
  }, [fetchRecent]);

  if (loading) return <p className="text-sm text-[#6b7280] py-6">Loading...</p>;
  if (error) {
    return (
      <div className="py-6">
        <p className="text-sm text-[#6b7280]">{error}</p>
        <button
          type="button"
          onClick={fetchRecent}
          className="mt-2 text-xs font-medium text-[#0d1f35] border border-[#d1d5db] rounded-full px-3 py-1 hover:bg-[#f3f5f7]"
        >
          Retry
        </button>
      </div>
    );
  }
  if (items.length === 0) {
    return <p className="text-sm text-[#6b7280] py-6">No reflections yet. Write your first one!</p>;
  }

  return (
    <>
      {items.map(item => (
        <ReflectionRow
          key={item.id}
          id={item.id}
          title={item.title}
          date={item.date}
          emotion={item.emotion}
          tag={item.tag}
        />
      ))}
    </>
  );
}

export default RecentReflections;
