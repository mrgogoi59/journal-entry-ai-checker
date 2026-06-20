import { JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG } from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

export default function AccountsAffectedChapterPreviewPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_ACCOUNTS_AFFECTED_SECTION_SLUG} />;
}
