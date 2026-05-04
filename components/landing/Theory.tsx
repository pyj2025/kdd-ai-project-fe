import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Theory() {
  return (
    <section
      id="theory"
      className="scroll-mt-14 min-h-screen flex items-center px-6 md:px-16 py-24 max-w-screen-xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center">
        <div className="flex flex-col gap-6">
          <Badge
            variant="outline"
            className="w-fit text-xs tracking-widest uppercase text-[#0d1f35] border-[#0d1f35]/30"
          >
            Portfolio Reflection Engine
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1f35] leading-tight">
            The decisions you <span className="text-[#5a7fa8]">didn't</span> make are your greatest
            data.
          </h1>
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed max-w-md">
            If-Vest is the &ldquo;Honest Mirror&rdquo; for serious investors. We quantify the
            opportunity cost of the road not taken, revealing the hidden patterns in your decision
            architecture.
          </p>
          <div className="flex items-center gap-4 mt-2 h-12">
            <Button className="bg-[#0d1f35] hover:bg-[#162d4a] text-white px-6 h-full" asChild>
              <Link href="/signup">Start Your Reflection →</Link>
            </Button>
            <Button
              variant="outline"
              className="border-[#0d1f35]/40 text-[#0d1f35] hover:bg-[#0d1f35]/5 px-6 h-full"
              asChild
            >
              <Link href="/#methodology">View Methodology</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-100 aspect-[4/3] flex items-center justify-center text-gray-400 text-sm">
          IMAGE
        </div>
      </div>
    </section>
  );
}

export default Theory;
