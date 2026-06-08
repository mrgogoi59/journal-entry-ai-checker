import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function DissolutionOfPartnershipFirmPage() {
  return <LessonReader lesson={lessons["dissolution-of-partnership-firm"]} />;
}
