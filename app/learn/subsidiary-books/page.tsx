import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function SubsidiaryBooksPage() {
  return <LessonReader lesson={lessons["subsidiary-books"]} />;
}
