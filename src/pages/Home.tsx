import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttorneyQuotes from "@/components/AttorneyQuotes";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SharingHomeShot } from "@/components/ClientVignettes";
import { Link } from "react-router-dom";
import {
  CheckInDemoVignette,
  ClientDetailJourneyVignette,
  ActiveClientsNextStepsVignette,
  SigningVignette,
  AssetBreakdownVignette,
  SharingRecommendationVignette,
} from "@/components/ProductVignettes";

import { ScaledScreen } from "@/components/product/kit";
import { PageHero, PrintFrame } from "@/components/site/blocks";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";
import { AttorneyClientsScreen } from "@/components/product/attorney-clients";
import { ClientEstatePlanTodayScreen } from "@/components/product/client-app";

// Rotating phrases for the hero, as on willow-inc.com ("their plan" singular,
// at Aaron's word, Nov 17). The stem commands the attorney ("Ensure your
// clients…"), so every phrase is an outcome they guarantee by using Willow.
// In the centred hero (Nov 25) every phrase is one line on desktop, so
// "never lose a document." no longer breaks after "lose": a two-line phrase
// would leave an empty line under all the others.
// Every phrase sits in the same grid cell, so the headline is always as tall
// as its longest phrase at the current width and never jumps as they change.
const HERO_PHRASES = [
  "actually understand their\u00A0plan.",
  "can sign from anywhere.",
  "never lose a\u00A0document.",
  "keep executors and guardians prepared.",
  "keep coming back to\u00A0you.",
]

const ROTATE_MS = 2800;

const HeroRotator = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => {
        setPrevIndex(i);
        return (i + 1) % HERO_PHRASES.length;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    // The padding/negative margin pair widens the clip box so descenders and
    // italic overhangs aren't cut, without changing the layout.
    <span className="-my-[0.12em] grid overflow-hidden py-[0.12em] pr-[0.1em] italic text-[#138F8B]">
      {HERO_PHRASES.map((p, i) => (
        <span
          key={p}
          aria-hidden={i !== index}
          className="[grid-area:1/1]"
          style={{
            textWrap: "balance",
            whiteSpace: "pre-line",
            transform: i === index ? "translateY(0)" : i === prevIndex ? "translateY(-110%)" : "translateY(110%)",
            opacity: i === index ? 1 : 0,
            transition: reduced ? "none" : "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",
          }}
        >
          {p}
        </span>
      ))}
    </span>
  );
};

/* One product shot under the hero, in the same print as the For attorneys and
   For clients heroes (PrintFrame: the screen's own proportions, an even 4%
   mat), so the three pages open alike (Aaron, Nov 25). The screen is the
   attorney's Clients page, recreated from the product code, with Daniel
   Rosen's panel open beside the dimmed list, as it is after clicking a client
   in the product. */
const HeroShot = () => (
  <PrintFrame print="/golden-gate.jpg" aspect="1440 / 855" className="shadow-2xl">
    <div
      role="img"
      aria-label="The Willow Clients page: clients and couples with joint accounts, and one client's estate plan documents open beside the list."
      className="absolute inset-0 bg-[#F0F2F5]"
    >
      <ScaledScreen>
        <AttorneyClientsScreen open />
      </ScaledScreen>
    </div>
  </PrintFrame>
);

/* Two doors, as on harvey.ai: hovering a card widens it to a 1.4 share of the
   row and dims its neighbour (.aud-row / .aud-card in index.css). Each card
   goes to the overview its menu heading goes to (Platform > For attorneys,
   Platform > For clients & their team). The body lines and the clients
   button are lines from the live homepage. The attorney
   dashboard and the client's estate plan, both product screens already on
   willow-inc.com, drawn wider than the card, so widening shows more of them. */
