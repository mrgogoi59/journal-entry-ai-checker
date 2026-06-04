import { NextResponse } from "next/server";
import { solveJournalEntry } from "@/lib/journal-entry-solver";
import type { JournalEntrySolverResponse, SolverMode } from "@/lib/types";

interface JournalEntrySolverRequest {
  transaction?: string;
  mode?: SolverMode;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JournalEntrySolverRequest;
    const transaction = body.transaction?.trim() ?? "";
    const mode = body.mode === "exam" ? "exam" : "beginner";

    return NextResponse.json<JournalEntrySolverResponse>(solveJournalEntry(transaction, mode));
  } catch {
    return NextResponse.json<JournalEntrySolverResponse>(solveJournalEntry("", "beginner"));
  }
}
