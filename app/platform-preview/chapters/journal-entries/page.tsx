import { JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "./JournalEntriesSectionPage";

export default function JournalEntriesChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG} />;
}
