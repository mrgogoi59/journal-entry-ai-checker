import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function BillsOfExchangePage() {
  return <LessonReader lesson={lessons["bills-of-exchange"]} />;
}
