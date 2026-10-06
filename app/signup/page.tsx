import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "링크 서비스에 가입하고 링크를 저장하세요.",
  openGraph: { title: "회원가입", description: "링크 서비스에 가입하고 링크를 저장하세요." },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
