"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageCircle, Sparkles } from "lucide-react";
import { getPublishedPosts, type StoredPost } from "@/lib/storage/posts";

export default function ExplorePage() {
  const [posts, setPosts] = useState<StoredPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load posts from LocalStorage
    const loadedPosts = getPublishedPosts();
    setPosts(loadedPosts);
    setIsLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    return `방금 전`;
  };

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">탐색하기</h1>
        <p className="text-xl text-muted-foreground">
          다른 사람들이 공유한 학습 경험과 프로젝트를 둘러보세요
        </p>
      </div>

      {/* Filter Badges */}
      <div className="flex gap-2 mb-8">
        <Badge variant="default" className="cursor-pointer">
          최신
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          인기
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          추천
        </Badge>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            아직 발행된 글이 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Write 페이지에서 첫 게시물을 작성해보세요!
          </p>
          <a
            href="/write"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            글 쓰러 가기
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="line-clamp-2 flex-1">{post.title}</CardTitle>
                    {post.aiSuggestionsUsed && (
                      <Badge variant="outline" className="ml-2 flex-shrink-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt!)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              총 {posts.length}개의 게시물
            </p>
          </div>
        </>
      )}
    </div>
  );
}
