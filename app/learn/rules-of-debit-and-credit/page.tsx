import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function RulesOfDebitAndCreditPage() {
  return <LessonReader lesson={lessons["rules-of-debit-and-credit"]} />;
}
