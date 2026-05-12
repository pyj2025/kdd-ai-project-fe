"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Refreshes server components when auth state changes (login, logout, token refresh).
 * Also refreshes on tab focus to pick up changes from other tabs (since @supabase/ssr
 * stores tokens in cookies, not localStorage, so 'storage' events don't fire).
 */
function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        router.refresh();
      }
    });

    const onFocus = () => router.refresh();
    window.addEventListener("focus", onFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  return null;
}

export default AuthListener;
