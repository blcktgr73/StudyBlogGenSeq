import { NextRequest, NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/service-factory";
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

    // Get configured AI service (OpenAI, Anthropic, or Mock)
    const aiService = getAIService();
    const result = await aiService.improveText(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI improve error:", error);
    return NextResponse.json(
      { error: "Failed to improve text" },
      { status: 500 }
    );
  }
}
