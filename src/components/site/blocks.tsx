import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DEMO_PATH } from "@/content/siteMap";

/* The page system every marketing page is built from. One width, one set of
   edges (max-w-7xl, px-5/8), one button pair, one card style, one heading
   scale. The signature visual is the "print": a photograph of a place, matted
   around a live recreation of the real product. */

export const WRAP = "mx-auto w-full max-w-7xl px-5 md:px-8";

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

export const PageShell = ({ children, ground = "#FCFCFD" }: { children: React.ReactNode; ground?: string }) => (
  <div className="flex min-h-screen flex-col" style={{ backgroundColor: ground, color: "#1F2933" }}>
    <Navbar />
    <main id="main" className="flex-1 pt-16">
      {children}
    </main>
    <Footer />
  </div>
);

export const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <div className={`flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] ${light ? "text-white/70" : "text-[#0C7370]"}`}>
    <span className={`h-[3px] w-5 rounded-full ${light ? "bg-white/60" : "bg-[#128F8B]"}`} />
    {children}
  </div>
);

export const PrimaryButton = ({ to = DEMO_PATH, children = "Book a demo", className = "" }: { to?: string; children?: React.ReactNode; className?: string }) => (
  <Link to={to} className={`press inline-flex h-12 items-center justify-center rounded-lg bg-[#128F8B] px-6 text-[15.5px] font-semibold text-white hover:bg-[#0C7370] ${className}`}>
    {children}
  </Link>
);

export const SecondaryButton = ({ to, href, children, light = false }: { to?: string; href?: string; children: React.ReactNode; light?: boolean }) => {
  const cls = `press inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border px-5 text-[15.5px] font-medium ${
    light ? "border-white/40 text-white hover:border-white/80" : "border-gray-300 bg-white text-[#1F2933] hover:border-gray-400"
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

/* ── The print: a photograph matted around a product screen. The screen
      keeps its own proportions: it takes `width` of the frame unless that
      would make it taller than 88% of the frame, then it narrows instead. ── */
const ratioOf = (a: string) => {
  const [w, h] = a.split("/").map((n) => parseFloat(n));
  return h ? w / h : 1.6;
};

export const PrintFrame = ({
  print,
  children,
  aspect = "900 / 560",
  width = "90%",
  className = "",
  frameAspect,
}: {
  print: string;
  children: React.ReactNode;
  aspect?: string;
  width?: string;
  className?: string;
  frameAspect?: string;
}) =>
  // "self": the screen already carries its own photograph, so it fills the frame
  print === "self" ? (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-black/10 bg-white ${className}`} style={{ aspectRatio: aspect }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  ) : (
  <div
    className={`relative w-full overflow-hidden rounded-2xl border border-black/10 ${className}`}
    style={{ aspectRatio: frameAspect ?? "16 / 10.5", containerType: "size" }}
  >
    <img src={print} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" decoding="async" />
    <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.18)" }} />
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white"
      style={{ width: `min(${width}, calc(88cqh * ${ratioOf(aspect).toFixed(4)}))`, aspectRatio: aspect, boxShadow: "0 10px 44px rgba(0,0,0,0.20)" }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  </div>
);

/* ── Page hero: breadcrumb eyebrow, a short h1, one sentence, two actions,
      then the product itself, wide. ── */
