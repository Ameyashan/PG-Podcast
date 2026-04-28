"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Mail } from "lucide-react";

export function WaitlistForm({
  variant = "inline",
  contextSlug,
  contextTitle,
  onClose,
}: {
  variant?: "inline" | "modal";
  contextSlug?: string | null;
  contextTitle?: string | null;
  onClose?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (state === "success" && variant === "modal") {
      const t = setTimeout(() => onClose?.(), 1800);
      return () => clearTimeout(t);
    }
  }, [state, variant, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, essaySlug: contextSlug ?? null }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "failed");
      }
      setState("success");
    } catch (err) {
      setErrMsg((err as Error).message);
      setState("error");
    }
  }

  return (
    <div className="w-full">
      {contextTitle ? (
        <p className="mb-3 text-sm text-[color:var(--muted)]">
          We&apos;ll email you when{" "}
          <span className="font-medium text-[color:var(--foreground)]">&ldquo;{contextTitle}&rdquo;</span>{" "}
          is ready.
        </p>
      ) : null}
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-5 py-3"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-sm">You&apos;re on the list. We&apos;ll be in touch.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            className="flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] pl-4 pr-1 py-1 focus-within:ring-2 focus-within:ring-[color:var(--accent)]/30"
          >
            <Mail className="h-4 w-4 text-[color:var(--muted)] shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[color:var(--muted)]"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition"
            >
              {state === "loading" ? "Joining…" : "Join waitlist"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state === "error" ? (
        <p className="mt-2 text-xs text-red-500">Couldn&apos;t sign you up: {errMsg}</p>
      ) : null}
    </div>
  );
}
