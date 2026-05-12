"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

type TagVariant = "deviation" | "plan-aligned" | "manual";

export type Filters = {
  tag: TagVariant | "all";
  emotion: string;
};

function FilterDialog({ filters, onApply }: { filters: Filters; onApply: (f: Filters) => void }) {
  const [local, setLocal] = useState<Filters>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(local);
    setOpen(false);
  };

  const handleReset = () => {
    const reset: Filters = { tag: "all", emotion: "all" };
    setLocal(reset);
    onApply(reset);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-[#f3f5f7] transition-colors text-[#6b7280] hover:text-[#0d1f35]">
          <SlidersHorizontal size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#0d1f35]">Filter Reflections</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-[#6b7280]">
              Tag
            </Label>
            <Select
              value={local.tag}
              onValueChange={v => setLocal(f => ({ ...f, tag: v as Filters["tag"] }))}
            >
              <SelectTrigger className="bg-[#f3f5f7] border-0 rounded-xl">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="deviation">Deviation</SelectItem>
                <SelectItem value="plan-aligned">Plan-aligned</SelectItem>
                <SelectItem value="manual">Manual Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-widest text-[#6b7280]">
              Emotion
            </Label>
            <Select
              value={local.emotion}
              onValueChange={v => setLocal(f => ({ ...f, emotion: v }))}
            >
              <SelectTrigger className="bg-[#f3f5f7] border-0 rounded-xl">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="High Anxiety">High Anxiety</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Cautious">Cautious</SelectItem>
                <SelectItem value="Fear">Fear</SelectItem>
                <SelectItem value="Greed">Greed</SelectItem>
                <SelectItem value="Optimistic">Optimistic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="ghost" className="flex-1 text-[#6b7280]" onClick={handleReset}>
              Reset
            </Button>
            <Button
              className="flex-1 bg-[#0d1f35] hover:bg-[#162d4a] text-white"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;
