import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Download, Plus } from "lucide-react";
import { Scaled } from "@/components/ProductVignettes";

/**
 * Coded vignettes for the For Clients page, recreated 1:1 from the clients
 * app (apps/clients + packages/ui): the plan playbook cards, the scenario
 * summary's succession rails and gift table, the trust milestone table, the
 * Shared tab's categories with section tabs and document cards, the
 * ShareItemList row + ReleaseSelector chip/panel, and the ContactModal
 * role-change card. Client surfaces: Inter, #128F8B, labels uppercase grey.
 *
 * All authored at the shared 900×560 design size and scaled to fill their
 * frame (position:relative parent with aspect-ratio 900/560).
 */

const VW = 900;
const VH = 560;

const Bleed = ({ bg = "#FFFFFF", children }: { bg?: string; children: React.ReactNode }) => (
  <Scaled w={VW} h={VH}>
    <div
      className="flex h-full w-full flex-col text-left text-[#1F2933]"
      style={{ fontFamily: "Inter, sans-serif", height: VH, backgroundColor: bg }}
    >
      {children}
    </div>
  </Scaled>
);

const Lbl = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF] ${className}`}>{children}</div>
);

/* The app's CardShell header: icon, 16px/600 title, grey subtitle */
const CardHead = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <div className="flex items-center gap-4 px-7 pb-4 pt-5">
    <img src={icon} alt="" className="h-12 w-12 flex-shrink-0 object-contain" />
    <div className="min-w-0 flex-1">
      <div className="mb-0.5 text-[16px] font-semibold text-[#1F2933]">{title}</div>
      <div className="text-[14px] text-[#9CA3AF]">{subtitle}</div>
    </div>
    <ChevronDown className="h-5 w-5 flex-shrink-0 rotate-180 text-[#6B7280]" />
  </div>
);

/* Frame treatment for the five summary chapters: a retro print fills the
   frame and the app UI floats as a smaller centred card over it. Each
   chapter carries its own print so the carousel never repeats one. */
const CoastCard = ({ w = 720, img = "/florida-coast.jpg", children }: { w?: number; img?: string; children: React.ReactNode }) => (
  <Bleed bg="#FAFBFC">
    <div className="relative h-full w-full">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white"
        style={{ width: w, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}
      >
        {children}
      </div>
    </div>
  </Bleed>
);

/* Succession chain — RoleChainView from the scenario summary, verbatim:
   uppercase office label, numbered 22px circles (first filled teal, later
   hollow) joined by a hairline, name with quiet relationship, caption under. */
const RoleChain = ({ role, steps }: { role: string; steps: { name: string; rel: string; caption: string }[] }) => (
  <div style={{ minWidth: 230, flex: "1 1 230px", maxWidth: "100%" }}>
    <Lbl>{role}</Lbl>
    <div className="mt-2">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <div key={s.name} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                  i === 0 ? "bg-[#128F8B] text-white" : "border border-[#CBD2D9] bg-white text-[#6B7280]"
                }`}
              >
                {i + 1}
              </span>
              {!last && <span className="my-1 w-px flex-1 bg-[#E1E5EA]" />}
            </div>
            <div className={last ? "" : "pb-4"} style={{ paddingTop: 1 }}>
              <div className="text-[15px] font-medium text-[#1F2933]">
                {s.name}
                {s.rel && <span className="ml-1.5 text-[12.5px] font-normal text-[#9CA3AF]">{s.rel}</span>}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[#9CA3AF]">{s.caption}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* 1 · Your team — executors and guardians the way the summary shows them:
      inside "What You'll Leave Behind", in relation to the will taking effect */
export const TeamRosterVignette = () => (
  <CoastCard img="/central-park.jpg">
    <CardHead
      icon="/mock/tree-icon.png"
      title="What You'll Leave Behind"
      subtitle="How your estate is managed and distributed"
    />
    <div className="flex flex-wrap gap-x-14 gap-y-7 px-7 pb-7">
      <RoleChain
        role="Executor"
        steps={[
          { name: "Claire Rosen", rel: "your sister", caption: "First choice" },
          { name: "Jun Park", rel: "your friend", caption: "Second in line — steps in if Claire Rosen can't serve" },
        ]}
      />
      <RoleChain
        role="Trustee"
        steps={[
          { name: "Claire Rosen", rel: "your sister", caption: "First choice" },
          { name: "Maria's parents", rel: "Emma and Leo's grandparents", caption: "Second in line — step in if Claire Rosen can't serve" },
        ]}
      />
    </div>
  </CoastCard>
);

/* 2 · If someone needs to step in — the incapacity card with the real
      teal-header powers table from the summary library */
export const StepInVignette = () => (
  <CoastCard img="/golden-gate.jpg">
    <div className="px-7 py-6">
      <div className="inline-flex items-center gap-5 border-b border-[#E5E7EB] pb-2">
        <span className="text-[14px] font-medium text-[#128F8B]">Power of Attorney</span>
        <span className="text-[14px] font-medium text-[#6B7280]">Health Care Proxy</span>
      </div>
      <div className="mt-4 flex gap-10">
        <div>
          <Lbl className="mb-1.5">Primary Agent</Lbl>
          <div className="text-[15px] font-medium text-[#1F2933]">Maria Rosen</div>
          <div className="mt-0.5 text-[13.5px] text-[#6B7280]">Your spouse</div>
        </div>
        <div>
          <Lbl className="mb-1.5">If primary can&apos;t serve</Lbl>
          <div className="text-[15px] font-medium text-[#1F2933]">Claire Rosen</div>
          <div className="mt-0.5 text-[13.5px] text-[#6B7280]">Your sister</div>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="flex rounded-t-xl bg-[#128F8B] text-white">
          <div className="w-[34%] flex-shrink-0 px-4 py-2 text-[12.5px] font-semibold">Power</div>
          <div className="flex-1 px-4 py-2 text-[12.5px] font-semibold">What this means</div>
        </div>
        {[
          { power: "Banks & Financial Institutions", desc: "Open and close accounts, make deposits and withdrawals" },
          { power: "Real Property", desc: "Buy, sell, lease, or manage property on your behalf" },
          { power: "Taxes", desc: "Prepare, file, and pay federal and state taxes" },
        ].map((row, i) => (
          <div key={row.power} className={`flex items-start border-b border-[#E5E7EB] ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}>
            <div className="w-[34%] flex-shrink-0 px-4 py-2.5 text-[13.5px] font-medium text-[#1F2933]">{row.power}</div>
            <div className="flex-1 px-4 py-2.5 text-[13.5px] leading-normal text-[#6B7280]">{row.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </CoastCard>
);

/* 3 · Who gets what — the ordered distribution story from the scenario summary */
export const WhoGetsWhatVignette = () => (
  <CoastCard>
    <div className="px-7 py-6">
      <div className="text-[15px] font-semibold text-[#1F2933]">1. Debts &amp; Taxes</div>
      <p className="mt-0.5 text-[13px] leading-normal text-[#6B7280]">
        Settled from the estate itself before anything is given out — no one below owes tax on their gift.
      </p>
      <div className="mt-3 text-[15px] font-semibold text-[#1F2933]">2. Gifts &amp; Bequests</div>
      <div className="mt-1.5 grid grid-cols-[1fr_1fr_1.5fr] gap-x-5 border-b border-[#E5E7EB] pb-1">
        <Lbl>Recipient</Lbl>
        <Lbl>The Gift</Lbl>
        <Lbl>Stipulations</Lbl>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1.5fr] items-center gap-x-5 border-b border-[#F0F2F4] py-2">
        <span>
          <span className="block text-[14px] font-semibold text-[#1F2933]">Maria Rosen</span>
          <span className="text-[12px] text-[#9CA3AF]">Your spouse</span>
        </span>
        <span className="text-[13.5px] text-[#4B5563]">The lake house</span>
        <span><span className="inline-block rounded-lg bg-[#FBF3E4] px-2 py-0.5 text-[12px] leading-snug text-[#92600A]">the mortgage is paid off first — arrives debt-free</span></span>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1.5fr] items-center gap-x-5 py-2">
        <span>
          <span className="block text-[14px] font-semibold text-[#1F2933]">Jun Park</span>
          <span className="text-[12px] text-[#9CA3AF]">Your friend</span>
        </span>
        <span className="text-[13.5px] text-[#4B5563]">$25,000</span>
        <span><span className="inline-block rounded-lg bg-[#E6F5F4] px-2 py-0.5 text-[12px] leading-snug text-[#0C7370]">the estate pays any tax on this — not him</span></span>
      </div>
      <div className="mt-2.5 text-[15px] font-semibold text-[#1F2933]">3. The Remaining Estate</div>
      <div className="mt-2">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[13.5px] font-medium text-[#1F2933]">Emma Rosen</span>
          <span className="text-[13.5px] font-semibold text-[#128F8B]">50%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full w-1/2 rounded-full bg-[#128F8B]" /></div>
        <div className="mt-1 text-[12.5px] text-[#9CA3AF]">Your daughter · <span className="inline-block rounded-full bg-[#E6F5F4] px-2 py-0.5 text-[11.5px] text-[#0C7370]">held in trust</span></div>
      </div>
      <div className="mt-2.5">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[13.5px] font-medium text-[#1F2933]">Leo Rosen</span>
          <span className="text-[13.5px] font-semibold text-[#128F8B]">50%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]"><div className="h-full w-1/2 rounded-full bg-[#128F8B]" /></div>
        <div className="mt-1 text-[12.5px] text-[#9CA3AF]">Your son · <span className="inline-block rounded-full bg-[#E6F5F4] px-2 py-0.5 text-[11.5px] text-[#0C7370]">held in trust</span></div>
      </div>
    </div>
  </CoastCard>
);

/* 4 · The trusts — the milestone table from the trust card: staged
      inheritance, each stage in plain words */
export const TrustVignette = () => (
  <CoastCard w={620} img="/santa-monica.jpg">
    {/* The trust popup's Payout Structure tab, verbatim: tab row on top,
        "How it pays out" subheader, teal milestone lead-ins with the amount
        on the trailing edge */}
    <div className="px-8 py-7">
      <div className="inline-flex items-center gap-6 border-b border-[#E5E7EB] pb-2.5 pr-6">
        <span className="text-[15px] font-medium text-[#6B7280]">Roles</span>
        <span className="text-[15px] font-medium text-[#6B7280]">What Goes In</span>
        <span className="text-[15px] font-medium text-[#128F8B]">Payout Structure</span>
        <span className="text-[15px] font-medium text-[#6B7280]">Good to Know</span>
      </div>
      <Lbl className="mt-4">How It Pays Out</Lbl>
      {[
        { lead: "Along the way", desc: "The trustee spends whenever it helps — for health, education and support.", amt: "As needed" },
        { lead: "At age 25", desc: "A first outright piece — a practice run at managing money.", amt: "25%" },
        { lead: "At age 30", desc: "Half of what remains is paid out.", amt: "50%" },
        { lead: "At age 35", desc: "Everything left is paid out and the trust ends.", amt: "Remainder" },
      ].map((m, i, arr) => (
        <div key={m.lead} className={`flex items-start justify-between gap-6 py-3 ${i < arr.length - 1 ? "border-b border-[#F0F1F3]" : ""}`}>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-[#128F8B]">{m.lead}</div>
            <div className="mt-0.5 text-[13.5px] leading-relaxed text-[#4B5563]">{m.desc}</div>
          </div>
          <div className="flex-shrink-0 text-[15px] font-semibold text-[#1F2933]">{m.amt}</div>
        </div>
      ))}
    </div>
  </CoastCard>
);


/* Solid document glyph — the same icon that sits beside "Plans signed" in the
   homepage hero (packages/ui signed-plans silhouette, check removed). */
const SolidDocIcon = ({ color, size = 17 }: { color: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill={color} className="flex-shrink-0">
    <path fillRule="evenodd" clipRule="evenodd" d="M7 2.5h6.5L18.6 7.6V19.4A2.1 2.1 0 0 1 16.5 21.5H7A2.1 2.1 0 0 1 4.9 19.4V4.6A2.1 2.1 0 0 1 7 2.5Zm6.6 1.1V6.8A1.1 1.1 0 0 0 14.7 7.9H17.9z" />
  </svg>
);

/* 5 · Your documents — the vault card: signed originals + past versions.
      Row icon is the solid signed-plans document glyph, matching the homepage hero. */
export const DocumentsVaultVignette = () => (
  <CoastCard img="/nyc-street.jpg">
    <CardHead
      icon="/mock/docs-icon.png"
      title="Your Documents"
      subtitle="Signed documents, recordings, and compliance files"
    />
    <div className="px-7 pb-5">
      <Lbl className="mb-0.5">Signed Estate Plan Documents</Lbl>
      {[
        { name: "Last Will and Testament", meta: "Signed August 18, 2026 · ceremony recording kept" },
        { name: "Power of Attorney", meta: "Signed August 18, 2026" },
        { name: "Medical Proxy", meta: "Signed August 18, 2026" },
      ].map((d) => (
        <div key={d.name} className="flex items-center gap-3 border-b border-[#F0F1F3] py-2.5 last:border-0">
          <SolidDocIcon color="#059669" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-medium text-[#1F2933]">{d.name}</div>
            <div className="text-[11.5px] text-[#9CA3AF]">{d.meta}</div>
          </div>
          <span className="text-[12.5px] font-semibold text-[#128F8B]">View</span>
        </div>
      ))}
      <Lbl className="mb-0.5 mt-3.5">Past Documents</Lbl>
      <div className="flex items-center gap-3 py-2.5 opacity-60">
        <SolidDocIcon color="#C4C9D0" />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-medium text-[#1F2933]">Last Will and Testament</div>
          <div className="text-[11.5px] text-[#9CA3AF]">Valid March 12, 2019 – August 18, 2026</div>
        </div>
        <span className="text-[12.5px] font-semibold text-[#9CA3AF]">View</span>
      </div>
    </div>
  </CoastCard>
);

/* ── Shared-tab building blocks, faithful to SharedTab.tsx ── */

const AvatarStack = () => (
  <span className="flex items-center">
    {["CR", "MR", "JP"].map((t, i) => (
      <span
        key={t}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F9F9] text-[10px] font-bold text-[#128F8B] ring-2 ring-white"
        style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}
      >
        {t}
      </span>
    ))}
  </span>
);

/* The Shared tab's DocumentCard — the illustrated document icon from the
   My Estate Plan card stack, no type pill */
const SupportingDocCard = ({ file, summary }: { file: string; summary: string }) => (
  <div className="w-full overflow-hidden rounded-xl border border-[#F0F1F3] bg-white text-left">
    <div className="flex items-center gap-4 px-5 py-4">
      <img src="/mock/docs-icon.png" alt="" className="h-9 w-9 flex-shrink-0 object-contain" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold text-[#1F2933]">{file}</div>
        <div className="mt-0.5 truncate text-[13px] leading-normal text-[#6B7280]">{summary}</div>
      </div>
      <Download className="h-[18px] w-[18px] flex-shrink-0 text-[#128F8B]" />
    </div>
  </div>
);

/* Pointer cursor for the self-playing sequences — minimal, willow teal.
   Fades out once its work is done. */
const Cursor = ({ x, y, pressed, moving, gone = false }: { x: number; y: number; pressed: boolean; moving: boolean; gone?: boolean }) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    className="absolute z-30"
    style={{
      left: x,
      top: y,
      opacity: gone ? 0 : 1,
      transform: pressed ? "scale(0.85)" : "none",
      transition: `left ${moving ? 0.7 : 0}s cubic-bezier(0.4,0,0.2,1), top ${moving ? 0.7 : 0}s cubic-bezier(0.4,0,0.2,1), transform 0.15s, opacity 0.6s`,
      filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
    }}
  >
    <path d="M5 3l14 8.5-6.3 1.4L9.5 19z" fill="#6B7280" strokeLinejoin="round" />
  </svg>
);

/* One-shot animation driver: waits until the vignette scrolls into view,
   plays the phase timeline once, and stays on the final phase. Under
   reduced motion it starts (and stays) there. */
const useOneShot = (steps: [number, string][], reduced: boolean) => {
  const finalPhase = steps[steps.length - 1][1];
  const [phase, setPhase] = useState(reduced ? finalPhase : "rest");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let started = false;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        steps.forEach(([ms, p]) => timers.push(window.setTimeout(() => setPhase(p), ms)));
        io.disconnect();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  return { phase, ref };
};

/* 6 · Gather — ONE category card, front and center: the cursor makes one
      small move to Children, clicks, and the card drops open. Stays open. */
const CAT_REST = { x: 700, y: 300 };
const CAT_CHILDREN = { x: 660, y: 140 };

export const CategoriesVignette = () => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { phase, ref } = useOneShot(
    [[600, "move"], [1400, "click"], [1650, "open"], [2400, "done"]],
    reduced
  );

  const expanded = phase === "open" || phase === "done";
  const cursor = phase === "rest" ? CAT_REST : CAT_CHILDREN;

  return (
    <Bleed bg="#FAFBFC">
      <div ref={ref} className="relative h-full w-full">
        {/* The willow-street print behind the card — softened so the card stays the subject */}
        <img src="/willow-street.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
        <div
          className="absolute left-1/2 w-[660px] -translate-x-1/2 overflow-hidden rounded-2xl bg-white"
          style={{ top: 96, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
        >
          <div className={`flex cursor-pointer items-center gap-5 px-8 py-5 transition-colors ${phase === "move" || phase === "click" ? "bg-[#F8FAFA]" : ""}`}>
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <img src="/mock/cat-children.png" alt="" className="h-11 w-11 object-contain" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-[17px] font-semibold text-[#1F2933]">Children</div>
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-[13.5px] text-[#9CA3AF]">Per-child info, education, guardian guidance, funds, pets</div>
                <AvatarStack />
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 flex-shrink-0 text-[#6B7280] transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </div>
          <div
            className="overflow-hidden"
            style={{ maxHeight: expanded ? 320 : 0, transition: reduced ? "none" : "max-height 0.55s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <div className="border-t border-[#F0F1F3] px-8 pt-4">
              <div className="flex items-center border-b border-[#E5E7EB]">
                <div className="flex flex-1">
                  {["Per-Child Info", "Education", "Guardian Guidance", "Funds", "Pets"].map((t) => (
                    <span
                      key={t}
                      className={`mr-6 whitespace-nowrap pb-2.5 text-[14px] font-medium ${
                        t === "Education" ? "border-b-2 border-[#128F8B] text-[#128F8B]" : "text-[#6B7280]"
                      }`}
                      style={{ marginBottom: -1 }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Plus className="mb-2.5 h-4 w-4 flex-shrink-0 text-[#D1D5DB]" />
              </div>
              <div className="flex flex-col gap-2.5 py-4">
                <SupportingDocCard
                  file="emma-iep-2026.pdf"
                  summary="Emma's Individualized Education Program — Lincoln Elementary, updated March 2026."
                />
                <SupportingDocCard
                  file="leo-iep-2026.pdf"
                  summary="Leo's IEP — speech therapy goals and classroom accommodations."
                />
              </div>
            </div>
          </div>
        </div>
        {!reduced && <Cursor x={cursor.x} y={cursor.y} pressed={phase === "click"} moving={phase === "move" || phase === "rest"} gone={phase === "done"} />}
      </div>
    </Bleed>
  );
};

/* ── ShareItemList row + ReleaseSelector chip/panel, faithful to the app ── */

const Tick = ({ on }: { on: boolean }) => (
  <span className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full ${on ? "bg-[#128F8B]" : "border border-[#D1D5DB]"}`}>
    {on && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
  </span>
);

const RecPill = () => (
  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[#F0F9F9] px-2 py-0.5 text-[10px] font-semibold text-[#128F8B]">Recommended</span>
);

const ReleaseChip = ({ label, active }: { label: string; active?: boolean }) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
      active ? "bg-[#E6F4F3] text-[#128F8B]" : "bg-[#F5F7F7] text-[#6B7280]"
    }`}
  >
    {label}
    <ChevronDown className={`h-3 w-3 ${active ? "rotate-180" : ""}`} />
  </span>
);

const ShareRow = ({ label, on, rec, chip, chipActive }: { label: string; on: boolean; rec?: boolean; chip?: string; chipActive?: boolean }) => (
  <div className="flex w-full items-center gap-2.5 border-b border-[#F0F1F3] py-2.5">
    <Tick on={on} />
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
      <span className="text-[14px] font-medium text-[#1F2933]">{label}</span>
      {rec && <RecPill />}
    </span>
    {on && chip && <ReleaseChip label={chip} active={chipActive} />}
  </div>
);

/* The ReleaseSelector panel, at the app's exact sizes */
const ReleasePanel = ({ sel, highlight }: { sel: number; highlight: boolean }) => {
  const rows = [
    { title: "Share now", desc: "They can open this straight away.", rec: false },
    { title: "Share when it springs", desc: "Held until a doctor confirms you can't decide for yourself.", rec: false },
    { title: "Share when I've passed", desc: "Held until your passing is verified.", rec: true },
  ];
  return (
    <div className="w-[292px] overflow-hidden rounded-2xl border border-[#E6F4F3] bg-white pt-1" style={{ boxShadow: "0 12px 32px rgba(18,143,139,0.14), 0 2px 8px rgba(0,0,0,0.06)" }}>
      {rows.map((row, i) => {
        const selected = i === sel;
        return (
          <div key={row.title} className={i > 0 ? "border-t border-[#F0F1F3]" : ""}>
            <div className={`flex w-full items-start gap-3 px-4 py-3 transition-colors ${selected ? "bg-[#F0F9F9]" : highlight && i === 2 ? "bg-[#F8FAFA]" : ""}`}>
              <span className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${selected ? "bg-[#128F8B]" : "border border-[#D1D5DB]"}`}>
                {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-[#1F2933]">{row.title}</span>
                  {row.rec && <span className="inline-flex items-center rounded-full bg-[#E6F4F3] px-1.5 py-0.5 text-[10px] font-semibold text-[#128F8B]">Recommended</span>}
                </span>
                <span className="block text-[11px] leading-snug text-[#9CA3AF]">{row.desc}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* 7 · Control — a zoomed-in ShareItemList row: the cursor opens the timing
      chip and picks when Maria may open the will. Plays once; stays open. */
const CHIP_POS = { x: 640, y: 208 };
const ROW3_POS = { x: 560, y: 420 };
const REST_POS = { x: 700, y: 300 };

export const ReleaseTimingVignette = () => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // rest → toChip → clickChip (panel opens) → toRow → clickRow (selection moves) → done
  const { phase, ref } = useOneShot(
    [[600, "toChip"], [1400, "clickChip"], [2200, "toRow"], [3000, "clickRow"], [3900, "done"]],
    reduced
  );
  const panelOpen = phase === "clickChip" || phase === "toRow" || phase === "clickRow" || phase === "done";
  const sel = phase === "clickRow" || phase === "done" ? 2 : 0;

  const cursor =
    phase === "rest" ? REST_POS
    : phase === "toChip" || phase === "clickChip" ? CHIP_POS
    : ROW3_POS;
  const pressed = phase === "clickChip" || phase === "clickRow";
  const chipLabel = sel === 2 ? "Share when I've passed" : "Share now";

  return (
    <Bleed bg="#FAFBFC">
      <div ref={ref} className="relative flex flex-1 items-center justify-center">
        {/* The NY skyline print behind the control — softened so the card stays the subject */}
        <img src="/nyc-skyline.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
        {/* Zoomed fragment of the contact card — Maria's "what she can see" list */}
        <div className="relative" style={{ transform: "scale(1.3)", transformOrigin: "center 40%" }}>
          <div className="w-[530px] rounded-2xl bg-white px-8 pb-4 pt-5" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>
            <div className="pb-2 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#6B7280]">When should we share access?</div>
            <div className="border-t border-[#F0F1F3]">
              <ShareRow label="Last Will & Testament" on rec chip={chipLabel} chipActive={panelOpen} />
              <ShareRow label="Revocable Living Trust" on rec chip="Share when I've passed" />
              <ShareRow label="Power of Attorney" on chip="Share when it springs" />
              <ShareRow label="Medical Proxy" on={false} />
            </div>
          </div>
          {/* The timing panel drops from the will's chip, exactly like the app */}
          <div
            className="absolute z-20"
            style={{
              right: 8,
              top: 64,
              opacity: panelOpen ? 1 : 0,
              transform: panelOpen ? "none" : "translateY(-6px)",
              transition: "opacity 0.25s, transform 0.25s",
              pointerEvents: "none",
            }}
          >
            <ReleasePanel sel={sel} highlight={phase === "toRow"} />
          </div>
        </div>
        {!reduced && <Cursor x={cursor.x} y={cursor.y} pressed={pressed} moving={phase === "toChip" || phase === "toRow" || phase === "rest"} gone={phase === "done"} />}
      </div>
    </Bleed>
  );
};

/* 8 · Stay current — the role-change review card (ContactModal with
      headerOverride), exactly as the app renders it */
/* 9 · Closing visual — a static life-update check-in in the app's popup
      grammar: Eva on a hairline, serif question, teal option rows. */
export const LifeUpdateVignette = () => (
  <Bleed bg="#FAFBFC">
    <div className="relative flex flex-1 items-center justify-center">
      <img src="/florida-coast.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
      <div className="relative w-[470px] rounded-2xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "26px 36px 30px", transform: "scale(1.25)" }}>
        <div className="relative w-full" style={{ marginBottom: 16 }}>
          <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-gray-200" style={{ top: 28 }} />
          <div className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full" style={{ width: 56, height: 56, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
            <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="text-center" style={{ paddingTop: 64 }}>
            <h3 className="mx-auto max-w-[380px] text-[21px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", lineHeight: 1.3 }}>
              Has anything changed since you signed?
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {["We bought a home", "We welcomed a child", "We moved to a new state"].map((t) => (
            <div key={t} className="flex items-center justify-between rounded-xl bg-[#F0F9F9] px-4 py-3">
              <span className="text-[14.5px] font-medium text-[#1F2933]">{t}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C7370" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center text-[13.5px] font-medium text-[#9CA3AF]">Nothing&apos;s changed</div>
      </div>
    </div>
  </Bleed>
);

/* 8b · Share a section — the SharingPopover exactly as the Shared tab opens it
      for the Finance category: ModalHeader ("Let's talk money"), tick-led person
      rows with the release-timing chip on the trailing edge once ticked, the
      Add-team-member row, then Done above a minimal Cancel. One-shot: the cursor
      adds Jun, whose chip appears on his recommendation. */
const SHARE_REST = { x: 660, y: 300 };
const SHARE_JUN = { x: 372, y: 451 };

export const SectionShareVignette = () => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { phase, ref } = useOneShot(
    [[600, "move"], [1400, "click"], [1650, "picked"], [2400, "done"]],
    reduced
  );
  const junOn = phase === "picked" || phase === "done";
  const cursor = phase === "rest" ? SHARE_REST : SHARE_JUN;

  return (
    <Bleed bg="#FAFBFC">
      <div ref={ref} className="relative flex flex-1 items-center justify-center">
        <img src="/central-park.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
        <div className="relative w-[470px] rounded-2xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "24px 34px 24px", transform: "scale(1.3)" }}>
          {/* ModalHeader, verbatim: portrait on the hairline, serif title, one line */}
          <div className="relative w-full" style={{ marginBottom: 21 }}>
            <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-gray-200" style={{ top: 28 }} />
            <div className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full" style={{ width: 56, height: 56, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
              <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="text-center" style={{ paddingTop: 69 }}>
              <h3 className="mx-auto max-w-[420px] text-[21px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", lineHeight: 1.3 }}>
                Let&apos;s handle your finances
              </h3>
              <p className="mx-auto max-w-[380px] text-[14px] text-[#6B7280]" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Select who should have access
                <br />
                to your financial information.
              </p>
            </div>
          </div>
          <div className="border-t border-[#F0F1F3]">
            <ShareRow label="Maria Rosen" on rec chip="Share now" />
            <ShareRow label="Claire Rosen" on chip="Share when I've passed" />
            <div data-jun className={`transition-colors ${phase === "move" || phase === "click" ? "bg-[#F8FAFA]" : ""}`}>
              <ShareRow label="Jun Park" on={junOn} chip={junOn ? "Share when I've passed" : undefined} />
            </div>
          </div>
        </div>
        {!reduced && <Cursor x={cursor.x} y={cursor.y} pressed={phase === "click"} moving={phase === "move" || phase === "rest"} gone={phase === "done"} />}
      </div>
    </Bleed>
  );
};

const CLAIRE_REST = { x: 680, y: 300 };
const CLAIRE_CHILDREN = { x: 540, y: 448 };

export const RoleChangeVignette = () => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { phase, ref } = useOneShot(
    [[600, "move"], [1400, "click"], [1650, "picked"], [2400, "done"]],
    reduced
  );
  const childrenOn = phase === "picked" || phase === "done";
  const cursor = phase === "rest" ? CLAIRE_REST : CLAIRE_CHILDREN;

  return (
    <Bleed bg="#FAFBFC">
      <div ref={ref} className="relative flex flex-1 items-center justify-center">
        {/* The river-bridge print behind the card — same treatment as its siblings */}
        <img src="/hudson-bridge.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
        {/* Zoomed like the Control card so the content reads large */}
        <div className="relative w-[490px] rounded-2xl bg-white" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "26px 36px 24px", transform: "scale(1.3)" }}>
          {/* ModalHeader: portrait centred on a hairline, serif title, one line under */}
          <div className="relative w-full" style={{ marginBottom: 14 }}>
            <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-gray-200" style={{ top: 28 }} />
            <div className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full" style={{ width: 56, height: 56, top: 0, backgroundColor: "rgba(84,167,154,0.1)" }}>
              <img src="/mock/eva.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="text-center" style={{ paddingTop: 64 }}>
              <h3 className="mx-auto max-w-[420px] text-[20px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif", lineHeight: 1.3 }}>
                Claire&apos;s responsibilities have changed
              </h3>
              <p className="mx-auto max-w-[380px] text-[13.5px] leading-relaxed text-[#6B7280]" style={{ marginTop: 6 }}>
                Claire is now Emma and Leo&apos;s guardian. Choose what she can see.
              </p>
            </div>
          </div>
          <div className="pb-1.5 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">Official documents</div>
          <div className="border-t border-[#F0F1F3]">
            <ShareRow label="Last Will & Testament" on chip="Share when I've passed" />
          </div>
          <div className="pb-1.5 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#9CA3AF]">Supporting information</div>
          <div className="border-t border-[#F0F1F3]">
            <div className={`transition-colors ${phase === "move" || phase === "click" ? "bg-[#F8FAFA]" : ""}`}>
              <ShareRow label="Children" on={childrenOn} rec chip="Share now" />
            </div>
          </div>
        </div>
        {!reduced && <Cursor x={cursor.x} y={cursor.y} pressed={phase === "click"} moving={phase === "move" || phase === "rest"} gone={phase === "done"} />}
      </div>
    </Bleed>
  );
};

