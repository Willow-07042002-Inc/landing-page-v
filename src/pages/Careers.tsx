import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/components/LegalPage";

/* Careers — layout modeled on the hero → open positions → role detail
   pattern Aaron supplied (General Magic reference), rendered in Willow's
   design language: FCFCFD ground, serif light headings, teal accents,
   line-based rows instead of boxes.

   Every posting shares an opening line, an About Willow, and a closing note
   about the stage the company is at — so those are written once, above the
   roles, rather than three times down the page. What differs per role is
   The Role, What you'll do and What you bring, and that's all ROLES holds.

   The Founding Attorney copy is Aaron's posting, verbatim; it runs elsewhere
   too, so the wording shouldn't drift between here and there. */

const APPLY_MAILTO = (role: string) =>
  `mailto:aaronburlacoff@willow-inc.com?subject=${encodeURIComponent(role)}%20%E2%80%94%20Application`;

type Role = {
  id: string;
  title: string;
  chips: string[];
  /* "The Role" — why the seat exists and who it's for */
  about: string[];
  doing: string[];
  bringing: string[];
};

const ROLES: Role[] = [
  {
    id: "founding-attorney",
    title: "Founding Attorney",
    chips: ["Full-time", "New York metro", "Starts summer 2026"],
    about: [
      "This is a founding role. You'd be the first practicing attorney on the team — building Willow alongside the founder and engineering, co-leading every sales call and design partner conversation with the founder, and being the lawyer in the room every step of the way.",
      "We've had a 30+ year T&E advisor as our north star from day one. Now we need someone in the day-to-day — mapping state legislation into the product, partnering with the founder on go-to-market and design partner success, and acting as a thought partner on every legal-adjacent decision.",
      "If you've spent two to five years drafting wills and trusts, running intakes, sitting through executions, and struggling to reconnect with clients down the road — and you've quietly wondered why the industry doesn't have the obvious tools to make everyone's life easier — this is for you.",
    ],
    doing: [
      "Map state-by-state compliance for remote and electronic signing, notarization, and document filing requirements — starting with New York and Florida, then expanding into other states as we grow. Work with engineering to translate those rules into product specifications that are easy for attorneys and their clients to navigate.",
      "Work alongside the founder to shape and execute Willow's go-to-market in New York and Florida.",
      "Lead or co-lead with the founder on sales-related conversations with the attorneys we serve. Our buyers are solo and 2–5 attorney estate firms — they want to hear from another lawyer that this works.",
      "Partner with the founder on onboarding and ongoing success for our design partner cohort. Capture their feedback, work alongside the team to ensure our product reflects what they're asking for, and follow up with attorneys as we continue to make improvements.",
      "Author and maintain best-practice content that customer-attorneys can use to navigate changing legislation with confidence.",
      "Activate your network and get us in the rooms that matter — Trusts & Estates committees and any other creative venues where Willow's presence can stand out.",
      "Bring Willow's voice to the broader estate planning community. Help arrange and run CLE-eligible webinars, and expand from there.",
      "Be the founder's thought partner on every legal-adjacent decision — positioning, customer agreements, design partner terms, regulatory questions, brand voice.",
      "Beyond the core role, there's room to help with whatever interests you on the broader legal side — first drafts of customer agreements, internal contracts, regulatory questions on the edges of your practice. We'll rely on outside counsel for anything outside your day-to-day expertise.",
    ],
    bringing: [
      "A JD and two-plus years of real-world T&E practice. Drafting wills and trusts, running intakes, navigating probate court. Solo or small-firm experience is a strong plus.",
      "Active New York bar admission required. Florida bar admission is a strong plus.",
      "Strong communication and sales instincts.",
      "Located in the New York metro area.",
    ],
  },
  {
    id: "head-of-sales",
    title: "Head of Sales",
    chips: ["Full-time", "New York metro", "Starts summer 2026"],
    about: [
      "This is a founding role. You'd be the first salesperson on the team — carrying the number alongside the founder, running the calls yourself, and turning what works on those calls into a motion the next hire can pick up and run.",
      "The founder has sold every account to date. The motion works; it has never been written down. Now we need someone to own it end to end — sourcing, pipeline, close, and the handoff into onboarding — and to build the thing that outlasts any one rep.",
      "If you've spent three to six years selling software to small professional-services firms — and you've been the one writing the playbook rather than inheriting it — this is for you.",
    ],
    doing: [
      "Own pipeline end to end in New York and Florida, from first touch to signed agreement, then expand into other states as we grow.",
      "Run discovery and demos with the attorneys we serve. Our buyers are solo and 2–5 attorney estate firms — they're busy, they're skeptical of software, and they decide quickly once they trust you.",
      "Co-lead early calls with the founder and the founding attorney, then take them over. Our buyers want to hear from another lawyer that this works — build the motion that makes that scalable rather than founder-dependent.",
      "Write the playbook as you go: sequences, call structure, objection handling, pricing conversations. If it only lives in your head, it doesn't count.",
      "Partner with the founder on pricing and packaging, and bring the market's answer back with evidence rather than anecdote.",
      "Turn our design partner cohort into references, case studies, and introductions — the firms who shaped the product are the ones other attorneys listen to.",
      "Activate your network and get us in the rooms that matter — bar association sections, Trusts & Estates committees, regional conferences, and any other venue where Willow's presence can stand out.",
      "Close the loop with product. What attorneys ask for, what stalls a deal, and what they say no to is the most honest roadmap input we get.",
      "Hire and lead the first reps behind you as the motion proves out.",
      "Beyond the core role, there's room to help with whatever interests you on the go-to-market side — lifecycle messaging, partnerships, events, and the story we tell the market.",
    ],
    bringing: [
      "Three-plus years closing software, ideally to small professional-services firms — legal, accounting, or wealth management.",
      "Evidence you've built a process, not just run one. We want to see something you wrote down that someone else then used.",
      "Comfort being the first rep: no SDRs, no marketing-qualified pipeline waiting for you, and a quota you help set.",
      "Strong written communication. Much of this sale happens in an inbox.",
      "Familiarity with estate planning or the legal industry is a strong plus, not a requirement.",
      "Located in the New York metro area.",
    ],
  },
  {
    id: "lead-designer",
    title: "Lead Designer",
    chips: ["Full-time", "New York metro", "Starts summer 2026"],
    about: [
      "This is a founding role. You'd own how Willow looks and how it's built on the front end — designing the product and then shipping it yourself, alongside the founder and engineering.",
      "We're not looking for someone to hand off mockups. The people who move fastest here design in the browser, hold the whole surface in their head, and go as deep into the stack as the problem requires. You'd set the bar for craft across two very different audiences: attorneys who live in the product all day, and families who open it a handful of times in their lives, often on the worst day of them.",
      "If you've been the designer who kept opening the pull request yourself — and you'd rather own a surface end to end than argue about handoff — this is for you.",
    ],
    doing: [
      "Own the design of every attorney- and client-facing surface: intake, the signing ceremony, the plan summary a family actually reads, and everything around them.",
      "Build what you design. You'll ship production React and TypeScript, not hand off a file and wait.",
      "Go deep enough into the backend to never be blocked by it — Postgres and Supabase, API routes, auth, and the data model behind the screen you're drawing.",
      "Own the design system, and keep it honest as the product grows: one set of components, one set of tokens, used everywhere.",
      "Work AI-first. Coding agents and models are part of how you design, prototype, and ship here — we expect you to be further along with them than we are, and to change how the team works because of it.",
      "Help design the AI surfaces in the product itself, where the hard part is knowing what software should never answer on a lawyer's behalf.",
      "Sit in on design partner sessions. Watch attorneys and their clients use what you built, and let that — not taste alone — settle the argument.",
      "Set the bar for craft and hold it. In a product people only open when something serious has happened, polish is not decoration.",
      "Beyond the core role, there's room to help with whatever interests you on the product side — marketing site, brand, and the way Willow presents itself to the industry.",
    ],
    bringing: [
      "A portfolio of product you designed and shipped, where you can point at the screens and say what you changed and why.",
      "Heavy front-end ability: React, TypeScript, and enough CSS and motion sense to get the last 10% right without help.",
      "Real backend competence. You don't need to have owned infrastructure, but you should be able to model data, write an endpoint, and read someone else's schema without flinching.",
      "AI-native in practice, not in theory. Show us what you build with these tools and how much faster it made you.",
      "Comfort with an early-stage pace: small team, direct access, decisions made in days rather than quarters.",
      "Located in the New York metro area.",
    ],
  },
];

