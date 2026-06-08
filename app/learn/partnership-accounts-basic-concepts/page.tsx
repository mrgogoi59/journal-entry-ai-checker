import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function PartnershipAccountsBasicConceptsPage() {
  return <LessonReader lesson={lessons["partnership-accounts-basic-concepts"]} />;
}
