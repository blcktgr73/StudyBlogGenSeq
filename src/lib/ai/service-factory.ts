import type { AIService } from './types';
import { MockAIService } from './mock-service';
import { OpenAIService } from './openai-service';
import { AnthropicService } from './anthropic-service';

export type AIProvider = 'openai' | 'anthropic' | 'mock';

/**
 * AI Service Factory
 * Creates appropriate AI service based on environment configuration
 */
export class AIServiceFactory {
  private static instance: AIService | null = null;

  /**
   * Get AI service instance (singleton)
   * Falls back to mock service if provider is not configured or fails
   */
  static getService(): AIService {
    if (this.instance) {
      return this.instance;
    }

    const provider = (process.env.AI_PROVIDER || 'mock') as AIProvider;

    try {
      switch (provider) {
        case 'openai':
          if (!process.env.OPENAI_API_KEY) {
            console.warn(
              'OPENAI_API_KEY not found, falling back to mock service'
            );
            this.instance = new MockAIService();
          } else {
            this.instance = new OpenAIService();
            console.log('Using OpenAI service');
          }
          break;

        case 'anthropic':
          if (!process.env.ANTHROPIC_API_KEY) {
            console.warn(
              'ANTHROPIC_API_KEY not found, falling back to mock service'
            );
            this.instance = new MockAIService();
          } else {
            this.instance = new AnthropicService();
            console.log('Using Anthropic (Claude) service');
          }
          break;

        case 'mock':
        default:
          this.instance = new MockAIService();
          console.log('Using mock AI service');
          break;
      }
    } catch (error) {
      console.error('Error creating AI service, falling back to mock:', error);
      this.instance = new MockAIService();
    }

    return this.instance;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Create a specific service instance (useful for testing)
   */
  static createService(provider: AIProvider, apiKey?: string): AIService {
    switch (provider) {
      case 'openai':
        return new OpenAIService(apiKey);
      case 'anthropic':
        return new AnthropicService(apiKey);
      case 'mock':
      default:
        return new MockAIService();
    }
  }
}

/**
 * Convenience function to get AI service
 */
export function getAIService(): AIService {
  return AIServiceFactory.getService();
}
