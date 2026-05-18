import { cn } from "@/lib/utils";

const EMOTIONS = [
  { value: "confident", label: "Confident" },
  { value: "optimistic", label: "Optimistic" },
  { value: "neutral", label: "Neutral" },
  { value: "cautious", label: "Cautious" },
  { value: "anxious", label: "Anxious" },
  { value: "fearful", label: "Fearful" },
  { value: "greedy", label: "Greedy" },
];

interface EmotionPickerProps {
  emotion: string | null;
  setEmotion: (value: string) => void;
}

function EmotionPicker({ emotion, setEmotion }: EmotionPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d1f35]">
        Emotion at the Time
      </p>
      <p className="text-xs text-[#6b7280] -mt-1">
        How were you feeling when you made this decision?
      </p>
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map(e => (
          <button
            key={e.value}
            type="button"
            onClick={() => setEmotion(e.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
              emotion === e.value
                ? "bg-[#0d1f35] border-[#0d1f35] text-white"
                : "bg-white border-[#d1d5db] text-[#0d1f35] hover:border-[#0d1f35]",
            )}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmotionPicker;
