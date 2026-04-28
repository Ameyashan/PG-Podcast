"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EssayCard } from "./essay-card";
import { LockedCard } from "./locked-card";
import { WaitlistForm } from "./waitlist-form";
import type { Essay } from "@/lib/essays";

export function EssayList({ essays }: { essays: Essay[] }) {
  const [modal, setModal] = useState<{ slug: string; title: string } | null>(null);

  const unlocked = essays.filter((e) => e.is_unlocked);
  const locked = essays.filter((e) => !e.is_unlocked);

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Unlocked — {unlocked.length} episodes
        </h2>
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="flex flex-col gap-3"
        >
          {unlocked.map((e) => (
            <EssayCard
              key={e.slug}
              rank={e.rank}
              slug={e.slug}
              title={e.title}
              durationSec={e.duration_sec}
            />
          ))}
        </motion.ul>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Locked — {locked.length} essays
          </h2>
          <p className="text-xs text-[color:var(--muted)]">Hover to request</p>
        </div>
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.015 } } }}
          className="flex flex-col gap-2"
        >
          {locked.map((e) => (
            <LockedCard
              key={e.slug}
              rank={e.rank}
              slug={e.slug}
              title={e.title}
              onWaitlist={(slug, title) => setModal({ slug, title })}
            />
          ))}
        </motion.ul>
      </section>

      <AnimatePresence>
        {modal ? (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="relative w-full max-w-md rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)] p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-3 right-3 rounded-full p-1.5 hover:bg-[color:var(--border)]/50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="mb-1 text-lg font-semibold">Get this episode</h3>
              <p className="mb-5 text-sm text-[color:var(--muted)]">
                Drop your email and we&apos;ll let you know the moment it&apos;s ready.
              </p>
              <WaitlistForm
                variant="modal"
                contextSlug={modal.slug}
                contextTitle={modal.title}
                onClose={() => setModal(null)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
