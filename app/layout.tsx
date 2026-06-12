import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccyWise AI",
  description: "AccyWise AI helps accountancy students learn, practice, and understand accounting workflows step by step.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MobileBottomNav />
        <Analytics />
      </body>
    </html>
  );
}
