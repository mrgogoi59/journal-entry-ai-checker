import type { Metadata } from "next";
import {
  getJournalEntriesSubtopic,
  JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG,
  journalEntriesChapter,
} from "@/lib/learning-platform/chapters/journal-entries";
import { JournalEntriesSectionPage } from "../JournalEntriesSectionPage";

type JournalEntriesSubtopicPageProps = {
  params: Promise<{
    sectionSlug: string;
  }>;
};

export function generateStaticParams() {
  return journalEntriesChapter.subtopics
    .filter((subtopic) => subtopic.slug !== JOURNAL_ENTRIES_INTRODUCTION_SECTION_SLUG)
    .map((subtopic) => ({
      sectionSlug: subtopic.slug,
    }));
}

export async function generateMetadata({ params }: JournalEntriesSubtopicPageProps): Promise<Metadata> {
  const { sectionSlug } = await params;
  const subtopic = getJournalEntriesSubtopic(sectionSlug);

  if (!subtopic) {
    return {
      title: "Journal Entries | AccyWise AI",
      description: "Learn Journal Entries through structured Accountancy chapter sections on AccyWise AI.",
    };
  }

  return {
    title: `${subtopic.title} | Journal Entries | AccyWise AI`,
    description: `${subtopic.shortDescription} Learn this Journal Entries section with concepts, solved illustrations, and chapter-wise progression.`,
  };
}

export default async function JournalEntriesSubtopicPage({ params }: JournalEntriesSubtopicPageProps) {
  const { sectionSlug } = await params;

  return <JournalEntriesSectionPage sectionSlug={sectionSlug} />;
}
