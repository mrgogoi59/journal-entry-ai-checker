import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AnalysisOfFinancialStatementsPage() {
  return <LessonReader lesson={lessons["analysis-of-financial-statements"]} />;
}
