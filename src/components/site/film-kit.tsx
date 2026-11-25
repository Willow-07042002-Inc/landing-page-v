import React, { useEffect, useState } from "react";

/* What the For attorneys films share: the props the chapter sections pass in,
   the dev page's clock, the phone switch, and the small pieces both films draw
   with. Each film writes its own chapters. */

/** Optional: lets the dev review page (/dev/film) pause and slow a film */
export type FilmClock = { rate: number; paused: boolean };

export type FilmProps = {
  chapter: number;
  /** Changes when someone reopens a chapter, so it plays again */
  replay: number;
  onChapter: (next: number) => void;
  /** A chapter has started and will take this many milliseconds (0: at rest) */
  onStart: (ms: number) => void;
  clock?: FilmClock;
  /** Play a chapter again when it's reopened (the dev review page). On the
      site a chapter already seen opens on its last frame */
  rewatch?: boolean;
};

export const FIGTREE = "Figtree, Inter, sans-serif";
export const MOVE = "cubic-bezier(0.45, 0.05, 0.35, 1)";

export const useCompact = () => {
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setCompact(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return compact;
};

/* A button pressing itself: nothing crosses the screen to click it */
export const tapStyle = (on: boolean): React.CSSProperties => ({
  transform: on ? "scale(0.96)" : "scale(1)",
  boxShadow: on ? "0 0 0 6px rgba(48,158,150,0.22)" : "0 0 0 0 rgba(48,158,150,0)",
  transition: "transform 180ms var(--ease-out), box-shadow 340ms ease",
});

/* A fill-in as the composer shows it: a quiet pill in place of the name */
export const FillIn = ({ children }: { children: React.ReactNode }) => (
  <span className="mx-px inline-flex items-center rounded-md bg-[#E6F5F4] px-1.5 text-[13px] font-medium leading-[22px] text-[#0F7673]">{children}</span>
);

/* Fades in once it's on the page */
export const Appear = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <div className={className} style={{ opacity: on ? 1 : 0, transition: "opacity 240ms ease" }}>{children}</div>;
};

/* A wait that the dev page's clock can pause and slow, and that gives up
   once the chapter it belongs to has been left */
export const makeWait = (clock: FilmClock | undefined, live: () => boolean) => (ms: number) =>
  new Promise<void>((resolve, reject) => {
    if (!clock) {
      window.setTimeout(() => (live() ? resolve() : reject(new Error("stopped"))), ms);
      return;
    }
    let left = ms;
    let last = performance.now();
    const id = window.setInterval(() => {
      if (!live()) {
        window.clearInterval(id);
        reject(new Error("stopped"));
        return;
      }
      const now = performance.now();
      if (!clock.paused) left -= (now - last) * clock.rate;
      last = now;
      if (left <= 0) {
        window.clearInterval(id);
        resolve();
      }
    }, 16);
  });
