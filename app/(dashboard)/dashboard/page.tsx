import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatCards from "@/components/dashboard/StatCards";
import ReflectionRow from "@/components/dashboard/ReflectionRow";
import { Button } from "@/components/ui/button";

const EMOTIONS = ["High Anxiety", "Neutral", "Cautious"] as const;

function getRandomEmotion(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return EMOTIONS[Math.abs(hash) % EMOTIONS.length];
}

const scenarioToTag = {
  no_buy: "deviation",
  no_sell: "plan-aligned",
  sold_too_early: "manual",
} as const;

const scenarioToLabel = {
  no_buy: "Missed Buy",
  no_sell: "Missed Sell",
  sold_too_early: "Sold Too Early",
} as const;

async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, ticker, scenario_type, decision_date")
    .eq("user_id", user.id)
    .order("decision_date", { ascending: false })
    .limit(3);

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-[#0d1f35] leading-tight">Behavioral Patterns</h1>
        <p className="text-sm text-[#6b7280] mt-2">
          A quantitative mirror of your emotional decision-making cycles.
        </p>
      </div>

      <div className="flex gap-4 mb-10">
        <StatCards />
      </div>

      <div>
        <h2 className="text-base font-bold text-[#0d1f35] mb-2">Recent Reflections</h2>

        {!decisions || decisions.length === 0 ? (
          <p className="text-sm text-[#6b7280] py-6">No reflections yet. Write your first one!</p>
        ) : (
          decisions.map(d => {
            const tag = scenarioToTag[d.scenario_type as keyof typeof scenarioToTag] ?? "manual";
            const label =
              scenarioToLabel[d.scenario_type as keyof typeof scenarioToLabel] ?? d.scenario_type;
            const title = `${d.ticker} – ${label}`;
            const date = new Date(d.decision_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const emotion = getRandomEmotion(d.id);

            return (
              <ReflectionRow
                key={d.id}
                id={d.id}
                title={title}
                date={date}
                emotion={emotion}
                tag={tag}
              />
            );
          })
        )}
      </div>

      <div className="bg-[#0d1f35] mx-10 mb-10 rounded-2xl px-10 py-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Unlock Deep Insights</h3>
          <p className="text-sm text-[#93abbe] max-w-xs leading-relaxed">
            Our algorithm needs more data to map your psychological profile accurately. Your next
            major discovery is only a few reflections away.
          </p>
        </div>
        <Button
          asChild
          className="bg-white text-[#0d1f35] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#f3f5f7] hover:text-[#0d1f35] shrink-0 ml-8"
        >
          <Link href="/dashboard/reflections/new">Write Reflection</Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
