import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { TrialBalanceExperience } from "./_components/TrialBalanceExperience";

export const metadata: Metadata = {
  title: "Trial Balance | AccyWise AI",
  description: "Prepare a trial balance from journal entries using the existing AccyWise AI Trial Balance tool.",
};

export default function TrialBalancePage() {
  return (
    <StudentAppShell activeItem="solver">
      <TrialBalanceExperience />
    </StudentAppShell>
  );
}
