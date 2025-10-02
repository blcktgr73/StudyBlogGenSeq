import Link from "next/link";
import { PenSquare, Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Study
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/explore"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            둘러보기
          </Link>
          <Link
            href="/tags"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            태그
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/write"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            <PenSquare className="h-4 w-4 mr-2" />
            글쓰기
          </Link>
        </div>
      </div>
    </header>
  );
}
