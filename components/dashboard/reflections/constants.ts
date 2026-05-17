import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const SCENARIO_LABEL: Record<string, string> = {
  no_buy: "Missed Buy",
  no_sell: "Missed Sell",
  sold_too_early: "Sold Too Early",
};

export const DIRECTION_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; Icon: React.ElementType }
> = {
  missed_gain: { label: "Missed Gain", color: "text-red-500", bg: "bg-red-50", Icon: TrendingUp },
  avoided_loss: {
    label: "Avoided Loss",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    Icon: TrendingDown,
  },
  kept_gain: {
    label: "Kept Gain",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    Icon: TrendingUp,
  },
  endured_loss: {
    label: "Endured Loss",
    color: "text-red-500",
    bg: "bg-red-50",
    Icon: TrendingDown,
  },
  cut_short_gain: {
    label: "Cut Short Gain",
    color: "text-orange-500",
    bg: "bg-orange-50",
    Icon: TrendingUp,
  },
  well_timed_exit: {
    label: "Well-Timed Exit",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    Icon: TrendingDown,
  },
  neutral: { label: "Neutral", color: "text-gray-500", bg: "bg-gray-50", Icon: Minus },
};

export const OUTCOME_STYLE: Record<string, string> = {
  favorable: "bg-emerald-100 text-emerald-700",
  unfavorable: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
};

export const OUTCOME_LABEL: Record<string, string> = {
  favorable: "Favorable",
  unfavorable: "Unfavorable",
  neutral: "Neutral",
};
