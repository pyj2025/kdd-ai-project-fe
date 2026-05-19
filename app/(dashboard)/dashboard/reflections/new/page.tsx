"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError, apiGet, apiPatch, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ThoughtTextarea from "@/components/dashboard/reflections/new/ThinkingTextarea";
import ScenarioType from "@/components/dashboard/reflections/new/ScenarioType";
import FooterFeatures from "@/components/dashboard/reflections/new/FooterFeatures";
import TickerInput from "@/components/dashboard/reflections/new/TickerInput";
import EmotionPicker from "@/components/dashboard/reflections/new/EmotionPicker";

function NewPage() {
  const router = useRouter();

  const [thought, setThought] = useState("");
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [scenario, setScenario] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [emotion, setEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (thought.trim().length < 3) return;
    setExtractLoading(true);
    setExtractError(null);
    try {
      const data = await apiPost("/parse-decision", { text: thought });
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
      if (extracted.title && confidence.title >= THRESHOLD) {
        setTitle(extracted.title);
      }
    } catch (err) {
      console.error(err);
      setExtractError("Couldn't extract details. Try again, or fill in the form below.");
    } finally {
      setExtractLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!ticker || !scenario || !date) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const quantityNum = quantity ? Number(quantity) : null;
      const amountNum = amount ? Number(amount) : null;
      const decisionDate = format(date, "yyyy-MM-dd");

      const saved = await apiPost("/decisions", {
        ticker,
        scenario_type: scenario,
        decision_date: decisionDate,
        quantity: quantityNum,
        amount: amountNum,
        notes: thought || null,
        title: title.trim() || null,
        emotion: emotion ?? null,
      });

      try {
        const list = await apiGet("/decisions?sort=-decision_date");
        const previousDecisions = (list.items ?? [])
          .filter((d: { id: string }) => d.id !== saved.id)
          .slice(0, 10)
          .map((d: {
            ticker: string;
            scenario_type: string;
            decision_date: string;
            diff_percent: number | null;
            direction: string | null;
            outcome: string | null;
          }) => ({
            ticker: d.ticker,
            scenario_type: d.scenario_type,
            decision_date: d.decision_date,
            diff_percent: d.diff_percent,
            direction: d.direction,
            outcome: d.outcome,
          }))
          .filter((d: { diff_percent: number | null; direction: string | null; outcome: string | null }) =>
            d.diff_percent != null && d.direction != null && d.outcome != null,
          );

        const reflectRes = await apiPost("/reflect", {
          ticker: saved.ticker,
          scenario_type: saved.scenario_type,
          decision_date: saved.decision_date,
          diff_percent: saved.diff_percent,
          direction: saved.direction,
          outcome: saved.outcome,
          previous_decisions: previousDecisions,
        });

        const reflectionText = reflectRes.degraded ? null : reflectRes.reflection || null;
        if (reflectionText) {
          await apiPatch(`/decisions/${saved.id}`, { reflection: reflectionText });
        }
      } catch (e) {
        console.error("reflect/patch failed (decision still saved)", e);
      }

      router.push(`/dashboard/reflections/${saved.id}`);
    } catch (err) {
      // 4xx (validation, 50-cap, etc.) carry actionable messages — show them.
      // 5xx or network drops aren't user-fixable, so show a generic line.
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Couldn't save right now. Please try again.");
      }
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
        {extractError && <p className="text-xs text-red-600">{extractError}</p>}
      </div>

      {/* ── Step 2 header ── */}
      <p className="text-xs font-bold text-[#0d1f35] uppercase tracking-widest">
        Step 2. Decision details
      </p>

      {/* ── Title ── */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
          Title <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
        </Label>
        <Input
          placeholder="e.g. NVDA Earnings Dip Skipped"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={120}
          className="h-12 bg-[#dce3eb] border-0 rounded text-sm text-[#0d1f35] placeholder:text-[#8fa0b0] focus-visible:ring-1 focus-visible:ring-[#0d1f35] shadow-none"
        />
      </div>

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

      {/* ── Emotion ── */}
      <EmotionPicker emotion={emotion} setEmotion={setEmotion} />

      {/* ── Submit ── */}
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleSubmit}
          disabled={loading || !ticker || !scenario}
          className="w-full max-w-lg bg-[#1e2d3d] hover:bg-[#162536] text-white rounded-xl h-14 text-base font-normal tracking-wide"
        >
          {loading ? "Loading..." : "Continue Reflection"}
        </Button>
        {submitError && (
          <p className="text-xs text-red-600 max-w-lg text-center">{submitError}</p>
        )}
        <p className="text-xs text-[#9ca3af]">
          Your inputs are encrypted and private to your journal.
        </p>
      </div>

      <FooterFeatures />
    </div>
  );
}

export default NewPage;
