"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, Eye, BookOpen, Lightbulb, Rocket, Loader2 } from "lucide-react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const templates = [
    {
      id: "learning",
      name: "학습 경험",
      icon: BookOpen,
      description: "새로 배운 내용과 인사이트 공유",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "project",
      name: "프로젝트 후기",
      icon: Rocket,
      description: "프로젝트 개발 과정과 결과",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: "tutorial",
      name: "튜토리얼",
      icon: Lightbulb,
      description: "단계별 가이드 작성",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
  ];

  // AI 태그 생성 함수
  const generateTags = async () => {
    if (!title && !content) return;

    setIsGeneratingTags(true);
    try {
      const response = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestedTags(data.tags.map((t: any) => t.tag));
      }
    } catch (error) {
      console.error("Failed to generate tags:", error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  // 텍스트 개선 함수
  const improveText = async (text: string) => {
    if (!text || text.length < 10) return;

    setIsImproving(true);
    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestion(data.improved);
      }
    } catch (error) {
      console.error("Failed to improve text:", error);
    } finally {
      setIsImproving(false);
    }
  };

  // 자동 태그 생성 (타이틀이나 내용 변경 시)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        generateTags();
      }
    }, 2000); // 2초 디바운스

    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <div className="container py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">새 글 작성</h1>
        <p className="text-lg text-muted-foreground">
          AI의 도움을 받아 더 나은 글을 작성해보세요
        </p>
      </div>

      {/* Template Selection */}
      {!selectedTemplate && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">템플릿 선택</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor */}
      {selectedTemplate && (
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background placeholder:text-muted-foreground"
            />
          </div>

          {/* AI Assistant Panel */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  AI 도우미
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  작성을 시작하면 AI가 자동으로 문장 개선, 구조화, 태그 생성을 도와드립니다.
                </p>
              </div>
            </div>
          </Card>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">내용</label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => improveText(content)}
                disabled={isImproving || content.length < 10}
              >
                {isImproving ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    개선 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI 개선 제안받기
                  </>
                )}
              </Button>
            </div>
            <textarea
              placeholder="여기에 내용을 작성하세요...

테스트 문구:
- '저는 파이썬을 배웠어요'
- '성능이 좋아졌어요'

위 문구를 입력하고 'AI 개선 제안받기' 버튼을 눌러보세요!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background placeholder:text-muted-foreground"
            />
          </div>

          {/* AI Text Improvement Suggestion */}
          {aiSuggestion && (
            <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    💡 AI 개선 제안
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    {aiSuggestion}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setContent(content + "\n\n" + aiSuggestion);
                        setAiSuggestion(null);
                      }}
                    >
                      적용하기
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAiSuggestion(null)}
                    >
                      무시
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">태그</label>
              {isGeneratingTags && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  AI가 태그를 생성하는 중...
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[50px]">
              {suggestedTags.length > 0 ? (
                suggestedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  제목이나 내용을 입력하면 AI가 자동으로 태그를 추천합니다
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                * AI가 내용을 분석하여 자동으로 태그를 추천합니다
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={generateTags}
                disabled={isGeneratingTags || (!title && !content)}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                다시 생성
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              템플릿 다시 선택
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                미리보기
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                임시저장
              </Button>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                발행하기
              </Button>
            </div>
          </div>

          {/* Info Note */}
          <Card className="p-4 bg-muted">
            <p className="text-sm text-muted-foreground">
              💡 <strong>팁:</strong> 초안을 작성한 후 AI 제안을 활용하면 더 효과적입니다.
              문단을 작성하고 잠시 기다리면 AI가 개선 사항을 제안합니다.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
