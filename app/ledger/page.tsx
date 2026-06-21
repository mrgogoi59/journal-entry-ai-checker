import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { LedgerExperience } from "./_components/LedgerExperience";

export const metadata: Metadata = {
  title: "Ledger Posting | AccyWise AI",
  description: "Post journal entries into ledger accounts with the existing AccyWise AI Ledger tool.",
};

export default function LedgerPage() {
  return (
    <StudentAppShell activeItem="solver">
      <LedgerExperience />
    </StudentAppShell>
  );
}
