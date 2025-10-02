import Link from "next/link";
import { Sparkles, Brain, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="container py-24">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          AI와 함께 성장하는
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            학습 경험 플랫폼
          </span>
        </h1>
        <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
          AI가 도와주는 글쓰기로 당신의 학습 여정을 기록하고 공유하세요.
          실시간 제안, 자동 구조화, 스마트 태깅으로 더 나은 콘텐츠를 만들어보세요.
        </p>
        <div className="flex gap-4">
          <Link
            href="/write"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            지금 시작하기
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
          >
            둘러보기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto mt-32 grid max-w-5xl gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
            <Brain className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="text-xl font-bold">AI 글쓰기 어시스턴트</h3>
          <p className="text-muted-foreground">
            실시간으로 문장을 개선하고 구조를 제안하는 스마트한 도우미
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900">
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="text-xl font-bold">학습 커뮤니티</h3>
          <p className="text-muted-foreground">
            다른 학습자들과 경험을 공유하고 함께 성장하세요
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h3 className="text-xl font-bold">성장 추적</h3>
          <p className="text-muted-foreground">
            학습 여정을 기록하고 발전 과정을 시각화하세요
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mt-32 max-w-[980px] text-center">
        <div className="rounded-lg border bg-card p-12">
          <h2 className="text-3xl font-bold mb-4">
            준비되셨나요?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            지금 바로 AI의 도움을 받아 첫 번째 학습 경험을 작성해보세요.
          </p>
          <Link
            href="/write"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
