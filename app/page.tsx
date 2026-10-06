import Header from "@/components/Header";
import BookmarkBoard from "@/components/BookmarkBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전체 링크",
  description: "저장한 링크를 한곳에서 확인하세요.",
  openGraph: { title: "전체 링크", description: "저장한 링크를 한곳에서 확인하세요." },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <BookmarkBoard />
    </div>
  );
}
