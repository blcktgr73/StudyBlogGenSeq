import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service-factory';
import type { StructureGenerationRequest } from '@/lib/ai/types';

/**
 * POST /api/ai/structure
 * Generate customized post structure based on user input
 */
export async function POST(request: NextRequest) {
  try {
    const body: StructureGenerationRequest = await request.json();
    const { userInput, context } = body;

    if (!userInput || userInput.trim().length < 3) {
      return NextResponse.json(
        { error: '글에 대한 설명을 3자 이상 입력해주세요.' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    const structure = await aiService.generateStructure({ userInput, context });

    return NextResponse.json(structure);
  } catch (error) {
    console.error('Structure generation error:', error);
    return NextResponse.json(
      { error: 'AI 구조 생성에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
