import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AccountingPrinciplesAndConceptsPage() {
  return <LessonReader lesson={lessons["accounting-principles-and-concepts"]} />;
}
