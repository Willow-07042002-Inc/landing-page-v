import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import EasyFilm from "@/components/site/EasyFilm";

/* Keeping things easy: the admin Willow takes off the attorney, as a row of
   three tiles (Aaron, Nov 24, 2026), each with its words above and its own
   short film below. Once the row is in view the films play one after
   another; the one playing grows a little, its rule fills, and it settles
   back when it's done. A tile not playing rests on its last frame. Clicking a
   tile plays it again. Below 1024px the tiles stack. Each chapter has an
   anchor; the parked pages in src/content/pages.tsx land on #dashboard and
   #plan-summaries, and a hash starts the row from its tile. */

export const EASY_CHAPTERS: { id: string; also?: string[]; title: string; body: string }[] = [
  {
    id: "set-up",
    also: ["signed-plan", "dashboard"],
    title: "Automate account creation",
    body: "Just drop in your documents, and Willow goes through the details and your contacts to put it all together.",
  },
  {
    id: "plan-summaries",
    title: "AI-generated summaries",
    body: "Willow creates a visual summary of every estate plan, and you can change any of its wording before clients see it.",
  },
  {
    id: "reaching-out",
    title: "Check-ins that send themselves",
    body: "Reminders, surveys and emails can all be automated, so you’re never buried in follow-up.",
  },
];

const chapterFor = (hash: string) => {
  const key = hash.replace("#", "");
  return EASY_CHAPTERS.findIndex((c) => c.id === key || c.also?.includes(key));
};

/* A tile's rule fills as its film plays */
const Fill = ({ ms }: { ms: number }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: on ? "100%" : "0%", transition: on ? `width ${ms}ms linear` : "none" }} />;
};

const noop = () => undefined;
const GROW = 1.035;

const KeepingThingsEasy = () => {
  const { hash } = useLocation();
  const n = EASY_CHAPTERS.length;
  /* Whose turn it is to play; the rest hold on their last frame */
  const [turn, setTurn] = useState<number | null>(() => Math.max(0, chapterFor(hash)));
  /* Bumped to play a tile again */
  const [runs, setRuns] = useState<number[]>(() => EASY_CHAPTERS.map(() => 0));
  /* The tile playing right now, and for how long */
  const [live, setLive] = useState<{ i: number; id: number; ms: number } | null>(null);
  const [played, setPlayed] = useState<boolean[]>(() => EASY_CHAPTERS.map(() => false));
  /* Still in the first pass through the row: each tile hands on to the next */
  const auto = useRef(true);

  useEffect(() => {
    const i = chapterFor(hash);
    if (i >= 0) {
      auto.current = true;
      setTurn(i);
    }
  }, [hash]);

  const play = (i: number) => {
    auto.current = false;
    setPlayed((p) => p.map((v, k) => (k === i ? false : v)));
    setRuns((r) => r.map((v, k) => (k === i ? v + 1 : v)));
    setTurn(i);
  };

  const started = useCallback((i: number, ms: number) => {
    if (ms > 0) setLive((l) => ({ i, id: (l?.id ?? 0) + 1, ms }));
  }, []);
  const ended = useCallback(
    (i: number) => {
      setLive((l) => (l?.i === i ? null : l));
      setPlayed((p) => p.map((v, k) => (k === i ? true : v)));
      setTurn((t) => (t !== i ? t : auto.current && i < n - 1 ? i + 1 : null));
    },
    [n]
  );

  return (
    <section id="keeping-things-easy" className="scroll-mt-24 bg-[#F8FAFC] py-16 md:py-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
          Drop in the estate plan.
          <span className="block italic text-[#138F8B]">We’ll handle the rest.</span>
        </h2>

        <div className="relative mt-10 grid gap-14 md:mt-12 lg:grid-cols-3 lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-6">
          {EASY_CHAPTERS.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}

          {EASY_CHAPTERS.map((c, i) => {
            const playing = live?.i === i;
            const quiet = live !== null && !playing;
            return (
              <div key={c.id} className="group relative grid gap-5 lg:row-span-2 lg:grid-rows-subgrid lg:gap-y-6">
                <div className="relative border-t-2 border-gray-200 pt-5">
                  {live?.i === i ? <Fill key={live.id} ms={live.ms} /> : played[i] && <span className="absolute left-0 top-[-2px] h-0.5 w-full bg-[#138F8B]" />}
                  <h3
                    className="text-[20px] font-medium leading-snug"
                    style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em", color: quiet ? "#6B7280" : "#222222", transition: "color 300ms ease" }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-2 max-w-[28rem] text-[15px] leading-relaxed text-gray-600" style={{ textWrap: "pretty" }}>
                    {c.body}
                  </p>
                </div>

                {/* The tile: lifts on hover, grows while it plays */}
                <div className="max-w-[440px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <div
                    className="rounded-xl"
                    style={{
                      transform: playing ? `scale(${GROW})` : "scale(1)",
                      boxShadow: playing ? "0 28px 60px -24px rgba(6,45,44,0.55)" : "0 0 0 0 rgba(6,45,44,0)",
                      transition: "transform 700ms var(--ease-in-out), box-shadow 700ms ease",
                    }}
                  >
                    <EasyFilm
                      tile
                      rewatch
                      chapter={i}
                      replay={runs[i]}
                      hold={turn !== i}
                      onChapter={noop}
                      onStart={(ms) => started(i, ms)}
                      onEnd={() => ended(i)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => play(i)}
                  aria-label={`Play “${c.title}” again`}
                  className="absolute -inset-2 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138F8B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8FAFC]"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeepingThingsEasy;
