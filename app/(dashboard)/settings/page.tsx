import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import UpdateNameForm from "@/components/settings/UpdateNameForm";
import UpdateEmailForm from "@/components/settings/UpdateEmailForm";
import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm";
import DeleteAccountForm from "@/components/settings/DeleteAccountForm";
import ResendVerificationButton from "@/components/settings/ResendVerificationButton";
import EmailChangedToast from "@/components/settings/EmailChangedToast";

async function SettingsPage() {
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

  const provider = user.app_metadata?.provider ?? "email";
  const isOAuth = provider !== "email";
  const isVerified = !!user.email_confirmed_at;

  return (
    <div className="px-8 py-8 space-y-8">
      <Suspense fallback={null}>
        <EmailChangedToast />
      </Suspense>

      <h1 className="text-3xl font-bold text-[#0d1f35]">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <span className="font-mono">{user.email}</span>
            {isOAuth && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {provider}
              </span>
            )}
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                <AlertCircle className="h-3 w-3" />
                Not verified
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UpdateNameForm defaultName={profile?.display_name ?? ""} />
          {!isVerified && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 flex items-center justify-between gap-3">
              <span>Please verify your email to secure your account.</span>
              <ResendVerificationButton />
            </div>
          )}
        </CardContent>
      </Card>

      {!isOAuth && (
        <Card>
          <CardHeader>
            <CardTitle>Change email</CardTitle>
            <CardDescription>
              You&apos;ll need to confirm the change from the new email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateEmailForm currentEmail={user.email ?? ""} />
          </CardContent>
        </Card>
      )}

      {!isOAuth && (
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              At least 8 characters with a letter, number, and special character.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      )}

      <Separator />

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Danger zone</CardTitle>
          <CardDescription>Account deletion is permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
