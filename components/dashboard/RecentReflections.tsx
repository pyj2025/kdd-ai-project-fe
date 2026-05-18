"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;
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
        setError(null);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? "Failed to load reflections");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm text-[#6b7280] py-6">Loading...</p>;
  if (error) return <p className="text-sm text-red-600 py-6">{error}</p>;
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
