import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function RecordingOfTransactionsPage() {
  return <LessonReader lesson={lessons["recording-of-transactions"]} />;
}
