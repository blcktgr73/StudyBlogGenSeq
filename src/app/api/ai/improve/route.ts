import { NextRequest, NextResponse } from "next/server";
import { mockAI } from "@/lib/ai/mock-service";
import type { TextImprovementRequest } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  try {
    const body: TextImprovementRequest = await request.json();

    if (!body.text || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Mock AI 서비스 사용 (나중에 실제 API로 교체)
    const result = await mockAI.improveText(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI improve error:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}
