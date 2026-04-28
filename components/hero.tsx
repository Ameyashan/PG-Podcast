import { Sparkles } from "lucide-react";
import { WaitlistForm } from "./waitlist-form";
import { PortraitIllustration } from "./portrait-illustration";

export function Hero({ unlockedCount }: { unlockedCount: number }) {
  return (
    <section className="relative grid grid-cols-1 items-center gap-8 px-6 pb-10 pt-8 md:grid-cols-[1.15fr_1fr] md:gap-14 md:px-16 md:pb-10 md:pt-16">
      <div className="flex flex-col gap-5 md:gap-[26px]">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.5px] text-[color:var(--ink2,#3D362E)]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--mint)",
              boxShadow: "0 0 0 3px color-mix(in srgb, var(--mint) 20%, transparent)",
            }}
          />
          {unlockedCount} essays · ready now
        </div>

        <h1 className="m-0 font-serif text-[40px] font-normal leading-[1.0] tracking-[-1.5px] text-[color:var(--foreground)] md:text-[64px]">
          Paul Graham,
          <br />
          <span className="italic text-[color:var(--accent)]">narrated.</span>
        </h1>

        <p className="m-0 max-w-[460px] text-base leading-[1.55] text-[color:var(--ink2,#3D362E)] md:text-lg">
          His most-loved essays, turned into audio you can press play on.
          Listen on your run, in the dishes, while the dog does its business.
          Drop your email and we&apos;ll holler when the next episode lands.
        </p>

        <div id="waitlist">
          <WaitlistForm />
        </div>

        <div className="mt-1 flex items-center gap-2 border-t border-dashed border-[color:var(--border)] pt-2 font-mono text-[11.5px] text-[color:var(--muted)]">
          <Sparkles className="h-3 w-3 text-[color:var(--accent)]" fill="currentColor" />
          <span>AI-narrated · essays used with credit to paulgraham.com</span>
        </div>
      </div>

      <div className="relative hidden w-full items-center justify-center md:flex">
        <PortraitIllustration size={520} />
      </div>
    </section>
  );
}
