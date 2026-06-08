import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function CashBookPage() {
  return <LessonReader lesson={lessons["cash-book"]} />;
}
