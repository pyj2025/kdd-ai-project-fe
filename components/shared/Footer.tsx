import Link from "next/link";
import { FOOTER_LINKS } from "./constants";

function Footer() {
  return (
    <footer className="w-full px-4 bg-[#F8FAFC]">
      <div className="flex justify-between h-40 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#0d1f35] tracking-tight">IF-VEST</span>
          <span className="text-xs text-gray-400">
            © 2026 Honest Mirror v1.0. All Rights Reserved.
          </span>
        </div>
        <nav className="flex gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-[#4a5568] hover:text-[#0d1f35] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
