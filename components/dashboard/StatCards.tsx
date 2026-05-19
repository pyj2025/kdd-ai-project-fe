"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    setErrorMsg(null);
    Promise.all([apiGet("/patterns"), apiGet("/patterns/insights")])
      .then(([p, i]) => {
        setPatterns(p);
        setInsights(i);
      })
      .catch(err => {
        setErrorMsg(err.message ?? "Couldn't load your patterns right now.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Error state: keep 3-card layout so the grid doesn't reflow, but each
  // card shows the friendly retry surface instead of the value.
  if (errorMsg) {
    return (
      <>
        <ConsistencyCard
          loading={false}
          errorMsg={errorMsg}
          onRetry={fetchAll}
          locked
          currentCount={0}
          requiredCount={10}
          score={null}
        />
        <PeakCard
          loading={false}
          errorMsg={errorMsg}
          onRetry={fetchAll}
          locked
          currentCount={0}
          requiredCount={10}
          avgDistance={null}
        />
        <InsightCard
          loading={false}
          errorMsg={errorMsg}
          onRetry={fetchAll}
          locked
          currentCount={0}
          requiredCount={10}
          insight={null}
        />
      </>
    );
  }

  // Loading state OR initial render before fetch resolves.
  if (loading || !patterns) {
    return (
      <>
        <ConsistencyCard loading locked currentCount={0} requiredCount={10} score={null} />
        <PeakCard loading locked currentCount={0} requiredCount={10} avgDistance={null} />
        <InsightCard loading locked currentCount={0} requiredCount={10} insight={null} />
      </>
    );
  }

  if (!patterns.unlocked) {
    return (
      <>
        <ConsistencyCard
          loading={false}
          locked
          currentCount={patterns.current_count}
          requiredCount={patterns.required_count}
          score={null}
        />
        <PeakCard
          loading={false}
          locked
          currentCount={patterns.current_count}
          requiredCount={patterns.required_count}
          avgDistance={null}
        />
        <InsightCard
          loading={false}
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
        loading={false}
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        score={patterns.metrics.consistency_score}
      />
      <PeakCard
        loading={false}
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        avgDistance={patterns.metrics.avg_distance_from_peak_percent}
      />
      <InsightCard
        loading={false}
        locked={false}
        currentCount={patterns.decision_count}
        requiredCount={10}
        insight={firstInsight}
      />
    </>
  );
}

export default StatCards;
