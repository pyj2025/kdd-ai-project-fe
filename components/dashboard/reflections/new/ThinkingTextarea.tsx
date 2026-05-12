import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ThoughtTextareaProps {
  thought: string;
  setThought: (value: string) => void;
  onExtract: () => void;
  extractLoading: boolean;
}

function ThoughtTextarea({ thought, setThought, onExtract, extractLoading }: ThoughtTextareaProps) {
  const canExtract = thought.trim().length >= 3 && !extractLoading;

  return (
    <>
      <p className="text-xs font-bold text-[#0d1f35] uppercase tracking-widest">
        Step 1. Describe your decision <span className="text-[#9ca3af] font-normal normal-case tracking-normal">(optional)</span>
      </p>
      <Textarea
        placeholder="e.g. I'm thinking about selling my NVDA position because the P/E ratio feels stretched, even though growth remains strong..."
        value={thought}
        onChange={e => setThought(e.target.value)}
        className="min-h-[160px] resize-none bg-[#f3f5f7] border-0 rounded-xl text-sm text-[#0d1f35] placeholder:text-[#9ca3af] focus-visible:ring-1 focus-visible:ring-[#0d1f35]"
      />
      <div className="flex justify-start pt-1">
        <Button
          type="button"
          onClick={onExtract}
          disabled={!canExtract}
          className="h-11 px-5 text-sm font-medium bg-[#0d1f35] text-white rounded-lg hover:bg-[#1e2d3d] disabled:bg-[#0d1f35] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {extractLoading ? "Extracting..." : "Auto-fill from my thought"}
        </Button>
      </div>
    </>
  );
}

export default ThoughtTextarea;
