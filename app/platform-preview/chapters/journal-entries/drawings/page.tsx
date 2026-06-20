import { JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function DrawingsChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_DRAWINGS_SECTION_SLUG} />;
}
