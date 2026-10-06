"use client";

import { useEffect, useState } from "react";
import type { Folder } from "@/lib/bookmarks";
import Link from "next/link";
import SidebarItem from "./SidebarItem";
import { useUser } from "./useUser";

type Props = {
  folders: Folder[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
};

export default function Sidebar({ folders, selectedId, onSelect, onRename, onDelete }: Props) {
  const user = useUser();
  const [pending, setPending] = useState<Folder | null>(null);
  const [editing, setEditing] = useState<Folder | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!pending && !editing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPending(null);
        setEditing(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, editing]);

  const canSave = name.trim().length > 0;

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-[var(--surface)] p-3 shadow-[1px_0_0_rgba(0,0,0,0.06)]">
      <nav className="flex flex-col gap-1">
        <SidebarItem label="전체" active={selectedId === null} onClick={() => onSelect(null)} />
        <p className="mt-5 px-3 text-[13px] font-bold text-[var(--text-sub)]">폴더</p>
        {folders.map((f) => (
          <SidebarItem
            key={f.id}
            label={f.name}
            active={selectedId === f.id}
            onClick={() => onSelect(f.id)}
            onEdit={
              onRename
                ? () => {
                    setName(f.name);
                    setEditing(f);
                  }
                : undefined
            }
            onDelete={onDelete ? () => setPending(f) : undefined}
          />
        ))}
      </nav>

      {user === null && (
        <div className="mt-auto flex flex-col gap-2 pt-6">
          <Link
            href="/login"
            className="btn rounded-xl bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-bold text-[var(--text)]"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="btn-sub rounded-xl bg-[var(--hover-bg)] px-4 py-2.5 text-center text-sm font-bold text-[var(--accent-text)]"
          >
            회원가입
          </Link>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
          onClick={() => setEditing(null)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label="폴더 이름 수정"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSave) return;
              onRename?.(editing.id, name.trim());
              setEditing(null);
            }}
            className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">폴더 이름 수정</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              placeholder="폴더 이름"
              className="field rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-sub rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-base font-bold text-[var(--accent-text)]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className="btn rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--text)] disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
          onClick={() => setPending(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="폴더 삭제 확인"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">폴더 삭제</h2>
            <p className="text-base text-[var(--text)]">
              <span className="font-bold">&lsquo;{pending.name}&rsquo;</span> 폴더를 삭제할까요?
              <br />
              <span className="text-[13px] text-[var(--text-sub)]">삭제한 폴더는 되돌릴 수 없어요.</span>
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => setPending(null)}
                className="btn-sub rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-base font-bold text-[var(--accent-text)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete?.(pending.id);
                  setPending(null);
                }}
                className="btn-danger rounded-xl bg-[var(--error)] px-6 py-3 text-base font-bold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
