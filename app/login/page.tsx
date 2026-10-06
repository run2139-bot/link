import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "링크 서비스에 로그인하세요.",
  openGraph: { title: "로그인", description: "링크 서비스에 로그인하세요." },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
