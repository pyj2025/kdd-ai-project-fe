"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};
const COOLDOWN_SECONDS = 60;

function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initial
  );
  const [cooldown, setCooldown] = useState(0);

  // Toast feedback + start cooldown on success.
  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setCooldown(COOLDOWN_SECONDS);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.message, state?.error]);

  // Countdown tick.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const disabled = pending || cooldown > 0;

  return (
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
        />
      </div>

      {state?.message && (
        <div className="text-sm">
          <p className="text-green-700">{state.message}</p>
          {state.hint && (
            <p className="text-xs text-muted-foreground mt-1">{state.hint}</p>
          )}
        </div>
      )}
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={disabled}
        className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white"
      >
        {pending
          ? "Sending..."
          : cooldown > 0
          ? `Resend in ${cooldown}s`
          : "Send reset link"}
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
