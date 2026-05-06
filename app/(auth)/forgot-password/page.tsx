import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

function ForgotPasswordPage() {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="text-lg font-bold text-[#0d1f35] mb-1">IF-VEST</div>
        <CardTitle className="text-2xl font-bold text-[#0d1f35]">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="text-[#0d1f35] underline underline-offset-4"
          >
            Back to log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ForgotPasswordPage;
