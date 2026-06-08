import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function FixedAndFluctuatingCapitalAccountsPage() {
  return <LessonReader lesson={lessons["fixed-and-fluctuating-capital-accounts"]} />;
}
