"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, DollarSign, BarChart2, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { DIRECTION_CONFIG, OUTCOME_LABEL, OUTCOME_STYLE, SCENARIO_LABEL } from "./constants";
import Skeleton from "./Skeleton";
import { formatDate, formatPercent, formatUsd } from "./utils";
import ChartTooltip from "./ChartTooltip";

type Decision = {
  id: string;
  ticker: string;
  scenario_type: string;
  decision_date: string;
  decision_price_snapshot: number | null;
  current_price: number | null;
  diff_amount: number | null;
  diff_percent: number | null;
  direction: string | null;
  outcome: string | null;
  was_decision_correct: boolean | null;
  notes: string | null;
  reflection: string | null;
  title: string | null;
  emotion: string | null;
  quantity: number | null;
  amount: number | null;
};

type PricePoint = { date: string; price: number };

type PriceHistory = {
  ticker: string;
  decision_date: string;
  decision_price: number;
  current_price: number;
  history: PricePoint[];
};

type OptimalTiming = {
  ticker: string;
  start_date: string;
  end_date: string;
  best_buy: { date: string; price: number };
  best_sell: { date: string; price: number };
  max_return_percent: number;
  summary_message: string;
  data_points: number;
};

function ReflectionDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const [decision, setDecision] = useState<Decision | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [optimal, setOptimal] = useState<OptimalTiming | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingOptimal, setLoadingOptimal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingDecision(true);
    apiGet(`/decisions/${id}`)
      .then(data => {
        if (cancelled) return;
        setDecision(data as Decision);
        setError(null);
      })
      .catch(err => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Reflection not found.");
        } else {
          setError(err.message ?? "Failed to load reflection.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDecision(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 2) FastAPI에서 price history 가져오기
  useEffect(() => {
    if (!decision) return;

    async function fetchPriceHistory() {
      setLoadingChart(true);
      try {
        const data: PriceHistory = await apiGet(
          `/price-history/${decision!.ticker}?decision_date=${decision!.decision_date}`,
        );
        setPriceHistory(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingChart(false);
      }
    }

    async function fetchOptimal() {
      setLoadingOptimal(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const data: OptimalTiming = await apiPost("/optimal-timing", {
          ticker: decision!.ticker,
          start_date: decision!.decision_date,
          end_date: today,
        });
        setOptimal(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOptimal(false);
      }
    }

    fetchPriceHistory();
    fetchOptimal();
  }, [decision]);

  // ── Loading ──
  if (loadingDecision) {
    return (
      <div className="px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-16 w-2/3" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-[#6b7280] text-sm">{error ?? "Something went wrong."}</p>
        <button onClick={() => router.back()} className="mt-4 text-xs text-[#0d1f35] underline">
          Go back
        </button>
      </div>
    );
  }

  const dirCfg = DIRECTION_CONFIG[decision.direction ?? "neutral"] ?? DIRECTION_CONFIG.neutral;
  const DirectionIcon = dirCfg.Icon;
  const isPositiveDiff = (decision.diff_percent ?? 0) > 0;
  const isNegativeDiff = (decision.diff_percent ?? 0) < 0;

  const chartData = priceHistory?.history ?? [];
  const decisionDateStr = decision.decision_date?.slice(0, 10) ?? "";

  return (
    <div className="px-8 py-8 space-y-8">
      {/* ── Back ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#0d1f35] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          {decision.title && (
            <p className="text-xs text-[#6b7280] mb-1 truncate">{decision.title}</p>
          )}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight">{decision.ticker}</h1>
            {decision.outcome && (
              <span
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full self-center",
                  OUTCOME_STYLE[decision.outcome],
                )}
              >
                {OUTCOME_LABEL[decision.outcome]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6b7280] flex-wrap">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {SCENARIO_LABEL[decision.scenario_type] ?? decision.scenario_type}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(decision.decision_date)}
            </span>
            {decision.emotion && (
              <>
                <span>·</span>
                <span>
                  Emotion:{" "}
                  {decision.emotion.charAt(0).toUpperCase() + decision.emotion.slice(1)}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-2xl", dirCfg.bg)}>
          <DirectionIcon className={cn("w-4 h-4", dirCfg.color)} />
          <span className={cn("text-xs font-semibold", dirCfg.color)}>{dirCfg.label}</span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#f3f5f7] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">
            Decision Price
          </p>
          <p className="text-2xl font-bold text-[#0d1f35]">
            {formatUsd(decision.decision_price_snapshot)}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">{formatDate(decision.decision_date)}</p>
        </div>
        <div className="bg-[#f3f5f7] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">
            Current Price
          </p>
          <p className="text-2xl font-bold text-[#0d1f35]">{formatUsd(decision.current_price)}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Latest close</p>
        </div>
        <div className="bg-[#0d1f35] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#93abbe] mb-2">
            Price Change
          </p>
          <p
            className={cn(
              "text-2xl font-bold",
              isPositiveDiff ? "text-emerald-400" : isNegativeDiff ? "text-red-400" : "text-white",
            )}
          >
            {formatPercent(decision.diff_percent)}
          </p>
          <p className="text-xs text-[#93abbe] mt-1">{formatUsd(decision.diff_amount)} total</p>
        </div>
      </div>

      {/* ── Price Chart ── */}
      <div className="bg-[#f3f5f7] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-[#0d1f35]" />
          <h2 className="text-sm font-bold text-[#0d1f35]">
            Price History · {decision.ticker}
          </h2>
          <span className="text-xs text-[#9ca3af] ml-auto">
            60 days before · 90 days after decision
          </span>
        </div>

        {loadingChart ? (
          <Skeleton className="h-56 w-full" />
        ) : chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eaed" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v: string) => {
                    try {
                      return format(parseISO(v), "MMM d");
                    } catch {
                      return v;
                    }
                  }}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                  width={52}
                />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine
                  x={decisionDateStr}
                  stroke="#0d1f35"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{
                    value: "Decision",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#0d1f35",
                    fontWeight: 600,
                  }}
                />
                {priceHistory?.decision_price && (
                  <ReferenceLine
                    y={priceHistory.decision_price}
                    stroke="#9ca3af"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#0d1f35"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#0d1f35", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#e8eaed]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-[#0d1f35]" />
                <span className="text-xs text-[#6b7280]">Close price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 border-t-2 border-dashed border-[#0d1f35]" />
                <span className="text-xs text-[#6b7280]">Decision date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 border-t-2 border-dashed border-[#9ca3af]" />
                <span className="text-xs text-[#6b7280]">Decision price</span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-56 flex items-center justify-center">
            <p className="text-xs text-[#9ca3af]">Price history unavailable for this ticker.</p>
          </div>
        )}
      </div>

      {/* ── Optimal Timing (hindsight) ── */}
      {loadingOptimal ? (
        <Skeleton className="h-40 w-full" />
      ) : optimal && optimal.data_points > 1 ? (
        <div className="border border-[#e8eaed] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#0d1f35]" />
            <h2 className="text-sm font-bold text-[#0d1f35]">Hindsight · Best Entry & Exit</h2>
            <span className="text-xs text-[#9ca3af] ml-auto">
              {formatDate(optimal.start_date)} to {formatDate(optimal.end_date)}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#f3f5f7] rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">
                Best Buy
              </p>
              <p className="text-2xl font-bold text-[#0d1f35]">{formatUsd(optimal.best_buy.price)}</p>
              <p className="text-xs text-[#9ca3af] mt-1">{formatDate(optimal.best_buy.date)}</p>
            </div>
            <div className="bg-[#f3f5f7] rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-2">
                Best Sell
              </p>
              <p className="text-2xl font-bold text-[#0d1f35]">{formatUsd(optimal.best_sell.price)}</p>
              <p className="text-xs text-[#9ca3af] mt-1">{formatDate(optimal.best_sell.date)}</p>
            </div>
            <div className="bg-[#0d1f35] rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#93abbe] mb-2">
                Max Return
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatPercent(optimal.max_return_percent)}
              </p>
              <p className="text-xs text-[#93abbe] mt-1">Theoretical, hindsight only</p>
            </div>
          </div>
          <p className="text-xs text-[#6b7280] leading-relaxed">{optimal.summary_message}</p>
        </div>
      ) : null}

      {/* ── Reflection ── */}
      {decision.reflection && (
        <div className="bg-[#0d1f35] rounded-2xl p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#93abbe] mb-3">
            Reflection
          </p>
          <p className="text-white text-sm leading-relaxed">{decision.reflection}</p>
        </div>
      )}

      {/* ── Notes ── */}
      {decision.notes && (
        <div className="bg-[#f3f5f7] rounded-2xl p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-3">
            Your Notes
          </p>
          <p className="text-[#0d1f35] text-sm leading-relaxed whitespace-pre-wrap">
            {decision.notes}
          </p>
        </div>
      )}

      {/* ── Position details ── */}
      {(decision.quantity || decision.amount) && (
        <div className="border border-[#e8eaed] rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280] mb-4 flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" />
            Position Details
          </p>
          <div className="grid grid-cols-2 gap-4">
            {decision.quantity && (
              <div>
                <p className="text-xs text-[#9ca3af]">Quantity</p>
                <p className="text-sm font-semibold text-[#0d1f35] mt-0.5">
                  {decision.quantity} shares
                </p>
              </div>
            )}
            {decision.amount && (
              <div>
                <p className="text-xs text-[#9ca3af]">Amount</p>
                <p className="text-sm font-semibold text-[#0d1f35] mt-0.5">
                  {formatUsd(decision.amount)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReflectionDetailClient;
