import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Journal Entry AI Checker",
  description: "A simple journal entry practice checker for accountancy students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
