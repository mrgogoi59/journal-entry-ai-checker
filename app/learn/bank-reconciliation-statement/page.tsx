import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function BankReconciliationStatementPage() {
  return <LessonReader lesson={lessons["bank-reconciliation-statement"]} />;
}
