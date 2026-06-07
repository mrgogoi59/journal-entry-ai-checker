import { NextResponse } from "next/server";
import { generatePracticeQuestion, normalizePracticeTopic } from "@/lib/practice-question-generator";
import type { PracticeQuestion } from "@/lib/types";

export function GET() {
  return NextResponse.json<PracticeQuestion>(generatePracticeQuestion());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { topic?: unknown };
  return NextResponse.json<PracticeQuestion>(generatePracticeQuestion(normalizePracticeTopic(body.topic)));
}
