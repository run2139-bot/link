import Header from "@/components/Header";
import NewLinkBoard from "@/components/NewLinkBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 링크 추가",
  description: "새 링크를 저장하세요.",
  openGraph: { title: "새 링크 추가", description: "새 링크를 저장하세요." },
  robots: { index: false, follow: false },
};

export default function NewLinkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <NewLinkBoard />
    </div>
  );
}
