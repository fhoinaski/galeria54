import { NextResponse } from "next/server";
import { feedbacksRepository } from "@/lib/feedbacks-repository";
import type { CreateFeedbackInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateFeedbackInput;
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "rating deve ser entre 1 e 5" }, { status: 422 });
    }
    const feedback = await feedbacksRepository.create(body);
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
