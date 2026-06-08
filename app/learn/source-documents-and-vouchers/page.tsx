import { LessonReader } from "@/app/learn/LessonReader";
import { lessons } from "@/lib/learning-content";

export default function SourceDocumentsAndVouchersPage() {
  return <LessonReader lesson={lessons["source-documents-and-vouchers"]} />;
}
