import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function CallsInArrearsAndCallsInAdvancePage() {
  return <LessonReader lesson={lessons["calls-in-arrears-and-calls-in-advance"]} />;
}
