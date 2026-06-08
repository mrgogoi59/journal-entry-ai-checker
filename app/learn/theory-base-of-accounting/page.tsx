import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function TheoryBaseOfAccountingPage() {
  return <LessonReader lesson={lessons["theory-base-of-accounting"]} />;
}
