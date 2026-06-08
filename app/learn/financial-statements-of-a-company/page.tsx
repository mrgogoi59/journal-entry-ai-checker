import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function FinancialStatementsOfACompanyPage() {
  return <LessonReader lesson={lessons["financial-statements-of-a-company"]} />;
}
