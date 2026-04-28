"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

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
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showErr = touched && email.length > 0 && !valid;

  useEffect(() => {
    if (state === "success" && variant === "modal") {
      const t = setTimeout(() => onClose?.(), 1800);
      return () => clearTimeout(t);
    }
  }, [state, variant, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || state === "loading") return;
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
            className="flex items-start gap-3.5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 sm:p-[22px]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <div>
              <div className="font-serif text-xl font-medium leading-tight text-[color:var(--foreground)] sm:text-2xl">
                You&apos;re on the list.
              </div>
              <div className="mt-1.5 text-sm leading-relaxed text-[color:var(--ink2,#3D362E)]">
                We&apos;ll email{" "}
                <b className="text-[color:var(--foreground)]">{email}</b> the
                moment the next essay drops. No spam, no promo nonsense — just a
                single &ldquo;go listen&rdquo; note.
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={submit}
            className="flex flex-col gap-2.5"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@goodemail.com"
                className="h-12 flex-1 rounded-[10px] border bg-[color:var(--card)] px-3.5 text-[15px] text-[color:var(--foreground)] outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
                style={{
                  borderColor: showErr ? "#C2503A" : "var(--border)",
                }}
              />
              <button
                type="submit"
                disabled={!valid || state === "loading"}
                className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-[22px] text-[15px] font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  background: valid && state !== "loading" ? "var(--foreground)" : "#9F968B",
                }}
              >
                {state === "loading" ? (
                  "Adding…"
                ) : (
                  <>
                    Notify me <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
            <div
              className="flex min-h-[18px] items-center gap-2 text-xs"
              style={{ color: showErr ? "#C2503A" : "var(--muted)" }}
            >
              {showErr ? (
                <span>Hmm, that doesn&apos;t look like an email.</span>
              ) : state === "error" ? (
                <span style={{ color: "#C2503A" }}>
                  Couldn&apos;t sign you up: {errMsg}
                </span>
              ) : (
                <>
                  <div className="flex">
                    {["#D9B27A", "#A8826A", "#7A8C6E", "#C2503A"].map((c, i) => (
                      <div
                        key={i}
                        className="rounded-full border-2 border-[color:var(--card)]"
                        style={{
                          width: 18,
                          height: 18,
                          background: c,
                          marginLeft: i === 0 ? 0 : -6,
                        }}
                      />
                    ))}
                  </div>
                  <span>
                    Walkers, runners &amp; dishwashers welcome.
                  </span>
                </>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
