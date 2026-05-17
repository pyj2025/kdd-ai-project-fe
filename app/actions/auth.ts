"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapAuthError, type AuthErrorCode } from "@/lib/auth/errorMessages";
import { passwordSchema } from "@/lib/auth/passwordSchema";

export type AuthState = {
  error?: string;
  errorCode?: AuthErrorCode;
  hint?: string;
  message?: string;
};

async function getOrigin(): Promise<string> {
  const h = await headers();
  return (
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`
  );
}

// ============================================
// Login
// ============================================
export async function login(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ============================================
// Signup
// ============================================
export async function signup(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");

  if (!email) return { error: "Email is required." };

  const passwordCheck = passwordSchema.safeParse(password);
  if (!passwordCheck.success) {
    return {
      error:
        passwordCheck.error.issues[0]?.message ??
        "Password doesn't meet security requirements.",
      errorCode: "weak_password",
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name || null },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  // Email confirmation OFF: session issued immediately.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  // Empty identities array means email already exists (Supabase enumeration protection).
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error: "This email is already registered.",
      errorCode: "user_already_exists",
      hint: "If you signed up with Google, use Continue with Google. Otherwise try logging in.",
    };
  }

  // Email confirmation pending — go to dedicated check-email page.
  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

// ============================================
// Logout
// ============================================
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ============================================
// Google OAuth
// ============================================
export async function loginWithGoogle() {
  const origin = await getOrigin();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(mapAuthError(error.message).message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

// ============================================
// Forgot password (request reset email)
// ============================================
export async function requestPasswordReset(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };

  const origin = await getOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  return {
    message:
      "If that email is registered, we've sent a reset link. Please check your inbox.",
    hint: "If you signed up with Google, the reset link won't work. Use Continue with Google instead.",
  };
}

// ============================================
// Reset password (set new password after clicking email link)
// ============================================
export async function updatePassword(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");

  const passwordCheck = passwordSchema.safeParse(password);
  if (!passwordCheck.success) {
    return {
      error:
        passwordCheck.error.issues[0]?.message ??
        "Password doesn't meet security requirements.",
      errorCode: "weak_password",
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ============================================
// Resend confirmation email
// ============================================
export async function resendConfirmation(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Email is required." };

  const origin = await getOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  return { message: "Confirmation email sent. Please check your inbox." };
}

// ============================================
// Update display name (settings)
// ============================================
export async function updateDisplayName(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: name },
  });
  if (authError) {
    return { error: mapAuthError(authError.message).message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: name })
    .eq("id", user.id);
  if (profileError) {
    return { error: profileError.message };
  }

  revalidatePath("/", "layout");
  return { message: "Name updated." };
}

// ============================================
// Change password (settings, while logged in)
// ============================================
export async function changePassword(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");

  const passwordCheck = passwordSchema.safeParse(password);
  if (!passwordCheck.success) {
    return {
      error:
        passwordCheck.error.issues[0]?.message ??
        "Password doesn't meet security requirements.",
      errorCode: "weak_password",
    };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  return { message: "Password updated." };
}

// ============================================
// Change email (settings)
// ============================================
export async function requestEmailChange(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const newEmail = String(formData.get("email") ?? "").trim();
  if (!newEmail) return { error: "Email is required." };

  const origin = await getOrigin();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (newEmail === user.email) {
    return { error: "That's already your current email." };
  }

  const nextPath = encodeURIComponent("/settings?emailChanged=1");
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${origin}/auth/callback?next=${nextPath}` }
  );

  if (error) {
    const friendly = mapAuthError(error.message);
    return {
      error: friendly.message,
      errorCode: friendly.code,
      hint: friendly.hint,
    };
  }

  return {
    message: `Confirmation sent to ${newEmail}. Click the link to complete the change.`,
  };
}

// ============================================
// Resend email confirmation for verified status (settings)
// ============================================
export async function resendVerification(): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) redirect("/login");

  const origin = await getOrigin();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: user.email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return { error: mapAuthError(error.message).message };
  }
  return { message: "Verification email sent." };
}

// ============================================
// Delete account (settings)
// ============================================
export async function deleteAccount(
  _prev: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const confirm = String(formData.get("confirm") ?? "").trim();
  if (confirm !== "DELETE") {
    return { error: "Confirmation text doesn't match. Type 'DELETE' to confirm." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return { error: error.message };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?deleted=1");
}
