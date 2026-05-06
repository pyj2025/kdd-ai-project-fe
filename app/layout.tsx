import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import AuthListener from "@/components/auth/AuthListener";

export const metadata: Metadata = {
  title: "IF-VEST | Portfolio Reflection Engine",
  description:
    "The decisions you didn't make are your greatest data. Quantify the opportunity cost of the road not taken.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthListener />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
