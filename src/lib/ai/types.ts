// AI 서비스 타입 정의

export interface TextImprovementRequest {
  text: string;
  context?: string;
  tone?: 'professional' | 'casual' | 'academic';
}

export interface TextImprovementResponse {
  improved: string;
  reason: string;
  type: 'clarity' | 'grammar' | 'style' | 'conciseness';
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

export type AIProvider = 'openai' | 'claude' | 'mock';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
}
