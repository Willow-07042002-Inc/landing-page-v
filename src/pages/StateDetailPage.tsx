import React from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { STATES, LEGISLATION_COMING_SOON, legislationStatus } from "@/lib/usStates";
import NotFound from "@/pages/NotFound";

/* Per-state legislation page. Layout: breadcrumb + serif title + dek + CTA on
   the left, the state photo on the right, then a section-nav sidebar beside
   the brief.

   BRIEFS holds the states we have actually written up — New York, Florida and
   Illinois. Every other state renders the same frame with a "brief in
   progress" body until its brief is written.

   Everything in these briefs is drawn from the statute or the enacting bill,
   cited inline so an attorney can check it, and each brief carries the date it
   was verified. This is a page lawyers will read about their own practice: a
   sentence nobody has checked against the text does more harm here than an
   empty section. Where the law is unsettled or we have not confirmed it, the
   brief says so rather than rounding to a clean answer. */

type Section = { id: string; title: string; body: React.ReactNode };
type Brief = { updated: string; sections: Section[] };

/* New York — Chapter 637 of 2025 (S7416A), adding EPTL 3-6.1 et seq.

   Effective date: December 12, 2027. Read the enacting bill alone and you get
   June 10, 2027 — it takes effect "on the five hundred forty-fifth day after
   it shall have become a law", and 545 days from December 12, 2025 is June 10,
   2027. That was the date this file carried, and it is wrong: a 2026 chapter
   amendment moved it to December 12, 2027. The original bill text is not the
   operative law. Check the amended statute, not S7416A, before touching this. */
const NY_SECTIONS: Section[] = [
  {
    id: "whats-legal",
    title: "What does New York's Electronic Wills Act allow?",
    body: (
      <>
        <p>
          Governor Hochul signed the Electronic Wills Act on December 12, 2025 as Chapter 637 of the Laws of 2025. It
          adds a new Part 6 to Article 3 of the Estates, Powers and Trusts Law — EPTL 3-6.1 through 3-6.9 — and lets a
          will be created, signed and attested electronically rather than on paper.
        </p>
        <p className="mt-4">
          The witnesses may sign in the testator's <em>physical or electronic</em> presence, and the officer
          administering the oath may likewise be physically or electronically present. That is what makes a fully remote
          execution possible: the testator, the witnesses and the notary need never be in the same room.
        </p>
      </>
    ),
  },
  {
    id: "filing",
    title: "The 30-day filing requirement",
    body: (
      <>
        <p>
          This is the provision that most changes how a New York practice runs, and it has no counterpart in Florida or
          Illinois. An electronic will must be electronically filed with the New York State Unified Court System within
          thirty days of its execution, by the testator or someone the testator authorises.
        </p>
        <p className="mt-4">
          Miss that window and the statute is unforgiving: an electronic will that is not timely filed is{" "}
          <strong>deemed invalid</strong>. The court system then holds the will until it is removed or revoked — New
          York has made the court the custodian rather than leaving custody to the drafting attorney or a private
          vendor, which is the opposite of Florida's approach.
        </p>
      </>
    ),
  },
  {
    id: "effective-date",
    title: "When does it take effect?",
    body: (
      <>
        <p>
          <strong>December 12, 2027.</strong> The enacting bill set the 545th day after it became law, which was
          June 10, 2027; a 2026 chapter amendment moved it to December 12, 2027. Summaries written before that
          amendment still carry the earlier date.
        </p>
        <p className="mt-4">
          Until that date nothing changes: a New York will still has to be executed on paper under EPTL 3-2.1. An
          electronic will signed before December 12, 2027 is not a valid will.
        </p>
      </>
    ),
  },
  {
    id: "for-your-practice",
    title: "What it means for your practice",
    body: (
      <p>
        There is a long runway here, and the work to do in it is operational rather than legal: deciding who on your
        team owns the thirty-day filing and how you prove it happened, since a missed filing voids the instrument
        outright. Willow tracks the execution date, files within the window, and keeps the receipt with the matter.
      </p>
    ),
  },
];

/* Florida — Fla. Stat. 732.521–732.525, in force since January 1, 2020, with
   remote online notarization under chapter 117, part II. */
