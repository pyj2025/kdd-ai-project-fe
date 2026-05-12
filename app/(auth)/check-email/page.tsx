import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResendOnCheckEmail from "@/components/auth/ResendOnCheckEmail";

async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) {
    redirect("/signup");
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1 items-center text-center">
        <div className="text-lg font-bold text-[#0d1f35] mb-1">IF-VEST</div>
        <div className="rounded-full bg-blue-50 p-3 mb-2">
          <Mail className="h-6 w-6 text-[#0d1f35]" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#0d1f35]">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a confirmation link to{" "}
          <span className="font-medium text-[#0d1f35]">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Click the link in the email to verify your account and continue.</p>
          <p className="text-xs">
            Can&apos;t find it? Check your spam folder, or resend below.
          </p>
        </div>
        <ResendOnCheckEmail email={email} />
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-center text-sm">
        <Link
          href="/signup"
          className="text-muted-foreground underline underline-offset-4 hover:text-[#0d1f35]"
        >
          Wrong email? Sign up again
        </Link>
        <Link
          href="/login"
          className="text-[#0d1f35] underline underline-offset-4"
        >
          Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
}

export default CheckEmailPage;
