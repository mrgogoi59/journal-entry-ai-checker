import { JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function AssetsAndLiabilitiesChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_ASSETS_AND_LIABILITIES_SECTION_SLUG} />;
}
