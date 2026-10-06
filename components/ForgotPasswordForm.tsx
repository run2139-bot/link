"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "./Toast";

const inputClass =
  "field w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]";

type ToastState = { message: string; tone: "error" | "success" } | null;

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(
    searchParams.get("error") === "invalid_link"
      ? { message: "유효하지 않거나 만료된 링크입니다. 다시 요청해주세요.", tone: "error" }
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      const rateLimited = error.code === "over_email_send_rate_limit" || /rate limit/i.test(error.message);
      setToast({
        message: rateLimited
          ? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
          : "비밀번호 재설정 링크 발송에 실패했습니다. 다시 시도해주세요.",
        tone: "error",
      });
      return;
    }
    setToast({ message: "비밀번호 재설정 링크를 이메일로 보냈습니다.", tone: "success" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <Toast message={toast?.message ?? null} tone={toast?.tone} onClose={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
      >
        <Link href="/" className="mb-2 text-center text-3xl font-bold tracking-tight text-[var(--text)]">
          🔗 <span className="text-[var(--accent-text)]">링크</span>
        </Link>
        <p className="text-center text-sm text-[var(--text-sub)]">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
        </p>
        <input
          type="email"
          placeholder="이메일"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={email.trim() === "" || submitting}
          className="btn rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          비밀번호 리셋 링크 발송
        </button>
        <p className="text-center text-sm text-[var(--text-sub)]">
          <Link href="/login" className="font-bold text-[var(--accent-text)] hover:underline">
            로그인으로 돌아가기
          </Link>
        </p>
      </form>
    </div>
  );
}
