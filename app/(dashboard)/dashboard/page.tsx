import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name ??
    (user.user_metadata?.display_name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    null;

  const greeting = displayName ? `Hi, ${displayName}` : "Hi there";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0d1f35]">{greeting}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Logged in as <span className="font-mono">{user.email}</span>
        </p>
      </div>

      {!displayName && (
        <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-sm flex items-center justify-between gap-4">
          <span className="text-blue-900">Add your name so we can greet you properly.</span>
          <Link
            href="/settings"
            className="text-[#0d1f35] underline underline-offset-4 text-sm font-medium whitespace-nowrap"
          >
            Go to settings
          </Link>
        </div>
      )}

      {/* 버튼 + 결과 카드 (Client Component) */}
      <DashboardClient />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0d1f35]" />
            Your decisions will appear here
          </CardTitle>
          <CardDescription>
            Log a buy or sell decision you made (or didn&apos;t make), and we&apos;ll show you what
            would have happened. Pattern analysis unlocks at 10 entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            (Decision logger and analysis coming soon.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
