-- StudyBlog GenSeq - Seed Data
-- Migration: 20251003_002_seed_data
-- Description: Insert initial tags and demo content

-- ============================================================================
-- INSERT DEFAULT TAGS
-- ============================================================================

INSERT INTO tags (name, slug, description, color) VALUES
  ('JavaScript', 'javascript', 'JavaScript programming language', '#F7DF1E'),
  ('TypeScript', 'typescript', 'TypeScript superset of JavaScript', '#3178C6'),
  ('React', 'react', 'React JavaScript library', '#61DAFB'),
  ('Next.js', 'nextjs', 'Next.js React framework', '#000000'),
  ('Python', 'python', 'Python programming language', '#3776AB'),
  ('AI/ML', 'ai-ml', 'Artificial Intelligence and Machine Learning', '#FF6F00'),
  ('백엔드', 'backend', 'Backend development', '#8B5CF6'),
  ('프론트엔드', 'frontend', 'Frontend development', '#3B82F6'),
  ('데이터베이스', 'database', 'Database systems', '#10B981'),
  ('클라우드', 'cloud', 'Cloud computing', '#EC4899'),
  ('DevOps', 'devops', 'DevOps practices', '#F59E0B'),
  ('보안', 'security', 'Security best practices', '#EF4444'),
  ('성능최적화', 'performance', 'Performance optimization', '#8B5CF6'),
  ('디버깅', 'debugging', 'Debugging techniques', '#6366F1'),
  ('리팩토링', 'refactoring', 'Code refactoring', '#14B8A6'),
  ('테스트', 'testing', 'Software testing', '#F97316')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMPLETED: Seed data migration
-- ============================================================================
