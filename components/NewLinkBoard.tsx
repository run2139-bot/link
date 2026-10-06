"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolders } from "./FolderProvider";
import Sidebar from "./Sidebar";

export default function NewLinkBoard() {
  const router = useRouter();
  const { folders, removeFolder, renameFolder, addLink } = useFolders();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-1">
      <Sidebar
        folders={folders}
        selectedId={null}
        onSelect={() => router.push("/")}
        onRename={renameFolder}
        onDelete={removeFolder}
      />
      <main className="flex-1 px-5 py-9 md:px-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!url.trim()) return;
            setError(false);
            if (await addLink(url.trim())) router.push("/");
            else setError(true);
          }}
          className="flex max-w-xl flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
        >
          <h1 className="text-[26px] font-bold leading-tight text-[var(--text)]">새 링크 추가</h1>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="field flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]"
            />
            <button
              type="submit"
              className="btn rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--text)]"
            >
              저장
            </button>
          </div>
          {error && <p className="text-sm text-red-600">저장에 실패했습니다. 다시 시도해주세요.</p>}
        </form>
      </main>
    </div>
  );
}
