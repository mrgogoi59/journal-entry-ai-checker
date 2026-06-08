import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AdjustmentsInFinalAccountsPage() {
  return <LessonReader lesson={lessons["adjustments-in-final-accounts"]} />;
}
