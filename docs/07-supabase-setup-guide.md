# Supabase 설정 가이드

## 개요

StudyBlog GenSeq는 Supabase를 백엔드 데이터베이스로 사용합니다. PostgreSQL 기반의 Supabase는 실시간 기능, 인증, 스토리지, Row Level Security(RLS)를 제공합니다.

---

## 🚀 Supabase 프로젝트 생성

### 1. Supabase 계정 생성

1. [Supabase 웹사이트](https://supabase.com/)에 접속
2. **Start your project** 클릭
3. GitHub 또는 이메일로 계정 생성

### 2. 새 프로젝트 생성

1. 대시보드에서 **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `StudyBlog-GenSeq`
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)` 또는 가장 가까운 지역
   - **Pricing Plan**: Free (개발용) 또는 Pro
3. **Create new project** 클릭
4. 프로젝트 생성 완료까지 약 2분 대기

### 3. API 키 확인

프로젝트 생성 후:
1. 좌측 메뉴에서 **Settings** → **API** 클릭
2. 다음 정보를 복사:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJh...`
   - **service_role key**: `eyJh...` (서버 사이드 전용, 보안 주의!)

---

## 🔧 환경 변수 설정

### .env.local 업데이트

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI Service Configuration (기존)
AI_PROVIDER=mock
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

**주의사항**:
- `NEXT_PUBLIC_` 접두사: 클라이언트에서 접근 가능
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 사이드 전용, 절대 클라이언트에 노출 금지

---

## 📊 데이터베이스 스키마 적용

### 방법 1: Supabase Dashboard (권장)

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New query** 생성
3. `supabase/migrations/20251003_001_initial_schema.sql` 파일 내용을 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭하여 실행
6. 성공 메시지 확인
7. `supabase/migrations/20251003_002_seed_data.sql` 파일도 동일하게 실행

### 방법 2: Supabase CLI (로컬 개발)

```bash
# Supabase CLI 설치 (Windows)
scoop install supabase

# 프로젝트에 Supabase 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

---

## 🔒 Row Level Security (RLS) 정책

RLS는 이미 마이그레이션에 포함되어 있지만, 주요 정책을 확인하세요:

### Profiles (프로필)
- ✅ 모든 사용자가 프로필 읽기 가능
- ✅ 본인 프로필만 수정 가능

### Posts (게시물)
- ✅ 발행된 게시물은 모두 볼 수 있음
- ✅ 작성자만 자신의 초안 볼 수 있음
- ✅ 본인 게시물만 생성/수정/삭제 가능

### Comments (댓글)
- ✅ 모든 댓글 읽기 가능
- ✅ 로그인 사용자만 댓글 작성
- ✅ 본인 댓글만 수정/삭제

### Likes & Bookmarks
- ✅ 본인 좋아요/북마크만 관리 가능

---

## 🗂️ 데이터베이스 구조

### 테이블 목록

| 테이블 | 설명 | 주요 필드 |
|--------|------|----------|
| **profiles** | 사용자 프로필 | username, display_name, bio, avatar_url |
| **posts** | 게시물 | title, slug, content, status, ai_model_used |
| **tags** | 태그 | name, slug, color, post_count |
| **post_tags** | 게시물-태그 관계 | post_id, tag_id |
| **comments** | 댓글 | post_id, author_id, content, parent_id |
| **likes** | 좋아요 | user_id, post_id, comment_id |
| **bookmarks** | 북마크 | user_id, post_id, collection_name |

### ERD

```
profiles (사용자 프로필)
  ↓
  ↓ author_id
  ↓
posts (게시물) ←→ post_tags ←→ tags (태그)
  ↓
  ↓ post_id
  ↓
comments (댓글)
  ↓
  ├→ likes (좋아요)
  └→ bookmarks (북마크)
```

---

## 🧪 연결 테스트

### 테스트용 API Route 생성

`src/app/api/test-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test 1: Get tags
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .limit(5);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tags,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

