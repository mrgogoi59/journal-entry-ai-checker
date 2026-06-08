import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AccountingRatiosPage() {
  return <LessonReader lesson={lessons["accounting-ratios"]} />;
}
