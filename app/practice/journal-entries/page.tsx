import type { Metadata } from "next";
import { StudentAppShell } from "@/components/student-platform/StudentAppShell";
import { JournalEntryPracticeExperience } from "../_components/JournalEntryPracticeExperience";

export const metadata: Metadata = {
  title: "Journal Entry Practice | AccyWise AI",
  description: "Practise beginner Journal Entries by topic with existing AccyWise AI answer checking.",
};

export default function JournalEntryPracticePage() {
  return (
    <StudentAppShell activeItem="practice">
      <JournalEntryPracticeExperience />
    </StudentAppShell>
  );
}
