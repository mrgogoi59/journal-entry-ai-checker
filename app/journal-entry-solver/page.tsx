import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { JournalEntrySolverExperience } from "./_components/JournalEntrySolverExperience";

export const metadata: Metadata = {
  title: "AI Journal Entry Explainer | AccyWise AI",
  description: "Explain journal entries step by step with the existing AccyWise AI transaction explainer.",
};

export default function JournalEntrySolverPage() {
  return (
    <StudentAppShell activeItem="solver">
      <JournalEntrySolverExperience />
    </StudentAppShell>
  );
}
