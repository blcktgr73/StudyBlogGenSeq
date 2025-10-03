/**
 * LocalStorage Post Management
 * Temporary storage until Supabase is integrated
 */

export interface StoredPost {
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

const STORAGE_KEY = 'studyblog_posts';

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
 * Get all posts from LocalStorage
 */
export function getPosts(): StoredPost[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading posts from localStorage:', error);
    return [];
  }
}

/**
 * Get published posts only
 */
export function getPublishedPosts(): StoredPost[] {
  return getPosts()
    .filter((post) => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
}

/**
 * Get post by slug
 */
export function getPostBySlug(slug: string): StoredPost | null {
  const posts = getPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Save post (create or update)
 */
export function savePost(
  post: Omit<StoredPost, 'id' | 'slug' | 'excerpt' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likeCount' | 'commentCount'>
): StoredPost {
  const posts = getPosts();
  const now = new Date().toISOString();

  // Generate slug from title
  const slug = generateSlug(post.title);

  // Check if post with this slug exists
  const existingIndex = posts.findIndex((p) => p.slug === slug);

  let savedPost: StoredPost;

  if (existingIndex >= 0) {
    // Update existing post
    savedPost = {
      ...posts[existingIndex],
      ...post,
      slug,
      excerpt: generateExcerpt(post.content),
      updatedAt: now,
      publishedAt: post.status === 'published' ? (posts[existingIndex].publishedAt || now) : null,
    };
    posts[existingIndex] = savedPost;
  } else {
    // Create new post
    savedPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug,
      excerpt: generateExcerpt(post.content),
      createdAt: now,
      updatedAt: now,
      publishedAt: post.status === 'published' ? now : null,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      ...post,
    };
    posts.push(savedPost);
  }

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving post to localStorage:', error);
    throw new Error('Failed to save post');
  }

  return savedPost;
}

/**
 * Delete post by slug
 */
export function deletePost(slug: string): boolean {
  const posts = getPosts();
  const filteredPosts = posts.filter((post) => post.slug !== slug);

  if (filteredPosts.length === posts.length) {
    return false; // Post not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
    return true;
  } catch (error) {
    console.error('Error deleting post from localStorage:', error);
    return false;
  }
}

/**
 * Clear all posts (for testing)
 */
export function clearAllPosts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get posts count
 */
export function getPostsCount(): { total: number; published: number; drafts: number } {
  const posts = getPosts();
  return {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
  };
}
