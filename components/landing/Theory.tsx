import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

function Theory() {
  return (
    <section
      id="theory"
      className="scroll-mt-14 min-h-screen flex items-center px-6 md:px-16 py-24 max-w-screen-xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1f35] leading-tight">
            Empower Your Decisions 
          </h1>
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed max-w-md">
            Analyze your investment patterns through precision data. Uncover actionable
            strategies by seeing your history built on the firmest ground.
          </p>
          <div className="flex items-center gap-4 mt-2 h-12">
            <Button
              className="bg-[#0d1f35] hover:bg-[#162d4a] text-white px-6 w-full h-full"
              asChild
            >
              <Link href="/dashboard">Investor Portal</Link>
            </Button>
          </div>
        </div>
        <Image src="/Theory-Chart.png" alt="charts" width={800} height={500} priority />
      </div>
    </section>
  );
}

export default Theory;
