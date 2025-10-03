"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, Eye, BookOpen, Lightbulb, Rocket } from "lucide-react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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
              className="w-full px-4 py-3 text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              placeholder="여기에 내용을 작성하세요...

AI가 다음과 같이 도와드립니다:
• 실시간 문장 개선 제안
• 글 구조 가이드
• 자동 태그 생성
• 관련 자료 추천"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">태그</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg">
              <Badge variant="secondary">AI</Badge>
              <Badge variant="secondary">학습</Badge>
              <Badge variant="outline" className="cursor-pointer">
                + 태그 추가
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              * AI가 내용을 분석하여 자동으로 태그를 추천합니다
            </p>
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
