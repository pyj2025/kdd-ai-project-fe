import { BarChart2, Eye } from "lucide-react";

function FooterFeatures() {
  return (
    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#e8eaed]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#f3f5f7] flex items-center justify-center shrink-0">
          <Eye className="w-4 h-4 text-[#0d1f35]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0d1f35] mb-1">
            Radical Transparency
          </p>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Documenting logic today prevents hindsight bias tomorrow.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#f3f5f7] flex items-center justify-center shrink-0">
          <BarChart2 className="w-4 h-4 text-[#0d1f35]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0d1f35] mb-1">
            Analytical Precision
          </p>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            We correlate these reflections with your actual portfolio performance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FooterFeatures;
