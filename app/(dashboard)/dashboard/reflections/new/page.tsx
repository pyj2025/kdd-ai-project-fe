"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ThoughtTextarea from "@/components/dashboard/reflections/new/ThinkingTextarea";
import ScenarioType from "@/components/dashboard/reflections/new/ScenarioType";
import FooterFeatures from "@/components/dashboard/reflections/new/FooterFeatures";
import TickerInput from "@/components/dashboard/reflections/new/TickerInput";

type ResultState = {
  ticker: string;
  scenario: string;
  decisionDate: string | null;
  decisionPrice: number | null;
  currentPrice: number | null;
  diffPercent: number | null;
  outcome: string | null;
  reflection: string | null;
};

const SCENARIO_LABEL: Record<string, string> = {
  no_buy: "No Buy",
  no_sell: "No Sell",
  sold_too_early: "Sold Early",
};

const OUTCOME_LABEL: Record<string, string> = {
  favorable: "Favorable",
  unfavorable: "Unfavorable",
  neutral: "Neutral",
};

const OUTCOME_STYLE: Record<string, string> = {
  favorable: "bg-emerald-100 text-emerald-700",
  unfavorable: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
};

const formatUsd = (n: number | null) =>
  n == null
    ? "N/A"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const formatPercent = (n: number | null) => {
  if (n == null) return "N/A";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};

function NewPage() {
  const router = useRouter();
  const supabase = createClient();

  const [thought, setThought] = useState("");
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [scenario, setScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);

  const handleExtract = async () => {
    if (thought.trim().length < 3) return;
    setExtractLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: thought }),
      });
      if (!res.ok) throw new Error(`Parse error ${res.status}`);
      const data = await res.json();
      const { extracted, confidence } = data;
      const THRESHOLD = 0.7;
      if (extracted.ticker && confidence.ticker >= THRESHOLD && data.ticker_validated) {
        setTicker(extracted.ticker.toUpperCase());
      }
      if (extracted.scenario_type && confidence.scenario_type >= THRESHOLD) {
        setScenario(extracted.scenario_type);
      }
      if (extracted.decision_date && confidence.decision_date >= THRESHOLD) {
        setDate(parse(extracted.decision_date, "yyyy-MM-dd", new Date()));
      }
      if (extracted.quantity != null && confidence.quantity >= THRESHOLD) {
        setQuantity(String(extracted.quantity));
      }
      if (extracted.amount != null && confidence.amount >= THRESHOLD) {
        setAmount(String(extracted.amount));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExtractLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!ticker || !scenario) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const quantityNum = quantity ? Number(quantity) : null;
      const amountNum = amount ? Number(amount) : null;
      const decisionDate = date ? format(date, "yyyy-MM-dd") : null;

      const [calcRes, prevQuery] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticker,
            scenario_type: scenario,
            decision_date: decisionDate,
            quantity: quantityNum,
            amount: amountNum,
          }),
        }),
        supabase
          .from("decisions")
          .select("ticker, scenario_type, decision_date, diff_percent, direction, outcome")
          .eq("user_id", user.id)
          .not("diff_percent", "is", null)
          .not("direction", "is", null)
          .not("outcome", "is", null)
          .order("decision_date", { ascending: false })
          .limit(10),
      ]);

      if (!calcRes.ok) throw new Error(`Calculate error ${calcRes.status}`);
      const calc = await calcRes.json();
      if (prevQuery.error) throw new Error(prevQuery.error.message);
      const previousDecisions = prevQuery.data ?? [];

      let reflection: string | null = null;
      try {
        const reflectRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reflect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticker,
            scenario_type: scenario,
            decision_date: decisionDate,
            diff_percent: calc.diff_percent,
            direction: calc.direction,
            outcome: calc.outcome,
            previous_decisions: previousDecisions,
          }),
        });
        if (reflectRes.ok) {
          const r = await reflectRes.json();
          reflection = r.degraded ? null : r.reflection || null;
        }
      } catch (e) {
        console.error("reflect failed", e);
      }

      const { error } = await supabase.from("decisions").insert({
        user_id: user.id,
        ticker,
        scenario_type: scenario,
        decision_date: decisionDate,
        quantity: quantityNum,
        amount: amountNum,
        decision_price_snapshot: calc.decision_price ?? null,
        current_price: calc.current_price ?? null,
        diff_amount: calc.diff_amount ?? null,
        diff_percent: calc.diff_percent ?? null,
        direction: calc.direction ?? null,
        outcome: calc.outcome ?? null,
        was_decision_correct: calc.was_decision_correct ?? null,
        actual_date_used: calc.actual_date_used ?? null,
        current_date_snapshot: calc.current_date ?? null,
        decision_price_source: calc.decision_price_source ?? null,
        reflection,
        notes: thought || null,
      });

      if (error) throw new Error(error.message);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-8 space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight tracking-tight">
          The Honest Mirror.
        </h1>
        <p className="text-sm text-[#6b7280] mt-1 leading-relaxed">
          Reflect on your investment thesis before taking action.
          <br />
          Our AI helps parse your raw thoughts into a structured decision log.
        </p>
      </div>

      {/* ── Thought textarea ── */}
      <div className="space-y-2">
        <ThoughtTextarea
          thought={thought}
          setThought={setThought}
          onExtract={handleExtract}
          extractLoading={extractLoading}
        />
      </div>

      {/* ── Step 2 header ── */}
      <p className="text-xs font-bold text-[#0d1f35] uppercase tracking-widest">
        Step 2. Decision details
      </p>

      {/* ── Inputs row ── */}
      <div className="grid grid-cols-4 gap-6">
        {/* Ticker */}
        <TickerInput value={ticker} onChange={setTicker} />

        {/* Date of Intent */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
            Date of Intent
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "w-full h-12 justify-start bg-[#dce3eb] border-0 rounded text-sm font-normal px-4 shadow-none hover:bg-[#dce3eb]",
                  date ? "text-[#0d1f35]" : "text-[#8fa0b0]",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#8fa0b0]" />
                {date ? format(date, "MM/dd/yyyy") : "mm/dd/tttt"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={d => {
                  setDate(d);
                  setCalendarOpen(false);
                }}
                disabled={d => d > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
            Quantity / Weight
          </Label>
          <Input
            placeholder="100 shares"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="h-12 bg-[#dce3eb] border-0 rounded text-sm text-[#0d1f35] placeholder:text-[#8fa0b0] focus-visible:ring-1 focus-visible:ring-[#0d1f35] shadow-none"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
            Amount (₩/$)
          </Label>
          <Input
            placeholder="0"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="h-12 bg-[#dce3eb] border-0 rounded text-sm text-[#0d1f35] placeholder:text-[#8fa0b0] focus-visible:ring-1 focus-visible:ring-[#0d1f35] shadow-none"
          />
        </div>
      </div>

      {/* ── Scenario Type ── */}
      <div className="space-y-4">
        <ScenarioType scenario={scenario} setScenario={setScenario} />
      </div>

      {/* ── Submit ── */}
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleSubmit}
          disabled={loading || !ticker || !scenario}
          className="w-full max-w-lg bg-[#1e2d3d] hover:bg-[#162536] text-white rounded-xl h-14 text-base font-normal tracking-wide"
        >
          {loading ? "Loading..." : "Continue Reflection"}
        </Button>
        <p className="text-xs text-[#9ca3af]">
          Your inputs are encrypted and private to your journal.
        </p>
      </div>

      <FooterFeatures />
    </div>
  );
}

export default NewPage;
