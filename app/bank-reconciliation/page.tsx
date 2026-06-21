import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { BankReconciliationExperience } from "./_components/BankReconciliationExperience";

export const metadata: Metadata = {
  title: "Bank Reconciliation Statement | AccyWise AI",
  description:
    "Prepare a Bank Reconciliation Statement step by step with the existing AccyWise AI BRS tool.",
};

export default function BankReconciliationPage() {
  return (
    <StudentAppShell activeItem="solver">
      <BankReconciliationExperience />
    </StudentAppShell>
  );
}
