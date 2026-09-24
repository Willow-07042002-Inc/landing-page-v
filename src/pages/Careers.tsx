import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/components/LegalPage";

/* Careers — layout modeled on the hero → open positions → role detail
   pattern Aaron supplied (General Magic reference), rendered in Willow's
   design language: FCFCFD ground, serif light headings, teal accents,
   line-based rows instead of boxes.

   The role copy is Aaron's posting, kept verbatim — it runs elsewhere too,
   so the wording shouldn't drift between here and there. Only the structure
   is ours. */

const APPLY_MAILTO =
  "mailto:aaronburlacoff@willow-inc.com?subject=Founding%20Attorney%20%E2%80%94%20Application";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-[#F0F9F9] px-3 py-1 text-[12.5px] font-medium text-[#0C7370]">{children}</span>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-heading text-xl font-bold text-[#222222]">{title}</h3>
    <div className="mt-3 space-y-3 text-base leading-relaxed text-gray-600">{children}</div>
  </div>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mt-3 list-disc space-y-2.5 pl-6 text-base leading-relaxed text-gray-600">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const Careers = () => {
  usePageMeta(
    "Careers | Willow",
    "Join Willow — we build the estate planning platform for attorneys and the clients they serve."
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />
      <main className="flex-grow pt-32 md:pt-36 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Careers</div>
            <h1 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl lg:text-[2.75rem]" style={{ lineHeight: 1.25 }}>
              Estate planning has run on paper for a century. We're rebuilding it.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] text-gray-500 md:text-base" style={{ lineHeight: 1.6 }}>
              Willow is the platform estate planning attorneys use to prepare, execute, and carry plans forward — and the place
              their clients actually understand them. Better tools for attorneys, better outcomes for families.
            </p>
            <Button
              size="lg"
              className="willow-btn mt-8 h-11 px-6 text-[15px] font-medium"
              onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
            >
              See open positions
            </Button>
          </div>

          {/* Open positions */}
          <div id="open-positions" className="mx-auto mt-20 max-w-3xl scroll-mt-28 md:mt-28">
            <h2 className="font-heading text-2xl font-bold text-[#222222] md:text-3xl">Open positions</h2>
            <a
              href="#founding-attorney"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("founding-attorney")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group mt-6 flex flex-col gap-3 border-t-2 border-[#222222] py-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-heading text-xl font-bold text-[#222222] transition-colors group-hover:text-[#128F8B]">
                Founding Attorney
              </span>
              {/* Not "Remote": the posting requires New York metro and an
                  active New York bar admission. */}
              <span className="flex flex-wrap items-center gap-2">
                <Chip>Full-time</Chip>
                <Chip>New York metro</Chip>
                <Chip>Starts summer 2026</Chip>
                <span className="ml-1 hidden text-gray-400 transition-transform group-hover:translate-x-0.5 sm:block">&rarr;</span>
              </span>
            </a>
            <div className="border-t border-gray-200" />
          </div>

          {/* Role detail */}
          <div id="founding-attorney" className="mx-auto mt-20 max-w-3xl scroll-mt-28 md:mt-28">
            <h2 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl" style={{ lineHeight: 1.2 }}>
              Founding Attorney
            </h2>
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-400">
              Expected start: summer 2026
            </p>

            {/* The posting opens on the company line — set as the pull quote
                it is, with the qualifier under it. */}
            <p className="mt-8 font-heading text-[22px] font-light text-[#222222] sm:text-[26px]" style={{ lineHeight: 1.35 }}>
              Estate plans shouldn't live in binders.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-gray-600">
              If you agree with the above statement, this role might be for you.
            </p>

            <Button size="lg" className="willow-btn mt-7 h-11 px-6 text-[15px] font-medium" onClick={() => (window.location.href = APPLY_MAILTO)}>
              Apply now
            </Button>

            <div className="mt-12 space-y-10">
              <Section title="About Willow">
                <p>
                  Estate planning is stuck in the 20th century. Once the plan is signed, attorneys immediately lose touch with
                  their client, and the binder collects dust as the plan falls out of date. At Willow, we're changing that
                  reality.
                </p>
                <p>
                  Willow is the estate planning platform attorneys rely on to digitally execute every document in the estate
                  plan in accordance with their state's laws — so they and their clients can take full advantage of changing
                  legislation.
                </p>
                <p>
                  Attorneys can finally move away from the binder and instead keep their client's estate plan and supporting
                  materials (children's medical records, education plans, etc.) secure and accessible online for clients and
                  authorized individuals — while making it easy to stay in touch and make updates as life moves forward.
                </p>
                <p>
                  When you join Willow, you become part of a team that is customer obsessed. We build with lawyers, not for
                  them, constantly incorporating their feedback into our solutions as we continue to define the future of
                  estate planning.
                </p>
                <p>
                  Every addition to our founding team will see the direct impact of their efforts in the lives of attorneys and
                  their clients, day in and day out.
                </p>
                <p className="font-medium text-[#222222]">We're going to win; we won't settle for less.</p>
              </Section>

              <Section title="The Role">
                <p>
                  This is a founding role. You'd be the first practicing attorney on the team — building Willow alongside the
                  founder and engineering, co-leading every sales call and design partner conversation with the founder, and
                  being the lawyer in the room every step of the way.
                </p>
                <p>
                  We've had a 30+ year T&amp;E advisor as our north star from day one. Now we need someone in the day-to-day —
                  mapping state legislation into the product, partnering with the founder on go-to-market and design partner
                  success, and acting as a thought partner on every legal-adjacent decision.
                </p>
                <p>
                  If you've spent two to five years drafting wills and trusts, running intakes, sitting through executions, and
                  struggling to reconnect with clients down the road — and you've quietly wondered why the industry doesn't
                  have the obvious tools to make everyone's life easier — this is for you.
                </p>
              </Section>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#222222]">What you'll do</h3>
                <Bullets
                  items={[
                    "Map state-by-state compliance for remote and electronic signing, notarization, and document filing requirements — starting with New York and Florida, then expanding into other states as we grow. Work with engineering to translate those rules into product specifications that are easy for attorneys and their clients to navigate.",
                    "Work alongside the founder to shape and execute Willow's go-to-market in New York and Florida.",
                    "Lead or co-lead with the founder on sales-related conversations with the attorneys we serve. Our buyers are solo and 2–5 attorney estate firms — they want to hear from another lawyer that this works.",
                    "Partner with the founder on onboarding and ongoing success for our design partner cohort. Capture their feedback, work alongside the team to ensure our product reflects what they're asking for, and follow up with attorneys as we continue to make improvements.",
                    "Author and maintain best-practice content that customer-attorneys can use to navigate changing legislation with confidence.",
                    "Activate your network and get us in the rooms that matter — Trusts & Estates committees and any other creative venues where Willow's presence can stand out.",
                    "Bring Willow's voice to the broader estate planning community. Help arrange and run CLE-eligible webinars, and expand from there.",
                    "Be the founder's thought partner on every legal-adjacent decision — positioning, customer agreements, design partner terms, regulatory questions, brand voice.",
                    "Beyond the core role, there's room to help with whatever interests you on the broader legal side — first drafts of customer agreements, internal contracts, regulatory questions on the edges of your practice. We'll rely on outside counsel for anything outside your day-to-day expertise.",
                  ]}
                />
                <p className="mt-5 text-base leading-relaxed text-gray-600">
                  Let's be upfront: this isn't a conventional role. You're joining a team building from the ground up — new
                  questions every week, new priorities every month, and a role that grows as fast as the company does. If
                  you're looking for a seat at the table that's defining where this industry is heading next — we want to hear
                  from you.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#222222]">What you bring</h3>
                <Bullets
                  items={[
                    "A JD and two-plus years of real-world T&E practice. Drafting wills and trusts, running intakes, navigating probate court. Solo or small-firm experience is a strong plus.",
                    "Active New York bar admission required. Florida bar admission is a strong plus.",
                    "Strong communication and sales instincts.",
                    "Located in the New York metro area.",
                  ]}
                />
              </div>
            </div>

            <div className="mt-16 border-t border-gray-200 pt-10 text-center md:pt-14">
              <p className="text-base text-gray-600">Think you're the right fit?</p>
              <Button size="lg" className="willow-btn mt-4 h-11 px-8 text-[15px] font-medium" onClick={() => (window.location.href = APPLY_MAILTO)}>
                Apply now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
