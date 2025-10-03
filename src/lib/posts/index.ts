/**
 * Unified Post Management Layer
 * Automatically uses Supabase if configured, falls back to LocalStorage
 */

import * as LocalStorage from '../storage/posts';
import * as Supabase from '../supabase/posts';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  if (typeof window === 'undefined') return false;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !!(
    url &&
    key &&
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder_key'
  );
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  status: 'draft' | 'published';
  aiSuggestionsUsed: boolean;
  aiModelUsed: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// Convert Supabase format to app format
function supabaseToPost(sp: Supabase.SupabasePost): Post {
  return {
    id: sp.id,
    title: sp.title,
    slug: sp.slug,
    content: sp.content,
    excerpt: sp.excerpt,
    tags: sp.tags,
    status: sp.status,
    aiSuggestionsUsed: sp.ai_suggestions_used,
    aiModelUsed: sp.ai_model_used,
    createdAt: sp.created_at,
    updatedAt: sp.updated_at,
    publishedAt: sp.published_at,
    viewCount: sp.view_count,
    likeCount: sp.like_count,
    commentCount: sp.comment_count,
  };
}

// Convert LocalStorage format to app format
function localStorageToPost(lp: LocalStorage.StoredPost): Post {
  return {
    id: lp.id,
    title: lp.title,
    slug: lp.slug,
    content: lp.content,
    excerpt: lp.excerpt,
    tags: lp.tags,
    status: lp.status,
    aiSuggestionsUsed: lp.aiSuggestionsUsed,
    aiModelUsed: lp.aiModelUsed,
    createdAt: lp.createdAt,
    updatedAt: lp.updatedAt,
    publishedAt: lp.publishedAt,
    viewCount: lp.viewCount,
    likeCount: lp.likeCount,
    commentCount: lp.commentCount,
  };
}

/**
 * Get all published posts
 */
export async function getPublishedPosts(): Promise<Post[]> {
  if (isSupabaseConfigured()) {
    const posts = await Supabase.getPublishedPosts();
    return posts.map(supabaseToPost);
  } else {
    const posts = LocalStorage.getPublishedPosts();
    return posts.map(localStorageToPost);
  }
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSupabaseConfigured()) {
    const post = await Supabase.getPostBySlug(slug);
    return post ? supabaseToPost(post) : null;
  } else {
    const post = LocalStorage.getPostBySlug(slug);
    return post ? localStorageToPost(post) : null;
  }
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<Post | null> {
  if (isSupabaseConfigured()) {
    const post = await Supabase.getPostById(id);
    return post ? supabaseToPost(post) : null;
  } else {
    const post = LocalStorage.getPostById(id);
    return post ? localStorageToPost(post) : null;
  }
}

/**
 * Save post (create or update)
 */
export async function savePost(
  post: {
    title: string;
    content: string;
    tags: string[];
    status: 'draft' | 'published';
    aiSuggestionsUsed: boolean;
    aiModelUsed: string | null;
  },
  postId?: string
): Promise<Post | null> {
  if (isSupabaseConfigured()) {
    const saved = await Supabase.savePost(
      {
        title: post.title,
        content: post.content,
        tags: post.tags,
        status: post.status,
        ai_suggestions_used: post.aiSuggestionsUsed,
        ai_model_used: post.aiModelUsed,
      },
      postId
    );
    return saved ? supabaseToPost(saved) : null;
  } else {
    const saved = LocalStorage.savePost(post, postId);
    return localStorageToPost(saved);
  }
}

/**
 * Increment view count
 */
export async function incrementViewCount(postId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await Supabase.incrementViewCount(postId);
  } else {
    LocalStorage.incrementViewCount(postId);
  }
}

/**
 * Delete post
 */
export async function deletePost(postId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    return await Supabase.deletePost(postId);
  } else {
    // LocalStorage doesn't have deleteById, so we need to get post first
    const post = LocalStorage.getPostById(postId);
    if (post) {
      return LocalStorage.deletePost(post.slug);
    }
    return false;
  }
}

/**
 * Get posts count
 */
export async function getPostsCount(): Promise<{
  total: number;
  published: number;
  drafts: number;
}> {
  if (isSupabaseConfigured()) {
    return await Supabase.getPostsCount();
  } else {
    return LocalStorage.getPostsCount();
  }
}

/**
 * Check storage type
 */
export function getStorageType(): 'supabase' | 'localstorage' {
  return isSupabaseConfigured() ? 'supabase' : 'localstorage';
}
