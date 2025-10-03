# 🚀 배포 체크리스트

Supabase와 Vercel을 사용한 프로덕션 배포를 위한 완전한 가이드입니다.

## 📋 사전 준비

- [ ] GitHub 계정 (Vercel 연동용)
- [ ] Supabase 계정
- [ ] OpenAI API 키 (AI 기능 사용 시)
- [ ] 프로젝트 코드가 GitHub에 푸시됨

## 1️⃣ Supabase 설정 (15분)

### 1.1 프로젝트 생성
- [ ] https://supabase.com 접속
- [ ] "New Project" 클릭
- [ ] 프로젝트 정보 입력:
  - Name: `StudyBlogGenSeq`
  - Password: 강력한 비밀번호 생성 (저장!)
  - Region: `Northeast Asia (Seoul)`
  - Plan: `Free`
- [ ] 프로젝트 생성 완료 대기 (~2분)

### 1.2 데이터베이스 마이그레이션
- [ ] 좌측 메뉴 → SQL Editor 클릭
- [ ] "New query" 클릭
- [ ] `supabase/migrations/20251003_001_initial_schema.sql` 복사
- [ ] SQL Editor에 붙여넣기
- [ ] "Run" 버튼 클릭
- [ ] ✅ Success 메시지 확인

### 1.3 테이블 생성 확인
- [ ] Table Editor 클릭
- [ ] 7개 테이블 확인:
  - profiles
  - tags
  - posts
  - post_tags
  - comments
  - likes
  - bookmarks

### 1.4 API 키 복사
- [ ] Settings → API 클릭
- [ ] 다음 정보 복사:
  - **Project URL**: `https://xxxxx.supabase.co`
  - **anon public key**: `eyJhbGci...`

## 2️⃣ Vercel 배포 (10분)

### 2.1 Vercel 프로젝트 생성
- [ ] https://vercel.com 접속
- [ ] GitHub 계정으로 로그인
- [ ] "Add New..." → "Project" 클릭
- [ ] `StudyBlogGenSeq` 저장소 선택
- [ ] "Import" 클릭

### 2.2 환경 변수 설정
**Environment Variables** 섹션에서 다음 변수 추가:

#### Supabase (필수)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = (Supabase Project URL)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Supabase anon key)

#### AI Provider (필수)
- [ ] `AI_PROVIDER` = `openai`
- [ ] `OPENAI_API_KEY` = (OpenAI API 키)
- [ ] `OPENAI_MODEL` = `gpt-4o-mini`

> **Environment**: Production, Preview, Development 모두 체크 ✅

### 2.3 배포 시작
- [ ] "Deploy" 버튼 클릭
- [ ] 빌드 로그 확인 (2-3분)
- [ ] ✅ Deployment 성공 확인

## 3️⃣ 배포 확인 (5분)

### 3.1 기본 기능 테스트
- [ ] 배포된 URL 접속 (예: `https://study-blog-gen-seq.vercel.app`)
- [ ] 홈페이지 로딩 확인
- [ ] Explore 페이지 접속
- [ ] Write 페이지 접속

### 3.2 AI 기능 테스트
- [ ] Write 페이지에서 제목 입력
- [ ] 내용 입력
- [ ] 2초 후 자동 태그 생성 확인
- [ ] "AI 개선 제안받기" 버튼 클릭
- [ ] AI 개선안 확인

### 3.3 Supabase 연동 확인
- [ ] 게시물 작성 및 발행
- [ ] Supabase 대시보드 → Table Editor → posts 확인
- [ ] 게시물 데이터 저장 확인
- [ ] Explore 페이지에서 게시물 표시 확인
- [ ] 게시물 상세 페이지 접속
- [ ] 조회수 증가 확인

## 4️⃣ 문제 해결

### ❌ 빌드 실패 시
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build

# 에러 수정 후 푸시
git add .
git commit -m "fix: Build error"
git push origin main
```

### ❌ Supabase 연결 실패 시
1. Vercel → Settings → Environment Variables 확인
2. `NEXT_PUBLIC_SUPABASE_URL`이 `https://`로 시작하는지 확인
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값 재확인
4. Deployments → Redeploy

### ❌ AI 기능 작동 안 함
1. `OPENAI_API_KEY` 환경 변수 확인
2. OpenAI API 크레딧 잔액 확인
3. 브라우저 콘솔에서 에러 메시지 확인

## 5️⃣ 선택 사항

### 커스텀 도메인 (선택)
- [ ] Vercel → Settings → Domains
- [ ] 도메인 추가
- [ ] DNS 설정 (A 레코드/CNAME)
- [ ] SSL 인증서 자동 발급 확인

### 모니터링 (선택)
- [ ] Vercel Analytics 활성화
- [ ] Speed Insights 활성화
- [ ] Error tracking 설정

## ✅ 배포 완료!

모든 체크리스트가 완료되면:

1. **Production URL 공유**: `https://your-app.vercel.app`
2. **자동 배포 활성화**: `main` 브랜치 푸시 시 자동 배포
3. **모니터링 시작**: Vercel 대시보드에서 트래픽 확인

---

## 📊 예상 비용

### Free Tier (개발/테스트)
- Vercel: $0 (Hobby 플랜)
- Supabase: $0 (Free 플랜 - 500MB DB)
- OpenAI: ~$5/월 (GPT-4o-mini, 100 요청/일 기준)
- **Total: ~$5/월**

### Production (100 MAU)
- Vercel: $20 (Pro 플랜)
- Supabase: $25 (Pro 플랜 - 8GB DB)
- OpenAI: $20-50/월 (사용량 기반)
- **Total: $65-95/월**

---

## 🔗 참고 문서

- [Supabase 설정 가이드](docs/SUPABASE_SETUP.md)
- [Vercel 배포 가이드](docs/VERCEL_DEPLOYMENT.md)
- [프로젝트 README](README.md)
- [개발 진행 상황](docs/00-development-progress.md)

---

## 🆘 도움이 필요하신가요?

- Supabase 문제: https://supabase.com/docs
- Vercel 문제: https://vercel.com/docs
- Next.js 문제: https://nextjs.org/docs
- GitHub Issues: https://github.com/blcktgr73/StudyBlogGenSeq/issues
