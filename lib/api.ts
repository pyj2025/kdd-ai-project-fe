import { createClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}

async function toApiError(res: Response): Promise<ApiError> {
  let code = "API_ERROR";
  let message = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    if (body?.error?.code) code = body.error.code;
    if (body?.error?.message) message = body.error.message;
  } catch {
    /* response wasn't JSON */
  }
  return new ApiError(message, res.status, code);
}

export async function apiGet(path: string) {
  const auth = await authHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...auth },
  });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  const auth = await authHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

export async function apiPatch(path: string, body: unknown) {
  const auth = await authHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

export async function apiDelete(path: string) {
  const auth = await authHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { ...auth },
  });
  if (!res.ok) throw await toApiError(res);
}
