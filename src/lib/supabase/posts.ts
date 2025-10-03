/**
 * Supabase Post Management
 * Production-ready database operations
 */

import { createClient } from '@/lib/supabase/client';

export interface SupabasePost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: 'draft' | 'published';
  ai_suggestions_used: boolean;
  ai_model_used: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
}

/**
 * Convert database post to app format
 */
function dbToAppPost(dbPost: any): SupabasePost {
  return {
    id: dbPost.id,
    author_id: dbPost.author_id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    excerpt: dbPost.excerpt,
    tags: dbPost.tags || [],
    status: dbPost.status,
    ai_suggestions_used: dbPost.ai_suggestions_used,
    ai_model_used: dbPost.ai_model_used,
    created_at: dbPost.created_at,
    updated_at: dbPost.updated_at,
    published_at: dbPost.published_at,
    view_count: dbPost.view_count,
    like_count: dbPost.like_count,
    comment_count: dbPost.comment_count,
  };
}

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content: string, maxLength: number = 150): string {
  const plain = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
  if (plain.length <= maxLength) return plain;
  return plain.substring(0, maxLength).trim() + '...';
}

/**
 * Get all published posts
 */
export async function getPublishedPosts(): Promise<SupabasePost[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return (data || []).map(dbToAppPost);
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<SupabasePost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data ? dbToAppPost(data) : null;
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<SupabasePost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data ? dbToAppPost(data) : null;
}

/**
 * Create or update post
 */
export async function savePost(
  post: {
    title: string;
    content: string;
    tags: string[];
    status: 'draft' | 'published';
    ai_suggestions_used: boolean;
    ai_model_used: string | null;
  },
  postId?: string,
  authorId: string = 'anonymous' // TODO: Replace with real user ID from auth
): Promise<SupabasePost | null> {
  const supabase = createClient();

  const slug = generateSlug(post.title);
  const excerpt = generateExcerpt(post.content);
  const now = new Date().toISOString();

  if (postId) {
    // Update existing post
    const { data, error } = await supabase
      .from('posts')
      .update({
        title: post.title,
        slug,
        content: post.content,
        excerpt,
        tags: post.tags,
        status: post.status,
        ai_suggestions_used: post.ai_suggestions_used,
        ai_model_used: post.ai_model_used,
        updated_at: now,
        published_at: post.status === 'published' ? now : null,
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return null;
    }

    return data ? dbToAppPost(data) : null;
  } else {
    // Create new post
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        title: post.title,
        slug,
        content: post.content,
        excerpt,
        tags: post.tags,
        status: post.status,
        ai_suggestions_used: post.ai_suggestions_used,
        ai_model_used: post.ai_model_used,
        published_at: post.status === 'published' ? now : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return null;
    }

    return data ? dbToAppPost(data) : null;
  }
}

/**
 * Increment view count
 */
export async function incrementViewCount(postId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc('increment_view_count', {
    post_id: postId,
  });

  if (error) {
    console.error('Error incrementing view count:', error);
  }
}

/**
 * Delete post
 */
export async function deletePost(postId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}

/**
 * Get posts count
 */
export async function getPostsCount(): Promise<{
  total: number;
  published: number;
  drafts: number;
}> {
  const supabase = createClient();

  const { count: total } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  const { count: published } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: drafts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  return {
    total: total || 0,
    published: published || 0,
    drafts: drafts || 0,
  };
}
