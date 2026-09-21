import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/components/LegalPage";
import { supabase } from "@/lib/supabase";
import { FOUNDING_100_FORM_TYPE, formatFirmDetails } from "@/lib/founding100";

/* Founding 100 — form and offer side by side on desktop (form left, benefits
   right); stacked on smaller screens with the form first.

   This page is built to be reached cold from a QR code on a phone, so on
   mobile the form is the first thing in the viewport and the offer is what
   you scroll into. Inputs follow the site's line-based style (underline,
   never a box).

   Lead capture only: no payment or billing fields. Sign-ups are written
   straight to form_submissions with the publishable key, which the table's
   "Allow public insert" policy permits — so capture keeps working regardless
   of how the nightly digest is configured.

   Lead capture only: no payment or billing fields. Submissions POST to
   /api/founding-100, which writes them server-side with the service role —
   so no database credentials ship in this bundle. */

const BENEFITS: { title: string; body: string }[] = [
  {
    title: "20% off for the first year",
    body: "Founding Partner pricing, locked in for your first twelve months on Willow.",
  },
  {
    title: "White-glove onboarding",
    body: "We set your firm up ourselves — templates, workflows, and your existing clients migrated with you.",
  },
  {
    title: "Direct input on what we build next",
    body: "Founding Partners get priority on feature requests. You tell us what your practice needs, and it goes to the front of the queue. No bureaucracy.",
  },
  {
    title: "Refer another attorney, get a free month",
    body: "Every attorney you refer who onboards earns you a free month. Uncapped — there's no ceiling on how many you can earn.",
  },
];

const CheckMark = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
    <circle cx="12" cy="12" r="11" fill="#E6F5F4" />
    <path d="M7.5 12.4l3 3 6-6.4" stroke="#0C7370" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Line-based field. 16px text is deliberate: iOS Safari zooms the page when a
   focused input is smaller, which is jarring on a QR-code landing. */
const Field = ({
  label, value, onChange, type = "text", inputMode, autoComplete, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "email" | "text";
  autoComplete?: string;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-medium text-gray-500">{label}</span>
    <input
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      required
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent pb-2 text-[16px] text-[#222222] placeholder:text-gray-300 focus:outline-none"
      style={{ borderBottom: "1px solid #D4DAE0", transition: "border-color 0.15s" }}
      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#128F8B")}
      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#D4DAE0")}
    />
  </label>
);

const Founding100 = () => {
  usePageMeta(
    "Founding 100 | Willow",
    "We're signing our first 100 Founding Partners — 20% off your first year, white-glove onboarding, and direct input on what we build next."
  );

  const [form, setForm] = useState({
    name: "", email: "", firmName: "", attorneyCount: "", plansPerYear: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    // No .select() here: reading the row back needs a SELECT policy the
    // publishable key deliberately doesn't have, and asking for it 401s.
    const { error: insertError } = await supabase.from("form_submissions").insert({
      form_type: FOUNDING_100_FORM_TYPE,
      contact_type: "attorney",
      name: form.name.trim(),
      email: form.email.trim(),
      message: formatFirmDetails({
        firmName: form.firmName.trim(),
        attorneyCount: form.attorneyCount.trim(),
        plansPerYear: form.plansPerYear.trim(),
      }),
    });
    if (insertError) {
      // supabase-js reports failures on `error` rather than throwing. Never
      // show a success screen over a lead we failed to save.
      console.error("Founding 100 sign-up failed:", insertError);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />
      <main className="flex-grow pt-28 md:pt-32 pb-20 md:pb-28">
        <div className="container mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">

          {/* Form — left on desktop; first in the viewport from a QR code */}
          <section className="mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:max-w-none lg:text-left">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">
              Founding 100
            </div>
            <h1
              className="mt-3 font-heading text-[1.75rem] font-light text-[#222222] sm:text-4xl"
              style={{ lineHeight: 1.25 }}
            >
              Become a Founding Partner
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[15px] text-gray-500 md:text-base lg:mx-0" style={{ lineHeight: 1.6 }}>
              Tell us about your firm and we'll be in touch within a day.
            </p>

            {status === "done" ? (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <div className="mx-auto h-11 w-11 lg:mx-0"><CheckMark /></div>
                <h2 className="mt-5 font-heading text-2xl font-light text-[#222222]">You're on the list.</h2>
                <p className="mx-auto mt-3 max-w-sm text-[15px] text-gray-500 lg:mx-0" style={{ lineHeight: 1.6 }}>
                  Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""} — we've got your details and
                  we'll reach out to {form.email} within a day to get {form.firmName || "your firm"} set up.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-9 space-y-6 text-left">
                <Field label="Name" value={form.name} onChange={set("name")} autoComplete="name" placeholder="Jane Whitfield" />
                <Field label="Email" type="email" inputMode="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="jane@whitfieldlaw.com" />
                <Field label="Firm name" value={form.firmName} onChange={set("firmName")} autoComplete="organization" placeholder="Whitfield Law" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label="Attorneys at the firm" inputMode="numeric" value={form.attorneyCount} onChange={set("attorneyCount")} placeholder="4" />
                  <Field label="Estate plans per year" inputMode="numeric" value={form.plansPerYear} onChange={set("plansPerYear")} placeholder="120" />
                </div>

                {error && (
                  <p className="text-[14px] text-[#B4342E]" role="alert">{error}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "sending"}
                  className="willow-btn h-12 w-full text-[15px] font-medium disabled:opacity-60"
                  style={{ boxShadow: "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)" }}
                >
                  {status === "sending" ? "Sending…" : "Claim my spot"}
                </Button>
                <p className="text-center text-[13px] text-gray-400">
                  No payment details needed — we'll follow up personally.
                </p>
              </form>
            )}
          </section>

          {/* Offer — right on desktop, below the form when stacked */}
          <section className="mx-auto w-full max-w-[640px] border-t border-gray-200 pt-14 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
            <div className="text-center lg:text-left">
              <h2
                className="font-heading text-[1.6rem] font-light text-[#222222] sm:text-[2rem]"
                style={{ lineHeight: 1.25 }}
              >
                Willow Founding 100
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-gray-500 md:text-base lg:mx-0" style={{ lineHeight: 1.6 }}>
                We're signing our first 100 Founding Partners.
              </p>
            </div>

            <ul className="mt-10 lg:mt-8">
              {BENEFITS.map(({ title, body }) => (
                <li key={title} className="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 md:gap-5">
                  <span className="mt-0.5 h-6 w-6 flex-shrink-0 md:h-[26px] md:w-[26px]"><CheckMark /></span>
                  <div>
                    <h3 className="font-heading text-[17px] font-semibold text-[#222222] md:text-lg">{title}</h3>
                    <p className="mt-1.5 text-[15px] text-gray-600 md:text-base" style={{ lineHeight: 1.6 }}>{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Scroll-back CTA only matters when the form is off-screen above;
                on desktop it sits in the next column, so this is hidden. */}
            <div className="mt-12 border-t border-gray-200 pt-10 text-center lg:hidden">
              <p className="text-[15px] text-gray-600 md:text-base">
                Spots are limited to the first 100 firms.
              </p>
              <Button
                size="lg"
                className="willow-btn mt-5 h-12 px-8 text-[15px] font-medium"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Claim my spot
              </Button>
            </div>
            <p className="mt-10 hidden border-t border-gray-200 pt-8 text-[15px] text-gray-600 lg:block">
              Spots are limited to the first 100 firms.
            </p>
          </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Founding100;
