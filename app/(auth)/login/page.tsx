import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="text-lg font-bold text-[#0d1f35] mb-1">IF-VEST</div>
        <CardTitle className="text-2xl font-bold text-[#0d1f35]">Welcome back</CardTitle>
        <CardDescription>Enter your email and password to access your account.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-[#0d1f35]"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white">Log In</Button>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#0d1f35] underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginPage;
