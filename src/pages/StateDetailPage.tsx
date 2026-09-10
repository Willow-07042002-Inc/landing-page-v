import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { STATES, LEGISLATION_COMING_SOON } from "@/lib/usStates";
import NotFound from "@/pages/NotFound";

/* Per-state legislation page. Layout: breadcrumb + serif title + dek + CTA on
   the left, the state photo on the right, then a section-nav sidebar beside
   the brief. New York carries FILLER content as the template; every other
   state renders the same frame with a "brief in progress" body until the
   state-by-state report lands. */

type Section = { id: string; title: string; body: React.ReactNode };

const NY_SECTIONS: Section[] = [
  {
    id: "whats-legal",
    title: "What does New York's Electronic Wills Act allow?",
    body: (
      <>
        <p>
          New York signed the Electronic Wills Act in December 2025, joining the states that recognize a will executed
          electronically — created, signed, witnessed, and stored without paper. [Filler copy: replace with the report's
          plain-language summary of what the statute covers, and what it deliberately leaves out.]
        </p>
        <p className="mt-4">
          [Filler copy: scope of electronic execution for the broader estate plan — trusts, powers of attorney, health
          directives — and how remote witnessing and notarization fit in.]
        </p>
      </>
    ),
  },
  {
    id: "effective-date",
    title: "When does it take effect?",
    body: (
      <p>
        The Act takes effect on June 10, 2027. [Filler copy: what attorneys can do now to be ready on day one, and how
        Willow supports plans signed before and after the effective date.]
      </p>
    ),
  },
  {
    id: "for-your-practice",
    title: "What it means for your practice",
    body: (
      <p>
        [Filler copy: practical guidance — which clients this serves first, what changes in the signing ceremony, how
        storage and probate submission work, and where the attorney of record stays in control.]
      </p>
    ),
  },
  {
    id: "faq",
    title: "Electronic wills FAQ",
    body: (
      <p>
        [Filler copy: the three or four questions New York attorneys actually ask — validity in other states, revocation,
        safekeeping obligations, court acceptance.]
      </p>
    ),
  },
];

const StateDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const state = STATES.find((s) => s.slug === slug);
  if (LEGISLATION_COMING_SOON) return <Navigate to="/legislation-by-state" replace />;
  if (!state) return <NotFound />;

  const sections = state.slug === "new-york" ? NY_SECTIONS : null;

  return (
    <div className="min-h-screen flex flex-col bg-white" style={{ color: "#222222" }}>
      <Navbar />

      <main className="flex-1">
        {/* Title band — breadcrumb, serif title, dek, CTA left; photo right */}
        <section className="bg-[#F8FAFC] pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            <div className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-14">
              <div>
                <nav className="text-[13px] font-medium text-gray-500">
                  <Link to="/legislation-by-state" className="hover:text-gray-900">Legislation by State</Link>
                  <span className="mx-1.5 text-gray-300">/</span>
                  <span className="text-gray-700">{state.name}</span>
                </nav>
                <h1 className="mt-4 font-heading text-3xl font-bold text-[#222222] md:text-4xl lg:text-[2.6rem]" style={{ lineHeight: 1.15 }}>
                  Electronic Wills
                  <span className="block">in {state.name}</span>
                </h1>
                <p className="mt-4 text-[15px] text-gray-600 md:text-[17px]" style={{ lineHeight: 1.6 }}>
                  {state.signed
                    ? `Electronic execution is signed into law in ${state.name}. Here's where things stand.`
                    : `${state.name} has not yet authorized electronic wills. Here's where things stand.`}
                </p>
                <Button
                  size="lg"
                  className="willow-btn mt-7 h-11 px-6 text-[15px] font-medium"
                  onClick={() => navigate("/request-access")}
                >
                  Book a Demo
                </Button>
              </div>
              <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 10", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
                <img src={`/states/${state.code}.jpg`} alt={`${state.name} capitol`} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Brief body — section nav beside the content */}
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-8">
            {sections ? (
              <div className="grid gap-10 md:grid-cols-[15rem_1fr] md:gap-14">
                <aside className="hidden md:block">
                  <nav className="sticky top-28 flex flex-col gap-4">
                    {sections.map((sec, i) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className={`text-[14.5px] font-medium leading-snug ${i === 0 ? "text-[#0C7370]" : "text-gray-500 hover:text-gray-900"}`}
                      >
                        {sec.title}
                      </a>
                    ))}
                  </nav>
                </aside>
                <article>
                  <div className="text-[13.5px] text-gray-400">Last updated: September 9, 2026</div>
                  {sections.map((sec) => (
                    <div key={sec.id} id={sec.id} className="mt-8 scroll-mt-28 first-of-type:mt-6">
                      <h2 className="font-heading text-xl font-bold text-[#222222] md:text-2xl" style={{ lineHeight: 1.3 }}>
                        {sec.title}
                      </h2>
                      <div className="mt-3 text-[15.5px] text-gray-600 md:text-base" style={{ lineHeight: 1.7 }}>
                        {sec.body}
                      </div>
                    </div>
                  ))}
                </article>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center md:p-12">
                <h2 className="font-heading text-xl font-bold text-[#222222]" style={{ lineHeight: 1.35 }}>
                  The full {state.name} brief is being prepared.
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[15px] text-gray-600" style={{ lineHeight: 1.6 }}>
                  A plain-language summary of {state.name}&apos;s rules on electronic wills and electronic execution is on
                  its way.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StateDetailPage;
