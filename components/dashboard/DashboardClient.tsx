"use client";

import { useState } from "react";
import { DecisionForm, CalcResult } from "./DecisionForm";
import { ResultCard } from "./ResultCard";

export function DashboardClient() {
  const [result, setResult] = useState<CalcResult | null>(null);
  const [ticker, setTicker] = useState("");

  const handleResult = (res: CalcResult, tk: string) => {
    setResult(res);
    setTicker(tk);
  };

  return (
    <>
      <div className="flex justify-end">
        <DecisionForm onResult={handleResult} />
      </div>
      {result && <ResultCard result={result} ticker={ticker} />}
    </>
  );
}
