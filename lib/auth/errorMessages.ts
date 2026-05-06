export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "user_already_exists"
  | "rate_limited"
  | "weak_password"
  | "same_password"
  | "invalid_email"
  | "session_expired"
  | "oauth_account_exists"
  | "unknown";

export type FriendlyError = {
  code: AuthErrorCode;
  message: string;
  hint?: string;
};

/**
 * Maps Supabase raw error messages to friendly user-facing strings.
 * Returns a code so the UI can branch on it (e.g. show a "resend" button).
 */
export function mapAuthError(rawMessage: string | undefined | null): FriendlyError {
  const m = (rawMessage ?? "").toLowerCase();

  if (m.includes("invalid login credentials") || m.includes("invalid_credentials")) {
    return {
      code: "invalid_credentials",
      message: "Incorrect email or password.",
      hint: "If you signed up with Google, use Continue with Google instead.",
    };
  }

  if (m.includes("email not confirmed") || m.includes("email_not_confirmed")) {
    return {
      code: "email_not_confirmed",
      message: "Your email isn't verified yet.",
      hint: "Click the link in the email we sent. Check your spam folder, or resend below.",
    };
  }

  if (m.includes("user already registered") || m.includes("already been registered")) {
    return {
      code: "user_already_exists",
      message: "This email is already registered.",
      hint: "If you signed up with Google, try Continue with Google. Otherwise log in.",
    };
  }

  if (
    m.includes("rate limit") ||
    m.includes("for security purposes") ||
    m.includes("too many requests")
  ) {
    return {
      code: "rate_limited",
      message: "Too many attempts. Please try again in a moment.",
      hint: "For security, wait about a minute before retrying.",
    };
  }

  if (m.includes("password should be") || m.includes("weak password")) {
    return {
      code: "weak_password",
      message: "Password doesn't meet security requirements.",
      hint: "Use 8+ characters with a letter, number, and special character.",
    };
  }

  if (m.includes("new password should be different")) {
    return {
      code: "same_password",
      message: "New password must be different from your current one.",
    };
  }

  if (m.includes("invalid email") || m.includes("unable to validate email")) {
    return {
      code: "invalid_email",
      message: "That doesn't look like a valid email address.",
    };
  }

  if (m.includes("jwt expired") || m.includes("session")) {
    return {
      code: "session_expired",
      message: "Your session expired. Please log in again.",
    };
  }

  return {
    code: "unknown",
    message: rawMessage || "Something went wrong. Please try again.",
  };
}