export const PageHero = ({
  eyebrow,
  title,
  subtitle,
  secondary,
  visual,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  secondary?: { label: string; to: string };
  visual?: React.ReactNode;
}) => (
  <section className="pb-14 pt-14 md:pb-20 md:pt-20">
    <div className={`${WRAP} enter`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-5 grid items-end gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <h1 className="font-heading text-[2.35rem] font-bold leading-[1.12] tracking-[-0.015em] text-[#14202B] md:text-[3.25rem]" style={{ textWrap: "balance" }}>
          {title}
        </h1>
        <div>
          <p className="text-[17px] leading-relaxed text-gray-600 md:text-[18.5px]">{subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton />
            {secondary && <SecondaryButton to={secondary.to}>{secondary.label}</SecondaryButton>}
          </div>
        </div>
      </div>
      {visual && <div className="mt-12 md:mt-16">{visual}</div>}
    </div>
  </section>
);

/* ── Section heading: eyebrow, h2, optional lead ── */
export const SectionHead = ({ eyebrow, title, lead, center = false }: { eyebrow?: string; title: React.ReactNode; lead?: string; center?: boolean }) => (
  <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {eyebrow && <div className={center ? "flex justify-center" : ""}><Eyebrow>{eyebrow}</Eyebrow></div>}
    <h2 className="mt-4 font-heading text-[1.9rem] font-bold leading-[1.18] tracking-[-0.01em] text-[#14202B] md:text-[2.5rem]" style={{ textWrap: "balance" }}>
      {title}
    </h2>
    {lead && <p className="mt-4 text-[17px] leading-relaxed text-gray-600 md:text-[18px]">{lead}</p>}
  </div>
);

/* ── Three points, ruled, numbered. No icon bubbles. ── */
export const ValuePoints = ({ title, eyebrow, points }: { title?: string; eyebrow?: string; points: { title: string; body: string }[] }) => (
  <section className="py-16 md:py-24">
    <div className={WRAP}>
      {title && <SectionHead eyebrow={eyebrow} title={title} />}
      <div className={`grid gap-10 md:grid-cols-3 md:gap-10 ${title ? "mt-12" : ""}`}>
        {points.map((p, i) => (
          <div key={p.title} className="border-t-2 border-[#14202B] pt-5">
            <div className="text-[13px] font-semibold tabular-nums text-[#0C7370]">0{i + 1}</div>
            <h3 className="mt-2 font-heading text-[1.3rem] font-bold leading-snug text-[#14202B]">{p.title}</h3>
            <p className="mt-3 text-[16.5px] leading-relaxed text-gray-600">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Feature rows: copy and a framed product screen, alternating sides ── */
export type FeatureRowData = { eyebrow?: string; title: string; body: string; bullets?: string[]; visual: React.ReactNode; print: string; aspect?: string; width?: string };

export const FeatureRows = ({ title, eyebrow, lead, rows }: { title?: string; eyebrow?: string; lead?: string; rows: FeatureRowData[] }) => (
  <section className="py-16 md:py-24">
    <div className={WRAP}>
      {title && <SectionHead eyebrow={eyebrow} title={title} lead={lead} />}
      <div className={`flex flex-col gap-20 md:gap-28 ${title ? "mt-14 md:mt-20" : ""}`}>
        {rows.map((r, i) => (
          <div key={r.title} className={`grid items-center gap-10 lg:gap-16 ${i % 2 === 1 ? "lg:grid-cols-[1.35fr_1fr]" : "lg:grid-cols-[1fr_1.35fr]"}`}>
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              {r.eyebrow && <div className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-[#0C7370]">{r.eyebrow}</div>}
              <h3 className="mt-3 font-heading text-[1.6rem] font-bold leading-[1.22] text-[#14202B] md:text-[2rem]" style={{ textWrap: "balance" }}>
                {r.title}
              </h3>
              <p className="mt-4 text-[17px] leading-relaxed text-gray-600">{r.body}</p>
              {r.bullets && (
                <ul className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[15.5px] leading-relaxed text-gray-700">
                      <span className="mt-[9px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#128F8B]" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <PrintFrame print={r.print} aspect={r.aspect} width={r.width} frameAspect="1 / 0.82">
                {r.visual}
              </PrintFrame>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── How it works: numbered steps on a line ── */
export const Steps = ({ eyebrow, title, steps, tinted = true }: { eyebrow?: string; title: string; steps: { title: string; body: string }[]; tinted?: boolean }) => (
  <section className={`py-16 md:py-24 ${tinted ? "bg-[#F1F6F6]" : ""}`}>
    <div className={WRAP}>
      <SectionHead eyebrow={eyebrow} title={title} />
      <ol className={`mt-12 grid gap-8 ${steps.length === 4 ? "md:grid-cols-4" : steps.length === 5 ? "md:grid-cols-5" : "md:grid-cols-3"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <div className="flex items-center gap-3">
              <span className="font-heading text-[2.2rem] font-bold leading-none text-[#128F8B]">{i + 1}</span>
              <span className="h-px flex-1 bg-[#128F8B]/30" />
            </div>
            <h3 className="mt-4 text-[17px] font-semibold text-[#14202B]">{s.title}</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-gray-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

/* ── FAQ: lines, not boxes ── */
export const Faq = ({ title = "Common questions", items }: { title?: string; items: { q: string; a: string }[] }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-16 md:py-24">
      <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 font-heading text-[1.9rem] font-bold leading-tight text-[#14202B] md:text-[2.4rem]">{title}</h2>
          <p className="mt-4 max-w-sm text-[16.5px] leading-relaxed text-gray-600">
            Anything else, we're happy to walk through it for your practice and your state.
          </p>
          <div className="mt-6">
            <PrimaryButton>Book a demo</PrimaryButton>
          </div>
        </div>
        <div className="border-t border-gray-200">
          {items.map((item, i) => (
            <div key={item.q} className="border-b border-gray-200">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-heading text-[1.15rem] font-bold leading-snug text-[#14202B] md:text-[1.3rem]">{item.q}</span>
                {open === i ? <Minus className="h-5 w-5 flex-shrink-0 text-gray-400" /> : <Plus className="h-5 w-5 flex-shrink-0 text-gray-400" />}
              </button>
              <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 pr-8 text-[16.5px] leading-relaxed text-gray-600">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Link cards to other pages ── */
export type CardLink = { label: string; desc: string; to: string; image: string; eyebrow?: string };

export const LinkCards = ({ eyebrow, title, lead, cards, cols = 3 }: { eyebrow?: string; title?: string; lead?: string; cards: CardLink[]; cols?: 2 | 3 | 4 }) => (
  <section className="py-16 md:py-24">
    <div className={WRAP}>
      {title && <SectionHead eyebrow={eyebrow} title={title} lead={lead} />}
      <div className={`grid gap-5 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"} ${title ? "mt-12" : ""}`}>
        {cards.map((c) => (
          <Link key={c.to + c.label} to={c.to} className="lift group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={c.image} alt="" aria-hidden className="lift-img absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              {c.eyebrow && <div className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">{c.eyebrow}</div>}
              <div className="mt-1 font-heading text-[1.15rem] font-bold text-[#14202B]">{c.label}</div>
              <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-gray-600">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-[#0C7370]">
                Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/* ── Security band: deep teal, the four commitments, a link to the page ── */
export const SECURITY_POINTS = [
  { title: "A code at every sign-in", body: "Attorneys and clients confirm each sign-in with a one-time code sent to their email." },
  { title: "Access the client controls", body: "Only the people a client names can see their documents, and only when the client says so." },
  { title: "No training on client documents", body: "Client documents are never used to train AI models, and AI processing stays in the United States." },
  { title: "Every release on record", body: "Each view, download, share and release is logged, and the record is kept for seven years." },
];

export const SecurityBand = () => (
  <section className="bg-[#064544] py-16 text-white md:py-20">
    <div className={WRAP}>
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow light>Security</Eyebrow>
          <h2 className="mt-4 font-heading text-[1.9rem] font-bold leading-tight md:text-[2.3rem]">Built for the most private documents a family has.</h2>
          <Link to="/security" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-white/90 hover:text-white">
            How we protect client information <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {SECURITY_POINTS.map((p) => (
            <div key={p.title} className="border-t border-white/20 pt-4">
              <h3 className="text-[16.5px] font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── Closing call to action: a photograph, a line, the demo button ── */
export const ClosingCta = ({
  title = "See Willow with your own practice.",
  body = "A short walkthrough of the attorney workspace and the client experience, set up around your state and the way you work.",
  image = "/williamsburg.jpg",
}: {
  title?: string;
  body?: string;
  image?: string;
}) => (
  <section className="pb-16 md:pb-24">
    <div className={WRAP}>
      <div className="relative overflow-hidden rounded-3xl">
        <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(6,45,44,0.88) 0%, rgba(6,45,44,0.62) 55%, rgba(6,45,44,0.35) 100%)" }} />
        <div className="relative px-7 py-14 md:px-16 md:py-20">
          <h2 className="max-w-2xl font-heading text-[2rem] font-bold leading-[1.15] text-white md:text-[2.75rem]" style={{ textWrap: "balance" }}>
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/85">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={DEMO_PATH} className="press inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-[15.5px] font-semibold text-[#064544] hover:bg-[#E6F5F4]">
              Book a demo
            </Link>
            <SecondaryButton to="/platform" light>
              Explore the platform
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── A single pulled statement, centered ── */
export const Statement = ({ children, by }: { children: React.ReactNode; by?: string }) => (
  <section className="py-16 md:py-24">
    <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
      <p className="font-heading text-[1.6rem] font-bold leading-[1.35] text-[#14202B] md:text-[2.2rem]" style={{ textWrap: "balance" }}>
        {children}
      </p>
      {by && <div className="mt-6 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gray-400">{by}</div>}
    </div>
  </section>
);
