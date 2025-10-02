# 데이터베이스 스키마 설계

## ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   users     │────────<│    posts     │>────────│    tags     │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                         │
      │                        │                         │
      │                   ┌────▼─────┐             ┌────▼──────┐
      │                   │ comments │             │ post_tags │
      │                   └──────────┘             └───────────┘
      │
      │
┌─────▼──────┐       ┌──────────────┐
│  profiles  │       │   bookmarks  │
└────────────┘       └──────────────┘
                            │
                     ┌──────▼───────┐
                     │    likes     │
                     └──────────────┘
```

## 테이블 상세 설계

### 1. users (사용자)

Supabase Auth를 사용하므로 `auth.users` 테이블 활용

```sql
-- auth.users는 Supabase가 자동 생성
-- 추가 정보는 profiles 테이블에 저장
```

### 2. profiles (사용자 프로필)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
```

**필드 설명:**
- `id`: auth.users와 1:1 관계
- `username`: 고유한 사용자명 (URL용)
- `display_name`: 표시 이름
- `bio`: 자기소개
- `avatar_url`: 프로필 이미지 URL

### 3. posts (게시물)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,

  -- AI 관련 메타데이터
  ai_suggestions_used BOOLEAN DEFAULT FALSE,
  ai_model_used VARCHAR(50), -- 예: 'gpt-4o', 'claude-3.5-sonnet'

  -- 상태 관리
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMPTZ,

  -- 통계
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 전문 검색용
  search_vector tsvector
);

-- 인덱스
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);

-- 전문 검색 인덱스 (PostgreSQL Full-Text Search)
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- 자동으로 search_vector 업데이트하는 트리거
CREATE OR REPLACE FUNCTION posts_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_update
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION posts_search_trigger();
```

**필드 설명:**
- `slug`: URL 친화적 게시물 식별자 (예: 'my-first-ai-learning-experience')
- `excerpt`: 게시물 요약 (목록 표시용)
- `ai_suggestions_used`: AI 도움 사용 여부
- `status`: 초안/발행/보관 상태

### 4. tags (태그)

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(60) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- 헥스 컬러 코드 (예: '#3B82F6')

  -- 통계
  post_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);
```

### 5. post_tags (게시물-태그 관계)

```sql
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (post_id, tag_id)
);

-- 인덱스
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

### 6. comments (댓글)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글용

  content TEXT NOT NULL,

  -- 통계
  like_count INTEGER DEFAULT 0,

  -- 상태
  is_deleted BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at ASC);
```

### 7. likes (좋아요)

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 좋아요 대상 (게시물 또는 댓글)
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 게시물 또는 댓글 중 하나만 있어야 함
  CONSTRAINT check_like_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),

  -- 중복 좋아요 방지
  UNIQUE NULLS NOT DISTINCT (user_id, post_id, comment_id)
);

-- 인덱스
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
```

### 8. bookmarks (북마크)

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

  -- 북마크 폴더/컬렉션 (추후 확장용)
  collection_name VARCHAR(100) DEFAULT 'default',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 중복 북마크 방지
  UNIQUE (user_id, post_id)
);

-- 인덱스
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
```

## Row Level Security (RLS) 정책

Supabase의 RLS를 활용한 보안 정책

### profiles

```sql
-- 모든 사용자가 프로필 읽기 가능
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 본인 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### posts

```sql
-- 발행된 게시물은 모두 볼 수 있음
CREATE POLICY "Published posts are viewable by everyone"
ON posts FOR SELECT
USING (status = 'published' OR author_id = auth.uid());

-- 본인 게시물만 생성/수정/삭제 가능
CREATE POLICY "Users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = author_id);
```

### comments

```sql
-- 모든 댓글 읽기 가능
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

-- 로그인 사용자만 댓글 작성 가능
CREATE POLICY "Authenticated users can insert comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- 본인 댓글만 수정/삭제 가능
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = author_id);
```

### likes & bookmarks

```sql
-- 본인 좋아요/북마크만 관리 가능
CREATE POLICY "Users can manage own likes"
ON likes FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks"
ON bookmarks FOR ALL
USING (auth.uid() = user_id);
```

## 마이그레이션 순서

1. `profiles` (사용자 프로필)
2. `tags` (태그)
3. `posts` (게시물)
4. `post_tags` (게시물-태그 관계)
5. `comments` (댓글)
6. `likes` (좋아요)
7. `bookmarks` (북마크)

## 초기 데이터 (Seed Data)

```sql
-- 기본 태그 생성
INSERT INTO tags (name, slug, description, color) VALUES
  ('AI', 'ai', 'Artificial Intelligence', '#3B82F6'),
  ('Machine Learning', 'machine-learning', 'ML algorithms and techniques', '#8B5CF6'),
  ('Deep Learning', 'deep-learning', 'Neural networks and DL', '#EC4899'),
  ('NLP', 'nlp', 'Natural Language Processing', '#10B981'),
  ('Computer Vision', 'computer-vision', 'Image and video processing', '#F59E0B'),
  ('Tutorial', 'tutorial', 'Step-by-step guides', '#6366F1'),
  ('Experience', 'experience', 'Personal learning experiences', '#14B8A6'),
  ('Project', 'project', 'Project showcases', '#F97316');
```

## 다음 단계

1. ✅ PRD 작성
2. ✅ 기술 스택 결정
3. ✅ 데이터베이스 스키마 설계
4. ⏭️ AI 에디터 기능 명세
5. ⏭️ 프로젝트 초기 설정
