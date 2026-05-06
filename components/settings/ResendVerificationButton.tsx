"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { resendVerification } from "@/app/actions/auth";
import { toast } from "sonner";

function ResendVerificationButton() {
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await resendVerification();
      if (result.message) toast.success(result.message);
      if (result.error) toast.error(result.error);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? "Sending..." : "Resend verification"}
    </Button>
  );
}

export default ResendVerificationButton;
