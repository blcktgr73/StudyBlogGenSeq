# AI 에디터 기능 명세

## 개요

사용자가 학습 경험을 작성할 때 실시간으로 LLM이 도움을 제공하는 인터랙티브 에디터

## 핵심 가치

- **작성 장벽 낮추기**: 초보자도 전문가처럼 글을 쓸 수 있도록
- **구조화 지원**: AI가 글의 흐름과 구조를 제안
- **생산성 향상**: 빠르게 고품질 콘텐츠 생성
- **학습 효과**: AI 제안을 통해 글쓰기 실력 향상

## 주요 기능

### 1. 템플릿 기반 작성

사용자가 글을 시작할 때 구조화된 템플릿 제공

#### 템플릿 종류

**1) 학습 경험 템플릿**
```markdown
# [학습 주제]

## 🎯 학습 동기
- 왜 이것을 배우게 되었나요?

## 📚 학습 과정
- 어떻게 학습했나요?
- 어려웠던 점은?

## 💡 핵심 인사이트
- 무엇을 배웠나요?

## 🚀 적용 사례
- 실제로 어떻게 활용했나요?

## 🔗 참고 자료
- 도움이 된 자료들
```

**2) 프로젝트 후기 템플릿**
```markdown
# [프로젝트 이름]

## 📋 프로젝트 개요
- 무엇을 만들었나요?

## 🛠️ 기술 스택
- 어떤 기술을 사용했나요?

## 🎯 주요 기능
- 핵심 기능은 무엇인가요?

## 🤔 문제 해결
- 어떤 문제를 만나고 해결했나요?

## 📊 결과 및 회고
- 결과는 어땠나요?
- 다음에 개선할 점은?
```

**3) 튜토리얼 템플릿**
```markdown
# [주제] 튜토리얼

## 🎯 이 튜토리얼에서 배울 것

## 📋 준비사항

## 📝 단계별 가이드

### Step 1:
### Step 2:

## ✅ 마무리

## 🔗 다음 단계
```

#### 기능 명세

```typescript
interface Template {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'project' | 'tutorial' | 'custom'
  content: string // Markdown 템플릿
  placeholders: string[] // AI가 채울 플레이스홀더
}

// 사용 예시
const templates: Template[] = [
  {
    id: 'learning-experience',
    name: '학습 경험',
    description: 'AI/ML 학습 과정과 인사이트 공유',
    icon: '📚',
    category: 'learning',
    content: '...',
    placeholders: ['학습 주제', '학습 동기', '핵심 인사이트']
  }
]
```

### 2. 실시간 문장 개선 제안

사용자가 문단을 작성하면 AI가 더 나은 표현을 제안

#### UX 플로우

1. 사용자가 문단 작성 완료 (Enter 두 번 또는 일정 시간 대기)
2. AI가 자동으로 분석
3. 개선 제안을 인라인으로 표시 (GitHub Copilot 스타일)
4. 사용자가 Tab 키로 수락 또는 무시

#### 개선 유형

**1) 문장 명료화**
```
원문: "저는 파이썬을 배웠는데 좀 어려웠어요."

AI 제안:
"Python 기초 문법을 3주 동안 학습했으나,
객체지향 프로그래밍 개념이 특히 어려웠습니다."
```

**2) 전문 용어 정확성**
```
원문: "딥러닝으로 이미지 분류하는 걸 만들었어요."

AI 제안:
"CNN(Convolutional Neural Network)을 활용한
이미지 분류 모델을 구현했습니다."
```

**3) 구체성 추가**
```
원문: "성능이 좋아졌어요."

AI 제안:
"모델 정확도가 72%에서 89%로 향상되었습니다."
```

#### API 호출 최적화

```typescript
interface ImprovementSuggestion {
  original: string
  improved: string
  reason: string // 개선 이유
  type: 'clarity' | 'terminology' | 'specificity' | 'grammar'
}

// Debounce로 API 호출 최적화
const getSuggestions = debounce(async (text: string) => {
  const response = await fetch('/api/ai/improve', {
    method: 'POST',
    body: JSON.stringify({
      text,
      context: editorContext, // 전체 글 맥락
      userPreferences: {
        tone: 'professional', // 또는 'casual'
        length: 'concise' // 또는 'detailed'
      }
    })
  })
  return response.json()
}, 2000) // 2초 대기
```

