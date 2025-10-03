/**
 * Migration utility: LocalStorage → Supabase
 * Run this once to migrate existing posts
 */

import { getPosts as getLocalPosts } from './posts';
import { savePost as saveSupabasePost } from '../supabase/posts';

export async function migratePostsToSupabase(): Promise<{
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
}> {
  const localPosts = getLocalPosts();
  const errors: string[] = [];
  let migrated = 0;
  let failed = 0;

  console.log(`Starting migration of ${localPosts.length} posts...`);

  for (const post of localPosts) {
    try {
      const result = await saveSupabasePost(
        {
          title: post.title,
          content: post.content,
          tags: post.tags,
          status: post.status,
          ai_suggestions_used: post.aiSuggestionsUsed,
          ai_model_used: post.aiModelUsed,
        },
        undefined,
        'anonymous' // TODO: Map to real user ID
      );

      if (result) {
        migrated++;
        console.log(`✅ Migrated: ${post.title}`);
      } else {
        failed++;
        errors.push(`Failed to migrate: ${post.title}`);
      }
    } catch (error) {
      failed++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Error migrating "${post.title}": ${errorMsg}`);
      console.error(`❌ Error migrating "${post.title}":`, error);
    }
  }

  console.log(`Migration complete: ${migrated} success, ${failed} failed`);

  return {
    success: failed === 0,
    migrated,
    failed,
    errors,
  };
}

/**
 * Clear LocalStorage after successful migration
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;

  const confirmation = confirm(
    'LocalStorage 데이터를 삭제하시겠습니까?\n\n' +
      'Supabase로 마이그레이션이 완료된 경우에만 실행하세요.\n' +
      '이 작업은 되돌릴 수 없습니다!'
  );

  if (confirmation) {
    localStorage.removeItem('studyblog_posts');
    localStorage.removeItem('likedPosts');
    localStorage.removeItem('bookmarkedPosts');
    console.log('✅ LocalStorage cleared');
    alert('LocalStorage가 성공적으로 삭제되었습니다.');
  }
}
