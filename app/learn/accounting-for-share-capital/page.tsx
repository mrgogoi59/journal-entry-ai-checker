import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AccountingForShareCapitalPage() {
  return <LessonReader lesson={lessons["accounting-for-share-capital"]} />;
}
