# StudyBlog GenSeq - 테스트 가이드

## 🎮 현재 구현된 기능 테스트

### 개발 서버 시작

```bash
npm run dev
```

서버 주소: http://localhost:3000

---

## 1. UI 페이지 테스트

### 홈페이지
```
URL: http://localhost:3000
```
- ✅ 환영 메시지
- ✅ 네비게이션 링크
- ✅ shadcn/ui 스타일링

### Explore 페이지 (글 탐색)
```
URL: http://localhost:3000/explore
```
**테스트 항목**:
- ✅ 4개 샘플 게시물 카드
- ✅ 필터 배지 (최신, 인기, 추천)
- ✅ 태그, 좋아요, 댓글 수 표시
- ✅ 반응형 3열 그리드

### Tags 페이지 (태그 목록)
```
URL: http://localhost:3000/tags
```
**테스트 항목**:
- ✅ 16개 컬러 코딩 태그
- ✅ 인기 태그 섹션 (상위 8개)
- ✅ 태그별 게시물 수
- ✅ 검색 입력 필드

### Write 페이지 (AI 글쓰기)
```
URL: http://localhost:3000/write
```
**테스트 항목**:
- ✅ 템플릿 선택 (학습 경험, 프로젝트 후기, 튜토리얼)
- ✅ 제목/내용 입력 필드
- ✅ AI 도우미 정보 패널
- ✅ 자동 태그 생성 (2초 디바운스)
- ✅ AI 문장 개선 기능

---

## 2. AI 기능 테스트

### 2.1. 기능 상태 확인

```bash
curl http://localhost:3000/api/test
```

**응답 확인**:
```json
{
  "success": true,
  "phase": "Phase 3 (Database & Auth) - 75%",
  "features": {
    "✅ AI Integration": {
      "currentProvider": "mock",
      "features": ["Text Improvement", "Auto-tagging"]
    }
  }
}
```

### 2.2. AI 텍스트 개선 API

**테스트 케이스 1**: 간단한 문장
```bash
curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"저는 파이썬을 배웠어요\",\"tone\":\"professional\"}"
```

**예상 응답**:
```json
{
  "improved": "Python 기초 문법을 3주 동안 학습했으며, 특히 객체지향 프로그래밍 개념을 집중적으로 공부했습니다.",
  "reason": "구체적인 기간과 학습 내용을 명시하여 전문성을 높였습니다.",
  "type": "clarity"
}
```

**테스트 케이스 2**: 성능 개선 문장
```bash
curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"성능이 좋아졌어요\"}"
```

**예상 응답**:
```json
{
  "improved": "모델의 정확도가 72%에서 89%로 17%p 향상되었습니다.",
  "reason": "정량적 지표를 사용하여 객관적으로 표현했습니다.",
  "type": "clarity"
}
```

### 2.3. AI 자동 태그 생성 API

```bash
curl -X POST http://localhost:3000/api/ai/tags \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Next.js로 AI 블로그 만들기\",\"content\":\"React 기반의 Next.js 프레임워크를 사용하여 AI 글쓰기 도우미를 구현했습니다\"}"
```

**예상 응답**:
```json
{
  "tags": ["Next.js", "React", "JavaScript", "AI"]
}
```

### 2.4. Write 페이지에서 AI 기능 테스트

1. http://localhost:3000/write 접속
2. **제목 입력**: "Next.js로 AI 블로그 만들기"
3. **내용 입력**: "React와 TypeScript를 사용했습니다"
4. **2초 대기** → 자동으로 태그 생성
5. **"AI 개선 제안받기"** 버튼 클릭
6. 개선안 확인 후 **"적용하기"** 클릭

---

## 3. AI Provider 전환 테스트

### Mock → OpenAI 전환

**.env.local** 수정:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_openai_key
OPENAI_MODEL=gpt-4o-mini
```

개발 서버 재시작:
```bash
# Ctrl+C로 서버 중지
npm run dev
```

테스트:
```bash
curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"리액트를 배웠습니다\"}"
```

**실제 GPT-4o-mini 응답 확인**

### Mock → Claude 전환

**.env.local** 수정:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_actual_anthropic_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

동일하게 테스트

---

## 4. 데이터베이스 연결 테스트 (Supabase 설정 후)

### 4.1. Supabase 프로젝트 생성

1. https://supabase.com/ 접속
2. 새 프로젝트 생성
3. API 키 복사

### 4.2. 환경 변수 설정

**.env.local** 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4.3. 마이그레이션 실행

**Supabase Dashboard**에서:
1. SQL Editor 클릭
2. `supabase/migrations/20251003_001_initial_schema.sql` 복사
3. Run 실행
4. `supabase/migrations/20251003_002_seed_data.sql` 복사
5. Run 실행

### 4.4. 데이터베이스 테스트 API 생성

`src/app/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllTags } from '@/lib/supabase/queries';

