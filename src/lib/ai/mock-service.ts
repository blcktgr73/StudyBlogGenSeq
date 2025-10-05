// Mock AI 서비스 (API 키 없이도 테스트 가능)

import type {
  AIService,
  TextImprovementRequest,
  TextImprovementResponse,
  TagSuggestion,
  StructureGenerationRequest,
  StructureGenerationResponse,
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

  async generateStructure(
    request: StructureGenerationRequest
  ): Promise<StructureGenerationResponse> {
    await sleep(MOCK_DELAY);

    const { userInput } = request;
    const input = userInput.toLowerCase();

    // 학습 경험 패턴
    if (input.includes('배웠') || input.includes('학습') || input.includes('공부')) {
      return {
        postType: '학습 경험',
        reasoning: '새로운 기술이나 개념을 학습한 경험을 공유하는 글로 보입니다.',
        sections: [
          {
            order: 1,
            title: '학습 배경',
            description: '왜 이 기술을 배우게 되었나요?',
            placeholder: '예: 프로젝트에서 상태 관리가 복잡해져서 Redux를 배우기로 결정했습니다...',
          },
          {
            order: 2,
            title: '학습 과정',
            description: '어떻게 학습했나요? 어떤 자료를 참고했나요?',
            placeholder: '예: 공식 문서를 먼저 읽고, 유튜브 강의를 따라하면서 실습했습니다...',
          },
          {
            order: 3,
            title: '실습 및 적용',
            description: '학습한 내용을 어떻게 적용해봤나요?',
            placeholder: '예: 간단한 Todo 앱을 만들어보면서 Redux의 핵심 개념을 이해했습니다...',
          },
          {
            order: 4,
            title: '배운 점과 느낀 점',
            description: '어떤 인사이트를 얻었나요? 어려웠던 점은?',
            placeholder: '예: 처음엔 보일러플레이트가 많아 복잡했지만, 상태 흐름이 명확해지는 장점을 느꼈습니다...',
          },
        ],
      };
    }

    // 프로젝트 후기 패턴
    if (input.includes('프로젝트') || input.includes('만들었') || input.includes('개발')) {
      return {
        postType: '프로젝트 후기',
        reasoning: '프로젝트 개발 경험을 회고하는 글로 보입니다.',
        sections: [
          {
            order: 1,
            title: '프로젝트 소개',
            description: '어떤 프로젝트인가요? 왜 시작했나요?',
            placeholder: '예: 개인 블로그를 Next.js로 만들었습니다. SEO와 성능을 개선하고 싶었습니다...',
          },
          {
            order: 2,
            title: '기술 스택 선택',
            description: '어떤 기술을 사용했고, 왜 선택했나요?',
            placeholder: '예: Next.js 14 App Router, TypeScript, Tailwind CSS를 사용했습니다...',
          },
          {
            order: 3,
            title: '주요 기능 및 구현',
            description: '핵심 기능을 어떻게 구현했나요?',
            placeholder: '예: MDX로 블로그 포스트를 작성하고, gray-matter로 메타데이터를 파싱했습니다...',
          },
          {
            order: 4,
            title: '트러블슈팅',
            description: '어떤 문제를 겪었고 어떻게 해결했나요?',
            placeholder: '예: 빌드 시 이미지 최적화 오류가 발생해서 next/image 설정을 수정했습니다...',
          },
          {
            order: 5,
            title: '회고 및 개선 방향',
            description: '배운 점과 앞으로의 계획은?',
            placeholder: '예: TypeScript를 더 깊이 이해하게 되었고, 다음엔 테스트 코드를 추가하고 싶습니다...',
          },
        ],
      };
    }

    // 문제 해결 패턴
    if (input.includes('버그') || input.includes('에러') || input.includes('해결') || input.includes('문제')) {
      return {
        postType: '문제 해결 과정',
        reasoning: '특정 문제를 해결한 경험을 공유하는 글로 보입니다.',
        sections: [
          {
            order: 1,
            title: '문제 상황',
            description: '어떤 문제가 발생했나요?',
            placeholder: '예: 프로덕션 환경에서만 API 호출이 실패하는 문제가 발생했습니다...',
          },
          {
            order: 2,
            title: '원인 분석',
            description: '어떻게 원인을 찾았나요?',
            placeholder: '예: 브라우저 개발자 도구와 서버 로그를 확인하면서 CORS 설정 문제임을 발견했습니다...',
          },
          {
            order: 3,
            title: '해결 방법',
            description: '어떻게 해결했나요? 코드나 설정 변경 내용은?',
            placeholder: '예: Next.js API 라우트에 CORS 헤더를 추가하여 문제를 해결했습니다...',
          },
          {
            order: 4,
            title: '배운 점 및 예방책',
            description: '이 경험에서 무엇을 배웠나요?',
            placeholder: '예: 로컬과 프로덕션 환경의 차이를 항상 고려해야 한다는 것을 배웠습니다...',
          },
        ],
      };
    }

    // 기본 구조 (범용)
    return {
      postType: '일반 글',
      reasoning: '자유로운 형식의 글로 보입니다. 기본 구조를 제안합니다.',
      sections: [
        {
          order: 1,
          title: '소개',
          description: '어떤 이야기를 나누고 싶으신가요?',
          placeholder: '글의 주제와 배경을 소개해주세요...',
        },
        {
          order: 2,
          title: '본문',
          description: '핵심 내용을 자유롭게 작성하세요',
          placeholder: '상세한 내용을 작성해주세요...',
        },
        {
          order: 3,
          title: '마무리',
          description: '결론이나 배운 점을 정리하세요',
          placeholder: '글을 마무리하고 인사이트를 공유해주세요...',
        },
      ],
    };
  }
}

export const mockAI = new MockAIService();
