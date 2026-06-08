import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function LedgerPostingBasicsPage() {
  return <LessonReader lesson={lessons["ledger-posting-basics"]} />;
}
