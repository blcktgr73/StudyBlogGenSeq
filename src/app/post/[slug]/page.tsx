"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Eye, Heart, MessageSquare, Bookmark, Edit } from 'lucide-react';
import { getPostBySlug, type Post, incrementViewCount } from '@/lib/posts';
import { CommentSection } from '@/components/CommentSection';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      const foundPost = await getPostBySlug(slug);

      if (!foundPost) {
        setIsLoading(false);
        return;
      }

      // Increment view count
      await incrementViewCount(foundPost.id);

      // Reload to get updated view count
      const updatedPost = await getPostBySlug(slug);
      setPost(updatedPost);
      setIsLoading(false);

      // Load user interactions from localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      setLiked(likedPosts.includes(foundPost.id));
      setBookmarked(bookmarkedPosts.includes(foundPost.id));
    };

    loadPost();
  }, [slug]);

  const handleLike = () => {
    if (!post) return;

    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');

    if (liked) {
      // Unlike
      const updated = likedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(updated));
      setLiked(false);
    } else {
      // Like
      likedPosts.push(post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      setLiked(true);
    }
  };

  const handleBookmark = () => {
    if (!post) return;

    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');

    if (bookmarked) {
      // Remove bookmark
      const updated = bookmarkedPosts.filter((id: string) => id !== post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updated));
      setBookmarked(false);
    } else {
      // Add bookmark
      bookmarkedPosts.push(post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      setBookmarked(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">게시물을 찾을 수 없습니다</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              요청하신 게시물이 존재하지 않거나 삭제되었습니다.
            </p>
            <Button onClick={() => router.push('/explore')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              둘러보기로 돌아가기
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>

        {/* Post Header */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.viewCount} 조회
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likeCount} 좋아요
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {post.commentCount} 댓글
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.aiSuggestionsUsed && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    ✨ AI 작성 도움
                  </Badge>
                )}
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Edit Button (shown for all posts in demo) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/write?edit=${post.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              수정
            </Button>
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {post.content}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6 mb-6">
          <div className="flex justify-center gap-4">
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLike}
              className={liked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-white' : ''}`} />
              {liked ? '좋아요 취소' : '좋아요'}
            </Button>
            <Button
              variant={bookmarked ? "default" : "outline"}
              onClick={handleBookmark}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? 'fill-white' : ''}`} />
              {bookmarked ? '북마크 취소' : '북마크'}
            </Button>
          </div>
        </Card>

        {/* Comments Section */}
        <CommentSection postId={post.id} commentCount={post.commentCount} />
      </div>
    </div>
  );
}