const FL_SECTIONS: Section[] = [
  {
    id: "whats-legal",
    title: "What does Florida allow?",
    body: (
      <>
        <p>
          Florida has recognised electronic wills since <strong>January 1, 2020</strong> — longer than almost any other
          state. The rules live at sections 732.521 through 732.525 of the Florida Statutes.
        </p>
        <p className="mt-4">
          A testator may sign with an electronic signature, and a witness may satisfy the presence requirement through
          audio-video technology rather than standing in the room, provided the execution is supervised by a Florida
          online notary public under chapter 117, part II.
        </p>
      </>
    ),
  },
  {
    id: "qualified-custodian",
    title: "The qualified custodian rule",
    body: (
      <>
        <p>
          Florida does not put the will in the court's hands the way New York does. It requires a{" "}
          <strong>qualified custodian</strong>, defined in section 732.525: a custodian must be domiciled in or have its
          principal place of business in Florida, must hold the will in a secure system, and must keep the audio-video
          recording of the notarization along with it.
        </p>
        <p className="mt-4">
          Custody is therefore a standing obligation rather than a one-time filing, and it is the piece most firms
          underestimate when they first move a signing online.
        </p>
      </>
    ),
  },
  {
    id: "vulnerable-adults",
    title: "Vulnerable adults cannot sign remotely",
    body: (
      <p>
        Remote witnessing is unavailable where the principal is a <strong>vulnerable adult</strong>. That exclusion
        deserves a place in your intake, not in the signing ceremony: it is a question to have answered before you plan
        an execution around a screen, because discovering it on the day means starting over on paper.
      </p>
    ),
  },
  {
    id: "for-your-practice",
    title: "What it means for your practice",
    body: (
      <p>
        Florida is the mature jurisdiction of the three — the statute has been in force for years and the operational
        questions are settled ones. The decisions in front of a Florida firm are about custody and record-keeping
        rather than about whether an electronic will is any good.
      </p>
    ),
  },
];

/* Illinois — 755 ILCS 6/, the Electronic Wills, Electronic Estate Planning
   Documents, and Remote Witnesses Act. The articles read here are all sourced
   to P.A. 102-167, eff. 7-26-21. The act's title now also covers electronic
   estate planning documents generally; the public act that broadened it has
   not been confirmed here, so this brief does not date that change. */
const IL_SECTIONS: Section[] = [
  {
    id: "whats-legal",
    title: "What does Illinois allow?",
    body: (
      <>
        <p>
          Illinois has allowed electronic wills since <strong>July 26, 2021</strong>, under the Electronic Wills,
          Electronic Estate Planning Documents, and Remote Witnesses Act, 755 ILCS 6/ (P.A. 102-167).
        </p>
        <p className="mt-4">
          Section 5-5 keeps the familiar shape of an execution: the testator signs with an electronic signature, or
          directs someone in their presence to sign, and two or more credible witnesses attest in the testator's
          presence. The person signing at the testator's direction may not be a witness, a beneficiary, or a
          beneficiary's spouse or child.
        </p>
      </>
    ),
  },
  {
    id: "remote-attestation",
    title: "Two conditions on remote attestation",
    body: (
      <>
        <p>
          Section 15-10 lets the witnessing happen over audio-video, but attaches two requirements that are easy to
          miss and fatal to get wrong. The will must <strong>designate Illinois as its place of execution</strong>, and
          the witnesses must be <strong>located in the United States</strong> at the time they attest.
        </p>
        <p className="mt-4">
          A witness who takes the call from abroad breaks the execution. It is worth asking where people will physically
          be, not just whether they can make the time.
        </p>
      </>
    ),
  },
  {
    id: "other-documents",
    title: "Trusts, powers of attorney and directives",
    body: (
      <p>
        Section 15-5 covers everything that is not a will. Those documents may be witnessed over audio-video and signed
        in counterparts — but a counterpart signature page has to be attached to the document{" "}
        <strong>within 10 business days</strong>, and before the signer's death or incapacity. The document does not
        take effect until it is. A signing that is left half-assembled on someone's desk is not merely untidy; it is
        not yet a document.
      </p>
    ),
  },
  {
    id: "for-your-practice",
    title: "What it means for your practice",
    body: (
      <p>
        Illinois puts the burden on the record rather than on a filing. Article 10 provides for certified paper copies,
        and section 5-10(b) presumes an electronic will was revoked if neither it nor a certified paper copy can be
        found after death. Storage you can produce from is not an administrative nicety here — it is what keeps the
        will provable.
      </p>
    ),
  },
];

const BRIEFS: Record<string, Brief> = {
  "new-york": {
    updated: "September 24, 2026",
    sections: NY_SECTIONS,
  },
  florida: {
    updated: "September 24, 2026",
    sections: FL_SECTIONS,
  },
  illinois: {
    updated: "September 24, 2026",
    sections: IL_SECTIONS,
  },
};

const StateDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const state = STATES.find((s) => s.slug === slug);
  if (LEGISLATION_COMING_SOON) return <Navigate to="/legislation-by-state" replace />;
  /* A state we haven't written up has no page at all. The library links only
     the three we cover, so anything else here is a guessed or stale URL, and
     a 404 is a truer answer than a page apologising for being empty. */
  if (!state || !BRIEFS[state.slug]) return <NotFound />;

  const brief = BRIEFS[state.slug];
  const sections = brief.sections;

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
                  <div className="text-[13.5px] text-gray-400">
                    {legislationStatus(state.slug)?.status} · verified {brief.updated}
                  </div>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StateDetailPage;
