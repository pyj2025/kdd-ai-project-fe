"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Triggers a toast when the URL has ?emailChanged=1, then strips the query.
 * Mounted on the settings page; fires once after the email-change callback returns.
 */
function EmailChangedToast() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("emailChanged") === "1") {
      toast.success("Email updated successfully.");
      router.replace("/settings");
    }
  }, [params, router]);

  return null;
}

export default EmailChangedToast;
