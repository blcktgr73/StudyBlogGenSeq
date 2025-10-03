import { NextRequest, NextResponse } from "next/server";
import { mockAI } from "@/lib/ai/mock-service";
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

    // Mock AI 서비스 사용
    const tags = await mockAI.generateTags(body);

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("AI tags error:", error);
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    );
  }
}
