export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Study Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI 학습 경험을 작성할 때 LLM의 도움을 받는 커뮤니티 플랫폼
        </p>
        <div className="flex gap-4 justify-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            Next.js 15
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            TypeScript
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
            Tailwind CSS
          </span>
        </div>
      </div>
    </main>
  );
}
