import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function ComputerisedAccountingSystemAndDatabaseReportsPage() {
  return <LessonReader lesson={lessons["computerised-accounting-system-and-database-reports"]} />;
}