const AUDIENCES: { title: string; body: string; cta: string; to: string; image: string; shot: React.ReactNode }[] = [
  {
    title: "For attorneys",
    body: "Every client, organized from engagement to signing.",
    cta: "Explore Willow for attorneys",
    to: "/platform",
    image: "/nyc-skyline.jpg",
    shot: (
      <div className="relative w-[130vw] max-w-[1440px] min-[1025px]:w-[68vw]" style={{ aspectRatio: "1440 / 855" }}>
        <ScaledScreen>
          <AttorneyDashboardScreen />
        </ScaledScreen>
      </div>
    ),
  },
  {
    title: "For clients",
    body: "Learn how we keep your clients connected.",
    cta: "Explore the client experience",
    to: "/for-clients",
    image: "/west-side-hwy.jpg",
    shot: (
      <div className="relative w-[130vw] max-w-[1440px] min-[1025px]:w-[68vw]" style={{ aspectRatio: "1440 / 855" }}>
        <ScaledScreen>
          <ClientEstatePlanTodayScreen />
        </ScaledScreen>
      </div>
    ),
  },
];

/* Set on harvey.ai's AudienceRouterSection: heading-2 and a 560px sentence
   (the heading Aaron asked to have back, Nov 23), then a row that is twice as wide as it
   is tall from 1025px (stacked 3:4 cards below that, at most 500px tall). Every
   line on the cards is from the live homepage, apart from the two titles. Each card's print is
   pinned to its outer edge at 5:4, so it doesn't move as the card widens. */
