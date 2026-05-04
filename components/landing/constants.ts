import { BarChart2, Brain, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Pillar = {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
};

export const PILLARS: Pillar[] = [
  {
    icon: BarChart2,
    title: "Calculate",
    desc: "Input the assets you considered but discarded. Our engine backtests these 'ghost positions' against your actual portfolio performance to isolate the exact alpha you left on the table.",
    tag: "QUANTITATIVE INPUT",
  },
  {
    icon: Brain,
    title: "Recognize Patterns",
    desc: "Identify recurring cognitive biases. Are you consistently avoiding high-growth tech or exiting energy positions too early? We visualize your psychological blind spots over time.",
    tag: "BEHAVIORAL MAPPING",
  },
  {
    icon: RefreshCw,
    title: "Correct Course",
    desc: "Actionable refinement. Use the insights from your discarded decisions to adjust your current thesis. Turn missed opportunities into future systemic advantages.",
    tag: "ITERATIVE REFINEMENT",
  },
];
