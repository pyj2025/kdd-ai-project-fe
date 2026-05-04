import { FlaskConical, ShieldCheck, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PILLARS } from "./constants";
import CallToAction from "./CallToAction";

function Methodology() {
  return (
    <section id="methodology" className="scroll-mt-14 px-6 md:px-16 py-4">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-[#0d1f35]">Core Analytical Pillars</h2>
          <span className="text-sm text-gray-400 pt-1">v1.0 Sophisticated Utility</span>
        </div>
        <Separator />
        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ icon: Icon, title, desc, tag }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between gap-8 min-h-70"
            >
              <div className="flex flex-col gap-4">
                <Icon className="w-5 h-5 text-[#0d1f35]" strokeWidth={1.5} />
                <div>
                  <h3 className="text-base font-semibold text-[#0d1f35] mb-2">{title}</h3>
                  <p className="text-sm text-[#4a5568] leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest text-gray-400">{tag}</span>
                <TrendingUp className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
        {/* 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ghost Portfolio Viewer */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 min-h-[480px]">
            <p className="text-sm font-medium text-[#0d1f35]">The Ghost Portfolio Viewer</p>
            <p className="text-sm text-[#4a5568] leading-relaxed max-w-xs">
              A real-time comparison of what your wealth would look like if you had followed through
              on every &lsquo;Strong Buy&rsquo; thesis you abandoned.
            </p>
            <div className="mt-auto rounded-lg bg-gray-100 border border-gray-200 flex-1 flex items-center justify-center text-gray-400 text-sm">
              CHART IMAGE
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Bias Detector */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-2 flex-1">
              <p className="text-xs text-[#5a7fa8] tracking-wide">Insight Module</p>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0d1f35]">Bias Detector</p>
                  <p className="text-sm text-[#4a5568] mt-1">
                    Quantify the frequency of omission bias in your decision cycle.
                  </p>
                </div>
                <FlaskConical className="w-5 h-5 text-gray-300 ml-4 shrink-0" strokeWidth={1.5} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Signal Accuracy */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2">
                <p className="text-4xl font-bold text-[#0d1f35]">94%</p>
                <p className="text-xs text-gray-400">Signal Accuracy</p>
              </div>

              {/* Bank-level Encryption */}
              <div className="bg-[#0d1f35] rounded-xl p-6 flex flex-col items-center justify-center gap-2">
                <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
                <p className="text-[10px] tracking-widest text-gray-400 uppercase text-center">
                  Bank-Level Encryption
                </p>
              </div>
            </div>
          </div>
        </div>
        <CallToAction />
      </div>
    </section>
  );
}

export default Methodology;
