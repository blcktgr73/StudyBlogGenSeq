# AI 통합 가이드

## 개요

StudyBlog GenSeq는 여러 AI Provider를 지원하는 유연한 AI 서비스 아키텍처를 제공합니다.

### 지원 Provider

- **Mock Service** (기본값): API 키 없이 테스트 가능
- **OpenAI**: GPT-4o-mini를 사용한 비용 효율적인 AI 지원
- **Anthropic (Claude)**: Claude 3.5 Sonnet을 사용한 고품질 텍스트 개선

---

## 🔧 환경 설정

### 1. 환경 변수 파일 생성

`.env.local` 파일을 프로젝트 루트에 생성:

```bash
# AI Service Configuration
AI_PROVIDER=mock  # Options: openai, anthropic, mock

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Anthropic Configuration (Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### 2. Provider 선택

#### Mock Service (개발/테스트용)
```env
AI_PROVIDER=mock
```
- API 키 불필요
- 800ms 시뮬레이션 지연
- 미리 정의된 개선안 제공

#### OpenAI (프로덕션 추천)
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```
- [OpenAI API Key 발급](https://platform.openai.com/api-keys)
- GPT-4o-mini: 비용 효율적 ($0.15/1M input tokens)
- GPT-4o: 고품질 ($5.00/1M input tokens)

#### Anthropic Claude (고품질 추천)
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```
- [Anthropic API Key 발급](https://console.anthropic.com/)
- Claude 3.5 Sonnet: 최신 모델 ($3.00/1M input tokens)
- Claude 3 Haiku: 빠르고 저렴 ($0.25/1M input tokens)

---

## 🏗️ 아키텍처

### 서비스 계층 구조

```
src/lib/ai/
├── types.ts              # TypeScript 인터페이스 정의
├── service-factory.ts    # Provider 선택 및 Singleton 관리
├── mock-service.ts       # Mock 서비스 구현
├── openai-service.ts     # OpenAI 서비스 구현
└── anthropic-service.ts  # Anthropic 서비스 구현
```

### AIService 인터페이스

모든 AI Provider는 동일한 인터페이스를 구현:

```typescript
export interface AIService {
  // 텍스트 개선 (명확성, 디테일, 구조)
  improveText(request: TextImprovementRequest): Promise<TextImprovementResponse>;

  // 태그 자동 생성
  suggestTags(title: string, content: string): Promise<TagSuggestion[]>;
}
```

### Factory Pattern

```typescript
import { getAIService } from '@/lib/ai/service-factory';

const aiService = getAIService(); // 환경변수에 따라 적절한 서비스 반환
const result = await aiService.improveText({ text: '...' });
```

---

## 📝 API 사용법

### 1. 텍스트 개선 API

**Endpoint**: `POST /api/ai/improve`

**Request**:
```typescript
{
  "text": "저는 파이썬을 배웠어요",
  "context": "학습 경험 공유",
  "tone": "professional"  // professional | casual | academic
}
```

**Response**:
```typescript
{
  "improved": "Python 기초 문법을 3주 동안 학습했으며, 특히 객체지향 프로그래밍 개념을 집중적으로 공부했습니다.",
  "reason": "구체적인 기간과 학습 내용을 명시하여 전문성을 높였습니다.",
  "type": "detail"  // clarity | detail | structure
}
```

### 2. 자동 태그 생성 API

**Endpoint**: `POST /api/ai/tags`

**Request**:
```typescript
{
  "title": "Next.js로 AI 블로그 만들기",
  "content": "React 기반의 Next.js 프레임워크를 사용하여..."
}
```

**Response**:
```typescript
{
  "tags": ["Next.js", "React", "AI/ML", "프론트엔드", "튜토리얼"]
}
```

---

## 🧪 테스트

### cURL 명령어

#### 텍스트 개선 테스트
```bash
curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d '{"text":"저는 파이썬을 배웠어요","tone":"professional"}'
```

#### 태그 생성 테스트
```bash
curl -X POST http://localhost:3000/api/ai/tags \
  -H "Content-Type: application/json" \
  -d '{"title":"Next.js 학습","content":"React 기반 프레임워크"}'
```

---

## 🔍 Provider 별 특징 비교

| Provider | 장점 | 단점 | 권장 용도 |
|----------|------|------|----------|
| **Mock** | • API 키 불필요<br>• 빠른 개발/테스트 | • 제한된 개선안<br>• 실제 AI 아님 | 로컬 개발, 데모 |
| **OpenAI** | • 비용 효율적<br>• 빠른 응답 속도<br>• JSON 모드 지원 | • 한국어 품질 약간 낮음 | 프로덕션 (일반) |
| **Claude** | • 최고 품질 한국어<br>• 맥락 이해 우수<br>• 긴 텍스트 처리 | • 약간 비쌈<br>• JSON 파싱 필요 | 프로덕션 (고품질) |

---

## 🛡️ 에러 처리

### Fallback 전략

AI Service Factory는 자동으로 Mock 서비스로 fallback:

```typescript
// API Key가 없으면 자동으로 Mock으로 전환
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not found, falling back to mock service');
  this.instance = new MockAIService();
}
```

### API 에러 처리

```typescript
try {
  const result = await aiService.improveText(request);
} catch (error) {
  console.error('AI improve error:', error);
  // 사용자에게 친절한 에러 메시지 반환
  return { error: 'Failed to improve text' };
}
```

---

## 💰 비용 최적화

### 1. 모델 선택

**개발 단계**: Mock Service 사용
```env
AI_PROVIDER=mock
```

**프로덕션 (저비용)**: GPT-4o-mini
```env
AI_PROVIDER=openai
OPENAI_MODEL=gpt-4o-mini
```

**프로덕션 (고품질)**: Claude 3.5 Sonnet
```env
AI_PROVIDER=anthropic
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### 2. 토큰 사용량 최적화

