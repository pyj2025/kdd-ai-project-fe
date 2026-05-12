"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/auth/PasswordInput";
import { changePassword, type AuthState } from "@/app/actions/auth";
import { passwordSchema } from "@/lib/auth/passwordSchema";
import { toast } from "sonner";

const initial: AuthState = {};

function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setPassword("");
      setConfirm("");
    }
    if (state?.error) toast.error(state.error);
  }, [state?.message, state?.error]);

  const valid = passwordSchema.safeParse(password).success;
  const match = password.length > 0 && password === confirm;
  const canSubmit = valid && match && !pending;

  return (
    <form action={formAction} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="password">New Password</Label>
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
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          autoComplete="new-password"
          required
          value={confirm}
          onValueChange={setConfirm}
        />
        {confirm.length > 0 && !match && (
          <p className="text-xs text-red-600">Passwords do not match.</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={!canSubmit}
        className="bg-[#0d1f35] hover:bg-[#162d4a] text-white w-fit"
      >
        {pending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

export default UpdatePasswordForm;
