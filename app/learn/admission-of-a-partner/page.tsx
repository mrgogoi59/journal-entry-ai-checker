import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function AdmissionOfAPartnerPage() {
  return <LessonReader lesson={lessons["admission-of-a-partner"]} />;
}
