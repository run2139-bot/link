"use client";

import { useEffect } from "react";

type Props = {
  message: string | null;
  onClose: () => void;
  tone?: "error" | "success";
};

export default function Toast({ message, onClose, tone = "error" }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-hover)] ${
        tone === "error" ? "bg-[var(--error)]" : "bg-[var(--accent-text)]"
      }`}
    >
      {message}
    </div>
  );
}
