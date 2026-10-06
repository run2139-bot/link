"use client";

import { useState } from "react";
import { useFolders } from "./FolderProvider";
import Sidebar from "./Sidebar";
import LinkGrid from "./LinkGrid";

export default function BookmarkBoard() {
  const { folders, links, removeFolder, renameFolder } = useFolders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = selectedId ? links.filter((l) => l.folderId === selectedId) : links;

  return (
    <div className="flex flex-1">
      <Sidebar
        folders={folders}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRename={renameFolder}
        onDelete={(id) => {
          removeFolder(id);
          if (selectedId === id) setSelectedId(null);
        }}
      />
      <main className="flex-1 px-5 py-9 md:px-8">
        <LinkGrid links={visible} />
      </main>
    </div>
  );
}
