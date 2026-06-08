import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function TrialBalanceBasicsPage() {
  return <LessonReader lesson={lessons["trial-balance-basics"]} />;
}