### 테스트 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 접속
http://localhost:3000/api/test-db
```

**성공 응답**:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "tags": [
    { "name": "JavaScript", "slug": "javascript", "color": "#F7DF1E" },
    ...
  ]
}
```

---

## 📝 사용 예시

### 1. Server Component에서 데이터 가져오기

```typescript
import { createClient } from '@/lib/supabase/server';
import { getPublishedPosts } from '@/lib/supabase/queries';

export default async function ExplorePage() {
  const supabase = await createClient();
  const { posts } = await getPublishedPosts(supabase, { limit: 10 });

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Client Component에서 실시간 구독

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RealtimeComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 초기 데이터 로드
    supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .then(({ data }) => setComments(data || []));

    // 실시간 구독
    const channel = supabase
      .channel('comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      }, (payload) => {
        setComments(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>{comment.content}</div>
      ))}
    </div>
  );
}
```

### 3. API Route에서 데이터 생성

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPost } from '@/lib/supabase/queries';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // 게시물 생성
    const post = await createPost(supabase, {
      author_id: user.id,
      title: body.title,
      slug: body.slug,
      content: body.content,
      status: 'draft',
    });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## 🔍 유용한 Query 함수들

프로젝트에 포함된 헬퍼 함수:

### Posts
- `getPublishedPosts()` - 발행된 게시물 목록 (페이지네이션)
- `getPostBySlug()` - slug로 게시물 조회
- `getPostsByAuthor()` - 작성자별 게시물
- `getPostsByTag()` - 태그별 게시물
- `searchPosts()` - 전문 검색
- `createPost()` - 게시물 생성
- `updatePost()` - 게시물 수정
- `deletePost()` - 게시물 삭제

### Tags
- `getAllTags()` - 모든 태그
- `getPopularTags()` - 인기 태그 (상위 N개)
- `getPostTags()` - 게시물의 태그들
- `addTagsToPost()` - 게시물에 태그 추가
- `findOrCreateTags()` - 태그 찾기 또는 생성

### Profiles
- `getProfile()` - 프로필 조회
- `getProfileByUsername()` - username으로 프로필 조회
- `createProfile()` - 프로필 생성
- `updateProfile()` - 프로필 수정

---

## ⚡ 성능 최적화

### 1. 인덱스 활용

마이그레이션에 포함된 인덱스:
- `idx_posts_slug` - slug 검색 최적화
- `idx_posts_published_at` - 발행일순 정렬 최적화
- `idx_posts_search` - 전문 검색 GIN 인덱스
- `idx_tags_post_count` - 인기 태그 정렬 최적화

### 2. Select 최적화

```typescript
// ❌ 나쁜 예: 모든 필드 가져오기
const { data } = await supabase.from('posts').select('*');

// ✅ 좋은 예: 필요한 필드만 선택
const { data } = await supabase
  .from('posts')
  .select('id, title, excerpt, published_at');
```

### 3. 페이지네이션

```typescript
// range()를 사용한 효율적인 페이지네이션
const { data } = await supabase
  .from('posts')
  .select('*')
  .range(0, 9); // 0-9번째 (10개)
```

---

## 🛡️ 보안 Best Practices

### 1. 환경 변수 보호
- ✅ `.env.local`은 `.gitignore`에 포함됨
- ✅ `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용
- ✅ GitHub Actions에서는 Secrets 사용

### 2. RLS 정책 확인
```sql
-- Supabase Dashboard에서 확인
SELECT * FROM pg_policies WHERE tablename = 'posts';
```

### 3. API Rate Limiting
- Supabase Free Plan: 500MB database, 50K MAU
- Pro Plan: 8GB database, 100K MAU
- 필요시 CDN, 캐싱 전략 도입

---

## 📚 다음 단계

1. ✅ Supabase 프로젝트 생성
2. ✅ 데이터베이스 스키마 적용
3. ✅ 환경 변수 설정
4. ⏭️ 인증 시스템 구축 (OAuth, 소셜 로그인)
5. ⏭️ 게시물 CRUD API 구현
6. ⏭️ Storage 설정 (이미지 업로드)

---

## 🔗 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
