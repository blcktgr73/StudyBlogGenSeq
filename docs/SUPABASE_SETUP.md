# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 대시보드 접속
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 또는 Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: StudyBlogGenSeq (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: Northeast Asia (Seoul) - 한국과 가장 가까운 리전
   - **Pricing Plan**: Free (개발용)
3. "Create new project" 클릭
4. 프로젝트 생성 대기 (~2분)

## 2. 데이터베이스 마이그레이션

### 2.1 SQL Editor에서 스키마 실행
1. Supabase 대시보드에서 프로젝트 선택
2. 좌측 메뉴에서 **SQL Editor** 클릭
3. "New query" 클릭
4. `supabase/migrations/20251003_001_initial_schema.sql` 파일 내용 복사
5. SQL Editor에 붙여넣기
6. "Run" 버튼 클릭
7. 성공 메시지 확인

### 2.2 테이블 생성 확인
1. 좌측 메뉴에서 **Table Editor** 클릭
2. 다음 테이블이 생성되었는지 확인:
   - profiles (사용자 프로필)
   - tags (태그)
   - posts (게시물)
   - post_tags (게시물-태그 관계)
   - comments (댓글)
   - likes (좋아요)
   - bookmarks (북마크)

## 3. API 키 및 URL 확인

### 3.1 프로젝트 설정으로 이동
1. 좌측 메뉴 하단의 **Settings** (톱니바퀴) 클릭
2. **API** 메뉴 선택

### 3.2 필요한 정보 복사
다음 정보를 복사하여 안전한 곳에 저장:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 4. 환경 변수 설정

### 4.1 로컬 환경 변수 (.env.local)
프로젝트 루트에 `.env.local` 파일 생성 (이미 있다면 업데이트):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Provider (기존)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

**⚠️ 주의**:
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능
- `.env.local` 파일은 절대 Git에 커밋하지 말 것 (이미 .gitignore에 포함됨)

### 4.2 Vercel 환경 변수 (배포 시)
Vercel 대시보드에서 설정:

1. Vercel 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AI_PROVIDER`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`

## 5. Row Level Security (RLS) 정책 확인

마이그레이션 파일에 이미 RLS 정책이 포함되어 있습니다:

### 현재 적용된 정책:
- **posts**: 모두 읽기 가능, 인증된 사용자만 작성/수정/삭제
- **comments**: 모두 읽기 가능, 인증된 사용자만 작성, 작성자만 수정/삭제
- **likes/bookmarks**: 인증된 사용자만 자신의 좋아요/북마크 관리
- **profiles**: 모두 읽기 가능, 본인만 수정

### RLS 정책 확인 방법:
1. Table Editor에서 테이블 선택
2. "Policies" 탭 클릭
3. 활성화된 정책 확인

## 6. 인증 설정 (선택 사항)

### 6.1 이메일 인증 활성화
1. Authentication → Providers
2. Email 토글 활성화
3. "Save" 클릭

### 6.2 OAuth 설정 (Google/GitHub)
1. Authentication → Providers
2. Google 또는 GitHub 선택
3. Client ID 및 Secret 입력
4. Redirect URL 복사하여 OAuth 앱에 등록

## 7. 연동 테스트

### 7.1 로컬 서버 재시작
```bash
npm run dev
```

### 7.2 브라우저 콘솔 확인
- F12 → Console
- Supabase 연결 오류 없는지 확인

### 7.3 기능 테스트
1. 글쓰기 페이지에서 게시물 작성
2. Supabase 대시보드 → Table Editor → posts 테이블 확인
3. 데이터가 저장되었는지 확인

## 8. 문제 해결

### 연결 오류 (Invalid URL)
- `.env.local` 파일의 URL이 정확한지 확인
- `https://` 프로토콜 포함 확인
- 서버 재시작 (`npm run dev`)

### RLS 정책 오류 (Row Level Security)
- SQL Editor에서 마이그레이션 파일 다시 실행
- 정책이 활성화되었는지 확인

### API 키 오류
- anon key (public key) 사용 확인
- service_role key는 서버 사이드에서만 사용

## 다음 단계

- [ ] LocalStorage 데이터를 Supabase로 마이그레이션
- [ ] 사용자 인증 구현 (OAuth)
- [ ] 실시간 댓글 기능 추가
- [ ] Vercel 배포
