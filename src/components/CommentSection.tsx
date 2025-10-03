"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  commentCount: number;
}

export function CommentSection({ postId, commentCount }: CommentSectionProps) {
  const [comments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    // TODO: 실제 댓글 저장 로직
    // For now, just show a message
    setTimeout(() => {
      alert('댓글 기능은 곧 추가될 예정입니다.');
      setNewComment('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Card className="p-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        댓글 {commentCount}개
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요... (곧 추가될 예정입니다)"
            className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 border-t">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>첫 번째 댓글을 작성해보세요!</p>
          <p className="text-sm mt-2">(댓글 기능은 곧 추가될 예정입니다)</p>
        </div>
      ) : (
        <div className="space-y-6 border-t pt-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {comment.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
