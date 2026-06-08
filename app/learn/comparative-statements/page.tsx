import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function ComparativeStatementsPage() {
  return <LessonReader lesson={lessons["comparative-statements"]} />;
}
