import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttorneyQuotes from "@/components/AttorneyQuotes";
import { DEMO_PATH } from "@/content/siteMap";
import { ScaledScreen } from "@/components/product/kit";
import { AttorneyDashboardScreen } from "@/components/product/attorney-dashboard";

/* The page system every marketing page is built from, in the language of the
   homepage and the For Clients page:
   - centered heroes: a light serif line, then an italic teal line
   - centered section heads: the second phrase in teal on its own line
   - copy and product side by side on the golden section (38.2 / 61.8)
   - the print: a photograph with the product screen laid over it, cut to the
     same proportions so it sits with an even mat on every side
   - the dark print card to close, its product screen rising out of the
     bottom-right corner; attorney quotes after it
   One ground (#F8FAFC), one ink (#222222), one button pair. */

export const WRAP = "mx-auto w-full max-w-7xl px-4 md:px-8";
const INK = "#222222";
const GLOW = "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)";

export const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);
};

export const PageShell = ({ children, quotes = false }: { children: React.ReactNode; quotes?: boolean }) => (
  <div className="flex min-h-screen flex-col bg-[#F8FAFC]" style={{ color: INK }}>
    <Navbar />
    <main id="main" className="flex-1 pt-16">
      {children}
      {quotes && <AttorneyQuotes />}
    </main>
    <Footer />
  </div>
);

export const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <div className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-[#0C7370]"}`}>{children}</div>
);

export const PrimaryButton = ({
  to = DEMO_PATH,
  children = "Request a demo",
  className = "",
  glow = false,
}: {
  to?: string;
  children?: React.ReactNode;
  className?: string;
  glow?: boolean;
}) => (
  <Link
    to={to}
    className={`press inline-flex h-11 items-center justify-center rounded-md bg-[#128F8B] px-6 text-[15px] font-medium text-white hover:bg-[#0C7370] ${className}`}
    style={glow ? { boxShadow: GLOW } : undefined}
  >
    {children}
  </Link>
);

