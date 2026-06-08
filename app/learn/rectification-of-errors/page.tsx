import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function RectificationOfErrorsPage() {
  return <LessonReader lesson={lessons["rectification-of-errors"]} />;
}
