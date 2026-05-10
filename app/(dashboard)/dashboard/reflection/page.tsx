"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import ThoughtTextarea from "@/components/dashboard/reflection/ThinkingTextarea";
import ScenarioType from "@/components/dashboard/reflection/ScenarioType";
import FooterFeatures from "@/components/dashboard/reflection/FooterFeatures";

function ReflectionPage() {
  const [thought, setThought] = useState("");
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [scenario, setScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!ticker || !scenario) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          scenario_type: scenario,
          target_date: date ? format(date, "yyyy-MM-dd") : "",
          quantity: Number(quantity) || 0,
          amount: Number(amount) || 0,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      // handle result
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-8 py-8 space-y-8">
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
        <ThoughtTextarea thought={thought} setThought={setThought} />
      </div>

      {/* ── Inputs row ── */}
      <div className="grid grid-cols-4 gap-6">
        {/* Ticker */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
            Ticker
          </Label>
          <Input
            placeholder="NVDA"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            className="h-12 bg-[#dce3eb] border-0 rounded text-sm text-[#0d1f35] placeholder:text-[#8fa0b0] focus-visible:ring-1 focus-visible:ring-[#0d1f35] shadow-none"
          />
        </div>

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

export default ReflectionPage;
