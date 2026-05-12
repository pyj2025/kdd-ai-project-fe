"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/auth/PasswordInput";
import { updatePassword, type AuthState } from "@/app/actions/auth";

const initial: AuthState = {};

function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initial);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          showStrength
          showRules
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          autoComplete="new-password"
          required
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
        disabled={pending}
        className="w-full bg-[#0d1f35] hover:bg-[#162d4a] text-white"
      >
        {pending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
