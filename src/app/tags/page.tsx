import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Hash } from "lucide-react";

// 임시 데이터 (나중에 DB에서 가져올 예정)
const mockTags = [
  { name: "AI", count: 156, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { name: "Machine Learning", count: 124, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  { name: "Next.js", count: 98, color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" },
  { name: "React", count: 87, color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300" },
  { name: "TypeScript", count: 76, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { name: "NLP", count: 65, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  { name: "Computer Vision", count: 54, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { name: "Deep Learning", count: 48, color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300" },
  { name: "GPT", count: 42, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" },
  { name: "Claude", count: 38, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" },
  { name: "Tutorial", count: 125, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
  { name: "Project", count: 112, color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300" },
  { name: "Experience", count: 98, color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300" },
  { name: "Python", count: 89, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  { name: "TensorFlow", count: 67, color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { name: "PyTorch", count: 63, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
];

export default function TagsPage() {
  // 인기순 정렬
  const sortedTags = [...mockTags].sort((a, b) => b.count - a.count);

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">태그</h1>
        <p className="text-lg text-muted-foreground">
          관심 있는 주제별로 학습 경험을 탐색해보세요
        </p>
      </div>

      {/* Popular Tags */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">인기 태그</h2>
        <div className="flex flex-wrap gap-3">
          {sortedTags.slice(0, 8).map((tag) => (
            <button
              key={tag.name}
              className="group cursor-pointer"
            >
              <Badge
                variant="outline"
                className={`${tag.color} px-4 py-2 text-base hover:shadow-md transition-all`}
              >
                <Hash className="h-4 w-4 mr-1" />
                {tag.name}
                <span className="ml-2 text-xs opacity-70">({tag.count})</span>
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* All Tags */}
      <div>
        <h2 className="text-2xl font-bold mb-6">모든 태그</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedTags.map((tag) => (
            <Card
              key={tag.name}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tag.color}`}>
                    <Hash className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tag.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tag.count}개의 게시물
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search (추후 구현) */}
      <div className="mt-12">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">태그 검색</h3>
          <input
            type="text"
            placeholder="찾고 싶은 태그를 입력하세요..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            disabled
          />
          <p className="mt-2 text-sm text-muted-foreground">
            * 검색 기능은 곧 추가될 예정입니다
          </p>
        </Card>
      </div>
    </div>
  );
}
