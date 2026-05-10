import { Textarea } from "@/components/ui/textarea";

interface ThoughtTextareaProps {
  thought: string;
  setThought: (value: string) => void;
}

function ThoughtTextarea({ thought, setThought }: ThoughtTextareaProps) {
  return (
    <>
      <p className="text-xs font-bold text-[#0d1f35] uppercase tracking-widest">
        What decision are you thinking about today?
      </p>
      <Textarea
        placeholder="e.g. I'm thinking about selling my NVDA position because the P/E ratio feels stretched, even though growth remains strong..."
        value={thought}
        onChange={e => setThought(e.target.value)}
        className="min-h-[160px] resize-none bg-[#f3f5f7] border-0 rounded-xl text-sm text-[#0d1f35] placeholder:text-[#9ca3af] focus-visible:ring-1 focus-visible:ring-[#0d1f35]"
      />
    </>
  );
}

export default ThoughtTextarea;
