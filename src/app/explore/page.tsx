import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, MessageCircle } from "lucide-react";

// 임시 데이터 (나중에 DB에서 가져올 예정)
const mockPosts = [
  {
    id: 1,
    title: "GPT-4를 활용한 챗봇 개발 경험",
    excerpt: "OpenAI API를 사용해서 맞춤형 AI 챗봇을 만들면서 배운 점들을 공유합니다.",
    author: "김개발",
    tags: ["GPT-4", "AI", "ChatBot"],
    likes: 24,
    comments: 8,
    createdAt: "2시간 전",
  },
  {
    id: 2,
    title: "Next.js 15 App Router 완벽 가이드",
    excerpt: "Next.js 15의 새로운 App Router를 실전 프로젝트에 적용하며 정리한 내용입니다.",
    author: "이프론트",
    tags: ["Next.js", "React", "Tutorial"],
    likes: 42,
    comments: 15,
    createdAt: "5시간 전",
  },
  {
    id: 3,
    title: "Supabase로 3일 만에 MVP 만들기",
    excerpt: "Supabase를 활용해 빠르게 프로토타입을 만든 경험을 공유합니다.",
    author: "박백엔드",
    tags: ["Supabase", "Database", "MVP"],
    likes: 38,
    comments: 12,
    createdAt: "1일 전",
  },
  {
    id: 4,
    title: "Claude API vs OpenAI API 비교 분석",
    excerpt: "두 LLM API를 실제 프로젝트에 적용해보고 장단점을 정리했습니다.",
    author: "최엘엘엠",
    tags: ["Claude", "OpenAI", "LLM"],
    likes: 56,
    comments: 22,
    createdAt: "2일 전",
  },
];

export default function ExplorePage() {
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">둘러보기</h1>
        <p className="text-lg text-muted-foreground">
          다른 사람들의 학습 경험을 탐색하고 영감을 얻어보세요
        </p>
      </div>

      {/* Filters (추후 구현) */}
      <div className="mb-8 flex gap-2">
        <Badge variant="default">최신</Badge>
        <Badge variant="outline">인기</Badge>
        <Badge variant="outline">추천</Badge>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.createdAt}</span>
                </div>
              </div>

              {/* Author */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">{post.author}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More (추후 구현) */}
      <div className="mt-12 text-center">
        <button className="px-6 py-2 border rounded-md hover:bg-accent">
          더 보기
        </button>
      </div>
    </div>
  );
}
