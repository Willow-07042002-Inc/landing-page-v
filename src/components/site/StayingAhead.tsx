import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { WRAP } from "@/components/site/blocks";
import ClientFilm from "@/components/site/ClientFilm";

/* One film of a client's life on Willow, set out like harvey.ai's "how teams
   stay ahead": the headline top left, a ruled list of chapters beside the film,
   the open chapter's rule filling as it plays. (On phones and tablets the list
   is a row above the film.) The film moves from one chapter to the next by
   itself, and any chapter can be opened to watch from there. Every chapter has
   an anchor, so the deeper pages parked in src/content/pages.tsx land on theirs. */

export const CHAPTERS: { id: string; also?: string[]; title: string; body: string }[] = [
  {
    id: "set-up",
    also: ["signed-plan", "dashboard"],
    title: "Drop in the signed plan",
    body: "Willow reads the documents you already signed, files each one under the right person, and pulls their email and phone from Outlook, so there’s nothing to retype.",
  },
  {
    id: "plan-summaries",
    title: "Explain the plan",
    body: "Willow drafts a plain-English summary of the plan. You review and approve it, and clients see nothing until you do.",
  },
  {
    id: "check-ins",
    also: ["booking", "their-people", "when-it-matters"],
    title: "Check in every year",
    body: "Write each check-in once, in your own words. Willow sends it every year to your client and to the executors and advisors in their plan, who can book time with you.",
  },
  {
    id: "firm-updates",
    title: "Share your firm’s updates",
    body: "Paste a link to anything your firm publishes, and it appears on every client’s dashboard, so you stay in view between check-ins.",
  },
];

const chapterFor = (hash: string) => {
  const key = hash.replace("#", "");
  return CHAPTERS.findIndex((c) => c.id === key || c.also?.includes(key));
};

/* The section headline: a light serif line, then an italic teal line */
export const LightHead = ({ title, accent }: { title: string; accent: string }) => (
  <div className="mx-auto max-w-4xl text-center">
    <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
      {title}
      <span className="block italic text-[#138F8B]">{accent}</span>
    </h2>
  </div>
);

/* The open chapter's line fills as it plays */
const Fill = ({ ms }: { ms: number }) => {
  const [on, setOn] = useState(ms === 0);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(true), 16);
    return () => window.clearTimeout(t);
  }, []);
  return <span className="absolute left-0 top-[-2px] h-0.5 bg-[#138F8B]" style={{ width: on ? "100%" : "0%", transition: on && ms ? `width ${ms}ms linear` : "none" }} />;
};

const StayingAhead = () => {
  const { hash } = useLocation();
  const [active, setActive] = useState(() => Math.max(0, chapterFor(hash)));
  const [replay, setReplay] = useState(0);
  const [run, setRun] = useState<{ id: number; ms: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const i = chapterFor(hash);
    if (i >= 0) setActive(i);
  }, [hash]);

  /* On phones the row scrolls: keep the open chapter in sight */
  useEffect(() => {
    const tab = tabRefs.current[active];
    const row = tab?.parentElement;
    if (tab && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [active]);

  const open = (i: number, focus = false) => {
    setActive(i);
    setRun(null);
    setReplay((r) => r + 1);
    if (focus) {
      tabRefs.current[i]?.focus({ preventScroll: true });
      rowRefs.current[i]?.focus({ preventScroll: true });
    }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") open((active + 1) % CHAPTERS.length, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") open((active + CHAPTERS.length - 1) % CHAPTERS.length, true);
    else return;
    e.preventDefault();
  };

  const chapter = CHAPTERS[active];
  return (
    <section className="bg-[#F8FAFC] pb-16 md:pb-24">
      <div className={`${WRAP} max-w-6xl lg:px-10`}>
        <h2 className="font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl md:text-[2.75rem]" style={{ lineHeight: 1.2 }}>
          A practice families
          <span className="block italic text-[#138F8B]">keep coming back to.</span>
        </h2>

        <div className="relative mt-10 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,11fr)] lg:items-start lg:gap-14">
          {CHAPTERS.flatMap((c) => [c.id, ...(c.also ?? [])]).map((id) => (
            <span key={id} id={id} className="absolute -top-24 left-0" aria-hidden />
          ))}

          <div className="min-w-0">
            {/* Phones and tablets: a row above the film */}
            <div className="lg:hidden">
              <div role="tablist" aria-label="A client's life on Willow" onKeyDown={onKey} className="relative flex gap-4 overflow-x-auto pt-0.5 [scrollbar-width:none]">
                {CHAPTERS.map((c, i) => (
                  <button
                    key={c.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={`chapter-tab-${c.id}`}
                    aria-selected={i === active}
                    aria-controls="chapter-panel"
                    tabIndex={i === active ? 0 : -1}
                    onClick={() => open(i)}
                    className={`relative flex-shrink-0 border-t-2 border-gray-200 pb-2 pr-3 pt-3.5 text-left text-[15px] font-medium leading-snug transition-colors ${
                      i === active ? "text-[#222222]" : "text-gray-500 hover:text-[#222222]"
                    }`}
                  >
                    {i < active && <span className="absolute left-0 top-[-2px] h-0.5 w-full bg-[#138F8B]" />}
                    {i === active && run && <Fill key={run.id} ms={run.ms} />}
                    {c.title}
                  </button>
                ))}
              </div>
              <p key={chapter.id} className="mt-4 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:min-h-[3.25rem]" style={{ textWrap: "pretty" }}>
                {chapter.body}
              </p>
            </div>

            {/* Desktop: the ruled list */}
            <div role="tablist" aria-orientation="vertical" aria-label="A client's life on Willow" onKeyDown={onKey} className="hidden border-b-2 border-gray-200 lg:block">
              {CHAPTERS.map((c, i) => {
                const on = i === active;
                return (
                  <div key={c.id} className="relative border-t-2 border-gray-200">
                    {on && run && <Fill key={run.id} ms={run.ms} />}
                    <button
                      ref={(el) => { rowRefs.current[i] = el; }}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="chapter-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => open(i)}
                      className={`block w-full py-5 text-left text-[20px] font-medium leading-snug transition-colors ${on ? "text-[#222222]" : "text-gray-500 hover:text-[#222222]"}`}
                      style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                    >
                      {c.title}
                    </button>
                    <div style={{ display: "grid", gridTemplateRows: on ? "1fr" : "0fr", transition: "grid-template-rows 340ms var(--ease-in-out)" }}>
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-6 pr-4 text-[15px] leading-relaxed text-gray-600" style={{ opacity: on ? 1 : 0, transition: on ? "opacity 260ms ease 120ms" : "opacity 120ms ease", textWrap: "pretty" }}>
                          {c.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="chapter-panel" role="tabpanel" aria-labelledby={`chapter-tab-${chapter.id}`} className="min-w-0">
            <ClientFilm
              chapter={active}
              replay={replay}
              onChapter={setActive}
              onStart={(ms) => setRun((r) => ({ id: (r?.id ?? 0) + 1, ms }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StayingAhead;
