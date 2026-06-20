import { JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function ExpensesChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_EXPENSES_SECTION_SLUG} />;
}
