import { format, parseISO } from "date-fns";

export const formatUsd = (n: number | null) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const formatPercent = (n: number | null) => {
  if (n == null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
};

export const formatDate = (s: string | null) => {
  if (!s) return "—";
  try {
    return format(parseISO(s), "MMM d, yyyy");
  } catch {
    return s;
  }
};
