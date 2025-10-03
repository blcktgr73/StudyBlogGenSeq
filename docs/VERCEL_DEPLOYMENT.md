# Vercel 배포 가이드

## 1. Vercel 계정 준비

### 1.1 Vercel 가입
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. **GitHub 계정으로 로그인** (권장)
   - GitHub 저장소와 자동 연동
   - Push 시 자동 배포

## 2. GitHub 저장소 확인

### 2.1 원격 저장소 상태 확인
```bash
git remote -v
git status
```

### 2.2 최신 코드 푸시 확인
```bash
# 변경사항이 있다면 커밋 & 푸시
git add .
git commit -m "docs: Add Supabase and Vercel setup guides"
git push origin main
```

## 3. Vercel 프로젝트 생성

### 3.1 새 프로젝트 Import
1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. "Import Git Repository" 섹션에서 GitHub 저장소 검색
3. `StudyBlogGenSeq` 저장소 선택
4. "Import" 클릭

### 3.2 프로젝트 설정
**Framework Preset**: Next.js (자동 감지)
**Root Directory**: `./ ` (기본값)
**Build Command**: `npm run build` (자동 설정)
**Output Directory**: `.next` (자동 설정)

### 3.3 환경 변수 설정 (중요!)
"Environment Variables" 섹션에서 다음 변수 추가:

#### Supabase 변수
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
  - **Value**: `https://xxxxxxxxxxxxx.supabase.co`
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### AI Provider 변수
- **Name**: `AI_PROVIDER`
  - **Value**: `openai`
- **Name**: `OPENAI_API_KEY`
  - **Value**: `sk-proj-...`
- **Name**: `OPENAI_MODEL`
  - **Value**: `gpt-4o-mini`

**Environment**: Production, Preview, Development 모두 체크

### 3.4 배포 시작
"Deploy" 버튼 클릭

## 4. 배포 진행 상황 확인

### 4.1 빌드 로그 확인
- 실시간 빌드 로그가 표시됨
- 에러 발생 시 로그에서 원인 파악

### 4.2 일반적인 빌드 에러

#### Type 에러
```bash
# 로컬에서 타입 체크
npm run build
```

#### 환경 변수 누락
- Vercel 대시보드에서 환경 변수 재확인
- 변수 추가 후 "Redeploy" 클릭

#### 의존성 에러
```bash
# package.json 확인
npm install
```

## 5. 배포 완료 및 확인

### 5.1 배포 URL 확인
배포 성공 시 다음 URL이 생성됨:
- **Production**: `https://study-blog-gen-seq.vercel.app`
- **Preview**: `https://study-blog-gen-seq-git-branch-name.vercel.app`

### 5.2 기능 테스트
1. 배포된 URL 접속
2. 주요 기능 테스트:
   - ✅ 홈페이지 로딩
   - ✅ Explore 페이지 (게시물 목록)
   - ✅ Write 페이지 (글쓰기)
   - ✅ AI 텍스트 개선 (OpenAI API)
   - ✅ AI 자동 태그 생성
   - ✅ 게시물 발행
   - ✅ 게시물 상세 페이지
   - ✅ 게시물 수정

### 5.3 Supabase 연동 확인
1. 배포된 사이트에서 게시물 작성
2. Supabase 대시보드 → Table Editor → posts 확인
3. 데이터가 저장되었는지 검증

## 6. 도메인 설정 (선택 사항)

### 6.1 커스텀 도메인 추가
1. Vercel 프로젝트 → Settings → Domains
2. "Add" 버튼 클릭
3. 도메인 입력 (예: `studyblog.com`)
4. DNS 설정 지침 따라 진행

### 6.2 DNS 설정 (도메인 제공업체)
**A Record**:
- Type: A
- Name: @
- Value: 76.76.21.21

**CNAME Record**:
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

## 7. 자동 배포 설정

### 7.1 Git 통합 (이미 활성화)
- `main` 브랜치 push → 자동 Production 배포
- 다른 브랜치 push → 자동 Preview 배포

### 7.2 배포 알림
1. Settings → Git → Deploy Hooks
2. Slack, Discord 등과 연동 가능

## 8. 성능 최적화 (선택 사항)

### 8.1 Analytics 활성화
1. Analytics 탭 클릭
2. "Enable Analytics" 클릭
3. 실시간 방문자/성능 데이터 확인

### 8.2 Speed Insights
1. Speed Insights 탭 클릭
2. Core Web Vitals 확인
3. 성능 개선 제안 확인

## 9. 배포 후 체크리스트

- [ ] Production URL 접속 성공
- [ ] 모든 페이지 정상 작동
- [ ] AI 기능 정상 작동 (API 키 확인)
- [ ] Supabase 연동 정상 (게시물 저장)
- [ ] 환경 변수 모두 설정
- [ ] 빌드 에러 없음
- [ ] 브라우저 콘솔 에러 없음

## 10. 문제 해결

### 배포 실패 (Build Error)
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build

# 에러 수정 후 푸시
git add .
git commit -m "fix: Build error"
git push origin main
```

### 환경 변수 미적용
1. Settings → Environment Variables
2. 변수 추가/수정
3. Deployments → 최신 배포 → "Redeploy"

### API 요청 실패
- CORS 설정 확인
- API 키 확인 (Vercel 환경 변수)
- 네트워크 탭에서 요청/응답 확인

### Supabase 연결 실패
- URL이 `https://`로 시작하는지 확인
- anon key (public) 사용 확인
- Supabase 프로젝트가 활성 상태인지 확인

## 11. 모니터링 및 유지보수

### 11.1 에러 추적
- Vercel → Logs 탭에서 실시간 로그 확인
- Runtime Logs: 서버 에러
- Build Logs: 빌드 에러

### 11.2 성능 모니터링
- Analytics 탭에서 트래픽 확인
- Speed Insights에서 성능 지표 확인

### 11.3 자동 업데이트
```bash
# 코드 수정 후
git add .
git commit -m "feat: New feature"
git push origin main
# → Vercel이 자동으로 새 버전 배포
```

## 다음 단계

- [ ] 커스텀 도메인 연결
- [ ] Google Analytics 통합
- [ ] SEO 최적화 (메타 태그, sitemap.xml)
- [ ] PWA 설정 (오프라인 지원)
- [ ] 에러 추적 서비스 연동 (Sentry)
