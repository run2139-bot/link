"use client";

import { useEffect, useState } from "react";
import { useFolders } from "./FolderProvider";

export default function NewFolderButton() {
  const { addFolder } = useFolders();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const close = () => {
    setOpen(false);
    setName("");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const canSave = name.trim().length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-sub rounded-xl bg-[var(--hover-bg)] px-4 py-2 text-sm font-bold text-[var(--accent-text)]"
      >
        + 새 폴더
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
          onClick={close}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label="새 폴더"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSave) return;
              addFolder(name.trim());
              close();
            }}
            className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">새 폴더</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="폴더 이름"
              className="field rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
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
    </>
  );
}
