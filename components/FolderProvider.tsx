"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Folder, LinkItem } from "@/lib/bookmarks";
import { createClient } from "@/utils/supabase/client";

type FolderContextValue = {
  folders: Folder[];
  links: LinkItem[];
  loading: boolean;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  addLink: (url: string) => Promise<boolean>;
};

const FolderContext = createContext<FolderContextValue | null>(null);

export function useFolders() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("useFolders must be used within FolderProvider");
  return ctx;
}

export default function FolderProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [folders, setFolders] = useState<Folder[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [f, l] = await Promise.all([
      supabase.from("folders").select("id, name").order("created_at"),
      supabase.from("links").select("id, title, url, description, folder_id").order("created_at"),
    ]);
    if (f.error || l.error) {
      console.error(f.error ?? l.error);
    } else {
      setFolders(f.data);
      setLinks(l.data.map(({ folder_id, ...rest }) => ({ ...rest, folderId: folder_id })));
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFolder = async (name: string) => {
    const { data, error } = await supabase.from("folders").insert({ name }).select("id, name").single();
    if (error) return console.error(error);
    setFolders((prev) => [...prev, data]);
  };

  const removeFolder = async (id: string) => {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) return console.error(error);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setLinks((prev) => prev.map((l) => (l.folderId === id ? { ...l, folderId: null } : l)));
  };

  const renameFolder = async (id: string, name: string) => {
    const { error } = await supabase.from("folders").update({ name }).eq("id", id);
    if (error) return console.error(error);
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const addLink = async (url: string) => {
    let title = url;
    try {
      title = new URL(url).hostname;
    } catch {}
    // DB에 저장하지 않고 메모리에만 추가 — 새로고침하면 사라짐
    setLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, url, description: "", folderId: null },
    ]);
    return true;
  };

  return (
    <FolderContext.Provider value={{ folders, links, loading, addFolder, removeFolder, renameFolder, addLink }}>
      {children}
    </FolderContext.Provider>
  );
}
