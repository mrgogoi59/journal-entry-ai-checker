import { JOURNAL_ENTRIES_SALES_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function SalesChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_SALES_SECTION_SLUG} />;
}
