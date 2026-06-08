import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function FinalAccountsBasicsPage() {
  return <LessonReader lesson={lessons["final-accounts-basics"]} />;
}
