import type { LinkItem } from "@/lib/bookmarks";

export default function LinkCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex flex-col gap-1 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
    >
      <h3 className="text-lg font-bold leading-snug text-[var(--text)]">{link.title}</h3>
      <p className="text-sm leading-snug text-[var(--text-sub)]">{link.description}</p>
      <span className="mt-3 w-fit max-w-full truncate rounded-lg bg-[var(--hover-bg)] px-2.5 py-1 text-[13px] font-bold text-[var(--accent-text)]">
        {link.url}
      </span>
    </a>
  );
}
