// AI 서비스 타입 정의

export interface TextImprovementRequest {
  text: string;
  context?: string;
  tone?: 'professional' | 'casual' | 'academic';
}

export interface TextImprovementResponse {
  improved: string;
  reason: string;
  type: 'clarity' | 'detail' | 'structure' | 'grammar' | 'style' | 'conciseness';
}

export interface TagGenerationRequest {
  title: string;
  content: string;
}

export interface TagSuggestion {
  tag: string;
  confidence: number; // 0-1
  reason: string;
}

export interface TitleSuggestionRequest {
  content: string;
}

export interface TitleSuggestion {
  title: string;
  reason: string;
}

export interface SummarizationRequest {
  content: string;
  maxLength?: number;
}

export interface SummarizationResponse {
  summary: string;
  keyPoints: string[];
}

export interface StructureGenerationRequest {
  userInput: string; // 사용자의 자유로운 글 설명
  context?: string; // 추가 컨텍스트
}

export interface StructureSection {
  title: string;
  description: string;
  placeholder: string;
  order: number;
}

export interface StructureGenerationResponse {
  postType: string; // 학습경험, 프로젝트후기, 튜토리얼 등
  sections: StructureSection[];
  reasoning: string; // AI가 이 구조를 제안한 이유
}

export type AIProvider = 'openai' | 'anthropic' | 'mock';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}

/**
 * AI Service Interface
 * All AI providers (OpenAI, Anthropic, Mock) must implement this interface
 */
export interface AIService {
  /**
   * Improve text clarity, detail, and structure
   */
  improveText(request: TextImprovementRequest): Promise<TextImprovementResponse>;

  /**
   * Suggest relevant tags based on title and content
   */
  suggestTags(title: string, content: string): Promise<TagSuggestion[]>;

  /**
   * Generate customized post structure based on user input
   */
  generateStructure(request: StructureGenerationRequest): Promise<StructureGenerationResponse>;
}
