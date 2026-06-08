import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function GstJournalEntriesPage() {
  return <LessonReader lesson={lessons["gst-journal-entries"]} />;
}
