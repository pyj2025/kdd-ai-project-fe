import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

async function ResetPasswordPage() {
  // Reached after the recovery callback exchanged the code and created a session.
  // Without a session we can't update the password, so bounce back to forgot-password.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/forgot-password?error=Reset link expired or invalid.");
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="text-lg font-bold text-[#0d1f35] mb-1">IF-VEST</div>
        <CardTitle className="text-2xl font-bold text-[#0d1f35]">
          Set a new password
        </CardTitle>
        <CardDescription>Choose a new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}

export default ResetPasswordPage;