/* Staying organized — three clients, three different next steps. Two are
   waiting on the client; one needs the attorney, and carries the CTA.
   Deliberately compact: the card takes only the room it needs, letting the
   print breathe around it. */
const StepSegs = ({ step }: { step: number }) => (
  <span className="flex w-[84px] flex-shrink-0 gap-[3px]">
    {[1, 2, 3, 4, 5].map((n) => (
      <span
        key={n}
        className="h-[3.5px] flex-1 rounded-full"
        style={{ backgroundColor: n < step ? "#128F8B" : n === step ? "rgba(18,143,139,0.3)" : "#E5E7EB" }}
      />
    ))}
  </span>
);

export const NextStepsVignette = () => (
  <CoastCard w={600} img="/hudson-bridge.jpg">
    <div className="px-7 pb-3 pt-6">
      <div className="flex items-baseline justify-between border-b border-[#F0F1F3] pb-3.5">
        <span className="text-[19px] font-semibold text-[#1F2933]" style={{ fontFamily: "Merriweather, Georgia, serif" }}>
          Your active clients
        </span>
        <span className="text-[13px] font-medium text-[#128F8B]">View all 10</span>
      </div>
      {[
        {
          n: "Daniel Rosen", i: "DR", step: 2,
          next: "Daniel is completing his information",
          chip: "With Daniel",
        },
        {
          n: "Elena Ruiz", i: "ER", step: 5,
          next: "Elena is picking her signing time",
          chip: "With Elena",
        },
        {
          n: "Marcus Webb", i: "MW", step: 4,
          next: "His plan summary is ready for your review",
          cta: "Handle this now",
        },
      ].map((r, idx, arr) => (
        <div key={r.n} className={`flex items-center gap-3.5 py-3.5 ${idx < arr.length - 1 ? "border-b border-[#F0F1F3]" : ""}`}>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[13.5px] font-semibold text-[#9CA3AF] ring-1 ring-black/5">{r.i}</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2.5">
              <span className="text-[15.5px] font-semibold text-[#1F2933]">{r.n}</span>
              <StepSegs step={r.step} />
            </span>
            <span className="mt-0.5 block truncate text-[13px] text-[#9CA3AF]">Next step: {r.next}</span>
          </span>
          {r.chip && (
            <span className="flex-shrink-0 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#6B7280]">{r.chip}</span>
          )}
          {r.cta && (
            <span className="flex-shrink-0 rounded-[9px] bg-[#128F8B] px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0F7673]">{r.cta}</span>
          )}
        </div>
      ))}
    </div>
  </CoastCard>
);