export const SecondaryButton = ({ to, href, children, light = false }: { to?: string; href?: string; children: React.ReactNode; light?: boolean }) => {
  const cls = `press inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-6 text-[15px] font-medium transition-colors ${
    light ? "border-white/70 bg-transparent text-white hover:bg-white/10" : "border-gray-300 bg-white text-[#222222] hover:border-gray-400"
  }`;
  return to ? (
    <Link to={to} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
};

/* ── The print. The frame takes the screen's own proportions, so the screen,
      laid over the photograph at 92% each way, fits it exactly with an even
      mat all round. "self": the screen already carries its photograph. ── */
export const PrintFrame = ({
  print,
  children,
  aspect = "900 / 560",
  className = "",
  dark = false,
}: {
  print: string;
  children: React.ReactNode;
  aspect?: string;
  width?: string;
  frameAspect?: string;
  className?: string;
  /** The For attorneys hero's ground: the photograph under the deep teal
      wash (rgba(6,45,44,0.74)), not the light one. */
  dark?: boolean;
}) =>
  print === "self" ? (
    <div className={`relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl ${className}`} style={{ aspectRatio: aspect }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  ) : (
    <div className={`relative w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl ${className}`} style={{ aspectRatio: aspect }}>
      <img src={print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" decoding="async" />
      <div className="absolute inset-0" style={{ background: dark ? "rgba(6,45,44,0.74)" : "rgba(248,250,252,0.22)" }} />
      <div className="absolute inset-[4%] overflow-hidden rounded-lg bg-white" style={{ boxShadow: dark ? "0 16px 56px rgba(0,0,0,0.35)" : "0 8px 40px rgba(0,0,0,0.18)" }}>
        {children}
      </div>
    </div>
  );

/* ── Headline with the teal second line ── */
export const TwoTone = ({ lead, accent, italic = false }: { lead: string; accent?: string; italic?: boolean }) => (
  <>
    {lead}
    {accent && <span className={`block text-[#138F8B] ${italic ? "italic" : ""}`}>{accent}</span>}
  </>
);

/* ── Page hero: centered, light serif with an italic teal line, one
      sentence, the demo button; then the product, wide. ── */
export const PageHero = ({
  eyebrow,
  title,
  accent,
  subtitle,
  secondary,
  visual,
  visualAspect = "900 / 560",
  ground = "#F8FAFC",
  wide = false,
}: {
  /** A wider headline measure (max-w-5xl), for the home page's rotating
      phrases, so its longest fits one line on desktop. */
  wide?: boolean;
  /** The small label above the headline; the home page has none. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accent?: string;
  subtitle: string;
  secondary?: { label: string; to: string };
  visual?: React.ReactNode;
  visualAspect?: string;
  /** The section's ground: the page's own, so no seam shows under it. */
  ground?: string;
}) => (
  <section className="pb-16 pt-14 md:pb-24 md:pt-20" style={{ background: ground }}>
    <div className={`${WRAP} enter flex flex-col items-center text-center`}>
      {eyebrow && (
        <div className="mb-5">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h1 className={`mb-5 ${wide ? "max-w-5xl" : "max-w-4xl"} font-heading text-[2rem] font-light text-[#222222] sm:text-4xl md:text-5xl lg:text-[3.25rem]`} style={{ lineHeight: 1.2, textWrap: "balance" }}>
        {typeof title === "string" ? <TwoTone lead={title} accent={accent} italic /> : title}
      </h1>
      <p className="mb-8 max-w-2xl text-base text-gray-500 sm:text-[17px] md:text-lg" style={{ lineHeight: 1.55, letterSpacing: "0.01em", textWrap: "balance" }}>
        {subtitle}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <PrimaryButton glow className="px-8 sm:h-12 sm:text-[16px]" />
        {secondary && (
          <Link to={secondary.to} className="group inline-flex h-11 items-center gap-1.5 px-3 text-[15px] font-medium text-[#0C7370] hover:text-[#064544]">
            {secondary.label} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
    {visual && (
      <div className="mx-auto mt-12 w-full px-4 md:mt-16" style={{ maxWidth: `min(1160px, calc((100svh - 140px) * ${ratioOf(visualAspect).toFixed(4)}))` }}>
        {visual}
      </div>
    )}
  </section>
);

const ratioOf = (a: string) => {
  const [w, h] = a.split("/").map((n) => parseFloat(n));
  return h ? w / h : 1.6;
};

/* ── Section heading: centered, the second phrase teal on its own line ── */
export const SectionHead = ({
  eyebrow,
  title,
  accent,
  lead,
  center = true,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: string;
  lead?: string;
  center?: boolean;
  light?: boolean;
}) => (
  <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow && (
      <div className="mb-3">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
      </div>
    )}
    <h2 className={`font-heading text-2xl font-bold md:text-3xl lg:text-[2.25rem] ${light ? "text-white" : "text-[#222222]"}`} style={{ lineHeight: 1.25, textWrap: "balance" }}>
      {typeof title === "string" ? <TwoTone lead={title} accent={accent} /> : title}
    </h2>
    {lead && (
      <p className={`mt-4 text-[15px] md:text-[17px] ${light ? "text-white/80" : "text-gray-600"} ${center ? "mx-auto max-w-2xl" : ""}`} style={{ lineHeight: 1.6 }}>
        {lead}
      </p>
    )}
  </div>
);

/* ── Three points: ruled, serif titles, no numbers or icons ── */
export const ValuePoints = ({ title, accent, eyebrow, points }: { title?: string; accent?: string; eyebrow?: string; points: { title: string; body: string }[] }) => (
  <section className="bg-[#F8FAFC] py-14 md:py-20">
    <div className={`${WRAP} max-w-6xl`}>
      {title && (
        <div className="mb-12">
          <SectionHead eyebrow={eyebrow} title={title} accent={accent} />
        </div>
      )}
      <div className="grid gap-10 md:grid-cols-3 md:gap-12">
        {points.map((p) => (
          <div key={p.title} className="border-t-2 border-[#222222] pt-5">
            <h3 className="font-heading text-xl font-bold text-[#222222]" style={{ lineHeight: 1.35 }}>
              {p.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600 lg:text-base">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Copy beside the product, on the golden section, alternating sides ── */
export type FeatureRowData = { eyebrow?: string; title: string; body: string; bullets?: string[]; visual: React.ReactNode; print: string; aspect?: string; width?: string };

export const FeatureRow = ({ r, flip }: { r: FeatureRowData; flip?: boolean }) => (
  <div className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-12 ${flip ? "lg:flex-row-reverse" : ""}`}>
    <div className="w-full lg:w-[38.2%]">
      {r.eyebrow && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">{r.eyebrow}</div>}
      <h3 className="mt-2 font-heading text-xl font-bold text-[#222222] lg:text-2xl" style={{ lineHeight: 1.35 }}>
        {r.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-600 lg:text-base">{r.body}</p>
      {r.bullets && (
        <ul className="mt-5 space-y-2.5">
          {r.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-gray-600">
              <span className="mt-[9px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#128F8B]" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="w-full lg:w-[61.8%]">
      <PrintFrame print={r.print} aspect={r.aspect}>
        {r.visual}
      </PrintFrame>
    </div>
  </div>
);

export const FeatureRows = ({ title, accent, eyebrow, lead, rows }: { title?: string; accent?: string; eyebrow?: string; lead?: string; rows: FeatureRowData[] }) => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      {title && (
        <div className="mb-12 md:mb-16">
          <SectionHead eyebrow={eyebrow} title={title} accent={accent} lead={lead} />
        </div>
      )}
      <div className="flex flex-col gap-16 md:gap-24">
        {rows.map((r, i) => (
          <FeatureRow key={r.title} r={r} flip={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);

/* ── How it works: a ruled line of steps ── */
export const Steps = ({ eyebrow, title, accent, steps }: { eyebrow?: string; title: string; accent?: string; steps: { title: string; body: string }[]; tinted?: boolean }) => (
  <section className="bg-white py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl`}>
      <SectionHead eyebrow={eyebrow} title={title} accent={accent} />
      <ol className={`mt-12 grid gap-8 md:mt-14 ${steps.length === 4 ? "md:grid-cols-4" : steps.length === 5 ? "md:grid-cols-5" : "md:grid-cols-3"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="border-t border-gray-200 pt-5">
            <div className="font-heading text-[1.75rem] font-light italic leading-none text-[#138F8B]">{i + 1}</div>
            <h3 className="mt-3 text-[16px] font-semibold text-[#222222]">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ── FAQ: the homepage's — lines, not boxes; questions left, heading right ── */
export const Faq = ({ title = "Common Questions", items }: { title?: string; items: { q: string; a: string }[] }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#FCFCFD] py-16 md:py-20">
      <div className={`${WRAP} max-w-6xl lg:px-12`}>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="order-2 md:order-1 md:w-3/5">
            <div className="border-t border-gray-200">
              {items.map((item, i) => (
                <div key={item.q} className="border-b border-gray-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="font-heading text-xl font-semibold text-[#222222] md:text-2xl" style={{ lineHeight: 1.25 }}>
                      {item.q}
                    </span>
                    <span className="flex-shrink-0 text-2xl leading-none text-gray-400" aria-hidden>
                      {open === i ? "×" : "+"}
                    </span>
                  </button>
                  <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-8 text-[17px] leading-relaxed text-gray-600 md:text-lg">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2 md:w-2/5 md:pl-6">
            <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">FAQ</div>
            <h2 className="mt-3 font-heading text-3xl font-bold text-[#222222] md:text-4xl" style={{ lineHeight: 1.25 }}>
              {title}
            </h2>
            <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-gray-600 md:text-lg">
              Still can't find what you're looking for? We're happy to walk through anything specific to your practice or your state.
            </p>
            <div className="mt-6">
              <PrimaryButton>Let's get started</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Link cards to other pages ── */
export type CardLink = { label: string; desc: string; to: string; image: string; eyebrow?: string };

export const LinkCards = ({
  eyebrow,
  title,
  accent,
  lead,
  cards,
  cols = 3,
}: {
  eyebrow?: string;
  title?: string;
  accent?: string;
  lead?: string;
  cards: CardLink[];
  cols?: 2 | 3 | 4;
}) => (
  <section className="bg-[#F8FAFC] py-16 md:py-24">
    <div className={`${WRAP} max-w-6xl`}>
      {title && (
        <div className="mb-12">
          <SectionHead eyebrow={eyebrow} title={title} accent={accent} lead={lead} />
        </div>
      )}
      <div className={`grid gap-6 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
        {cards.map((c) => (
          <Link key={c.to + c.label} to={c.to} className="lift group flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={c.image} alt="" aria-hidden className="lift-img absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              {c.eyebrow && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">{c.eyebrow}</div>}
              <div className="mt-1.5 font-heading text-xl font-bold text-[#222222]">{c.label}</div>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-[14.5px] font-medium text-[#0C7370]">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ── The dark print card (the homepage's client band) ── */
const DarkPrintCard = ({ image, children, right }: { image: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <div className="relative overflow-hidden rounded-3xl">
    <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    <div className="absolute inset-0" style={{ background: "rgba(6,45,44,0.72)" }} />
    <div className={`relative z-10 grid ${right ? "md:grid-cols-[1fr_1.15fr]" : ""}`}>
      <div className={`p-8 md:p-14 lg:p-16 ${right ? "md:pr-4" : ""}`}>{children}</div>
      {right}
    </div>
  </div>
);

/* ── Security: the four commitments on the dark print card ── */
export const SECURITY_POINTS = [
  { title: "A code at every sign-in", body: "Attorneys and clients confirm each sign-in with a one-time code sent to their email." },
  { title: "Access the client controls", body: "Only the people a client names can see their documents, and only when the client says so." },
  { title: "No training on client documents", body: "Client documents are never used to train AI models, and AI processing stays in the United States." },
  { title: "Every release on record", body: "Each view, download, share and release is logged, and the record is kept for seven years." },
];

export const SecurityBand = () => (
  <section className="bg-[#F8FAFC] py-12 md:py-16">
    <div className={WRAP}>
      <DarkPrintCard image="/nyc-street.jpg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <Eyebrow light>Security</Eyebrow>
            <h2 className="mt-3 font-heading text-2xl font-bold text-white md:text-3xl lg:text-[2.25rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
              Built for the most private documents a family has.
            </h2>
            <div className="mt-8">
              <SecondaryButton to="/security" light>
                How we protect client information
              </SecondaryButton>
            </div>
          </div>
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {SECURITY_POINTS.map((p) => (
              <div key={p.title} className="border-t border-white/25 pt-4">
                <h3 className="font-heading text-[17px] font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/80">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </DarkPrintCard>
    </div>
  </section>
);

/* ── Closing: the dark print card, white copy left, a product screen rising
      out of the bottom-right corner. `more` stacks further closing cards
      (ClosingCard) under it in the same section. ── */
type ClosingCardProps = {
  title?: string;
  body?: string;
  image?: string;
  shot?: React.ReactNode;
};

export const ClosingCard = ({
  title = "See Willow with your own practice.",
  body = "Request a demo and walk through both sides of Willow live: the attorney workspace and the client experience, set up around your state and the way you work.",
  image = "/west-side-hwy.jpg",
  shot,
}: ClosingCardProps) => (
  <DarkPrintCard
    image={image}
    right={
      <div className="relative h-[300px] sm:h-[380px] md:h-auto md:min-h-[460px]">
        <div className="absolute -bottom-12 -right-12 left-6 top-6 overflow-hidden rounded-tl-xl bg-white md:left-[8%] md:top-[12%]" style={{ boxShadow: "0 16px 56px rgba(0,0,0,0.35)" }}>
          {shot ?? (
            <ScaledScreen>
              <AttorneyDashboardScreen />
            </ScaledScreen>
          )}
        </div>
      </div>
    }
  >
    <h2 className="font-heading text-2xl font-bold text-white md:text-3xl lg:text-[2.25rem]" style={{ lineHeight: 1.2, textWrap: "balance" }}>
      {title}
    </h2>
    <p className="mt-6 max-w-xl text-[15px] text-white/85 md:text-[17px]" style={{ lineHeight: 1.65 }}>
      {body}
    </p>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <SecondaryButton to={DEMO_PATH} light>
        Request a demo
      </SecondaryButton>
    </div>
  </DarkPrintCard>
);

export const ClosingCta = ({ more, ...card }: ClosingCardProps & { more?: React.ReactNode }) => (
  <section className="bg-[#F8FAFC] py-12 md:py-16">
    <div className={`${WRAP} space-y-6 md:space-y-8`}>
      <ClosingCard {...card} />
      {more}
    </div>
  </section>
);

/* ── A single pulled statement, centered, light serif ── */
export const Statement = ({ children, by }: { children: React.ReactNode; by?: string }) => (
  <section className="bg-white py-16 md:py-24">
    <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
      <p className="font-heading text-[1.75rem] font-light italic leading-[1.3] text-[#138F8B] md:text-[2.5rem]" style={{ textWrap: "balance" }}>
        {children}
      </p>
      {by && (
        <div className="mt-6">
          <span className="mx-auto mb-3 block w-10 border-t border-gray-300" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">{by}</span>
        </div>
      )}
    </div>
  </section>
);
