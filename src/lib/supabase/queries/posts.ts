import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

/**
 * Post Database Queries
 */

/**
 * Get all published posts with pagination
 */
export async function getPublishedPosts(
  supabase: SupabaseClient<Database>,
  options?: {
    page?: number;
    limit?: number;
    orderBy?: 'created_at' | 'published_at' | 'view_count' | 'like_count';
    order?: 'asc' | 'desc';
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const orderBy = options?.orderBy || 'published_at';
  const order = options?.order || 'desc';

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*, profiles(username, display_name, avatar_url)', { count: 'exact' })
    .eq('status', 'published')
    .order(orderBy, { ascending: order === 'asc' })
    .range(from, to);

  if (error) throw error;

  return {
    posts: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(username, display_name, avatar_url),
      post_tags(tags(id, name, slug, color))
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get posts by author
 */
export async function getPostsByAuthor(
  supabase: SupabaseClient<Database>,
  authorId: string,
  includesDrafts: boolean = false
) {
  let query = supabase
    .from('posts')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (!includesDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  supabase: SupabaseClient<Database>,
  tagSlug: string,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // First get the tag ID
  const { data: tag } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single();

  if (!tag) return { posts: [], count: 0, page, limit, totalPages: 0 };

  // Then get posts with that tag
  const { data, error, count } = await supabase
    .from('post_tags')
    .select(`
      posts!inner(
        *,
        profiles(username, display_name, avatar_url)
      )
    `, { count: 'exact' })
    .eq('tag_id', tag.id)
    .eq('posts.status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    posts: data?.map((item: any) => item.posts) || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Create a new post
 */
export async function createPost(
  supabase: SupabaseClient<Database>,
  post: PostInsert
) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a post
 */
export async function updatePost(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: PostUpdate
) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a post
 */
export async function deletePost(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Increment post view count
 */
export async function incrementViewCount(
  supabase: SupabaseClient<Database>,
  id: string
) {
  const { error } = await supabase.rpc('increment_view_count', { post_id: id });
  if (error) throw error;
}

/**
 * Search posts by keyword
 */
export async function searchPosts(
  supabase: SupabaseClient<Database>,
  keyword: string,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*, profiles(username, display_name, avatar_url)', { count: 'exact' })
    .eq('status', 'published')
    .textSearch('search_vector', keyword)
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    posts: data || [],
    count: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}
