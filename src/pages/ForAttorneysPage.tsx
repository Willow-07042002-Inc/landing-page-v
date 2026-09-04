import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck2, Landmark, Lock } from "lucide-react";
import {
  LeadIntakeVignette,
  SigningVignette,
  ComingBackVignette,
  VignetteFrame,
} from "@/components/ProductVignettes";
import { NextStepsVignette } from "@/components/ClientVignettes";

const FeatureRow = ({
  title,
  body,
  flip,
  children,
}: {
  title: string;
  body: string;
  flip?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`flex flex-col gap-8 md:gap-12 items-center md:flex-row ${flip ? "md:flex-row-reverse" : ""}`}>
    <div className="w-full md:w-2/5">
      <h3 className="text-xl lg:text-2xl font-heading font-bold text-[#222222]" style={{ lineHeight: 1.3 }}>
        {title}
      </h3>
      <p className="mt-3 text-[15px] lg:text-base text-gray-600 leading-relaxed">{body}</p>
    </div>
    <div className="w-full md:w-3/5">
      <VignetteFrame>{children}</VignetteFrame>
    </div>
  </div>
);

const ForAttorneysPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "#222222" }}>
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#F8FAFC] pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 pt-24 md:pt-28 pb-12 md:pb-16">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">For attorneys</div>
            <h1 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] mb-3 font-heading font-light text-[#222222]" style={{ lineHeight: 1.25 }}>
              Spend your days advising.
              <span className="block text-[#138F8B] italic">Willow handles the rest.</span>
            </h1>
            <p className="mb-6 max-w-xl text-[15px] sm:text-base md:text-[17px] font-normal text-gray-500" style={{ lineHeight: 1.5, letterSpacing: "0.01em" }}>
              Intake, scheduling, summaries, signing, and follow-up — the administrative weight of an estate practice, organized so you can do what clients actually pay you for.
            </p>
            <Button
              size="lg"
              className="willow-btn px-6 py-5 text-base"
              style={{ boxShadow: "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)" }}
              onClick={() => navigate("/request-access")}
              data-hero-demo-button
            >
              Request Access
            </Button>
          </div>
        </div>
      </section>

      {/* Practice, end to end */}
      <section className="bg-[#F5F7F9] py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-10 max-w-6xl flex flex-col gap-16 md:gap-20">
          <FeatureRow
            title="The practice runs itself into your calendar."
            body="Prospects and referred family book directly into your real availability — Google and Outlook synced — and arrive with their situation already captured. First meetings start at the substance."
          >
            <LeadIntakeVignette />
          </FeatureRow>
          <FeatureRow
            flip
            title="Stay organized, without trying."
            body="Every client, every next step, one glance — and Willow tells you whether the ball is with them or with you. When it's yours, it's one click away from handled."
          >
            <NextStepsVignette />
          </FeatureRow>
          <FeatureRow
            title="Execution that meets the moment — and the statute."
            body="Lead signing ceremonies with witnesses, notarization, and recordings that align with state requirements. You control the ceremony; you can pause it at any time. Willow keeps the record."
          >
            <SigningVignette />
          </FeatureRow>
          <FeatureRow
            flip
            title="The relationship keeps working after the signing."
            body="When a client's life changes, Willow surfaces it and books the conversation onto your calendar — with the context attached. Retainers become relationships; relationships become referrals."
          >
            <ComingBackVignette />
          </FeatureRow>
        </div>
      </section>

      {/* You stay the attorney of record */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-heading font-bold text-[#222222]">
              You stay the attorney of record. Always.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] md:text-[17px] text-gray-500" style={{ lineHeight: 1.5 }}>
              Willow does not practice law — it carries the weight around your practice of it.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                icon: <FileCheck2 className="h-5 w-5 text-[#138F8B]" />,
                t: "Nothing reaches your client unapproved",
                b: "Every plan summary is drafted for your review. You edit and approve every word before a client sees it.",
              },
              {
                icon: <Landmark className="h-5 w-5 text-[#138F8B]" />,
                t: "Built inside the statutes",
                b: "Willow operates only in states where electronic wills are legally recognized, and execution workflows align with each state's requirements.",
              },
              {
                icon: <Lock className="h-5 w-5 text-[#138F8B]" />,
                t: "Your clients' documents stay private",
                b: "Documents are processed privately — never used to train AI models, never retained by AI providers. Access is controlled row by row, person by person.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-[#138F8B]" />,
                t: "A succession plan, in writing",
                b: "Like any practice planning for continuity, Willow maintains a formal succession plan — custodianship transfers under applicable state standards, on the client's terms.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2.5">
                  {c.icon}
                  <h3 className="text-base font-semibold text-[#222222]">{c.t}</h3>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-gray-600">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridge to clients */}
      <section className="bg-[#F5F7F9] py-14 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-[#222222]">And what do your clients get?</h2>
          <p className="mx-auto mt-2 max-w-lg text-[15px] text-gray-500">
            A plan they understand, sharing on their terms, and you — one click away.
          </p>
          <a href="/for-clients" className="mt-4 inline-block text-base font-semibold text-[#138F8B] hover:text-[#0C7370]">
            See the client experience →
          </a>
        </div>
      </section>

      {/* Proof + CTA */}
      <section className="bg-white pt-14 md:pt-16 pb-20 md:pb-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="font-heading text-lg md:text-xl italic leading-relaxed text-gray-700" style={{ textWrap: "balance" }}>
            "This is what's going to set me apart from everyone else moving forward. I can deliver the best of both worlds: a simple, streamlined process backed by professional expertise."
          </p>
          <p className="mt-4 text-sm text-gray-500">David Castellano · Trust &amp; Estate Lawyer</p>
          <div className="mt-10">
            <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-heading font-bold mb-5 text-[#222222]">
              Your <span className="text-[#138F8B]">First Five Clients</span>, Covered
            </h2>
            <Button size="lg" className="willow-btn px-8 py-6 text-base font-medium" onClick={() => navigate("/request-access")}>
              Request Access
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForAttorneysPage;
