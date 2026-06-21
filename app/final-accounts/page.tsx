import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { FinalAccountsExperience } from "./_components/FinalAccountsExperience";

export const metadata: Metadata = {
  title: "Final Accounts | AccyWise AI",
  description:
    "Prepare Trading Account, Profit & Loss Account, Balance Sheet, and selected adjustments with the existing AccyWise AI Final Accounts tool.",
};

export default function FinalAccountsPage() {
  return (
    <StudentAppShell activeItem="solver">
      <FinalAccountsExperience />
    </StudentAppShell>
  );
}
