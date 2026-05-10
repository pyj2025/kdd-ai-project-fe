import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    value: "no_buy",
    label: "No Buy",
    description: "Deciding against a potential entry despite external hype.",
  },
  {
    value: "no_sell",
    label: "No Sell",
    description: "Exercising patience and holding during market volatility",
  },
  {
    value: "sold_too_early",
    label: "Sold Early",
    description: "Exiting a position before your original price target was hit",
  },
];

interface ScenarioTypeProps {
  scenario: string | null;
  setScenario: (value: string) => void;
}

function ScenarioType({ scenario, setScenario }: ScenarioTypeProps) {
  return (
    <>
      <p className="text-sm font-semibold text-[#0d1f35]">Select Scenario Type</p>
      <div className="grid grid-cols-3 gap-4">
        {SCENARIOS.map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => setScenario(s.value)}
            className={cn(
              "flex flex-row rounded-2xl p-4 text-left transition-all border-2 gap-2",
              scenario === s.value
                ? "bg-[#1e3a52] border-[#1e3a52]"
                : "bg-[#1e3a52]/90 border-transparent hover:border-[#1e3a52]",
            )}
          >
            {/* Icon placeholder — 디자이너가 피그마에서 직접 교체 예정 */}
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-white/20" />
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">{s.label}</p>
              <p className="text-xs text-[#93abbe] leading-relaxed">{s.description}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default ScenarioType;
