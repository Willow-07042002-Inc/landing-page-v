import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LEGISLATION_STATES, LEGISLATION_COMING_SOON } from "@/lib/usStates";

/* Legislation by State — a card per state we cover, opening its brief.

   Three states, not fifty. The grid used to list every state split by whether
   electronic execution was signed into law, with most cards opening a page
   that admitted it had nothing to say. A card is a promise that there is
   something behind it, so the library shows only the states whose briefs are
   written; LEGISLATION_SLUGS is the list. */

const StateCard = ({ code, name, slug, card }: { code: string; name: string; slug: string; card: string }) => (
  <Link
    to={`/legislation-by-state/${slug}`}
    className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
  >
    <div className="overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
      <img src={`/states/${code}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
    </div>
    <div className="p-5">
      <h3 className="font-heading text-[17px] font-bold text-[#222222]">{name}</h3>
      <p className="mt-1 text-[13.5px] text-gray-600" style={{ lineHeight: 1.55 }}>
        {card}
      </p>
    </div>
  </Link>
);

const RegulatoryLibraryPage = () => {
  if (LEGISLATION_COMING_SOON) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ color: "#222222" }}>
        <Navbar />
        <main className="flex flex-1 items-center">
          <div className="container mx-auto max-w-2xl px-4 pb-24 pt-32 text-center md:px-8">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Legislation by State</div>
            <h1 className="font-heading text-3xl font-bold text-[#222222] md:text-4xl" style={{ lineHeight: 1.2 }}>
              Learn About Your State
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-gray-600 md:text-base" style={{ lineHeight: 1.6 }}>
              Plain-language briefs on electronic wills and the electronic execution of estate plans.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E6F5F4] px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#0C7370]">
              Coming soon
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]" style={{ color: "#222222" }}>
      <Navbar />

      <main className="flex-1">
        <section className="pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="container mx-auto max-w-5xl px-4 md:px-8">
            <div className="mb-12 text-center md:mb-16">
              <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Legislation by State</div>
              <h1 className="font-heading text-3xl font-bold text-[#222222] md:text-4xl" style={{ lineHeight: 1.2 }}>
                Learn About Your State
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] text-gray-600 md:text-base" style={{ lineHeight: 1.6 }}>
                Where the law stands on electronic wills and the electronic execution of estate plans, in the states we serve.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {LEGISLATION_STATES.map((s) => (
                <StateCard key={s.code} {...s} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RegulatoryLibraryPage;