const AudienceRouter = () => (
  <section className="bg-[#FCFCFD] pb-6 md:pb-10 min-[1025px]:pb-14">
    <div className="hv-wrap hv-grid">
      <div className="hv-content">
        <div className="col-span-full flex flex-col gap-[var(--hv-lg)]">
          <div className="flex flex-col items-center gap-[var(--hv-sm)] text-center">
            <h2 className="hv-h2 font-heading font-light text-[#222222]">
              One platform, <span className="text-[#138F8B]">for the attorney and the family.</span>
            </h2>
            <p className="hv-body-2 max-w-[560px] text-gray-600">
              Attorneys run every client relationship from one place. Clients and the people they name get a plan they understand, shared on their terms.
            </p>
          </div>

          <div className="aud-row flex flex-col gap-[var(--hv-sm)] overflow-hidden min-[1025px]:aspect-[2/1] min-[1025px]:flex-row">
            {AUDIENCES.map((a, i) => (
              <Link
                key={a.to}
                to={a.to}
                className="aud-card group relative flex aspect-[3/4] max-h-[500px] flex-1 flex-col overflow-hidden rounded-[8px] text-white min-[1025px]:aspect-auto min-[1025px]:max-h-none"
              >
                <div className={`absolute inset-0 min-[1025px]:aspect-[5/4] ${i === 0 ? "min-[1025px]:right-auto" : "min-[1025px]:left-auto"}`}>
                  <img src={a.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
                <div className="relative flex flex-col items-start gap-[var(--hv-sm)] px-[var(--hv-md)] pt-[var(--hv-md)]">
                  <h3 className="hv-h3 font-heading font-normal min-[1025px]:max-w-[420px]">{a.title}</h3>
                  <p className="hv-body-2 max-w-[480px] text-white/85 min-[1025px]:max-w-[300px]">{a.body}</p>
                  <span className="inline-flex h-8 w-max items-center rounded-[4px] border border-white/80 px-3 text-[13px] font-medium transition-colors duration-300 group-hover:bg-white/10">
                    {a.cta}
                  </span>
                </div>
                <div className="relative mt-[var(--hv-md)] pl-[var(--hv-md)]">
                  <div className="w-max overflow-hidden rounded-tl-[8px] bg-white min-[1025px]:ml-12" style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)" }}>
                    {a.shot}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// The four core capabilities. Left list activates as you scroll; the
// screenshots on the right slide up and stack over one another.
const CAPABILITIES: { title: string; body: string; print: string; visual: React.ReactNode; fitAspect?: string; fitWidth?: string }[] = [
  {
    title: "Every client, organized from engagement to signing.",
    body:
      "See who's waiting on you and who you're waiting on. Send documents straight to your client's portal, so everything for the matter lives in one place.",
    print: "/central-park.jpg",
    visual: <ActiveClientsNextStepsVignette />,
    fitAspect: "900 / 400",
  },
  {
    title: "Sign digitally from anywhere, or right in your office.",
    body:
      "Every signature is captured digitally, whether your client is across the country or across your conference table. No paper to lose. (Remote signing available in select states.)",
    print: "/golden-gate.jpg",
    visual: (
      <div className="absolute inset-0">
        <img src="/lovable-uploads/Signing Product Shot.png" alt="Willow digital signing ceremony" className="h-full w-full object-cover object-center" />
      </div>
    ),
    fitAspect: "2056 / 1258",
  },
  {
    title: "Keep every document safe and easy to understand.",
    body:
      "Signed documents live in secure online storage built around your state's regulations, with every gift, condition, and account written out in language the family can follow.",
    print: "/florida-coast.jpg",
    visual: <AssetBreakdownVignette />,
    fitAspect: "900 / 650",
  },
  {
    title: "Ensure your executors and guardians are prepared.",
    body:
      "Willow understands everyone's role, recommends what each person should have access to, and releases it exactly when they need it, never a day earlier.",
    print: "/hudson-bridge.jpg",
    visual: <SharingRecommendationVignette h={660} />,
    fitAspect: "760 / 660",
    fitWidth: "76%",
  },
  {
    title: "Grow client relationships and build new ones with their families.",
    body:
      "As your client's life moves forward, you always stay in the loop. When their executors, guardians, and the people around them need plans of their own, we'll put them in touch with the attorney who knows their family best.",
    print: "/willow-street.jpg",
    visual: <CheckInDemoVignette h={520} />,
    fitAspect: "900 / 520",
  },
];

const StackedCapabilities = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = CAPABILITIES.length;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    const onScroll = () => {
      if (!trackRef.current || !isDesktop() || reduced) return;
      const rect = trackRef.current.getBoundingClientRect();
      const total = trackRef.current.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const prog = Math.max(0, Math.min(0.999, -rect.top / total)) * n;
      // Incoming cards start below the SCREEN and travel up into the frame,
      // not out of the frame's own bottom edge
      const visual = panelRefs.current[0]?.parentElement;
      const offscreen = visual ? window.innerHeight - visual.getBoundingClientRect().top + 60 : 800;
      panelRefs.current.forEach((panel, j) => {
        if (!panel) return;
        if (j === 0) {
          panel.style.transform = `scale(${1 - 0.03 * Math.max(0, Math.min(2, prog))})`;
          return;
        }
        const t = Math.max(0, Math.min(1, j - prog));
        const sc = 1 - 0.03 * Math.max(0, Math.min(2, prog - j));
        panel.style.transform = `translateY(${t * offscreen}px) scale(${sc})`;
      });
      setActive(Math.min(n - 1, Math.floor(prog)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [n, reduced]);

  return (
    <>
      {/* Section intro — scrolls away before the pin, like General Magic */}
      <div className="container mx-auto px-4 pt-14 md:px-6 md:pt-16 lg:px-10 max-w-7xl">
        <div className="flex items-center gap-3 text-[15px] font-semibold uppercase tracking-widest text-gray-500">
          <span className="w-6 h-1.5 rounded-full bg-[#138F8B]" />
          Core capabilities
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-heading font-bold text-[#222222] mt-3 max-w-3xl" style={{ lineHeight: 1.25 }}>
          Purpose-built for estate attorneys and the families they protect.
        </h2>
      </div>

      {/* Desktop: pinned scrollytelling — half copy, half product image. Only
          with motion allowed: it works by sliding each print up over the last,
          and without the slide the waiting prints sat below the frame, on top
          of the next section. */}
      {!reduced && (
      <div ref={trackRef} className="relative hidden md:block" style={{ height: `${n * 55 + 100}vh`, marginTop: -60 }}>
        <div className="sticky top-0 flex h-screen flex-col" style={{ paddingTop: 76 }}>
          <div className="flex flex-1 items-center min-h-0">
          <div className="container mx-auto px-6 lg:px-10 max-w-7xl grid md:grid-cols-[38.2fr_61.8fr] gap-8 lg:gap-10 items-center w-full">
            <div className="flex flex-col">
              {CAPABILITIES.map((cap, i) => (
                <div key={cap.title} className={`py-4 ${i === 0 ? "border-t-2 border-[#222222]" : "border-t border-gray-200"}`}>
                  <h3
                    className={`font-heading font-bold text-xl lg:text-2xl transition-colors duration-300 cursor-default ${
                      i === active ? "text-[#222222]" : "text-gray-400"
                    }`}
                  >
                    {cap.title}
                  </h3>
                  {/* Accordion: one open at a time. Max-height and fade share one easing
                      so the expanding item absorbs the collapsing one without a visible jump. */}
                  {/* One shared duration + easing for closing and opening bodies:
                      the expanding item absorbs the collapsing one, so the list
                      makes a single curtain-pull movement in step with the image. */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: i === active ? "10.5rem" : 0,
                      transition: "max-height 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <p
                      className="text-[17px] lg:text-lg text-gray-600 leading-relaxed mt-2.5 pr-2"
                      style={{
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? "none" : "translateY(10px)",
                        transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {cap.body}
                    </p>
                  </div>
                  {i === CAPABILITIES.length - 1 && (
                    <Button
                      className="willow-btn mt-6 h-10 px-5 text-[15px] font-medium"
                      onClick={() => (window.location.href = "/request-access")}
                    >
                      Let's get started
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="relative w-full justify-self-end" style={{ aspectRatio: "1 / 1", maxHeight: "calc(100vh - 170px)", maxWidth: "min(100%, calc(100vh - 170px))" }}>
              {CAPABILITIES.map((cap, i) => (
                <div
                  key={cap.title}
                  ref={(el) => (panelRefs.current[i] = el)}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: i === 0 ? "none" : "translateY(110%)", zIndex: i }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl">
                    <img src={cap.print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white ${cap.fitAspect ? "" : "h-[70%]"}`}
                      style={{ width: cap.fitWidth ?? "92%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", ...(cap.fitAspect ? { aspectRatio: cap.fitAspect } : {}) }}
                    >
                      {cap.visual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
      )}

      {/* Phones, and any screen with reduced motion: a still list, each
          capability beside its print from 768px */}
      <div className={`${reduced ? "" : "md:hidden"} container mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-6 pt-10 md:gap-20 md:px-6 md:pb-16 md:pt-14 lg:px-10`}>
        {CAPABILITIES.map((cap, i) => (
          <div key={cap.title} className="md:grid md:grid-cols-[38.2fr_61.8fr] md:items-center md:gap-8 lg:gap-10">
            <div className="md:border-t md:border-gray-200 md:pt-4">
              <h3 className="font-heading font-bold text-xl text-[#222222] mb-2 lg:text-2xl">{cap.title}</h3>
              <p className="text-[17px] text-gray-600 leading-relaxed mb-4 lg:text-lg">{cap.body}</p>
              {i === CAPABILITIES.length - 1 && (
                <Button
                  className="willow-btn mt-2 hidden h-10 px-5 text-[15px] font-medium md:inline-flex"
                  onClick={() => (window.location.href = "/request-access")}
                >
                  Let's get started
                </Button>
              )}
            </div>
            <div className="relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl md:max-w-[560px] md:justify-self-end" style={{ aspectRatio: "1 / 1" }}>
              <img src={cap.print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.22)" }} />
              <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white ${cap.fitAspect ? "" : "h-[70%]"}`}
                style={{ width: cap.fitWidth ?? "92%", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", ...(cap.fitAspect ? { aspectRatio: cap.fitAspect } : {}) }}
              >
                {cap.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};


/* ── FAQ — what lawyers want to know. Line-based (no boxes), accordion on the
     left, heading + contact on the right. Content carried over from the
     existing lawyer FAQ, plus the signing-is-optional question. ── */
const FAQ_ITEMS: { topic: "practice" | "compliance"; q: string; a: string[] }[] = [
  {
    topic: "practice",
    q: "Do my clients have to sign through Willow?",
    a: [
      "No. Digital execution is optional and available in select states.",
      "Keep your signing ceremony exactly as it is today (pen, paper, conference room), then upload the executed documents. Your clients still get everything else: plain-language summaries, secure storage, sharing on their terms, and a plan that stays current for life.",
    ],
  },
  {
    topic: "practice",
    q: "How can I get started?",
    a: [
      "It starts with a short conversation.",
      "We take time to understand your practice and jurisdiction to ensure your firm is a good fit. From there, we guide you through a brief onboarding call, walk through the platform, and answer any questions before you begin using Willow with clients. No process overhaul, just a better way to deliver what you already do.",
    ],
  },
  {
    topic: "practice",
    q: "Does Willow help create estate planning documents?",
    a: [
      "You remain fully responsible for advising clients and drafting estate planning documents.",
      "Willow does not provide legal advice. Instead, we support the execution, storage, and long-term management of the documents you prepare, allowing you to focus your time on what you do best while we help elevate the client experience.",
    ],
  },
  {
    topic: "practice",
    q: "How does the signing ceremony work, and can I tailor it to my practice?",
    a: [
      "Willow supports attorney-led digital execution that aligns with state requirements around witnessing, recordings, and notarization. You remain in control of the ceremony and can pause at any time or build in breaks to review materials with your client.",
      "For practices that prefer a more tailored approach, we can support custom execution flows built around existing regulations. Our goal is to make digital execution compliant and reliable without forcing you into a one-size-fits-all format.",
    ],
  },
  {
    topic: "practice",
    q: "Who can access my clients' documents?",
    a: [
      "Access is fully controlled by the client.",
      "Only individuals the client explicitly authorizes, such as family members, executors, or fiduciaries, can view documents through their own secure accounts. Permissions can be granted or revoked at any time, ensuring access remains intentional and appropriate.",
    ],
  },
  {
    topic: "practice",
    q: "How does Willow support revisiting plans over time?",
    a: [
      "As life moves forward, Willow helps surface natural moments when an update may be needed and routes clients back to their attorney.",
      "Clients can book time directly through your connected calendar, and both you and the client receive reminders along with a clear summary of relevant background and documents ahead of the conversation.",
    ],
  },
  {
    topic: "compliance",
    q: "Are there estate planning lawyers on the Willow team?",
    a: [
      "Yes. Our team includes estate planning attorneys with over 35 years of combined experience.",
      "They help shape our workflows, compliance standards, and long-term storage practices to ensure the platform aligns with how estate planning is practiced in the real world. Willow does not provide legal advice, and you remain the attorney of record.",
    ],
  },
  {
    topic: "compliance",
    q: "Is Willow compliant with applicable state laws?",
    a: [
      "Yes. Willow operates only in states where electronic wills are legally recognized, and all execution and storage workflows are designed to align with applicable state law.",
    ],
  },
  {
    topic: "compliance",
    q: "How are documents and recordings stored long term?",
    a: [
      "Our storage is designed for long-term reliability, ensuring signed documents and required supporting materials are securely preserved over time.",
    ],
  },
  {
    topic: "compliance",
    q: "What happens if Willow is no longer operating?",
    a: [
      "Like any law practice planning for continuity, Willow maintains a formal succession plan in the unlikely event we no longer offer our services.",
      "In that situation, custodianship of each will and its associated records would be transferred in accordance with applicable state standards, and the decision about where a will is transferred always remains with the client.",
    ],
  },
];

const FaqSection = () => {
  const [topic, setTopic] = useState<"practice" | "compliance">("practice");
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQ_ITEMS.filter((i) => i.topic === topic);
  const pick = (t: "practice" | "compliance") => {
    setTopic(t);
    setOpen(null);
  };
  return (
    <section className="bg-[#FCFCFD] py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Accordion — lines, not boxes */}
          <div className="order-2 md:order-1 md:w-3/5">
            {/* Topic tabs — the professional underline pattern from the product's tab bars */}
            <div className="mb-4 flex gap-7 border-b border-gray-200">
              {([["practice", "Your Practice"], ["compliance", "Compliance"]] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => pick(key)}
                  className={`relative pb-3 text-[16px] font-medium transition-colors ${topic === key ? "text-[#138F8B]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {label}
                  {topic === key && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#138F8B]" />}
                </button>
              ))}
            </div>
            {items.map((item, i) => (
              <div key={item.q} className="border-b border-gray-200">
                <button
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-heading text-xl md:text-2xl font-semibold text-[#222222]" style={{ lineHeight: 1.25 }}>{item.q}</span>
                  <span className="flex-shrink-0 text-2xl leading-none text-gray-400" aria-hidden>
                    {open === i ? "×" : "+"}
                  </span>
                </button>
                <div
                  className="overflow-hidden"
                  style={{ maxHeight: open === i ? "24rem" : 0, transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)" }}
                >
                  <div className="pb-6 pr-8">
                    {item.a.map((para) => (
                      <p key={para.slice(0, 24)} className="mb-3 max-w-2xl text-[17px] md:text-lg leading-relaxed text-gray-600 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Heading + contact */}
          <div className="order-1 md:order-2 md:w-2/5 md:pl-6">
            <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">FAQ</div>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-[#222222]" style={{ lineHeight: 1.25 }}>
              Common Questions
            </h2>
            <p className="mt-4 max-w-sm text-[17px] md:text-lg leading-relaxed text-gray-600">
              Still can't find what you're looking for? We're happy to walk through anything specific to your practice or your jurisdiction.
            </p>
            <Button
              size="lg"
              className="willow-btn mt-6 px-7 py-5 text-base"
              onClick={() => (window.location.href = "/request-access")}
            >
              Let's Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />

      {/* Hero, as on For attorneys and For clients: the headline, sentence
          and button centred, then the product in its print at the same width,
          with no label above the headline (Aaron, Nov 25). pt-16 clears the
          fixed header, as PageShell's main does on the other pages. */}
      <div className="pt-16">
        <PageHero
          ground="#FCFCFD"
          wide
          title={
            <>
              <span className="block">Ensure your clients</span>
              <HeroRotator />
            </>
          }
          subtitle="Modernize your practice with our all-in-one platform purpose-built for estate planning attorneys and the clients they serve."
          visualAspect="1440 / 855"
          visual={<HeroShot />}
        />
      </div>

      {/* As seen in, set as on the live site (small tracked label, the same
          logo sizes), with equal space above and below so it sits centred
          between the product shot and the cards: the space above is the
          hero's own bottom padding (pb-16, md:pb-24), so this matches it
          below. Yahoo Finance as on the live site, and the two linked
          articles. */}
      <section className="bg-[#FCFCFD] pb-16 md:pb-24">
        <div className="hv-wrap">
          <div className="flex flex-col items-center justify-center gap-5">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">As seen in</h2>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 min-[640px]:gap-x-10 md:gap-x-14">
              <img src="/press-yahoo-finance.svg" alt="Yahoo Finance" className="h-[14px] w-auto opacity-55 grayscale min-[640px]:h-5 md:h-6" />
              <a href="https://markets.businessinsider.com/news/currencies/124-trillion-is-changing-hands-willow-announces-pilot-to-prepare-estate-planning-attorneys-for-the-next-generation-1036548412" target="_blank" rel="noopener noreferrer" className="opacity-55 grayscale transition-opacity duration-300 hover:opacity-90">
                <img src="/press-business-insider.svg" alt="Business Insider" className="h-[18px] w-auto min-[640px]:h-6 md:h-7" />
              </a>
              <a href="https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/" target="_blank" rel="noopener noreferrer" className="opacity-55 grayscale transition-opacity duration-300 hover:opacity-90">
                <img src="/press-usa-today.svg" alt="USA Today" className="h-[14px] w-auto min-[640px]:h-5 md:h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* For attorneys / For clients & their team */}
      <AudienceRouter />

      {/* Core capabilities */}
      <section className="bg-[#FCFCFD]">
        <StackedCapabilities />
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Our commitment to lawyers — the Golden Gate print fills the rounded
          box; a smaller white box floats over it and carries the content */}
      <section className="bg-[#FCFCFD] py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/golden-gate.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 45%" }} />
            <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.15)" }} />
            <div className="relative z-10 p-6 md:p-14 lg:p-16">
              <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 md:p-12" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
          <div className="md:grid md:grid-cols-[1.55fr_1fr] md:gap-14 items-center">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">A note from our founder</div>
              <blockquote className="mt-5 font-heading text-[17px] md:text-[19px] leading-relaxed text-[#222222]">
                <p>
                  "Estate attorneys bring judgment, discretion, and decades of earned trust. Technology brings access, continuity, and permanence. Together, they change what an estate plan can do for the people it was written for.
                </p>
                <p className="mt-4">
                  Our vision is to give every estate attorney the tools their clients deserve, and to keep the attorney at the center of that relationship. A plan shouldn't disappear into a drawer the day it's signed. It should stay with the family, current and within reach, and so should the lawyer who built it.
                </p>
                <p className="mt-4">
                  We're building more than a product. Alongside estate attorneys, we're setting a new standard for how plans are signed, stored, and carried forward: a future where families are never left guessing, and every attorney is free to do what they do best."
                </p>
              </blockquote>
            </div>
            <div className="mt-10 flex flex-col items-center text-center md:mt-0">
              <div className="h-[72px] w-[72px] overflow-hidden rounded-full bg-gray-200">
                <img
                  src="/Burlacoff Headshot.svg"
                  alt="Aaron Burlacoff"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "center 25%", transform: "scale(1.7)", transformOrigin: "center center" }}
                />
              </div>
              <div className="mt-4 text-[17px] font-semibold text-[#222222]">Aaron Burlacoff</div>
              <div className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">Founder &amp; CEO, Willow</div>
              <span className="my-5 block w-12 border-t border-gray-200" />
              <Button
                size="lg"
                className="willow-btn h-11 px-6 text-[15px] font-medium"
                onClick={() => navigate("/request-access")}
              >
                Elevate your practice today
              </Button>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For clients — the darkened print card: white copy on the left, the
          client sharing home surfacing out of the bottom-right corner */}
      <section className="bg-[#FCFCFD] pb-12 md:pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/west-side-hwy.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
            <div className="relative z-10 grid md:grid-cols-[1fr_1.15fr]">
              <div className="p-8 md:p-14 lg:p-16 md:pr-4">
                <h2 className="font-heading text-2xl md:text-3xl lg:text-[2.25rem] font-bold text-white" style={{ lineHeight: 1.2, textWrap: "balance" }}>
                  Learn how we keep{" "}
                  <br className="hidden md:block" />
                  your clients connected.
                </h2>
                <p className="mt-6 max-w-xl text-[15px] md:text-[17px] text-white/85" style={{ lineHeight: 1.65 }}>
                  Willow becomes a lasting touchpoint between your practice and the entire family: everyone understands the plan, gets answers in moments, and is prepared long before when it matters most.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/for-clients")}
                  className="mt-8 inline-flex h-11 items-center rounded-md border border-white/70 bg-transparent px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Explore the client experience
                </button>
              </div>
              <div className="relative h-[340px] sm:h-[400px] md:h-auto md:min-h-[520px]">
                <div className="absolute -bottom-12 -right-12 left-6 top-6 overflow-hidden rounded-tl-xl bg-white md:left-[8%] md:top-[11%]" style={{ boxShadow: "0 16px 56px rgba(0,0,0,0.35)" }}>
                  <SharingHomeShot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotes close the page on every marketing page */}
      <AttorneyQuotes />


      <Footer />

    </div>
  );
};

export default Home;
