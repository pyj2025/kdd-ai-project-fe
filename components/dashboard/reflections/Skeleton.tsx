import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-[#e8eaed] rounded-xl", className)} />;
}

export default Skeleton;