- **짧은 프롬프트**: 시스템 프롬프트를 간결하게 유지
- **max_tokens 제한**: 응답 길이 제한 (현재 300-500 토큰)
- **캐싱**: 동일 요청에 대한 결과 캐싱 (추후 구현 예정)

### 3. Debouncing

자동 태그 생성은 2초 debounce로 불필요한 API 호출 방지:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (title || content) {
      generateTags();
    }
  }, 2000); // 2초 대기
  return () => clearTimeout(timer);
}, [title, content]);
```

---

## 🔐 보안

### API Key 보호

1. **.env.local**은 절대 커밋하지 않기 (.gitignore에 포함됨)
2. **프로덕션 환경**: 환경 변수로 주입
   ```bash
   # Vercel/Netlify 등에서 설정
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-...
   ```
3. **서버 사이드만 사용**: API Route에서만 AI 서비스 호출

---

## 📊 모니터링 (추후 구현)

### 로깅

```typescript
console.log('Using OpenAI service'); // Provider 선택 로그
console.error('AI improve error:', error); // 에러 로그
```

### 메트릭 (TODO)

- API 호출 횟수
- 평균 응답 시간
- 토큰 사용량
- 에러율

---

## 🚀 다음 단계

### Phase 3: AI 기능 확장

1. **응답 캐싱**: Redis 기반 캐시 시스템
2. **스트리밍 응답**: 실시간 텍스트 개선 표시
3. **A/B 테스트**: Provider별 품질 비교
4. **사용자 피드백**: 개선안 평가 시스템
5. **비용 추적**: 토큰 사용량 대시보드

### 추가 AI 기능

- **요약 생성**: 긴 글 자동 요약
- **제목 제안**: 내용 기반 제목 추천
- **맞춤법 검사**: 한국어 문법 체크
- **SEO 최적화**: 키워드 밀도 분석

---

## 📚 참고 자료

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
