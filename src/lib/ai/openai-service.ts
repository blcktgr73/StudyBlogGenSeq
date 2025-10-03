import OpenAI from 'openai';
import type {
  AIService,
  TextImprovementRequest,
  TextImprovementResponse,
  TagSuggestion,
} from './types';

/**
 * OpenAI Service Implementation
 * Uses GPT-4o-mini for cost-effective AI assistance
 */
export class OpenAIService implements AIService {
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
    this.model = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async improveText(
    request: TextImprovementRequest
  ): Promise<TextImprovementResponse> {
    const { text, context, tone = 'professional' } = request;

    const systemPrompt = this.buildImprovementPrompt(tone);
    const userPrompt = context
      ? `Context: ${context}\n\nText to improve: ${text}`
      : `Text to improve: ${text}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const improved = completion.choices[0]?.message?.content || text;

      return {
        improved,
        reason: this.extractReason(improved),
        type: this.detectImprovementType(text, improved),
      };
    } catch (error) {
      console.error('OpenAI improve text error:', error);
      throw new Error('Failed to improve text with OpenAI');
    }
  }

  async suggestTags(title: string, content: string): Promise<TagSuggestion[]> {
    const systemPrompt = `You are an expert at categorizing learning and technical content.
Given a title and content, suggest relevant tags from this list:
[JavaScript, TypeScript, React, Next.js, Python, AI/ML, 백엔드, 프론트엔드, 데이터베이스, 클라우드, DevOps, 보안, 성능최적화, 디버깅, 리팩토링, 테스트]

Respond in JSON format:
{
  "tags": [
    {"tag": "tag-name", "confidence": 0.95, "reason": "why this tag fits"},
    ...
  ]
}`;

    const userPrompt = `Title: ${title}\n\nContent: ${content}`;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return [];
      }

      const parsed = JSON.parse(response);
      return parsed.tags || [];
    } catch (error) {
      console.error('OpenAI suggest tags error:', error);
      throw new Error('Failed to suggest tags with OpenAI');
    }
  }

  private buildImprovementPrompt(tone: string): string {
    const toneGuide = {
      professional:
        '전문적이고 명확한 표현을 사용하세요. 기술 블로그에 적합한 톤입니다.',
      casual:
        '친근하고 대화하듯 자연스러운 표현을 사용하세요. 개인 블로그에 적합합니다.',
      academic:
        '학술적이고 정확한 표현을 사용하세요. 연구나 심화 학습 내용에 적합합니다.',
    };

    return `You are a writing assistant for technical learning content.
Your goal: Improve clarity, add specific details, and make content more engaging.

Tone: ${toneGuide[tone as keyof typeof toneGuide] || toneGuide.professional}

Guidelines:
1. Add specific details (timeframes, technologies, metrics)
2. Use clear, concrete language
3. Maintain the original intent
4. Keep it concise but informative
5. Write in Korean (한국어)

Respond with ONLY the improved text, no explanations.`;
  }

  private extractReason(improvedText: string): string {
    // Simple heuristic: longer = more detail added
    if (improvedText.length > 100) {
      return '구체적인 세부사항과 명확한 표현을 추가했습니다.';
    }
    return '명확성을 개선했습니다.';
  }

  private detectImprovementType(
    original: string,
    improved: string
  ): 'clarity' | 'detail' | 'structure' {
    const lengthIncrease = improved.length / original.length;

    if (lengthIncrease > 1.5) return 'detail';
    if (improved.includes('\n') && !original.includes('\n')) return 'structure';
    return 'clarity';
  }
}
