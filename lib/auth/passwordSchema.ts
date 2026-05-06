import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Must be at least 8 characters." })
  .regex(/[A-Za-z]/, { message: "Must include a letter." })
  .regex(/[0-9]/, { message: "Must include a number." })
  .regex(/[^A-Za-z0-9]/, { message: "Must include a special character." });

export type PasswordCheck = {
  label: string;
  passed: boolean;
};

export function checkPasswordRules(password: string): PasswordCheck[] {
  return [
    { label: "8+ characters", passed: password.length >= 8 },
    { label: "Includes a letter", passed: /[A-Za-z]/.test(password) },
    { label: "Includes a number", passed: /[0-9]/.test(password) },
    { label: "Includes a special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function passwordStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  const passed = checkPasswordRules(password).filter((r) => r.passed).length;
  const labels = ["None", "Very weak", "Weak", "Fair", "Strong"] as const;
  return { score: passed as 0 | 1 | 2 | 3 | 4, label: labels[passed] };
}
