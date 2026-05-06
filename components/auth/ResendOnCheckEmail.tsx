"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { resendConfirmation, type AuthState } from "@/app/actions/auth";
import { toast } from "sonner";

const initial: AuthState = {};

function ResendOnCheckEmail({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    resendConfirmation,
    initial
  );

  useEffect(() => {
    if (state?.message) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state?.message, state?.error]);

  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Sending..." : "Resend confirmation email"}
      </Button>
    </form>
  );
}

export default ResendOnCheckEmail;
