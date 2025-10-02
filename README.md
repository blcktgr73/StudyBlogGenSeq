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
│   ├── 01-PRD.md             # 제품 요구사항 정의서
│   ├── 02-tech-stack.md      # 기술 스택 상세
│   ├── 03-database-schema.md # DB 스키마 설계
│   └── 04-ai-editor-features.md # AI 에디터 기능 명세
├── app/                       # Next.js App Router (예정)
├── components/                # React 컴포넌트 (예정)
├── lib/                       # 유틸리티 & API (예정)
└── README.md
```

## 📋 개발 로드맵

### Phase 1: Foundation (4주)
- [x] PRD 및 기술 문서 작성
- [ ] 프로젝트 초기 설정
- [ ] Supabase 데이터베이스 구축
- [ ] 기본 인증 시스템
- [ ] UI 컴포넌트 라이브러리

### Phase 2: AI Editor Core (4주)
- [ ] Tiptap 에디터 통합
- [ ] LLM API 연동
- [ ] 실시간 문장 개선 기능
- [ ] 템플릿 시스템
- [ ] 자동 태그 생성

### Phase 3: Community Features (3주)
- [ ] 게시물 CRUD
- [ ] 댓글 시스템
- [ ] 좋아요/북마크
- [ ] 검색 기능

### Phase 4: Polish & Launch (2주)
- [ ] 성능 최적화
- [ ] 사용자 테스트
- [ ] 베타 런칭

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- pnpm (권장)
- Supabase 계정
- OpenAI API 키

### 설치 (예정)

```bash
# 저장소 클론
git clone https://github.com/yourusername/StudyBlogGenSeq.git
cd StudyBlogGenSeq

# 패키지 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 API 키 입력

# 개발 서버 실행
pnpm dev
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
