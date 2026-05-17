import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReflectionsClient from "@/components/dashboard/reflections/ReflectionsClient";

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

const EMOTIONS = ["High Anxiety", "Neutral", "Cautious"] as const;

function getRandomEmotion(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return EMOTIONS[Math.abs(hash) % EMOTIONS.length];
}

async function ReflectionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: decisions } = await supabase
    .from("decisions")
    .select("id, ticker, scenario_type, decision_date")
    .eq("user_id", user.id)
    .order("decision_date", { ascending: false });

  const reflections = (decisions ?? []).map(d => {
    const tag = scenarioToTag[d.scenario_type as keyof typeof scenarioToTag] ?? "manual";
    const label =
      scenarioToLabel[d.scenario_type as keyof typeof scenarioToLabel] ?? d.scenario_type;
    return {
      id: d.id as string,
      title: `${d.ticker} – ${label}`,
      date: new Date(d.decision_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      emotion: getRandomEmotion(d.id),
      tag,
    };
  });

  return <ReflectionsClient reflections={reflections} />;
}

export default ReflectionsPage;
