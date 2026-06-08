import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function CashFlowStatementPage() {
  return <LessonReader lesson={lessons["cash-flow-statement"]} />;
}
