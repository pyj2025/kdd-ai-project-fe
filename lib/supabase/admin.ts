import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role 권한 supabase client.
 * RLS를 우회하므로 server action / route handler 안에서만 사용.
 * 절대 client component에서 import 금지. ("server-only"가 빌드시 차단)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