export async function GET() {
  try {
    const supabase = await createClient();
    const tags = await getAllTags(supabase);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tagsCount: tags.length,
      tags: tags.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

**테스트**:
```bash
curl http://localhost:3000/api/test-db
```

**예상 응답**:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "tagsCount": 16,
  "tags": [
    { "name": "JavaScript", "slug": "javascript", "color": "#F7DF1E" },
    ...
  ]
}
```

---

## 5. 성능 테스트

### AI 응답 시간 (Mock)
```bash
time curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"테스트\"}"
```
**예상**: ~800ms (Mock 딜레이)

### AI 응답 시간 (OpenAI)
실제 API 사용 시: 1-3초

### 페이지 로드 시간
- 홈페이지: < 1초
- Explore: < 1초
- Write: < 1초

---

## 6. 브라우저 콘솔 테스트

### Write 페이지에서 개발자 도구 확인

1. F12로 개발자 도구 열기
2. Console 탭 확인
3. Network 탭에서 API 호출 확인:
   - `/api/ai/tags` (자동 태그)
   - `/api/ai/improve` (문장 개선)

---

## 7. 반응형 디자인 테스트

### 브라우저 크기 조정

- **Desktop (1920px)**: 3열 그리드
- **Tablet (768px)**: 2열 그리드
- **Mobile (375px)**: 1열 그리드

F12 → Device Toolbar (Ctrl+Shift+M)로 테스트

---

## 8. 다크 모드 테스트

현재는 시스템 설정 따름:
- Windows: 설정 → 개인 설정 → 색
- macOS: System Preferences → Appearance

**확인 항목**:
- ✅ Write 페이지 입력 필드 가독성
- ✅ 버튼 색상 대비
- ✅ 카드 배경색

---

## 🐛 알려진 제한사항

### 현재 구현되지 않은 기능

- ❌ 인증 (로그인/회원가입)
- ❌ 게시물 실제 저장 (DB 연결 필요)
- ❌ 댓글 기능
- ❌ 좋아요/북마크
- ❌ 이미지 업로드
- ❌ 실시간 협업

### Mock AI 제한사항

- 미리 정의된 2개 문장만 실제 개선안 제공
- 나머지는 "(더 구체적인 내용을 추가하면 좋을 것 같습니다)" 추가
- 16개 키워드만 태그 감지

---

## ✅ 테스트 체크리스트

### UI 테스트
- [ ] 홈페이지 정상 렌더링
- [ ] Explore 페이지 4개 카드 표시
- [ ] Tags 페이지 16개 태그 표시
- [ ] Write 페이지 템플릿 선택 가능

### AI 기능 테스트
- [ ] 텍스트 개선 API 정상 응답 (800ms)
- [ ] 자동 태그 생성 정상 작동
- [ ] Write 페이지에서 AI 버튼 클릭 가능
- [ ] 2초 디바운스 후 자동 태그 생성

### API 테스트
- [ ] `/api/test` 기능 상태 확인
- [ ] `/api/ai/improve` 200 응답
- [ ] `/api/ai/tags` 200 응답

### 데이터베이스 테스트 (Supabase 설정 후)
- [ ] 마이그레이션 성공
- [ ] 16개 태그 삽입 확인
- [ ] `/api/test-db` 연결 성공

---

## 📊 성능 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| 페이지 로드 | < 1초 | ✅ |
| Mock AI 응답 | ~800ms | ✅ |
| 실제 AI 응답 | < 3초 | ⏸️ |
| DB 쿼리 | < 100ms | ⏸️ |

---

## 🔗 참고 문서

- [AI Integration Guide](./docs/06-ai-integration-guide.md)
- [Supabase Setup Guide](./docs/07-supabase-setup-guide.md)
- [Development Progress](./docs/00-development-progress.md)
