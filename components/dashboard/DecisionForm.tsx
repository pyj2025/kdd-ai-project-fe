"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const SCENARIO_OPTIONS = [
  { value: "NO_BUY", label: "NO_BUY — 안 샀을 때" },
  { value: "NO_SELL", label: "NO_SELL — 안 팔았을 때" },
  { value: "SELL_THEN_RISE", label: "SELL_THEN_RISE — 팔았는데 올랐을 때" },
];

type FormValues = {
  ticker: string;
  scenario_type: string;
  target_date: string;
  quantity: number;
  amount: number;
};

export type CalcResult = {
  past_price: number;
  current_price: number;
  difference_amount: number;
  difference_percent: number;
  message: string;
  status_color: string;
  icon: string;
};

const defaultValues: FormValues = {
  ticker: "",
  scenario_type: "",
  target_date: format(new Date(), "yyyy-MM-dd"),
  quantity: 0,
  amount: 0,
};

interface DecisionFormProps {
  onResult: (result: CalcResult, ticker: string) => void;
}

export function DecisionForm({ onResult }: DecisionFormProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (selected) {
      setValues(v => ({ ...v, target_date: format(selected, "yyyy-MM-dd") }));
    }
    setCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log(values);

    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail ?? `Error ${res.status}`);
      }

      const result: CalcResult = await res.json();
      onResult(result, values.ticker);
      setOpen(false);
      setValues(defaultValues);
      setDate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0d1f35] hover:bg-[#162d4a] text-white">+ Log a Decision</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Decision</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              placeholder="e.g. AAPL, TSLA"
              value={values.ticker}
              onChange={e => setValues(v => ({ ...v, ticker: e.target.value.toUpperCase() }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Scenario Type</Label>
            <Select
              value={values.scenario_type}
              onValueChange={val => setValues(v => ({ ...v, scenario_type: val }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="시나리오 선택" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Target Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={d => d > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                placeholder="0"
                value={values.quantity || ""}
                onChange={e => setValues(v => ({ ...v, quantity: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₩/$)</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                placeholder="0"
                value={values.amount || ""}
                onChange={e => setValues(v => ({ ...v, amount: Number(e.target.value) }))}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Quantity 또는 Amount 중 하나만 입력하면 돼요.
          </p>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white"
          >
            {loading ? "계산 중..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
