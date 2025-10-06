"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Edit2, Check, ArrowUp, ArrowDown } from "lucide-react";
import type { StructureGenerationResponse, StructureSection } from "@/lib/ai/types";

interface StructureWizardProps {
  onStructureGenerated: (structure: StructureGenerationResponse) => void;
  onCancel: () => void;
}

export function StructureWizard({ onStructureGenerated, onCancel }: StructureWizardProps) {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStructure, setGeneratedStructure] = useState<StructureGenerationResponse | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editedSection, setEditedSection] = useState<StructureSection | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim() || userInput.trim().length < 3) {
      alert("글에 대한 설명을 3자 이상 입력해주세요!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      if (response.ok) {
        const structure = await response.json();
        setGeneratedStructure(structure);
      } else {
        alert("구조 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Structure generation error:", error);
      alert("구조 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSectionEdit = (index: number) => {
    setEditingSectionIndex(index);
    setEditedSection({ ...generatedStructure!.sections[index] });
  };

  const handleSectionSave = () => {
    if (editingSectionIndex !== null && editedSection && generatedStructure) {
      const updatedSections = [...generatedStructure.sections];
      updatedSections[editingSectionIndex] = editedSection;
      setGeneratedStructure({
        ...generatedStructure,
        sections: updatedSections,
      });
      setEditingSectionIndex(null);
      setEditedSection(null);
    }
  };

  const handleAddSection = () => {
    if (!generatedStructure) return;

    const newSection: StructureSection = {
      order: generatedStructure.sections.length + 1,
      title: "새 섹션",
      description: "이 섹션에 무엇을 작성할지 설명해주세요",
      placeholder: "내용을 입력하세요...",
    };

    setGeneratedStructure({
      ...generatedStructure,
      sections: [...generatedStructure.sections, newSection],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!generatedStructure) return;

    const updatedSections = generatedStructure.sections
      .filter((_, i) => i !== index)
      .map((section, i) => ({ ...section, order: i + 1 }));

    setGeneratedStructure({
      ...generatedStructure,
      sections: updatedSections,
    });
  };

  const handleMoveSectionUp = (index: number) => {
    if (!generatedStructure || index === 0) return;

    const updatedSections = [...generatedStructure.sections];
    [updatedSections[index - 1], updatedSections[index]] =
      [updatedSections[index], updatedSections[index - 1]];

    // Update order numbers
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });

    setGeneratedStructure({
      ...generatedStructure,
      sections: updatedSections,
    });
  };

  const handleMoveSectionDown = (index: number) => {
    if (!generatedStructure || index === generatedStructure.sections.length - 1) return;

    const updatedSections = [...generatedStructure.sections];
    [updatedSections[index], updatedSections[index + 1]] =
      [updatedSections[index + 1], updatedSections[index]];

    // Update order numbers
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });

    setGeneratedStructure({
      ...generatedStructure,
      sections: updatedSections,
    });
  };

  const handleUseStructure = () => {
    if (generatedStructure) {
      onStructureGenerated(generatedStructure);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI와 함께 구조 짜기</h2>
          <p className="text-sm text-muted-foreground">
            어떤 글을 쓰고 싶은지 자유롭게 설명해주세요
          </p>
        </div>
      </div>

      {/* Input Section */}
      {!generatedStructure && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                글 아이디어를 자유롭게 입력하세요
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="예: React Query를 처음 써봤는데 데이터 캐싱이 너무 편했어요&#10;예: Next.js로 블로그를 만들면서 겪은 시행착오들을 공유하고 싶어요&#10;예: API 성능을 3배 향상시킨 방법을 단계별로 설명하고 싶어요"
                className="w-full min-h-[120px] px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground bg-background placeholder:text-muted-foreground resize-none"
                disabled={isGenerating}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                💡 구체적으로 설명할수록 더 정확한 구조를 만들어드려요
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
                  취소
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || userInput.trim().length < 3}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      AI가 구조를 만드는 중...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      구조 생성하기
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Structure Preview */}
      {generatedStructure && (
        <div className="space-y-6">
          {/* Structure Info */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    추천 구조
                  </h3>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {generatedStructure.postType}
                  </Badge>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                  {generatedStructure.reasoning}
                </p>
                <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                  <span>📝 {generatedStructure.sections.length}개 섹션</span>
                  <span>•</span>
                  <span>위/아래 화살표로 순서 변경, 수정/추가/제거 가능</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sections */}
          <div className="space-y-4">
            {generatedStructure.sections.map((section, index) => (
              <Card
                key={index}
                className="p-5 hover:shadow-md transition-shadow"
              >
                {editingSectionIndex === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedSection?.title || ""}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection!,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-lg font-semibold border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
                    />
                    <textarea
                      value={editedSection?.description || ""}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection!,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background resize-none"
                      rows={2}
                    />
                    <textarea
                      value={editedSection?.placeholder || ""}
                      onChange={(e) =>
                        setEditedSection({
                          ...editedSection!,
                          placeholder: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-muted italic resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSectionSave}>
                        <Check className="h-3 w-3 mr-1" />
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingSectionIndex(null);
                          setEditedSection(null);
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      {/* Order controls */}
                      <div className="flex flex-col gap-1 pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveSectionUp(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                          title="위로 이동"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveSectionDown(index)}
                          disabled={index === generatedStructure.sections.length - 1}
                          className="h-6 w-6 p-0"
                          title="아래로 이동"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Section content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">
                            {section.order}
                          </span>
                          <h3 className="text-lg font-semibold">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {section.description}
                        </p>
                        <p className="text-xs text-muted-foreground italic bg-muted px-3 py-2 rounded">
                          {section.placeholder}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 ml-14">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSectionEdit(index)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        수정
                      </Button>
                      {generatedStructure.sections.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveSection(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          제거
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {/* Add Section Button */}
            <Button
              variant="outline"
              onClick={handleAddSection}
              className="w-full border-dashed"
            >
              + 섹션 추가
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setGeneratedStructure(null);
                setUserInput("");
              }}
            >
              다시 만들기
            </Button>
            <Button
              onClick={handleUseStructure}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Check className="h-4 w-4 mr-2" />
              이 구조로 글쓰기 시작
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
