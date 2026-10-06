"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const inputClass =
  "field w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-base text-[var(--text)]";

type Props = {
  mode: "login" | "signup";
};

function signupErrorMessage(message: string, code?: string) {
  if (code === "user_already_exists" || /already registered/i.test(message)) {
    return "이미 가입된 이메일입니다.";
  }
  if (code === "weak_password" || /password/i.test(message)) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (code === "email_address_invalid" || /invalid.*email|email.*invalid/i.test(message)) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  if (code === "over_email_send_rate_limit" || /rate limit/i.test(message)) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  return "회원가입에 실패했습니다. 다시 시도해주세요.";
}

function loginErrorMessage(message: string, code?: string) {
  if (code === "invalid_credentials" || /invalid login credentials/i.test(message)) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (code === "email_not_confirmed" || /email not confirmed/i.test(message)) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.";
  }
  if (code === "over_request_rate_limit" || /rate limit/i.test(message)) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  return "로그인에 실패했습니다. 다시 시도해주세요.";
}

export default function AuthForm({ mode }: Props) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const canSubmit =
    email.trim() !== "" && password !== "" && (isLogin || passwordConfirm !== "");

  const handleKakaoLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    });
    if (error) {
      setToast("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (isLogin) {
      setSubmitting(true);
      const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setToast(loginErrorMessage(error.message, error.code));
        setSubmitting(false);
        return;
      }
      router.push("/");
      return;
    }

    if (password !== passwordConfirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    const { error } = await createClient().auth.signUp({ email: email.trim(), password });
    if (error) {
      setToast(signupErrorMessage(error.message, error.code));
      setSubmitting(false);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-hover)]"
        >
          {toast}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3.5 rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
      >
        <Link href="/" className="mb-2 text-center text-3xl font-bold tracking-tight text-[var(--text)]">
          🔗 <span className="text-[var(--accent-text)]">링크</span>
        </Link>
        <input
          type="email"
          placeholder="이메일"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="비밀번호"
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="비밀번호 확인"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={inputClass}
          />
        )}
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="btn rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLogin ? "로그인" : "회원가입"}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={submitting}
            aria-label="카카오 로그인"
            className="btn-sub flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3 text-base font-bold text-[rgba(0,0,0,0.85)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.9 5.37 4.76 6.78l-.96 3.52a.4.4 0 0 0 .6.44l4.2-2.8c.46.05.93.08 1.4.08 5.52 0 10-3.58 10-8S17.52 3 12 3z"
              />
            </svg>
            카카오 로그인
          </button>
        )}
        {isLogin && (
          <p className="text-center text-sm">
            <Link href="/forgot-password" className="font-bold text-[var(--text-sub)] hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        )}
        <p className="text-center text-sm text-[var(--text-sub)]">
          {isLogin ? "계정이 없으신가요? " : "이미 계정이 있으신가요? "}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="font-bold text-[var(--accent-text)] hover:underline"
          >
            {isLogin ? "회원가입" : "로그인"}
          </Link>
        </p>
      </form>
    </div>
  );
}
