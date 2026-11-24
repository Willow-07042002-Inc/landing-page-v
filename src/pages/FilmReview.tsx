/* Dev only (/dev/film): the For attorneys film on its own, with pause, slow
   motion and chapter jumps, for going through it and giving notes. It renders
   the same ClientFilm and chapter copy as the page, so it updates with them.
   Not routed in production builds. */
import React, { useCallback, useEffect, useRef, useState } from "react";
import ClientFilm, { FILM_CHAPTERS, FILM_MS, type FilmClock } from "@/components/site/ClientFilm";
import { CHAPTERS } from "@/components/site/StayingAhead";

const SPEEDS = [0.25, 0.5, 1];
const TOTAL = FILM_MS.reduce((a, b) => a + b, 0);
const stamp = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const FilmReview = () => {
  const clock = useRef<FilmClock>({ rate: 0.5, paused: false }).current;
  const filmRef = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.5);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    document.title = "Film review · Willow";
  }, []);

  /* Holds the film's CSS motion to the same clock as its script */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let painted = 0;
    const tick = (now: number) => {
      if (!clock.paused) elapsed.current += (now - last) * clock.rate;
      last = now;
      filmRef.current?.getAnimations({ subtree: true }).forEach((a) => {
        if (a.playbackRate !== clock.rate) a.playbackRate = clock.rate;
        if (clock.paused && a.playState === "running") a.pause();
        else if (!clock.paused && a.playState === "paused") a.play();
      });
      if (now - painted > 100) {
        painted = now;
        setShown(elapsed.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clock]);

  const setPause = useCallback((p: boolean) => {
    clock.paused = p;
    setPaused(p);
  }, [clock]);
  const jump = useCallback((i: number) => {
    elapsed.current = 0;
    setChapter(i);
    setReplay((r) => r + 1);
    setPause(false);
  }, [setPause]);
  const speed = (s: number) => {
    clock.rate = s;
    setRate(s);
  };

  const inChapter = Math.min(shown, FILM_MS[chapter]);
  const before = FILM_MS.slice(0, chapter).reduce((a, b) => a + b, 0);
  const finished = chapter === FILM_CHAPTERS - 1 && shown >= FILM_MS[chapter];

  const toggle = useCallback(() => {
    if (chapter === FILM_CHAPTERS - 1 && elapsed.current >= FILM_MS[chapter]) jump(0);
    else setPause(!clock.paused);
  }, [chapter, clock, jump, setPause]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") toggle();
      else if (e.key === "ArrowRight") jump(Math.min(chapter + 1, FILM_CHAPTERS - 1));
      else if (e.key === "ArrowLeft") jump(Math.max(chapter - 1, 0));
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chapter, jump, toggle]);

  const button = "h-9 rounded-lg px-3.5 text-[14px] font-medium transition-colors";
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-4 text-[#222222] md:px-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mx-auto" style={{ maxWidth: "min(100%, calc((100svh - 200px) * 1.6842))" }}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button type="button" onClick={toggle} className={`${button} w-[92px] bg-[#128F8B] text-white hover:bg-[#0C7370]`}>
            {finished ? "Replay" : paused ? "Play" : "Pause"}
          </button>
          <button type="button" onClick={() => jump(0)} className={`${button} border border-gray-300 bg-white hover:bg-gray-50`}>
            Restart
          </button>
          <div className="flex items-center gap-1" role="group" aria-label="Speed">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={rate === s}
                onClick={() => speed(s)}
                className={`${button} ${rate === s ? "bg-[#E6F5F4] text-[#0C7370]" : "text-gray-500 hover:text-[#222222]"}`}
              >
                {s}x
              </button>
            ))}
          </div>
          <span className="text-[15px] font-semibold" style={{ fontVariantNumeric: "tabular-nums" }} data-film-time>
            {stamp(before + inChapter)} <span className="font-normal text-gray-400">/ {stamp(TOTAL)}</span>
          </span>
          <span className="ml-auto hidden text-[13px] text-gray-400 md:block">Space to pause · arrow keys for chapters</span>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {CHAPTERS.map((c, i) => (
            <button key={c.id} type="button" onClick={() => jump(i)} aria-current={i === chapter} className="text-left">
              <span className="block h-1 overflow-hidden rounded-full bg-gray-200">
                <span
                  className="block h-full bg-[#138F8B]"
                  style={{ width: i < chapter ? "100%" : i === chapter ? `${(inChapter / FILM_MS[i]) * 100}%` : "0%" }}
                />
              </span>
              <span className={`mt-1.5 block truncate text-[13px] font-medium ${i === chapter ? "text-[#222222]" : "text-gray-500"}`}>
                {stamp(FILM_MS.slice(0, i).reduce((a, b) => a + b, 0))} · {c.title}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-2 min-h-[2.75rem] max-w-4xl text-[14.5px] leading-snug text-gray-600">{CHAPTERS[chapter].body}</p>

        <div ref={filmRef} className="mt-1">
          <ClientFilm
            chapter={chapter}
            replay={replay}
            clock={clock}
            rewatch
            onChapter={setChapter}
            onStart={() => {
              elapsed.current = 0;
              setShown(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FilmReview;
