import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* News & writing — a simple dated list that grows one entry per article.
   Each item links out to the piece (or, later, to posts of our own). */
const ARTICLES: {
  outlet: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  image?: string;
  logo?: string;
  logoH?: number;
}[] = [
  {
    outlet: "Business Insider",
    logo: "/press-business-insider.svg",
    logoH: 20,
    date: "September 9, 2026",
    title: "Willow Announces Pilot Program to Develop Digital Estate-Planning Platform",
    // The article's own description line
    excerpt:
      "Willow has announced a pilot program with five boutique trusts and estates firms as the company develops a digital platform designed around the evolving requirements of electronic estate planning.",
    href: "https://markets.businessinsider.com/news/currencies/willow-announces-pilot-program-to-develop-digital-estate-planning-platform-1036534070",
    image: "/news/bi-willow-pilot.jpg",
  },
  {
    outlet: "USA Today",
    logo: "/press-usa-today.svg",
    logoH: 15,
    date: "September 9, 2026",
    title: "Digital Estate Planning Arrived Six Years Ago. The Technology Is Finally Catching Up.",
    // The article's own opening lines
    excerpt:
      "A week after the funeral, the daughter calls her father's lawyer. Everyone in the family is certain there was a will. They remember the appointment. They remember him coming home and saying it was taken care of. But no one can find it.",
    href: "https://www.usatoday.com/press-release/story/42659/digital-estate-planning-arrived-six-years-ago-the-technology-is-finally-catching-up/",
    image: "/news/usatoday-digital-estate-planning.jpg",
  },
];

const NewsPage = () => (
  <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ color: "#222222" }}>
    <Navbar />

    <main className="flex-1">
      <section className="pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="container mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-12 text-center md:mb-16">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">News</div>
            <h1 className="font-heading text-3xl font-bold text-[#222222] md:text-4xl" style={{ lineHeight: 1.2 }}>
              Willow in the news
            </h1>
            <p className="mt-4 text-[15px] text-gray-600 md:text-base" style={{ lineHeight: 1.6 }}>
              Coverage, announcements, and writing on where estate planning is headed.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {ARTICLES.map((a) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              >
                {a.image && (
                  <div className="overflow-hidden" style={{ aspectRatio: "16 / 8" }}>
                    <img src={a.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  </div>
                )}
                <div className="p-7 md:p-9">
                <div className="flex items-center gap-3">
                  {a.logo ? (
                    <img src={a.logo} alt={a.outlet} style={{ height: a.logoH ?? 16 }} className="w-auto" />
                  ) : (
                    <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#0C7370]">{a.outlet}</span>
                  )}
                  <span className="text-[12px] font-medium text-gray-400">{a.date}</span>
                </div>
                <h2 className="mt-3 font-heading text-xl font-bold text-[#222222] md:text-[22px]" style={{ lineHeight: 1.35 }}>
                  {a.title}
                </h2>
                <p className="mt-3 text-[15px] text-gray-600" style={{ lineHeight: 1.6 }}>
                  {a.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-[#128F8B]">
                  Read the article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default NewsPage;
