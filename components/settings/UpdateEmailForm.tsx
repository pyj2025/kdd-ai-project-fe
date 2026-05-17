"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestEmailChange, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function UpdateEmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(
    requestEmailChange,
    initial
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setEmail("");
    }
    if (state?.error) toast.error(state.error);
  }, [state?.message, state?.error]);

  const valid = EMAIL_RE.test(email);
  const different = email !== currentEmail;
  const canSubmit = valid && different && !pending;

  return (
    <form action={formAction} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="email">New Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="new@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={email.length > 0 && !valid}
          required
        />
        {email.length > 0 && !valid && (
          <p className="text-xs text-red-600">Enter a valid email address.</p>
        )}
        {email.length > 0 && valid && !different && (
          <p className="text-xs text-red-600">
            That&apos;s already your current email.
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        We&apos;ll send a confirmation link to the new address. The change takes
        effect after you click it.
      </p>
      <Button
        type="submit"
        disabled={!canSubmit}
        className="bg-[#0d1f35] hover:bg-[#162d4a] text-white w-fit"
      >
        {pending ? "Sending..." : "Update email"}
      </Button>
    </form>
  );
}

export default UpdateEmailForm;
