import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function CommonSizeStatementsPage() {
  return <LessonReader lesson={lessons["common-size-statements"]} />;
}
