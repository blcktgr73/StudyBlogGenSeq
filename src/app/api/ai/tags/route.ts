import { NextRequest, NextResponse } from "next/server";
import { getAIService } from "@/lib/ai/service-factory";
import type { TagGenerationRequest } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  try {
    const body: TagGenerationRequest = await request.json();

    if (!body.title && !body.content) {
      return NextResponse.json(
        { error: "Title or content is required" },
        { status: 400 }
      );
    }

    // Get configured AI service (OpenAI, Anthropic, or Mock)
    const aiService = getAIService();
    const tags = await aiService.suggestTags(
      body.title || "",
      body.content || ""
    );

    // Return top 5 tags
    const topTags = tags
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
      .map((t) => t.tag);

    return NextResponse.json({ tags: topTags });
  } catch (error) {
    console.error("AI tags error:", error);
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    );
  }
}
