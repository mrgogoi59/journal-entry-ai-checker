import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AccountingForNotForProfitOrganisationsPage() {
  return <LessonReader lesson={lessons["accounting-for-not-for-profit-organisations"]} />;
}