/* Shared across every posting */
const ABOUT_WILLOW = [
  "Estate planning is stuck in the 20th century. Once the plan is signed, attorneys immediately lose touch with their client, and the binder collects dust as the plan falls out of date. At Willow, we're changing that reality.",
  "Willow is the estate planning platform attorneys rely on to digitally execute every document in the estate plan in accordance with their state's laws — so they and their clients can take full advantage of changing legislation.",
  "Attorneys can finally move away from the binder and instead keep their client's estate plan and supporting materials (children's medical records, education plans, etc.) secure and accessible online for clients and authorized individuals — while making it easy to stay in touch and make updates as life moves forward.",
  "When you join Willow, you become part of a team that is customer obsessed. We build with lawyers, not for them, constantly incorporating their feedback into our solutions as we continue to define the future of estate planning.",
  "Every addition to our founding team will see the direct impact of their efforts in the lives of attorneys and their clients, day in and day out.",
];

const CLOSING_NOTE =
  "Let's be upfront: this isn't a conventional role. You're joining a team building from the ground up — new questions every week, new priorities every month, and a role that grows as fast as the company does. If you're looking for a seat at the table that's defining where this industry is heading next — we want to hear from you.";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-[#F0F9F9] px-3 py-1 text-[12.5px] font-medium text-[#0C7370]">{children}</span>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-heading text-xl font-bold text-[#222222]">{children}</h3>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mt-3 list-disc space-y-2.5 pl-6 text-base leading-relaxed text-gray-600">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

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
          {/* Hero — the headline breaks between its two sentences rather than
              wherever the measure runs out, so the turn lands on "We're
              rebuilding it." The first sentence needs 898px at this size, so
              the measure is 5xl; forced only from sm up, since narrower than
              that it has to wrap on its own anyway. */}
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Careers</div>
            <h1 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl lg:text-[2.5rem]" style={{ lineHeight: 1.25 }}>
              Estate planning has run on paper for a century.
              <br className="hidden sm:block" /> We're rebuilding it.
            </h1>
          </div>

          {/* The open roles, directly under the headline — nothing sits
              between them to scroll past, so this keeps its anchor but drops
              the heading and the jump button that used to lead here. */}
          <div id="open-positions" className="mx-auto mt-14 max-w-3xl scroll-mt-28 md:mt-16">
            <div className="border-t-2 border-[#222222]" />
            {ROLES.map((r) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(r.id);
                }}
                className="group flex flex-col gap-3 border-b border-gray-200 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-heading text-xl font-bold text-[#222222] transition-colors group-hover:text-[#128F8B]">
                  {r.title}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  {r.chips.map((c) => (
                    <Chip key={c}>{c}</Chip>
                  ))}
                  <span className="ml-1 hidden text-gray-400 transition-transform group-hover:translate-x-0.5 sm:block">&rarr;</span>
                </span>
              </a>
            ))}
          </div>

          {/* Shared preamble — the opening line and About Willow belong to
              every posting, so they're stated once here instead of repeating
              inside each role. */}
          <div className="mx-auto mt-20 max-w-3xl md:mt-28">
            <p className="font-heading text-[22px] font-light text-[#222222] sm:text-[26px]" style={{ lineHeight: 1.35 }}>
              Estate plans shouldn't live in binders.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-gray-600">
              If you agree with the above statement, one of these roles might be for you.
            </p>

            <div className="mt-10">
              <Heading>About Willow</Heading>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-gray-600">
                {ABOUT_WILLOW.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                <p className="font-medium text-[#222222]">We're going to win; we won't settle for less.</p>
              </div>
            </div>
          </div>

          {/* One section per role */}
          {ROLES.map((r) => (
            <div key={r.id} id={r.id} className="mx-auto mt-20 max-w-3xl scroll-mt-28 md:mt-28">
              <div className="border-t border-gray-200 pt-12 md:pt-16">
                <h2 className="font-heading text-3xl font-light text-[#222222] sm:text-4xl" style={{ lineHeight: 1.2 }}>
                  {r.title}
                </h2>
                <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                  Expected start: summer 2026
                </p>
                <span className="mt-4 flex flex-wrap items-center gap-2">
                  {r.chips.map((c) => (
                    <Chip key={c}>{c}</Chip>
                  ))}
                </span>

                <div className="mt-10 space-y-10">
                  <div>
                    <Heading>The Role</Heading>
                    <div className="mt-3 space-y-3 text-base leading-relaxed text-gray-600">
                      {r.about.map((p) => (
                        <p key={p.slice(0, 40)}>{p}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Heading>What you'll do</Heading>
                    <Bullets items={r.doing} />
                    <p className="mt-5 text-base leading-relaxed text-gray-600">{CLOSING_NOTE}</p>
                  </div>

                  <div>
                    <Heading>What you bring</Heading>
                    <Bullets items={r.bringing} />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="willow-btn mt-10 h-11 px-6 text-[15px] font-medium"
                  onClick={() => (window.location.href = APPLY_MAILTO(r.title))}
                >
                  Apply for {r.title}
                </Button>
              </div>
            </div>
          ))}

          <div className="mx-auto mt-20 max-w-3xl border-t border-gray-200 pt-10 text-center md:pt-14">
            <p className="text-base text-gray-600">Not sure which one fits?</p>
            <Button
              size="lg"
              className="willow-btn mt-4 h-11 px-8 text-[15px] font-medium"
              onClick={() => (window.location.href = APPLY_MAILTO("Willow"))}
            >
              Get in touch
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
