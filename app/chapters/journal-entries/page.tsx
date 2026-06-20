import type { Metadata } from "next";
import {
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  journalEntriesChapter,
} from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "./JournalEntriesSectionPage";

export const metadata: Metadata = {
  title: "Journal Entries | Chapters | AccyWise AI",
  description:
    "Learn Journal Entries through concepts, solved illustrations, and structured chapter progression on AccyWise AI.",
};

export default function JournalEntriesChapterPage() {
  return <JournalEntriesSectionPage sectionSlug={JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG} />;
}

export const chapterMetadata = journalEntriesChapter.metadata;
