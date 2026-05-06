"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * After a server action returns a success message, reset the form and show a toast.
 * Pass a stable key (the message itself) — effect re-runs when it changes.
 */
export function useResetFormOnSuccess(
  message: string | undefined,
  options?: { toastMessage?: string }
) {
  const formRef = useRef<HTMLFormElement>(null);
  const lastShown = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (message && message !== lastShown.current) {
      lastShown.current = message;
      formRef.current?.reset();
      toast.success(options?.toastMessage ?? message);
    }
  }, [message, options?.toastMessage]);

  return formRef;
}

/**
 * Show a toast when an error message changes. Doesn't reset the form.
 */
export function useToastOnError(error: string | undefined) {
  const lastShown = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (error && error !== lastShown.current) {
      lastShown.current = error;
      toast.error(error);
    }
  }, [error]);
}
