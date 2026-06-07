import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function JournalEntryBasicsPage() {
  return <LessonReader lesson={lessons["journal-entry-basics"]} />;
}