### 3. 구조화 도우미

글의 흐름을 분석하고 구조 개선 제안

#### 기능

**1) 아웃라인 자동 생성**
```
사용자 입력:
"GPT-4를 사용해서 챗봇을 만들었어요.
처음에는 프롬프트 작성이 어려웠지만..."

AI 제안 아웃라인:
1. 프로젝트 개요
2. 기술 스택 (GPT-4 API)
3. 구현 과정
   3.1 프롬프트 엔지니어링 학습
   3.2 챗봇 기본 구조 구현
4. 어려웠던 점과 해결 방법
5. 결과 및 배운 점
```

**2) 섹션 추가 제안**
```
현재 구조:
- 학습 동기
- 핵심 인사이트

AI 제안:
"다음 섹션을 추가하면 더 완성도 높은 글이 될 것 같아요:
📚 학습 과정 (어떻게 배웠는지)
🚀 적용 사례 (실제 활용 예시)"
```

**3) 글 흐름 분석**
```
AI 분석:
"현재 '문제 해결' 섹션이 '프로젝트 개요' 앞에 있어
독자가 맥락을 이해하기 어려울 수 있습니다.

제안:
1. 프로젝트 개요
2. 기술 스택
3. 문제 해결 ← 여기로 이동"
```

### 4. AI 질문/제안 시스템

사용자가 작성을 멈췄을 때 도움 제공

#### 트리거 조건

- 30초 이상 작성 중단
- 섹션이 비어있음
- 문장이 미완성 상태

#### 제안 유형

**1) 질문으로 유도**
```
"💡 이런 내용도 추가해보세요:
- 이 기술을 선택한 이유는?
- 대안으로 고려했던 방법은?
- 가장 큰 어려움은 무엇이었나요?"
```

**2) 예시 제공**
```
"다른 사용자들은 이렇게 작성했어요:

예시 1: '처음에는 TensorFlow를 고려했으나,
학습 곡선이 가파르다고 판단해 PyTorch를 선택했습니다.'

예시 2: '...'"
```

**3) 자동 완성 제안**
```
사용자 입력: "가장 어려웠던 점은"

AI 제안:
"...데이터 전처리 과정에서 결측치를 처리하는 것이었습니다.
이를 해결하기 위해..."
```

### 5. 자동 태그 생성

글 내용을 분석해 관련 태그 자동 추천

#### 알고리즘

```typescript
interface TagSuggestion {
  tag: string
  confidence: number // 0-1
  reason: string
}

async function generateTags(content: string): Promise<TagSuggestion[]> {
  const response = await llm.complete({
    prompt: `
다음 글을 읽고 관련성 높은 태그를 5-7개 추천해주세요.

글 내용:
${content}

기존 태그 목록:
${existingTags.join(', ')}

응답 형식:
- 태그명 (신뢰도: 0.0-1.0, 이유)
    `,
    model: 'gpt-4o-mini' // 비용 절약
  })

  return parseTags(response)
}
```

#### 태그 추천 로직

1. **기술 스택 추출**: Python, TensorFlow, React 등
2. **주제 분류**: Tutorial, Project, Learning 등
3. **난이도 판단**: Beginner, Intermediate, Advanced
4. **도메인 인식**: NLP, Computer Vision, Web Development 등

예시:
```
글 내용: "Claude API를 사용해 Next.js 블로그에 AI 챗봇 추가..."

추천 태그:
✅ Claude (신뢰도: 0.95) - 본문에 명시
✅ Next.js (신뢰도: 0.95) - 기술 스택
✅ AI Chatbot (신뢰도: 0.90) - 주제
✅ API Integration (신뢰도: 0.85) - 작업 유형
✅ Tutorial (신뢰도: 0.80) - 글 형식
✅ Intermediate (신뢰도: 0.75) - 난이도
```

### 6. 요약 자동 생성

긴 글을 작성 후 자동으로 인트로/요약 생성

```typescript
async function generateSummary(content: string): Promise<string> {
  const response = await llm.complete({
    prompt: `
다음 글을 2-3문장으로 요약해주세요.
독자가 이 글을 읽어야 하는 이유가 명확하게 드러나야 합니다.

