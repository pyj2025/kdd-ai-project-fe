"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import ConsistencyCard from "./ConsistencyCard";
import InsightCard from "./InsightCard";
import PeakCard from "./PeakCard";

type PatternsLocked = {
  unlocked: false;
  current_count: number;
  required_count: number;
};

type PatternsUnlocked = {
  unlocked: true;
  decision_count: number;
  metrics: {
    avg_distance_from_peak_percent: number;
    consistency_score: number;
    scenario_distribution: Record<string, number>;
  };
};

type PatternsResponse = PatternsLocked | PatternsUnlocked;

type InsightsResponse =
  | { unlocked: false }
  | { unlocked: true; insights: string[]; degraded: boolean };

function StatCards() {
  const [patterns, setPatterns] = useState<PatternsResponse | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([apiGet("/patterns"), apiGet("/patterns/insights")])
      .then(([p, i]) => {
        if (cancelled) return;
        setPatterns(p);
        setInsights(i);
        setError(null);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? "Failed to load patterns");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex-1 bg-[#f3f5f7] rounded-2xl p-6 text-sm text-red-600">{error}</div>
    );
  }

  if (!patterns) {
    return (
      <>
        <ConsistencyCard locked currentCount={0} requiredCount={10} score={null} />
        <PeakCard locked currentCount={0} requiredCount={10} avgDistance={null} />
        <InsightCard locked currentCount={0} requiredCount={10} insight={null} />
      </>
    );
  }

  if (!patterns.unlocked) {
    return (
      <>
        <ConsistencyCard
          locked
          currentCount={patterns.current_count}
          requiredCount={patterns.required_count}
          score={null}
        />
        <PeakCard
          locked
          currentCount={patterns.current_count}
          requiredCount={patterns.required_count}
          avgDistance={null}
        />
        <InsightCard
          locked
          currentCount={patterns.current_count}
          requiredCount={patterns.required_count}
          insight={null}
        />
      </>
    );
  }

  const firstInsight =
    insights && insights.unlocked && insights.insights.length > 0 ? insights.insights[0] : null;

  return (
    <>
      <ConsistencyCard
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        score={patterns.metrics.consistency_score}
      />
      <PeakCard
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        avgDistance={patterns.metrics.avg_distance_from_peak_percent}
      />
      <InsightCard
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        insight={firstInsight}
      />
    </>
  );
}

export default StatCards;
