// Mock AI 서비스 (API 키 없이도 테스트 가능)

import type {
  AIService,
  TextImprovementRequest,
  TextImprovementResponse,
  TagSuggestion,
} from "./types";

// 시뮬레이션 지연 시간
const MOCK_DELAY = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAIService implements AIService {
  async improveText(
    request: TextImprovementRequest
  ): Promise<TextImprovementResponse> {
    await sleep(MOCK_DELAY);

    const { text } = request;

    // 간단한 개선 시뮬레이션
    const improvements: Record<string, TextImprovementResponse> = {
      "저는 파이썬을 배웠어요": {
        improved:
          "Python 기초 문법을 3주 동안 학습했으며, 특히 객체지향 프로그래밍 개념을 집중적으로 공부했습니다.",
        reason: "구체적인 기간과 학습 내용을 명시하여 전문성을 높였습니다.",
        type: "clarity",
      },
      "성능이 좋아졌어요": {
        improved: "모델의 정확도가 72%에서 89%로 17%p 향상되었습니다.",
        reason: "정량적 지표를 사용하여 객관적으로 표현했습니다.",
        type: "clarity",
      },
    };

    // 매칭되는 개선안이 있으면 반환
    for (const [key, improvement] of Object.entries(improvements)) {
      if (text.includes(key)) {
        return improvement;
      }
    }

    // 기본 개선안
    return {
      improved: `${text} (더 구체적인 내용을 추가하면 좋을 것 같습니다)`,
      reason: "문장을 더 상세하게 작성하여 독자의 이해를 돕습니다.",
      type: "clarity",
    };
  }

  async suggestTags(title: string, content: string): Promise<TagSuggestion[]> {
    await sleep(MOCK_DELAY);

    const text = `${title} ${content}`.toLowerCase();

    const suggestions: TagSuggestion[] = [];

    // 키워드 기반 태그 추천
    const tagKeywords: Record<string, string[]> = {
      Python: ["python", "파이썬"],
      JavaScript: ["javascript", "js", "자바스크립트"],
      "Next.js": ["next.js", "nextjs", "넥스트"],
      React: ["react", "리액트"],
      AI: ["ai", "인공지능", "머신러닝", "딥러닝"],
      "Machine Learning": ["machine learning", "ml", "머신러닝"],
      "Deep Learning": ["deep learning", "딥러닝", "neural network"],
      GPT: ["gpt", "chatgpt", "openai"],
      Claude: ["claude", "anthropic"],
      Tutorial: ["tutorial", "가이드", "튜토리얼"],
      Experience: ["경험", "experience", "후기"],
      Project: ["project", "프로젝트"],
    };

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          suggestions.push({
            tag,
            confidence: 0.7 + Math.random() * 0.3,
            reason: `'${keyword}' 키워드가 포함되어 있습니다`,
          });
          break;
        }
      }
    }

    // 신뢰도 순 정렬
    suggestions.sort((a, b) => b.confidence - a.confidence);

    // 상위 5개만 반환
    return suggestions.slice(0, 5);
  }
}

export const mockAI = new MockAIService();
