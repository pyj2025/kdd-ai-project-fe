"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, XCircle, Loader2, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SearchItem = {
  ticker: string;
  name: string;
  exchange?: string | null;
};

type ValidationState = "idle" | "loading" | "valid" | "invalid";

interface TickerInputProps {
  value: string;
  onChange: (ticker: string) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function TickerInput({ value, onChange }: TickerInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [validation, setValidation] = useState<ValidationState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const lastValidatedTicker = useRef<string | null>(null);
  const selectedFromDropdown = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setTriggerWidth(entries[0]?.contentRect.width);
    });
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  // Search
  useEffect(() => {
    const q = debouncedInput.trim();
    if (!q || selectedFromDropdown.current) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tickers/search?q=${encodeURIComponent(q)}&limit=6`,
          { signal: controller.signal },
        );
        if (!res.ok) return;
        const data = await res.json();
        const items: SearchItem[] = data.items ?? [];
        setSuggestions(items);
        setHighlightedIndex(0);
        if (items.length > 0) setOpen(true);
      } catch {}
    })();
    return () => controller.abort();
  }, [debouncedInput]);

  // Validate
  const validateTicker = useCallback(async (ticker: string) => {
    if (!ticker || lastValidatedTicker.current === ticker) return;
    lastValidatedTicker.current = ticker;
    setValidation("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickers/validate?ticker=${encodeURIComponent(ticker)}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.valid) {
        setValidation("valid");
      } else {
        setValidation("invalid");
        setErrorMsg(`"${ticker}" is not a recognized ticker.`);
      }
    } catch {
      setValidation("invalid");
      setErrorMsg("Could not validate ticker. Check your connection.");
    }
  }, []);

  // Select
  const selectSuggestion = useCallback(
    (item: SearchItem) => {
      selectedFromDropdown.current = true;
      setInputValue(item.ticker);
      onChange(item.ticker);
      setOpen(false);
      setValidation("valid");
      setErrorMsg(null);
      lastValidatedTicker.current = item.ticker;
    },
    [onChange],
  );

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upper = e.target.value.toUpperCase();
    selectedFromDropdown.current = false;
    setInputValue(upper);
    onChange(upper);
    setValidation("idle");
    setErrorMsg(null);
    lastValidatedTicker.current = null;
    if (!upper) {
      setSuggestions([]);
      setOpen(false);
    }
  };

  // Keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter" && inputValue) validateTicker(inputValue);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[highlightedIndex]) selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      // focus the hidden input when popover opens
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (inputValue && !selectedFromDropdown.current) {
      validateTicker(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
        Ticker
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-12 justify-between bg-[#dce3eb] border-0 rounded text-sm font-semibold px-4 shadow-none hover:bg-[#d0d9e3] transition-colors",
              inputValue ? "text-[#0d1f35]" : "text-[#8fa0b0]",
              validation === "invalid" && "bg-red-50 hover:bg-red-50 ring-1 ring-red-300",
              validation === "valid" && "ring-1 ring-emerald-400",
            )}
          >
            <span>{inputValue || "NVDA"}</span>
            <span className="shrink-0 ml-2">
              {validation === "loading" && (
                <Loader2 className="h-4 w-4 text-[#8fa0b0] animate-spin" />
              )}
              {validation === "valid" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {validation === "invalid" && <XCircle className="h-4 w-4 text-red-400" />}
              {validation === "idle" && <ChevronsUpDown className="h-4 w-4 text-[#8fa0b0]" />}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 overflow-hidden rounded-xl shadow-md border-0"
          style={{
            width: triggerWidth ? `${triggerWidth}px` : "100%",
            backgroundColor: "#f8f9fb",
          }}
          align="start"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          {/* Search input */}
          <div className="px-3 pt-3 pb-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search ticker..."
              autoComplete="off"
              className="w-full h-10 bg-[#edf0f4] rounded-lg text-sm font-medium text-[#0d1f35] placeholder:text-[#b0bec8] outline-none"
            />
          </div>

          {/* Results */}
          <div className="pb-2 max-h-[280px] overflow-y-auto">
            {inputValue.length > 0 && suggestions.length === 0 && (
              <p className="py-6 text-center text-xs text-[#9ca3af]">
                No results for &quot;{inputValue}&quot;
              </p>
            )}

            {suggestions.map((item, idx) => (
              <button
                key={item.ticker}
                type="button"
                onMouseDown={() => selectSuggestion(item)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-2 text-left transition-colors",
                  idx === highlightedIndex ? "bg-[#0d1f35]" : "hover:bg-[#edf0f4]",
                )}
              >
                {/* Ticker */}
                <span
                  className={cn(
                    "w-20 shrink-0 text-sm font-bold",
                    idx === highlightedIndex ? "text-white" : "text-[#0d1f35]",
                  )}
                >
                  {item.ticker}
                </span>

                {/* Name + Exchange stacked */}
                <div className="flex flex-col min-w-0 py-1">
                  <span
                    className={cn(
                      "text-xs truncate leading-snug",
                      idx === highlightedIndex ? "text-white" : "text-[#4b5563]",
                    )}
                  >
                    {item.name}
                  </span>
                  {item.exchange && (
                    <span
                      className={cn(
                        "text-[10px] leading-snug mt-0.5",
                        idx === highlightedIndex ? "text-white" : "text-[#9ca3af]",
                      )}
                    >
                      {item.exchange}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {validation === "invalid" && errorMsg && (
        <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
      )}
    </div>
  );
}

export default TickerInput;
