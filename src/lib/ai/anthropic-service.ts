import Anthropic from '@anthropic-ai/sdk';
import type {
  AIService,
  TextImprovementRequest,
  TextImprovementResponse,
  TagSuggestion,
  StructureGenerationRequest,
  StructureGenerationResponse,
} from './types';

/**
 * Anthropic (Claude) Service Implementation
 * Uses Claude 3.5 Sonnet for high-quality text improvement
 */
export class AnthropicService implements AIService {
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
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
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7,
      });

      const improved =
        message.content[0]?.type === 'text'
          ? message.content[0].text
          : text;

      return {
        improved,
        reason: this.extractReason(improved),
        type: this.detectImprovementType(text, improved),
      };
    } catch (error) {
      console.error('Anthropic improve text error:', error);
      throw new Error('Failed to improve text with Claude');
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
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.5,
      });

      const response =
        message.content[0]?.type === 'text'
          ? message.content[0].text
          : '{}';

      const parsed = JSON.parse(response);
      return parsed.tags || [];
    } catch (error) {
      console.error('Anthropic suggest tags error:', error);
      throw new Error('Failed to suggest tags with Claude');
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

  async generateStructure(
    request: StructureGenerationRequest
  ): Promise<StructureGenerationResponse> {
    const { userInput, context } = request;

    const systemPrompt = `You are an expert content structure advisor for technical and learning blogs.
Your task is to analyze the user's brief description and create a customized post structure.

Consider these post types:
- 학습 경험 (Learning Experience): sharing what was learned
- 프로젝트 후기 (Project Review): reflecting on a project
- 튜토리얼 (Tutorial): step-by-step guide
- 문제 해결 (Problem Solving): troubleshooting story
- 일반 글 (General): flexible format

Respond in JSON format:
{
  "postType": "detected type in Korean",
  "reasoning": "why this structure fits (in Korean)",
  "sections": [
    {
      "order": 1,
      "title": "section title in Korean",
      "description": "what to write here (in Korean)",
      "placeholder": "example text (in Korean)"
    },
    ...
  ]
}

Guidelines:
- Create 3-5 sections
- Each section should have clear purpose
- Use Korean language
- Keep placeholders concrete and helpful`;

    const userPrompt = context
      ? `User input: ${userInput}\n\nContext: ${context}`
      : `User input: ${userInput}`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.7,
      });

      const response =
        message.content[0]?.type === 'text'
          ? message.content[0].text
          : '{}';

      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Anthropic generate structure error:', error);
      throw new Error('Failed to generate structure with Claude');
    }
  }
}
