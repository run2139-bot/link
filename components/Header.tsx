import Link from "next/link";
import NewFolderButton from "./NewFolderButton";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between bg-[var(--surface)] px-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <Link href="/" className="text-xl font-bold tracking-tight text-[var(--text)]">
        🔗 <span className="text-[var(--accent-text)]">링크</span>
      </Link>
      <div className="flex items-center gap-2">
        <NewFolderButton />
        <Link
          href="/new"
          className="btn rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--text)]"
        >
          + 링크 추가
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
