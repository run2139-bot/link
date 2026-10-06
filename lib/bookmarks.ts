export type Folder = { id: string; name: string };

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string | null;
};
