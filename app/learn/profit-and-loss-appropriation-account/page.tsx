import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function ProfitAndLossAppropriationAccountPage() {
  return <LessonReader lesson={lessons["profit-and-loss-appropriation-account"]} />;
}
