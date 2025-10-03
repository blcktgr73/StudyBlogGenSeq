import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

type Tag = Database['public']['Tables']['tags']['Row'];

/**
 * Tag Database Queries
 */

/**
 * Get all tags ordered by post count
 */
export async function getAllTags(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('post_count', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get popular tags (top N by post count)
 */
export async function getPopularTags(
  supabase: SupabaseClient<Database>,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('post_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(
  supabase: SupabaseClient<Database>,
  slug: string
) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get tags for a specific post
 */
export async function getPostTags(
  supabase: SupabaseClient<Database>,
  postId: string
) {
  const { data, error } = await supabase
    .from('post_tags')
    .select('tags(*)')
    .eq('post_id', postId);

  if (error) throw error;
  return data?.map((item: any) => item.tags) || [];
}

/**
 * Add tags to a post
 */
export async function addTagsToPost(
  supabase: SupabaseClient<Database>,
  postId: string,
  tagIds: string[]
) {
  const postTags = tagIds.map((tagId) => ({
    post_id: postId,
    tag_id: tagId,
  }));

  const { error } = await supabase.from('post_tags').insert(postTags);

  if (error) throw error;
}

/**
 * Remove tags from a post
 */
export async function removeTagsFromPost(
  supabase: SupabaseClient<Database>,
  postId: string,
  tagIds?: string[]
) {
  let query = supabase.from('post_tags').delete().eq('post_id', postId);

  if (tagIds && tagIds.length > 0) {
    query = query.in('tag_id', tagIds);
  }

  const { error } = await query;
  if (error) throw error;
}

/**
 * Find or create tags by name
 * Returns array of tag IDs
 */
export async function findOrCreateTags(
  supabase: SupabaseClient<Database>,
  tagNames: string[]
): Promise<string[]> {
  const tagIds: string[] = [];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    // Try to find existing tag
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag
      const { data: newTag, error } = await supabase
        .from('tags')
        .insert({ name, slug })
        .select('id')
        .single();

      if (error) throw error;
      if (newTag) tagIds.push(newTag.id);
    }
  }

  return tagIds;
}
