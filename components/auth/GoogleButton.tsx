"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/app/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Redirecting to Google..." : label}
    </Button>
  );
}

function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  return (
    <form action={loginWithGoogle} className="w-full">
      <SubmitButton label={label} />
    </form>
  );
}

export default GoogleButton;
