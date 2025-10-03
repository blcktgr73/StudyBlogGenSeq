# AI Study Platform

AI 학습 경험을 작성할 때 LLM의 도움을 받아 더 구조화되고 통찰력 있는 콘텐츠를 만들 수 있는 커뮤니티 플랫폼

## 🎯 프로젝트 비전

GPTers와 같은 AI 학습 커뮤니티에서 **작성 과정 자체에 AI를 통합**하여, 초보자도 전문가처럼 학습 경험을 구조화하고 공유할 수 있도록 돕습니다.

## ✨ 핵심 기능

### 1. AI 글쓰기 어시스턴트
- 📝 **실시간 문장 개선** - 작성 중 더 나은 표현 제안
- 🏗️ **구조화 도우미** - AI가 글의 흐름과 아웃라인 제안
- 💡 **스마트 질문** - 작성이 막힐 때 아이디어 제공
- 🏷️ **자동 태그 생성** - 콘텐츠 분석 후 관련 태그 추천

### 2. 학습 커뮤니티
- 📚 게시물 작성/공유
- 💬 댓글 및 토론
- ❤️ 좋아요 & 북마크
- 🔍 태그 기반 검색

### 3. 템플릿 시스템
- 학습 경험 템플릿
- 프로젝트 후기 템플릿
- 튜토리얼 템플릿

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Tiptap** (Rich Text Editor)

### Backend
- **Next.js API Routes** + **Server Actions**
- **Supabase** (PostgreSQL + Auth + Storage)
- **Drizzle ORM**

### AI/LLM
- **OpenAI API** (GPT-4o, GPT-4o-mini)
- **Anthropic Claude API** (Claude 3.5 Sonnet)

### Deployment
- **Vercel** (Hosting)
- **Supabase Cloud** (Database)

## 📁 프로젝트 구조

```
StudyBlogGenSeq/
├── docs/                      # 프로젝트 문서
│   ├── 00-development-progress.md  # 개발 진행 상황
│   ├── 01-PRD.md             # 제품 요구사항 정의서
│   ├── 02-tech-stack.md      # 기술 스택 상세
│   ├── 03-database-schema.md # DB 스키마 설계
│   └── 04-ai-editor-features.md # AI 에디터 기능 명세
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/ai/          # AI API Routes
│   │   ├── explore/         # 둘러보기 페이지
│   │   ├── tags/            # 태그 페이지
│   │   └── write/           # 글쓰기 페이지 (AI 에디터)
│   ├── components/
│   │   ├── ui/              # shadcn/ui 컴포넌트
│   │   └── layout/          # 레이아웃 컴포넌트
│   └── lib/
│       └── ai/              # AI 서비스 레이어
└── README.md
```

## 📋 개발 로드맵

### Phase 1: Foundation ✅ (완료)
- [x] PRD 및 기술 문서 작성
- [x] 프로젝트 초기 설정 (Next.js 15 + TypeScript)
- [x] UI 컴포넌트 라이브러리 (shadcn/ui)
- [x] 기본 레이아웃 (Header, Footer)
- [x] 핵심 페이지 (Home, Explore, Tags, Write)

### Phase 2: AI Editor Core ✅ (완료)
- [x] AI 서비스 레이어 구축
- [x] Mock AI 서비스 (API 없이 테스트 가능)
- [x] 자동 태그 생성 (16개 키워드 감지)
- [x] 실시간 문장 개선 기능
- [x] 템플릿 시스템 (3가지 템플릿)
- [x] API Routes (/api/ai/improve, /api/ai/tags)
- [x] 실제 OpenAI/Claude API 통합 (GPT-4o-mini, Claude 3.5 Sonnet)
- [x] Multi-provider AI 아키텍처 (Factory Pattern)
- [ ] Tiptap 리치 에디터 통합
- [ ] 실시간 스트리밍 응답

### Phase 3: Database & Community Features 🚧 (진행 중 - 90%)
- [x] Supabase 데이터베이스 스키마 설계 (7 테이블)
- [x] 마이그레이션 파일 작성
- [x] LocalStorage 기반 게시물 관리 (임시)
- [x] 글쓰기 → 발행 → 탐색 완전한 워크플로우
- [x] 게시물 CRUD (저장/발행)
- [x] 자동 슬러그 생성 (한글+영문)
- [x] 자동 요약 생성 (150자)
- [ ] Supabase 실제 연결
- [ ] 사용자 인증 (OAuth)
- [ ] 댓글 시스템
- [ ] 좋아요/북마크
- [ ] 검색 기능

### Phase 4: Polish & Launch (예정)
- [ ] 성능 최적화
- [ ] 사용자 테스트
- [ ] 베타 런칭

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 pnpm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/blcktgr73/StudyBlogGenSeq.git
cd StudyBlogGenSeq

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 🎮 AI 에디터 체험하기

1. **글쓰기 페이지 접속**: http://localhost:3000/write
2. **템플릿 선택**: 학습 경험, 프로젝트 후기, 튜토리얼 중 선택
3. **제목 입력**: 예) "Next.js로 AI 블로그 만들기"
4. **내용 입력**:
   - 테스트 문구 1: "저는 파이썬을 배웠어요"
   - 테스트 문구 2: "성능이 좋아졌어요"
5. **AI 기능 체험**:
   - 2초 후 자동으로 태그 생성됨 (실제 GPT-4o-mini 사용)
   - "AI 개선 제안받기" 버튼 클릭하여 문장 개선안 확인 (~8초)
   - 제안을 "적용" 또는 "무시" 선택 가능
6. **게시물 저장/발행**:
   - "💾 임시저장" - 초안으로 저장
   - "🚀 발행하기" - 즉시 발행 후 Explore 페이지로 이동
7. **발행된 게시물 확인**: http://localhost:3000/explore

### 환경 변수 설정

**실제 AI API 사용 (필수)**:
```bash
cp .env.example .env.local
# .env.local 파일에 API 키 입력
AI_PROVIDER=openai  # 또는 anthropic, mock
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
# 또는 Claude 사용 시
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**Supabase 설정 (선택 사항 - 현재는 LocalStorage 사용)**:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 성공 지표 (KPI)

### 단기 (3개월)
- 주간 활성 사용자(WAU): 100명
- AI 에디터 사용률: 70% 이상
- 평균 글 작성 완료율: 60% 이상

### 중기 (6개월)
- 월간 활성 사용자(MAU): 500명
- 작성된 게시물 수: 1,000개 이상
- 사용자 재방문율: 40% 이상

## 💰 예상 비용

### 초기 개발 단계
- Vercel: $0 (Hobby 플랜)
- Supabase: $0 (Free 플랜)
- OpenAI API: ~$50/월
- **Total: ~$50/월**

### 프로덕션 (100 MAU)
- Vercel: $20 (Pro 플랜)
- Supabase: $25 (Pro 플랜)
- OpenAI API: $100-200/월
- **Total: $150-250/월**

## 📝 라이선스

MIT License

## 🤝 기여하기

이 프로젝트는 현재 개발 초기 단계입니다. 기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 연락처

프로젝트 관련 문의: [이메일 또는 이슈 트래커]

## 🙏 Acknowledgments

- [GPTers](https://www.gpters.org/) - 영감을 준 플랫폼
- [Next.js](https://nextjs.org/) - React 프레임워크
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [OpenAI](https://openai.com/) - LLM API
- [Anthropic](https://anthropic.com/) - Claude API
