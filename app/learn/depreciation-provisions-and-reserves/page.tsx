import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function DepreciationProvisionsAndReservesPage() {
  return <LessonReader lesson={lessons["depreciation-provisions-and-reserves"]} />;
}