글 내용:
${content}
    `,
    model: 'gpt-4o' // 고품질 요약
  })

  return response.text
}
```

## UI/UX 디자인

### 에디터 레이아웃

```
┌─────────────────────────────────────────────┐
│ [템플릿 선택] [AI 도움말 ▼] [저장] [발행]    │
├─────────────────────────────────────────────┤
│                                             │
│  제목: ____________________________         │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │  # 학습 경험                       │     │
│  │                                    │     │
│  │  사용자 작성 중...                 │     │
│  │                                    │     │
│  │  💡 AI 제안:                      │     │
│  │  이 부분을 더 구체적으로 설명하면  │     │
│  │  좋을 것 같아요. [적용] [무시]     │     │
│  │                                    │     │
│  └───────────────────────────────────┘     │
│                                             │
│  🏷️ 자동 태그: [Python] [ML] [Tutorial]    │
│                                             │
└─────────────────────────────────────────────┘
```

### 인터랙션 패턴

**1) 인라인 제안 (GitHub Copilot 스타일)**
```
사용자 입력:  "PyTorch를 사용해서"
AI 회색 텍스트: "이미지 분류 모델을 구현했습니다."
                ↑ Tab 키로 수락
```

**2) 사이드패널 제안**
```
┌──────────┬───────────────────┐
│          │  💡 AI 도움말     │
│  에디터   │                  │
│          │  [구조 개선]      │
│          │  [문장 다듬기]     │
│          │  [태그 생성]      │
└──────────┴───────────────────┘
```

**3) 플로팅 툴팁**
```
"Python을 배웠어요"
     ↑ 드래그
┌─────────────────┐
│ ✨ AI 개선 제안 │
│ "Python 기초... │
│ [적용] [무시]   │
└─────────────────┘
```

## API 엔드포인트

### 1. 문장 개선
```
POST /api/ai/improve
Body: {
  text: string
  context?: string
  preferences?: {
    tone: 'professional' | 'casual'
    length: 'concise' | 'detailed'
  }
}
Response: {
  suggestions: ImprovementSuggestion[]
}
```

### 2. 구조 분석
```
POST /api/ai/structure
Body: {
  content: string
  templateType?: string
}
Response: {
  outline: Section[]
  suggestions: StructureSuggestion[]
}
```

### 3. 태그 생성
```
POST /api/ai/tags
Body: {
  title: string
  content: string
}
Response: {
  tags: TagSuggestion[]
}
```

### 4. 요약 생성
```
POST /api/ai/summarize
Body: {
  content: string
  maxLength?: number
}
Response: {
  summary: string
}
```

## 비용 최적화 전략

### 1. 모델 선택
- **빠른 제안**: GPT-4o-mini ($0.15/1M tokens)
- **고품질 요약**: GPT-4o ($2.50/1M tokens)
- **균형**: Claude 3.5 Sonnet ($3/1M tokens)

### 2. 캐싱
- 동일한 텍스트 재요청 방지
- Redis 캐시 활용 (24시간 TTL)

### 3. 배치 처리
- 여러 제안을 한 번의 API 호출로 처리
- 스트리밍 응답 활용

### 4. Rate Limiting
- 사용자당 시간당 API 호출 제한
- Free tier: 50회/시간
- Premium: 500회/시간

## 프라이버시 & 윤리

### 데이터 처리
- 사용자 콘텐츠는 AI 모델 학습에 사용되지 않음
- OpenAI/Anthropic의 zero-retention 정책 활용

### 투명성
- AI 제안임을 명확히 표시
- 사용자가 AI 도움 여부 선택 가능
- AI 사용 사실을 게시물에 표시 (선택사항)

## 성공 지표

- AI 제안 수락률: 목표 40% 이상
- 글 작성 완료율: 목표 60% 이상 (vs 30% without AI)
- 평균 작성 시간: 목표 50% 감소
- 사용자 만족도: 목표 4.5/5.0

## 다음 단계

1. ✅ PRD 작성
2. ✅ 기술 스택 결정
3. ✅ 데이터베이스 스키마 설계
4. ✅ AI 에디터 기능 명세
5. ⏭️ 프로젝트 초기 설정 및 개발 시작
