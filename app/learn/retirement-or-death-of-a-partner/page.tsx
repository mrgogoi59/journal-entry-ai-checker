import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function RetirementOrDeathOfAPartnerPage() {
  return <LessonReader lesson={lessons["retirement-or-death-of-a-partner"]} />;
}
