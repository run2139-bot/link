import type { LinkItem } from "@/lib/bookmarks";
import LinkCard from "./LinkCard";

export default function LinkGrid({ links }: { links: LinkItem[] }) {
  if (links.length === 0) {
    return (
      <p className="rounded-2xl bg-[var(--surface)] p-8 text-center text-sm font-bold text-[var(--text-sub)] shadow-[var(--shadow)]">
        등록된 링크가 없습니다.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((l) => (
        <LinkCard key={l.id} link={l} />
      ))}
    </div>
  );
}
