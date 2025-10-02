# 기술 스택 (Tech Stack)

## 전체 아키텍처

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  React + TypeScript + Tailwind CSS      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Backend (Next.js API)            │
│      Server Actions + API Routes        │
└─────────────┬───────────┬───────────────┘
              │           │
    ┌─────────▼──┐   ┌───▼────────────┐
    │ Database   │   │   LLM API      │
    │ (Supabase) │   │ (OpenAI/Claude)│
    └────────────┘   └────────────────┘
```

## Frontend

### Core Framework
- **Next.js 15** (App Router)
  - 이유: React 기반 풀스택 프레임워크, SSR/SSG 지원, 빠른 개발
  - Server Components로 성능 최적화
  - API Routes로 백엔드 통합

- **React 18+**
  - 이유: 컴포넌트 기반 UI, 풍부한 생태계
  - Hooks로 상태 관리
  - Suspense로 로딩 처리

- **TypeScript**
  - 이유: 타입 안정성, 개발자 경험 향상
  - 컴파일 타임 에러 방지
  - IDE 자동완성 지원

### UI/UX
- **Tailwind CSS**
  - 이유: 빠른 스타일링, 일관된 디자인 시스템
  - JIT 모드로 빌드 크기 최적화
  - 반응형 디자인 쉽게 구현

- **shadcn/ui**
  - 이유: 고품질 React 컴포넌트, 커스터마이징 용이
  - Radix UI 기반 (접근성 우수)
  - 복사/붙여넣기 방식으로 번들 크기 최소화

- **Lucide Icons**
  - 이유: 깔끔한 아이콘 세트, Tree-shaking 지원
  - 일관된 디자인

### 에디터
- **Tiptap** 또는 **Lexical**
  - 이유: 확장 가능한 리치 텍스트 에디터
  - Markdown 지원
  - 실시간 협업 기능 추가 가능
  - 추천: Tiptap (문서화가 더 좋음)

### 상태 관리
- **React Hooks** (useState, useContext)
  - 이유: 간단한 상태는 내장 Hook으로 충분

- **Zustand** (선택적)
  - 이유: 복잡한 전역 상태 관리 시 사용
  - Redux보다 가볍고 간단

## Backend

### Framework
- **Next.js API Routes + Server Actions**
  - 이유: 프론트엔드와 통합, 별도 백엔드 불필요
  - Server Actions로 데이터 mutation
  - API Routes로 RESTful 엔드포인트

### Authentication
- **NextAuth.js (Auth.js v5)**
  - 이유: Next.js와 완벽 통합
  - OAuth 제공자 쉽게 추가 (Google, GitHub 등)
  - JWT/Session 지원

- **대안: Supabase Auth**
  - 이유: Supabase 사용 시 통합 인증
  - Row Level Security (RLS) 지원

### API Integration
- **LLM API**
  - **OpenAI API** (GPT-4o, GPT-4o-mini)
    - 장점: 안정적, 빠른 응답, 좋은 문서화
    - 단점: 비용 높음

  - **Anthropic Claude API** (Claude 3.5 Sonnet)
    - 장점: 긴 컨텍스트, 정확한 응답, 저렴함
    - 단점: 한국 리전 없음

  - **추천**: OpenAI GPT-4o-mini (비용 효율) + Claude 3.5 Sonnet (고품질 응답)

## Database

### Primary Database
- **Supabase (PostgreSQL)**
  - 이유:
    - PostgreSQL 기반 (확장성, 안정성)
    - 실시간 기능 내장
    - Authentication 통합
    - Row Level Security (RLS)
    - 무료 티어 제공
    - RESTful API 자동 생성
    - Storage 제공 (이미지 업로드)

### ORM
- **Prisma** 또는 **Drizzle ORM**
  - **Prisma**
    - 장점: 타입 안전성, 마이그레이션 도구, 좋은 DX
    - 단점: 번들 크기가 큼

  - **Drizzle ORM** (추천)
    - 장점: 가볍고 빠름, TypeScript 우선, SQL-like 문법
    - 단점: 생태계가 상대적으로 작음

### 대안
- **Vercel Postgres**
  - 이유: Vercel과 완벽 통합
  - 단점: Authentication 별도 구현 필요

## Deployment & Infrastructure

### Hosting
- **Vercel**
  - 이유: Next.js 최적화, 자동 배포, Edge Functions
  - 무료 티어로 시작 가능
  - Git 연동 자동 배포

### Database Hosting
- **Supabase Cloud**
  - 무료 티어: 500MB DB, 1GB 파일 저장소
  - Pro: $25/월

### CDN & Storage
- **Supabase Storage** (이미지, 파일)
- **Vercel Edge Network** (정적 에셋)

### Monitoring
- **Vercel Analytics** (웹 분석)
- **Sentry** (에러 추적, 선택적)

## Development Tools

### Package Manager
- **pnpm**
  - 이유: 빠르고, 디스크 효율적, monorepo 지원

### Code Quality
- **ESLint** (Linting)
- **Prettier** (Code formatting)
- **Husky** (Git hooks)
- **lint-staged** (커밋 전 검사)

### Testing (Phase 2+)
- **Vitest** (단위 테스트)
- **Playwright** (E2E 테스트)

## 예상 비용 (월)

### Free Tier (개발/초기)
- Vercel: $0 (Hobby)
- Supabase: $0 (Free)
- LLM API: $0-50 (사용량 기준)
- **Total: $0-50/월**

### Production (100 MAU 기준)
- Vercel: $20 (Pro)
- Supabase: $25 (Pro)
- LLM API: $100-200 (사용량 증가)
- 도메인: $1-2/월
- **Total: $150-250/월**

## 기술 선택 이유 요약

| 카테고리 | 선택 | 이유 |
|---------|------|------|
| Frontend | Next.js 15 | 풀스택 프레임워크, SSR, 빠른 개발 |
| UI | Tailwind + shadcn/ui | 빠른 스타일링, 고품질 컴포넌트 |
| 에디터 | Tiptap | 확장성, Markdown 지원 |
| Backend | Next.js API | 프론트엔드 통합, 별도 서버 불필요 |
| Database | Supabase | PostgreSQL, 실시간, Auth 통합 |
| ORM | Drizzle | 가볍고 빠름, TypeScript 우선 |
| LLM | OpenAI + Claude | 비용 효율 + 고품질 |
| Hosting | Vercel | Next.js 최적화, 자동 배포 |

## 다음 단계

1. ✅ PRD 작성
2. ✅ 기술 스택 결정
3. ⏭️ 데이터베이스 스키마 설계
4. ⏭️ AI 에디터 기능 명세
5. ⏭️ 프로젝트 초기 설정
