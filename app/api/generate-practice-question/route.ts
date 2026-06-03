import { NextResponse } from "next/server";
import { generatePracticeQuestion } from "@/lib/practice-question-generator";
import type { PracticeQuestion } from "@/lib/types";

export function GET() {
  return NextResponse.json<PracticeQuestion>(generatePracticeQuestion());
}
