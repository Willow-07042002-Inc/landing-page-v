import React, { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, Plus, Video, Stamp } from "lucide-react";

/**
 * Coded product vignettes — single UI elements lifted from the real Willow
 * apps, rendered full-bleed so they fill their frame edge to edge.
 * Attorney surfaces: Figtree, #309E96 accents. Client surfaces: Inter, #128F8B.
 *
 * Each vignette is authored at a fixed 900×560 design size and scaled to fill
 * its parent (which must be position:relative with aspect-ratio 900/560).
 */

export const Scaled = ({ w, h, children }: { w: number; h: number; children: React.ReactNode }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    // offsetWidth, not getBoundingClientRect: the rect includes ancestor
    // transforms (e.g. the carousel's scale on non-active slides), which
    // ResizeObserver never re-fires for — the stage would stay mis-scaled.
    const measure = () => {
      const width = el.offsetWidth || el.getBoundingClientRect().width;
      if (width > 50) setScale(width / w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [w]);
  return (
    <div ref={outerRef} className="absolute inset-0 overflow-hidden">
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
};

const VW = 900;
const VH = 560;

/** Demo pacing: waits `ms` of *visible* time — the clock freezes while the
    tab is hidden (rAF stops firing) and resolves early if the vignette
    unmounts, so a background tab never fast-forwards the animation. */
export const demoWait = (ms: number, isAlive: () => boolean) =>
  new Promise<void>((resolve) => {
    let remaining = ms;
    let last = performance.now();
    const tick = () => {
      if (!isAlive()) return resolve();
      const now = performance.now();
      if (document.visibilityState !== "hidden") remaining -= now - last;
      last = now;
      if (remaining <= 0) return resolve();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

const Bleed = ({ font, h = VH, children }: { font: "attorney" | "client"; h?: number; children: React.ReactNode }) => (
  <Scaled w={VW} h={h}>
    <div
      className="flex h-full w-full flex-col bg-white text-left"
      style={{ fontFamily: font === "attorney" ? "Figtree, Inter, sans-serif" : "Inter, sans-serif", height: h }}
    >
      {children}
    </div>
  </Scaled>
);

/* 1 · Leads land on your calendar — the public intake form, full bleed */
export const LeadIntakeVignette = () => (
  <Bleed font="client">
    <div className="flex items-center gap-4 border-b border-[#E5E7EB] px-10 py-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F5F4] text-[17px] font-bold text-[#0C7370]">AF</span>
      <div>
        <div className="text-[21px] font-semibold text-[#1F2933]">Book with Alvarez Family Law</div>
        <div className="mt-0.5 text-[15px] text-[#9CA3AF]">A few questions first — it keeps the meeting short</div>
      </div>
    </div>
    <div className="flex flex-1 flex-col justify-center gap-7 px-10">
      <div>
        <div className="text-[16px] font-medium text-[#6B7280]">What brings you in?</div>
        <div className="mt-3 flex gap-2.5">
          <span className="rounded-full bg-[#128F8B] px-5 py-2.5 text-[16px] font-semibold text-white">Start a new estate plan</span>
          <span className="rounded-full border border-[#E5E7EB] px-5 py-2.5 text-[16px] font-medium text-[#6B7280]">Update an existing plan</span>
        </div>
      </div>
      <div>
        <div className="text-[16px] font-medium text-[#6B7280]">Tell us about your family</div>
        <div className="mt-3 flex gap-2.5">
          <span className="rounded-full bg-[#E6F5F4] px-5 py-2.5 text-[16px] font-semibold text-[#0C7370]">Married</span>
          <span className="rounded-full bg-[#E6F5F4] px-5 py-2.5 text-[16px] font-semibold text-[#0C7370]">2 children</span>
          <span className="rounded-full border border-[#E5E7EB] px-5 py-2.5 text-[16px] font-medium text-[#6B7280]">+ more</span>
        </div>
      </div>
      <div>
        <div className="text-[16px] font-medium text-[#6B7280]">Thursday, September 10 · synced with Rachel's calendar</div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <span className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-center text-[17px] font-medium text-[#1F2933]">10:00 AM</span>
          <span className="rounded-xl bg-[#128F8B] px-4 py-3.5 text-center text-[17px] font-semibold text-white">2:30 PM</span>
          <span className="rounded-xl border border-[#E5E7EB] px-4 py-3.5 text-center text-[17px] font-medium text-[#1F2933]">4:15 PM</span>
        </div>
      </div>
    </div>
  </Bleed>
);

/* 2b · One client's journey — the attorney app's client-detail Journey tab,
      verbatim from apps/professionals/components/dashboard/client-detail/
      journey-tab.tsx: summary with the 5-segment bar, then the stage rows
      (done = filled teal + Done, active = teal ring + "Daniel is here"). */
const JOURNEY_STAGES_DEMO = [
  { label: "Engagement agreement", sub: "Signed August 2, 2026" },
  { label: "Your information" },
  { label: "Planning meeting" },
  { label: "Review meeting" },
  { label: "Signing" },
];

export const ClientDetailJourneyVignette = ({ h }: { h?: number }) => {
  const activeIdx = 3; // Step 4 of 5 · Review meeting
  return (
    <Bleed font="attorney" h={h}>
      <div className="flex h-full w-full flex-col bg-[#F0F2F5] px-10 py-8">
        <div className="flex items-center justify-between">
          <h3 className="text-[24px] font-semibold text-[#1F2933]">Daniel Rosen</h3>
          <Bell className="h-5 w-5 text-[#6B7280]" strokeWidth={1.8} />
        </div>
        <div className="mt-3 flex gap-7 border-b border-[#E5E7EB]">
          {["Contact", "Estate Plan", "Journey", "Notes", "Emails"].map((t) => (
            <span
              key={t}
              className={`pb-2.5 text-[14px] font-medium ${t === "Journey" ? "border-b-2 border-[#128F8B] text-[#128F8B]" : "text-[#6B7280]"}`}
              style={{ marginBottom: -1 }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl bg-[#F3F4F6]">
          <div className="flex flex-col gap-1.5">
            <div className="bg-white px-6 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-[#1F2933]">Step 4 of 5 · Review meeting</h3>
                <span className="whitespace-nowrap text-[12px] text-[#9CA3AF]">
                  Last logged in: <span className="text-[#6B7280]">Yesterday</span>
                </span>
              </div>
              <div className="mt-3 flex gap-1">
                {JOURNEY_STAGES_DEMO.map((st, i) => (
                  <span
                    key={st.label}
                    className={`h-[5px] flex-1 rounded-full ${i < activeIdx ? "bg-[#128F8B]" : i === activeIdx ? "bg-[#128F8B]/25" : "bg-[#E5E7EB]"}`}
                  />
                ))}
              </div>
            </div>
            {JOURNEY_STAGES_DEMO.map((st, i) => {
              const isDone = i < activeIdx;
              const isActive = i === activeIdx;
              return (
                <div key={st.label} className="flex items-center gap-4 bg-white px-6 py-3">
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold ${
                      isDone ? "border-[#128F8B] bg-[#128F8B] text-white" : isActive ? "border-[#128F8B] bg-white text-[#128F8B]" : "border-[#E5E7EB] bg-white text-[#C4C9D0]"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[14px] font-semibold ${isDone || isActive ? "text-[#1F2933]" : "text-[#9CA3AF]"}`}>{st.label}</span>
                    {i === 0 && <span className="block text-[12px] text-[#9CA3AF]">{st.sub}</span>}
                  </span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isDone ? "bg-[#ECFDF5] text-[#059669]" : isActive ? "bg-[#F0F9F9] text-[#128F8B]" : "bg-[#F3F4F6] text-[#9CA3AF]"
                    }`}
                  >
                    {isDone ? "Done" : isActive ? "Daniel is here" : "Up next"}
                  </span>
                </div>
              );
            })}
            <div className="bg-white px-6 py-3.5">
              <p className="text-[13px] text-[#6B7280]">
                Already have Daniel&rsquo;s signed estate plan?{" "}
                <span className="font-medium text-[#309E96]">Upload it now &rarr;</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Bleed>
  );
};


/* 2c · Three clients, three next steps — the organized-practice view. Two
      matters are waiting on the client; one is waiting on the attorney and
      carries the CTA. */
const NextStepSegs = ({ step }: { step: number }) => (
  <span className="flex w-[110px] flex-shrink-0 gap-[4px]">
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className="h-[4px] flex-1 rounded-full"
        style={{ backgroundColor: n < step ? "#128F8B" : n === step ? "rgba(18,143,139,0.3)" : "#E5E7EB" }}
      />
    ))}
  </span>
);

export const ActiveClientsNextStepsVignette = () => (
  <Scaled w={900} h={400}>
    <div className="flex h-full w-full flex-col bg-white px-11 pt-7 pb-2 text-left" style={{ fontFamily: "Figtree, Inter, sans-serif", height: 400 }}>
      <div className="flex items-center justify-between border-b border-[#F0F1F3] pb-4">
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 24,
              height: 24,
              backgroundColor: "#309E96",
              WebkitMask: "url(/mock/clients-icon.svg) center / contain no-repeat",
              mask: "url(/mock/clients-icon.svg) center / contain no-repeat",
            }}
          />
          <h3 className="text-[26px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
            Active clients
          </h3>
        </span>
        <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[15px] font-semibold text-[#6B7280]">10</span>
      </div>
      {[
        {
          n: "Daniel Rosen", i: "DR", step: 2,
          next: "Send the retainer for signing",
          cta: "Send retainer now",
        },
        {
          n: "Elena Ruiz", i: "ER", step: 2,
          next: "Waiting on Elena's signature on the retainer",
        },
        {
          n: "Marcus Webb", i: "MW", step: 4,
          next: "Review meeting scheduled for September 12",
        },
      ].map((r, idx, arr) => (
        <div key={r.n} className={`flex items-center gap-5 py-4 ${idx < arr.length - 1 ? "border-b border-[#F0F1F3]" : ""}`}>
          <span className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[15px] font-semibold text-[#9CA3AF]">{r.i}</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-3.5">
              <span className="text-[20px] font-semibold text-[#1F2933]">{r.n}</span>
              <span className="flex w-[104px] flex-shrink-0 gap-[4px]">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className="h-[5px] flex-1 rounded-full"
                    style={{ backgroundColor: n < r.step ? "#128F8B" : n === r.step ? "rgba(18,143,139,0.3)" : "#E5E7EB" }}
                  />
                ))}
              </span>
            </span>
            <span className="mt-0.5 block truncate text-[15.5px] text-[#9CA3AF]">Next step: {r.next}</span>
          </span>
          {r.cta && (
            <span className="flex-shrink-0 rounded-full bg-[#F0F9F9] px-4 py-1.5 text-[14.5px] font-semibold text-[#128F8B]">{r.cta}</span>
          )}
        </div>
      ))}
    </div>
  </Scaled>
);

/* 1b · Animated check-in demo — recreates apps/demo CheckInModal + its trigger
      pill: the client's "My Estate Plan" screen sits behind the Eva pill
      ("Has anything changed?"); the demo cursor clicks it, the check-in popup
      rises (Eva on the grey hairline, per the popup design system), two life
      changes get ticked, and the cursor fades out — the demo ends on the
      selection screen. Cursor sprite/easing and play-once/replay-after-5s-away
      behavior match SharingRecommendationVignette. */

const DEMO_SERIF: React.CSSProperties = { fontFamily: "Merriweather, Georgia, serif", textWrap: "balance" };
const BRAND = "#128F8B";

type CheckInStep = "idle" | "ask";

/** Grey check-in row from CheckInModal — soft grey card, round radio, teal dot. */
const CheckItemRow = ({ label, checked, targetRef }: { label: string; checked?: boolean; targetRef?: React.Ref<HTMLDivElement> }) => (
  <div ref={targetRef} className="flex w-full items-center gap-3 rounded-lg bg-[#F3F4F6] px-4 py-3.5 text-left">
    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] bg-white">
      <span className="h-3.5 w-3.5 rounded-full transition-opacity duration-200" style={{ backgroundColor: "#159a95", opacity: checked ? 1 : 0 }} />
    </span>
    <span className="text-[15px] font-medium text-[#1F2933]">{label}</span>
  </div>
);

/** Compact modal header: Eva's portrait on the grey hairline, serif title —
    the ModalHeader pattern from CheckInModal / the popup design system. */
const ModalEvaHeader = ({ title, sub }: { title: React.ReactNode; sub?: string }) => (
  <div className="relative w-full" style={{ marginBottom: 21 }}>
    <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-gray-200" style={{ top: 28 }} />
    <div className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full" style={{ width: 56, height: 56, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
      <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
    </div>
    <div className="text-center" style={{ paddingTop: 69 }}>
      <h4 className="mx-auto font-semibold text-[#1F2933]" style={{ ...DEMO_SERIF, fontSize: 21, lineHeight: 1.3 }}>{title}</h4>
      {sub && <p className="mx-auto max-w-[340px] text-[#6B7280]" style={{ fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>{sub}</p>}
    </div>
  </div>
);

const PLAYBOOK_CARDS = [
  { icon: "/mock/family-icon.png", t: "You & Your Family", s: "The people at the center of your plan" },
  { icon: "/mock/shield-icon.png", t: "If You Need Someone to Step In", s: "What happens if you can't make decisions for yourself" },
  { icon: "/mock/tree-icon.png", t: "What You'll Leave Behind", s: "How your estate is managed and distributed" },
  { icon: "/mock/docs-icon.png", t: "Your Documents", s: "Signed documents, recordings, and compliance files" },
];

export const CheckInDemoVignette = ({ h = VH }: { h?: number } = {}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const chkChildRef = useRef<HTMLDivElement>(null);
  const chkHomeRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<CheckInStep>("idle");
  const [chkChild, setChkChild] = useState(false);
  const [chkHome, setChkHome] = useState(false);
  const [cursor, setCursor] = useState({ x: 780, y: 160, down: false, shown: false });
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setStep("ask");
      setChkChild(true);
      setChkHome(true);
      return;
    }
    let alive = true;
    const isAlive = () => alive;
    let running = false;
    let played = false;
    let outSince: number | null = null;

    const centerOf = (el: HTMLElement | null) => {
      if (!el || !rootRef.current) return { x: 450, y: 280 };
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      let n: HTMLElement | null = el;
      while (n && n !== rootRef.current) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };

    const click = async () => {
      setCursor((c) => ({ ...c, down: true }));
      await demoWait(160, isAlive);
      setCursor((c) => ({ ...c, down: false }));
    };
    const glideTo = async (el: HTMLElement | null, ms: number) => {
      const pos = centerOf(el);
      setCursor((c) => ({ ...c, x: pos.x, y: pos.y }));
      await demoWait(ms, isAlive);
    };

    const play = async () => {
      if (running) return;
      running = true;
      played = true;
      // reset
      setStep("idle");
      setChkChild(false);
      setChkHome(false);
      setCursor({ x: 780, y: 160, down: false, shown: false });
      await demoWait(700, isAlive);
      if (!alive) return;
      setCursor((c) => ({ ...c, shown: true }));
      // 1 · the "Has anything changed?" pill
      await glideTo(pillRef.current, 900);
      await click();
      setStep("ask");
      await demoWait(800, isAlive);
      // 2 · tick the two life changes, then the cursor simply fades out —
      // the demo ends here, on the selection screen.
      await glideTo(chkChildRef.current, 750);
      await click();
      setChkChild(true);
      await demoWait(450, isAlive);
      await glideTo(chkHomeRef.current, 600);
      await click();
      setChkHome(true);
      await demoWait(500, isAlive);
      setCursor((c) => ({ ...c, shown: false }));
      running = false;
    };

    const io = new IntersectionObserver((entries) => {
      const inView = entries.some((e) => e.isIntersecting);
      if (inView) {
        // Plays once per visit; replays only after the card has been away ≥5s.
        if (!played) play();
        else if (outSince !== null && Date.now() - outSince >= 5000 && !running) play();
        outSince = null;
      } else if (played) {
        outSince = Date.now();
      }
    }, { threshold: 0.3 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [reduced]);

  const modalOpen = step !== "idle";

  return (
    <Scaled w={VW} h={h}>
      <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-[#FAFBFC] text-left" style={{ fontFamily: "Inter, sans-serif", height: h }}>
        <style>{`
          @keyframes demoFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes demoPopIn { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        `}</style>

        {/* ── Backdrop: the client's My Estate Plan screen ── */}
        <div className="border-b border-gray-100 bg-white px-6 pb-6 pt-8 text-center">
          <h3 className="mb-1.5 text-[#1F2933]" style={{ ...DEMO_SERIF, fontSize: 30, fontWeight: 600 }}>Your Plan's Playbook</h3>
          <p className="mx-auto max-w-[440px] text-[#6B7280]" style={{ fontSize: 14.5, lineHeight: 1.6 }}>We've made it simple for you to understand everything.</p>
        </div>
        <div className="mx-auto max-w-[640px] px-4 pt-5">
          <div className="space-y-1 overflow-hidden rounded-2xl bg-gray-100" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            {PLAYBOOK_CARDS.map((c) => (
              <div key={c.t} className="flex items-center gap-3.5 bg-white px-5 py-3.5">
                <img src={c.icon} alt="" className="h-10 w-10 flex-shrink-0 object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-[#1F2933]">{c.t}</span>
                  <span className="block truncate text-[12.5px] text-[#9CA3AF]">{c.s}</span>
                </span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#9CA3AF]" />
              </div>
            ))}
          </div>
        </div>

        {/* ── The dark "Has anything changed?" pill (CheckInTrigger, Ask-Eva style) ── */}
        <div
          ref={pillRef}
          className="absolute bottom-5 right-5 flex items-center gap-3 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-5"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
        >
          <span className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(84,167,154,0.1)" }}>
            <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-[13.5px] font-medium text-[#1F2933]">Has anything changed?</span>
            <span className="block text-[11px] text-[#9CA3AF]">Takes about two minutes</span>
          </span>
        </div>

        {/* ── Dim + popup ── */}
        <div className="absolute inset-0 bg-[#0F172A] transition-opacity duration-500" style={{ opacity: modalOpen ? 0.45 : 0, pointerEvents: "none" }} />
        {modalOpen && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div
              className="w-[500px] rounded-2xl bg-white"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)", padding: "24px 34px", animation: "demoPopIn 0.35s cubic-bezier(0.3, 1.2, 0.4, 1) both" }}
            >
              <div key="ask" style={{ animation: "demoFadeUp 0.4s ease both" }}>
                <ModalEvaHeader
                  title={<>Have any of these events<br />happened in the last year?</>}
                />
                <div className="space-y-2">
                  <CheckItemRow label="Got married or engaged" />
                  <CheckItemRow label="Had or adopted a child (or grandchild)" checked={chkChild} targetRef={chkChildRef} />
                  <CheckItemRow label="Bought or sold a home or property" checked={chkHome} targetRef={chkHomeRef} />
                  <CheckItemRow label="Retired or changed careers" />
                </div>
                <div className="mt-6 flex w-full items-center justify-center rounded-xl py-3 font-medium text-white" style={{ backgroundColor: "#159a95", fontSize: 15 }}>
                  Next
                </div>
              </div>
            </div>
          </div>
        )}

        {/* The demo cursor — same clicker as SharingRecommendationVignette */}
        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: cursor.x,
            top: cursor.y,
            opacity: cursor.shown ? 1 : 0,
            transform: `translate(-2px, -2px) scale(${cursor.down ? 0.82 : 1})`,
            transition: "left 0.8s cubic-bezier(0.45,0.05,0.35,1), top 0.8s cubic-bezier(0.45,0.05,0.35,1), transform 0.15s, opacity 0.3s",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}>
            <path d="M5 3l14 8.5-6.5 1.5L10 19.5 5 3z" fill="#128F8B" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Scaled>
  );
};

/* 2 · Every client journey, one place — the roster, full bleed */
const JourneySegs = ({ step }: { step: number }) => (
  <span className="flex w-[96px] flex-shrink-0 gap-[4px]">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className="h-[4px] flex-1 rounded-full"
        style={{ backgroundColor: s < step ? "#128F8B" : s === step ? "rgba(18,143,139,0.3)" : "#E5E7EB" }}
      />
    ))}
  </span>
);

export const ClientJourneyVignette = () => (
  <Bleed font="attorney">
    <div className="flex items-center justify-between border-b border-[#EEF0F2] px-10 py-5">
      <div className="flex items-center gap-3">
        <span className="text-[20px] font-semibold text-[#1F2933]">Active clients</span>
        <span className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[15px] font-semibold text-[#6B7280]">10</span>
      </div>
      <span className="text-[16px] font-medium text-[#128F8B]">+ Add</span>
    </div>
    {[
      { n: "Daniel Rosen", i: "DR", step: 3, label: "Step 3 of 5 · Planning meeting", chip: null },
      { n: "Maria Rosen", i: "MR", step: 2, label: "Step 2 of 5 · Your information", chip: null },
      { n: "Elena Ruiz", i: "ER", step: 5, label: "Step 5 of 5 · Signing", chip: "Signing booked" },
      { n: "Marcus Webb", i: "MW", step: 4, label: "Step 4 of 5 · Review meeting", chip: null },
      { n: "Priya Anand", i: "PA", step: 1, label: "Step 1 of 5 · Engagement agreement", chip: null },
    ].map((r) => (
      <div key={r.n} className="flex flex-1 items-center justify-between gap-3 border-b border-[#EEF0F2] px-10 last:border-0">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6] text-[16px] font-semibold text-[#9CA3AF] ring-1 ring-black/5">{r.i}</span>
          <span>
            <span className="block text-[19px] font-semibold text-[#1F2933]">{r.n}</span>
            <span className="mt-1.5 flex items-center gap-2.5">
              <JourneySegs step={r.step} />
              <span className="text-[15px] text-[#9CA3AF]">{r.label}</span>
            </span>
          </span>
        </div>
        {r.chip && <span className="rounded-full bg-[#E6F5F4] px-3 py-1 text-[14px] font-semibold text-[#0C7370]">{r.chip}</span>}
      </div>
    ))}
  </Bleed>
);

/* 3 · Signing day — the ceremony roll call, full bleed */
export const SigningVignette = () => (
  <Bleed font="attorney">
    <div className="flex items-center justify-between border-b border-[#EEF0F2] px-10 py-6">
      <div>
        <div className="text-[21px] font-semibold text-[#1F2933]">Signing ceremony — the Rosen plan</div>
        <div className="mt-1 text-[15px] text-[#9CA3AF]">Led by Rachel Alvarez</div>
      </div>
      <span className="flex items-center gap-2 rounded-full bg-[#FEF2F2] px-3.5 py-1.5 text-[14px] font-semibold text-[#EF4444]">
        <span className="h-2 w-2 rounded-full bg-[#EF4444]" /> REC 12:41
      </span>
    </div>
    {[
      { n: "Daniel Rosen", role: "Testator", status: "Identity verified · signed", done: true, icon: <Check className="h-5 w-5" /> },
      { n: "Maria Rosen", role: "Spouse", status: "Identity verified · signed", done: true, icon: <Check className="h-5 w-5" /> },
      { n: "Jun Park", role: "Witness", status: "Present by video", done: true, icon: <Video className="h-5 w-5" /> },
      { n: "Mary Okafor", role: "Notary", status: "Applying seal…", done: false, icon: <Stamp className="h-5 w-5" /> },
    ].map((p) => (
      <div key={p.n} className="flex flex-1 items-center justify-between border-b border-[#EEF0F2] px-10 last:border-0">
        <div>
          <span className="text-[19px] font-semibold text-[#1F2933]">{p.n}</span>
          <span className="ml-3 text-[15px] text-[#9CA3AF]">{p.role}</span>
        </div>
        <span className={`flex items-center gap-2 text-[16px] font-medium ${p.done ? "text-[#059669]" : "text-[#9CA3AF]"}`}>
          {p.icon}
          {p.status}
        </span>
      </div>
    ))}
  </Bleed>
);

/* 4 · Accessible, safe, and understood — gifts + the remaining estate, from the summary library */
const GiftRow = ({ who, sub, gift, addr, pill, tone = "teal" }: { who: string; sub: string; gift: string; addr?: string; pill: string; tone?: "teal" | "amber" | "grey" }) => (
  <div className="grid grid-cols-[1.05fr_1.25fr_1.45fr] items-center gap-x-6 border-b border-[#F0F2F4] py-3 last:border-0">
    <span>
      <span className="block text-[15px] font-semibold text-[#1F2933]">{who}</span>
      <span className="text-[12.5px] text-[#9CA3AF]">{sub}</span>
    </span>
    <span>
      <span className="block text-[14px] text-[#4B5563]">{gift}</span>
      {addr && <span className="text-[12px] text-[#9CA3AF]">{addr}</span>}
    </span>
    <span>
      <span className={`inline-block rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tone === "amber" ? "bg-[#FBF3E4] text-[#92600A]" : tone === "grey" ? "bg-[#EEF0F2] text-[#4B5563]" : "bg-[#E6F5F4] text-[#0C7370]"}`}>{pill}</span>
    </span>
  </div>
);

export const AssetBreakdownVignette = () => (
  <Scaled w={900} h={650}>
    <div className="flex h-full w-full flex-col bg-white px-11 pt-9 pb-14 text-left" style={{ fontFamily: "Inter, sans-serif", height: 650 }}>
      <div className="grid grid-cols-[1.05fr_1.25fr_1.45fr] gap-x-6 border-b border-[#E5E7EB] pb-2.5 text-[13px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
        <span>Recipient</span><span>The Gift</span><span>Stipulations</span>
      </div>
      {[
        { who: "Emma Rosen", sub: "Your daughter", gift: "The lake house", addr: "14 Birchwood Lane, Lake George, NY", pill: "the mortgage is paid off first — arrives debt-free", tone: "amber" },
        { who: "Leo Rosen", sub: "Your son", gift: "The chalet", addr: "8 Stowe Hollow Road, Stowe, VT", pill: "the estate pays any tax on this — not them", tone: "amber" },
        { who: "Your nieces & nephews", sub: "A class gift", gift: "$25,000 each", addr: null, pill: "Passes to their descendants", tone: "grey" },
      ].map((g, idx, arr) => (
        <div key={g.who} className={`grid grid-cols-[1.05fr_1.25fr_1.45fr] items-center gap-x-6 py-4 ${idx < arr.length - 1 ? "border-b border-[#F0F2F4]" : ""}`}>
          <span>
            <span className="block text-[20px] font-semibold text-[#1F2933]">{g.who}</span>
            <span className="text-[15.5px] text-[#9CA3AF]">{g.sub}</span>
          </span>
          <span>
            <span className="block text-[17px] text-[#4B5563]">{g.gift}</span>
            {g.addr && <span className="text-[14px] text-[#9CA3AF]">{g.addr}</span>}
          </span>
          <span>
            <span className={`inline-block rounded-full px-3 py-1.5 text-[13.5px] font-semibold ${g.tone === "amber" ? "bg-[#FBF3E4] text-[#92600A]" : "bg-[#EEF0F2] text-[#4B5563]"}`}>{g.pill}</span>
          </span>
        </div>
      ))}
      <h4 className="mt-7 text-[26px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
        The Remaining Estate
      </h4>
      <div className="mt-3.5">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[20px] font-semibold text-[#1F2933]">Emma Rosen</span>
          <span className="text-[18px] font-semibold text-[#128F8B]">50%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full w-1/2 rounded-full bg-[#128F8B]" /></div>
        <div className="mt-1.5 text-[15.5px] text-[#9CA3AF]">Your daughter · <span className="inline-block rounded-full bg-[#E6F5F4] px-2.5 py-0.5 text-[13.5px] font-semibold text-[#0C7370]">held in trust until age 30</span></div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-[20px] font-semibold text-[#1F2933]">Leo Rosen</span>
          <span className="text-[18px] font-semibold text-[#128F8B]">50%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full w-1/2 rounded-full bg-[#128F8B]" /></div>
        <div className="mt-1.5 text-[15.5px] text-[#9CA3AF]">Your son · <span className="inline-block rounded-full bg-[#E6F5F4] px-2.5 py-0.5 text-[13.5px] font-semibold text-[#0C7370]">held in trust until age 30</span></div>
      </div>
    </div>
  </Scaled>
);

export const SharingRecommendationVignette = ({ h }: { h?: number } = {}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const optRef = useRef<HTMLDivElement>(null);
  const [willOn, setWillOn] = useState(true);
  const [chipLabel, setChipLabel] = useState<string | null>("Share when I've passed");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuChoice, setMenuChoice] = useState<"now" | "die">("now");
  const [cursor, setCursor] = useState({ x: 720, y: 420, down: false, shown: false });
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setWillOn(true);
      setChipLabel("Share when I've passed");
      return;
    }
    let alive = true;
    const isAlive = () => alive;
    let running = false;
    let played = false;
    let outSince: number | null = null;

    const centerOf = (el: HTMLElement | null) => {
      if (!el || !rootRef.current) return { x: 450, y: 250 };
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      let n: HTMLElement | null = el;
      while (n && n !== rootRef.current) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };
    const click = async () => {
      setCursor((c) => ({ ...c, down: true }));
      await demoWait(160, isAlive);
      setCursor((c) => ({ ...c, down: false }));
    };
    const glideTo = async (el: HTMLElement | null, ms: number) => {
      const pos = centerOf(el);
      setCursor((c) => ({ ...c, x: pos.x, y: pos.y }));
      await demoWait(ms, isAlive);
    };

    const play = async () => {
      if (running) return;
      running = true;
      played = true;
      // The will stays shared throughout — the demo only acts out choosing
      // WHEN it releases.
      setChipLabel("Share now");
      setMenuOpen(false);
      setCursor({ x: 720, y: 420, down: false, shown: false });
      await demoWait(700, isAlive);
      if (!alive) return;
      setCursor((c) => ({ ...c, shown: true }));
      await glideTo(chipRef.current, 900);
      await click();
      setMenuChoice("now");
      setMenuOpen(true);
      await demoWait(700, isAlive);
      await glideTo(optRef.current, 700);
      await click();
      setMenuChoice("die");
      await demoWait(350, isAlive);
      setMenuOpen(false);
      setChipLabel("Share when I've passed");
      await demoWait(600, isAlive);
      setCursor((c) => ({ ...c, shown: false }));
      running = false;
    };

    const io = new IntersectionObserver((entries) => {
      const inView = entries.some((e) => e.isIntersecting);
      if (inView) {
        if (!played) play();
        else if (outSince !== null && Date.now() - outSince >= 5000 && !running) play();
        outSince = null;
      } else if (played) {
        outSince = Date.now();
      }
    }, { threshold: 0.3 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [reduced]);

  const sectionLabel = { fontSize: 15, fontWeight: 600, letterSpacing: "0.06em" } as React.CSSProperties;
  const rowLabel = { fontSize: 21, fontWeight: 600 } as React.CSSProperties;
  const chip = (label: string) => (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#F2F2F7] px-4 py-2 text-[#1F2933]" style={{ fontSize: 15.5, fontWeight: 500 }}>
      {label}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
    </span>
  );
  const tick = (on: boolean, ref?: React.Ref<HTMLSpanElement>) => (
    <span ref={ref} className={`flex h-[27px] w-[27px] flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${on ? "bg-[#128F8B]" : "border border-[#D1D5DB] bg-white"}`}>
      {on && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
    </span>
  );

  return (
    <Scaled w={760} h={h ?? 660}>
      <div ref={rootRef} className="relative flex h-full w-full flex-col bg-white text-left" style={{ fontFamily: "Inter, sans-serif", height: h ?? 660, padding: "28px 48px 0" }}>
        <div className="relative w-full" style={{ marginBottom: 18 }}>
          <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-gray-200" style={{ top: 37 }} />
          <div className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center overflow-hidden rounded-full" style={{ width: 76, height: 76, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
            <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="text-center" style={{ paddingTop: 90 }}>
            <h4 className="mx-auto max-w-[640px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", fontSize: 29, lineHeight: 1.3, textWrap: "balance" }}>
              Let's make sure Maria is prepared
            </h4>
            <p className="mx-auto max-w-[560px] text-[#6B7280]" style={{ fontSize: 17.5, lineHeight: 1.55, marginTop: 8, textWrap: "balance" }}>
              Maria is your primary Executor. Choose what she can see.
            </p>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-b border-[#F0F1F3] pb-2">
          <span className="uppercase text-[#9CA3AF]" style={sectionLabel}>Official documents</span>
          <span className="uppercase text-[#9CA3AF]" style={{ ...sectionLabel, fontSize: 13 }}>When should we share access?</span>
        </div>
        <div className="flex items-center gap-4 border-b border-[#F0F1F3] py-4">
          {tick(willOn, tickRef)}
          <span className="flex-1 text-[#1F2933]" style={rowLabel}>Last Will &amp; Testament</span>
          {chipLabel && (
            <span ref={chipRef} className="relative inline-block">
              {chip(chipLabel)}
              {menuOpen && (
                <div
                  className="absolute right-0 z-20 mt-2 w-[300px] overflow-hidden rounded-2xl border border-[#E6F4F3] bg-white text-left"
                  style={{ boxShadow: "0 12px 32px rgba(18,143,139,0.14), 0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  <div className="px-4 pb-1.5 pt-3 uppercase tracking-wide text-[#9CA3AF]" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>
                    When should we share access?
                  </div>
                  <div className={`flex w-full items-start gap-3 px-4 py-3 transition-colors ${menuChoice === "now" ? "bg-[#F0F9F9]" : ""}`}>
                    <span className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors ${menuChoice === "now" ? "bg-[#128F8B]" : "border border-[#D1D5DB]"}`}>
                      {menuChoice === "now" && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>Share now</span>
                      <span className="block text-[#9CA3AF]" style={{ fontSize: 12, lineHeight: 1.45 }}>They can open this straight away.</span>
                    </span>
                  </div>
                  <div ref={optRef} className={`flex w-full items-start gap-3 border-t border-[#F0F1F3] px-4 py-3 transition-colors ${menuChoice === "die" ? "bg-[#F0F9F9]" : ""}`}>
                    <span className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors ${menuChoice === "die" ? "bg-[#128F8B]" : "border border-[#D1D5DB]"}`}>
                      {menuChoice === "die" && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>Share when I've passed</span>
                        <span className="inline-flex items-center rounded-full bg-[#E6F4F3] px-1.5 py-0.5 text-[#128F8B]" style={{ fontSize: 10.5, fontWeight: 600 }}>Recommended</span>
                      </span>
                      <span className="block text-[#9CA3AF]" style={{ fontSize: 12, lineHeight: 1.45 }}>Held until your passing is verified.</span>
                    </span>
                  </div>
                  <div className="flex w-full items-start gap-3 border-t border-[#F0F1F3] px-4 py-3">
                    <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border border-[#D1D5DB]" />
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <Plus className="h-3 w-3 flex-shrink-0 text-[#128F8B]" strokeWidth={2.5} />
                      <span className="text-[#1F2933]" style={{ fontSize: 14, fontWeight: 500 }}>Add a condition</span>
                    </span>
                  </div>
                </div>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 border-b border-[#F0F1F3] py-4">
          {tick(false)}
          <span className="flex-1 text-[#1F2933]" style={rowLabel}>Power of Attorney</span>
        </div>
        <div className="flex items-center gap-4 py-4">
          {tick(false)}
          <span className="flex-1 text-[#1F2933]" style={rowLabel}>Medical Proxy</span>
        </div>

        <div className="mt-5 border-b border-[#F0F1F3] pb-2 uppercase text-[#9CA3AF]" style={sectionLabel}>Supporting information</div>
        <div className="flex items-center gap-4 border-b border-[#F0F1F3] py-4">
          {tick(true)}
          <span className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-[#1F2933]" style={rowLabel}>Finance</span>
            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#F0F9F9] px-3 py-1 text-[#128F8B]" style={{ fontSize: 14, fontWeight: 600 }}>Recommended</span>
          </span>
          {chip("Share when I've passed")}
        </div>
        <div className="flex items-center gap-4 py-4">
          {tick(true)}
          <span className="flex min-w-0 flex-1 items-center gap-3">
            <span className="text-[#1F2933]" style={rowLabel}>Digital Life</span>
            <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#F0F9F9] px-3 py-1 text-[#128F8B]" style={{ fontSize: 14, fontWeight: 600 }}>Recommended</span>
          </span>
          {chip("Share when I've passed")}
        </div>

        {/* The demo cursor */}
        <div
          className="pointer-events-none absolute z-30"
          style={{
            left: cursor.x,
            top: cursor.y,
            opacity: cursor.shown ? 1 : 0,
            transform: `translate(-2px, -2px) scale(${cursor.down ? 0.82 : 1})`,
            transition: "left 0.8s cubic-bezier(0.45,0.05,0.35,1), top 0.8s cubic-bezier(0.45,0.05,0.35,1), transform 0.15s, opacity 0.3s",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}>
            <path d="M5 3l14 8.5-6.5 1.5L10 19.5 5 3z" fill="#128F8B" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Scaled>
  );
};

export const ComingBackVignette = () => (
  <Bleed font="client">
    <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
      <img src="/mock/eva.png" alt="" className="h-20 w-20 rounded-full object-cover" style={{ backgroundColor: "rgba(84,167,154,0.1)" }} />
      <h3 className="mt-6 max-w-[560px] text-[30px] font-semibold leading-snug text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", textWrap: "balance" }}>
        We'll connect you with the attorney who knows your family best.
      </h3>
      <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-relaxed text-[#6B7280]">
        Rachel Alvarez prepared your parents' estate plan — she already knows the people and the property involved.
      </p>
      <span className="mt-7 rounded-[10px] bg-[#128F8B] px-10 py-3.5 text-[17px] font-semibold text-white">Connect me</span>
    </div>
  </Bleed>
);

/* Reusable framed panel for placing a vignette on a page */
export const VignetteFrame = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-xl border border-gray-300 shadow-xl bg-white ${className}`} style={{ aspectRatio: "900 / 560" }}>
    {children}
  </div>
);
