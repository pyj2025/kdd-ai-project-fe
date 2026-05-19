import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatCards from "@/components/dashboard/StatCards";
import RecentReflections from "@/components/dashboard/RecentReflections";
import { Button } from "@/components/ui/button";

async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
        <RecentReflections />
      </div>

      <div className="bg-[#0d1f35] mx-10 mb-10 rounded-2xl px-10 py-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Unlock Deep Insights</h3>
          <p className="text-sm text-[#93abbe] max-w-xs leading-relaxed">
            Log more reflections to unlock pattern analysis.
          </p>
        </div>
        <Button
          asChild
          className="bg-white text-[#0d1f35] hover:bg-[#f3f5f7] rounded-xl h-12 px-6 text-sm font-semibold"
        >
          <Link href="/dashboard/reflections/new">Add Reflection</Link>
        </Button>
      </div>
    </div>
  );
}

export default DashboardPage;
