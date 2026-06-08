import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function IssueAndRedemptionOfDebenturesPage() {
  return <LessonReader lesson={lessons["issue-and-redemption-of-debentures"]} />;
}
