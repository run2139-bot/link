"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "./useUser";

export default function UserMenu() {
  const router = useRouter();
  const user = useUser();

  if (!user) return null;

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[180px] truncate text-sm font-bold text-[var(--text-sub)] sm:block">
        {user.email}
      </span>
      <button
        type="button"
        onClick={logout}
        className="btn-sub rounded-xl bg-[var(--hover-bg)] px-4 py-2 text-sm font-bold text-[var(--accent-text)]"
      >
        로그아웃
      </button>
    </div>
  );
}
