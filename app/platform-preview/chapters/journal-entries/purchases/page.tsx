import { JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function PurchasesChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_PURCHASES_SECTION_SLUG} />;
}
