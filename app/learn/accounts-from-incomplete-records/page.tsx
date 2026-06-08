import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AccountsFromIncompleteRecordsPage() {
  return <LessonReader lesson={lessons["accounts-from-incomplete-records"]} />;
}
