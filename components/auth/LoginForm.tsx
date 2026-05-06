"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/auth/PasswordInput";
import { login, resendConfirmation, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm({ oauthError }: { oauthError?: string }) {
  const [state, formAction, pending] = useActionState(login, initial);
  const [resendState, resendAction, resendPending] = useActionState(
    resendConfirmation,
    initial
  );
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // Surface OAuth error from query string as a toast on first render.
  useEffect(() => {
    if (oauthError) toast.error(oauthError);
  }, [oauthError]);

  // Surface resend feedback as toast.
  useEffect(() => {
    if (resendState?.message) toast.success(resendState.message);
    if (resendState?.error) toast.error(resendState.error);
  }, [resendState?.message, resendState?.error]);

  const emailValid = EMAIL_RE.test(emailValue);
  const canSubmit = emailValid && passwordValue.length > 0 && !pending;

  return (
    <div className="grid gap-4">
      <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            aria-invalid={emailValue.length > 0 && !emailValid}
          />
          {emailValue.length > 0 && !emailValid && (
            <p className="text-xs text-red-600">Enter a valid email address.</p>
          )}
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
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={passwordValue}
            onValueChange={setPasswordValue}
          />
        </div>

        {state?.error && (
          <div role="alert" className="text-sm">
            <p className="text-red-600">{state.error}</p>
            {state.hint && (
              <p className="text-xs text-muted-foreground mt-1">{state.hint}</p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white"
        >
          {pending ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {state?.errorCode === "email_not_confirmed" && (
        <form action={resendAction}>
          <input type="hidden" name="email" value={emailValue} />
          <Button
            type="submit"
            variant="outline"
            disabled={resendPending}
            className="w-full"
          >
            {resendPending ? "Sending..." : "Resend confirmation email"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
