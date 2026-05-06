"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/auth/PasswordInput";
import { signup, type AuthState } from "@/app/actions/auth";
import { passwordSchema } from "@/lib/auth/passwordSchema";

const initial: AuthState = {};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const emailValid = EMAIL_RE.test(email);
  const passwordValid = passwordSchema.safeParse(password).success;
  const passwordsMatch = password.length > 0 && password === confirm;
  const canSubmit =
    emailValid && passwordValid && passwordsMatch && !pending;

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" type="text" placeholder="John Doe" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={email.length > 0 && !emailValid}
        />
        {email.length > 0 && !emailValid && (
          <p className="text-xs text-red-600">Enter a valid email address.</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          showStrength
          showRules
          value={password}
          onValueChange={setPassword}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          autoComplete="new-password"
          required
          value={confirm}
          onValueChange={setConfirm}
        />
        {confirm.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-600">Passwords do not match.</p>
        )}
      </div>

      {state?.error && (
        <div role="alert" className="text-sm">
          <p className="text-red-600">{state.error}</p>
          {state.hint && (
            <p className="text-xs text-muted-foreground mt-1">{state.hint}</p>
          )}
          {state.errorCode === "user_already_exists" && (
            <Link
              href="/login"
              className="inline-block mt-2 text-xs underline text-[#0d1f35]"
            >
              Go to log in
            </Link>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white"
      >
        {pending ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}

export default SignupForm;
