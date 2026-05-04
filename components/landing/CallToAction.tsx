import Link from "next/link";
import { Button } from "@/components/ui/button";

function CallToAction() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <p className="text-sm text-[#4a5568]">Ready to confront your data?</p>
      <p className="text-base text-[#0d1f35] max-w-md">
        Join 15,000+ serious investors using If-Vest to strip away the noise and see their decision
        architecture with absolute clarity.
      </p>
      <div className="flex items-center gap-4 mt-2">
        <Button className="bg-[#0d1f35] hover:bg-[#162d4a] text-white px-8" asChild>
          <Link href="/signup">Access Portal</Link>
        </Button>
        <Button
          variant="outline"
          className="border-[#0d1f35]/40 text-[#0d1f35] hover:bg-[#0d1f35]/5 px-8"
        >
          Request Demo
        </Button>
      </div>
    </div>
  );
}

export default CallToAction;
