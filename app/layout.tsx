import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IF-VEST | Portfolio Reflection Engine",
  description:
    "The decisions you didn't make are your greatest data. Quantify the opportunity cost of the road not taken.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
