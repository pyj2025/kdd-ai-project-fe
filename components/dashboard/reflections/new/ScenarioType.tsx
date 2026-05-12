import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    value: "no_buy",
    label: "No Buy",
    description: "Deciding against a potential entry despite external hype.",
    icon: "/icons/scenarios/piggybank.png",
  },
  {
    value: "no_sell",
    label: "No Sell",
    description: "Exercising patience and holding during market volatility",
    icon: "/icons/scenarios/money.png",
  },
  {
    value: "sold_too_early",
    label: "Sold Early",
    description: "Exiting a position before your original price target was hit",
    icon: "/icons/scenarios/briefcase.png",
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
            <img
              src={s.icon}
              alt=""
              aria-hidden="true"
              className="w-16 h-16 shrink-0 object-contain"
            />
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
