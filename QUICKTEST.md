# 빠른 테스트 가이드

## 🚀 서버 시작

```bash
npm run dev
```

서버: http://localhost:3000 (또는 http://localhost:3001)

---

## ✅ 1. 기능 상태 확인

```bash
curl http://localhost:3000/api/test
```

**성공 응답**:
```json
{
  "success": true,
  "phase": "Phase 3 (Database & Auth) - 75%",
  "features": {
    "✅ Next.js 15": { "version": "15.5.4" },
    "✅ UI Components": { "pages": ["/", "/explore", "/tags", "/write"] },
    "✅ AI Integration": { "currentProvider": "mock" },
    "✅ Database Setup": { "tables": 7 }
  }
}
```

---

## 🤖 2. AI 텍스트 개선 테스트

```bash
curl -X POST http://localhost:3000/api/ai/improve \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"저는 파이썬을 배웠어요\"}"
```

**응답**: 800ms 후 개선된 문장 반환

---

## 🏷️ 3. AI 자동 태그 테스트

```bash
curl -X POST http://localhost:3000/api/ai/tags \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Next.js로 AI 블로그 만들기\",\"content\":\"React와 TypeScript를 사용했습니다\"}"
```

**응답**: `["React", "JavaScript", "AI", "Next.js"]`

---

## 🖥️ 4. 브라우저 테스트

### 페이지 접속
- **홈**: http://localhost:3000/
- **Explore**: http://localhost:3000/explore (4개 샘플 게시물)
- **Tags**: http://localhost:3000/tags (16개 태그)
- **Write**: http://localhost:3000/write (AI 글쓰기)

### Write 페이지에서 AI 기능
1. 제목 입력: "Next.js로 AI 블로그 만들기"
2. 내용 입력: "React와 TypeScript를 사용했습니다"
3. **2초 대기** → 자동 태그 생성 확인
4. **"AI 개선 제안받기"** 버튼 클릭
5. 개선안 확인 후 **"적용하기"**

---

## 📊 현재 구현 상태

| 기능 | 상태 |
|------|------|
| Next.js 15 | ✅ 완료 |
| UI Components | ✅ 완료 |
| AI Integration | ✅ 완료 (Mock) |
| Database Schema | ✅ 완료 |
| Authentication | ⏸️ 대기 |
| Real DB | ⏸️ 대기 (Supabase 설정 필요) |

---

## 🔗 상세 가이드

- [전체 테스트 가이드](./TESTING.md)
- [AI 통합 가이드](./docs/06-ai-integration-guide.md)
- [Supabase 설정](./docs/07-supabase-setup-guide.md)
