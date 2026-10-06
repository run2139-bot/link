"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "./Toast";

const inputClass =
  "field w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]";

function resetErrorMessage(message: string, code?: string) {
  if (code === "same_password" || /different from the old/i.test(message)) {
    return "이전과 다른 비밀번호를 입력해주세요.";
  }
  if (code === "weak_password" || /password/i.test(message)) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (code === "session_not_found" || /session/i.test(message)) {
    return "세션이 만료되었습니다. 재설정 링크를 다시 요청해주세요.";
  }
  return "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (password !== passwordConfirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }
    setSubmitting(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setToast(resetErrorMessage(error.message, error.code));
      setSubmitting(false);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <Toast message={toast} onClose={() => setToast(null)} />
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
      >
        <Link href="/" className="mb-2 text-center text-3xl font-bold tracking-tight text-[var(--text)]">
          🔗 <span className="text-[var(--accent-text)]">링크</span>
        </Link>
        <p className="text-center text-sm text-[var(--text-sub)]">새 비밀번호를 입력해주세요.</p>
        <input
          type="password"
          placeholder="새 비밀번호"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={password === "" || passwordConfirm === "" || submitting}
          className="btn rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          비밀번호 재설정
        </button>
      </form>
    </div>
  );
}
