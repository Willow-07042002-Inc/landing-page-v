import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/components/LegalPage";
import { supabase } from "@/lib/supabase";
import { formatFirmDetails, type SignupFormType } from "@/lib/founding100";

/* The Founding Partner sign-up page: form and offer side by side on desktop
   (form left, benefits right); stacked on smaller screens with the form first.

   This shell is shared by every surface that sells the same Founding Partner
   offer — /founding-100 and the conference pages — because the offer must
   stay identical across them. Only the header copy and the form_type differ,
   so those are props; everything below the header is fixed here. Editing a
   benefit once changes it everywhere, which is the point.

   Each page is built to be reached cold from a QR code on a phone, so on
   mobile the form is the first thing in the viewport and the offer is what
   you scroll into. Inputs follow the site's line-based style (underline,
   never a box).

   Lead capture only: no payment or billing fields. Sign-ups are written
   straight to form_submissions with the publishable key, which the table's
   "Allow public insert" policy permits — so capture keeps working regardless
   of how the nightly digest is configured. */

/* `gain` is what the Founding Partner actually receives. It's set in Willow
   teal at the start of each heading, which is what makes the list scan
   without a check mark or bullet. */
const BENEFITS: { gain: string; rest: string; body: string }[] = [
  {
    gain: "20% off",
    rest: "for the first year",
    body: "Founding Partner pricing, locked in for your first twelve months on Willow.",
  },
  {
    gain: "White-glove",
    rest: "onboarding",
    body: "We set your firm up ourselves — templates, workflows, and your existing clients migrated with you.",
  },
  {
    gain: "Direct input",
    rest: "on what we build next",
    body: "Your feature requests go to the front of the queue. No bureaucracy.",
  },
  {
    gain: "A free month",
    rest: "for every attorney you refer",
    body: "Each referral who onboards earns you a month free. Uncapped.",
  },
];

/* Submitting saves the lead and then hands the attorney to the booking page,
   so the button says what actually happens rather than promising the offer
   outright. It carries that on its own — a line of small print underneath
   repeating it was saying the same thing twice. */
const CTA_LABEL = "Book a demo to claim";

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

/* Volume is a sizing signal, not a figure anyone needs to the unit, and an
   attorney at a booth shouldn't have to total up last year to answer. Bands
   are quicker to answer and honest about the precision we actually get.
   Non-overlapping on purpose: "10–25" next to "1–10" makes 10 ambiguous. */
const PLANS_PER_YEAR = ["1–10", "11–25", "26–50", "51–100", "100+"];

/* The line-based Field's sibling, kept visually identical: same underline,
   same 16px text, same teal focus. `appearance-none` drops the platform
   control, so the chevron below replaces it. */
const SelectField = ({
  label, value, onChange, options, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[13px] font-medium text-gray-500">{label}</span>
    <span className="relative block">
      <select
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-none bg-transparent pb-2 pr-6 text-[16px] focus:outline-none ${value ? "text-[#222222]" : "text-gray-300"}`}
        style={{ borderBottom: "1px solid #D4DAE0", transition: "border-color 0.15s" }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#128F8B")}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#D4DAE0")}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <svg
        viewBox="0 0 12 8" width="11" height="8" aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M1 1.5 6 6.5 11 1.5" />
      </svg>
    </span>
  </label>
);

export type PartnerSignupPageProps = {
  /* Browser tab title and meta description — each surface wants its own, so a
     conference page can be shared without reading as the evergreen offer. */
  metaTitle: string;
  metaDescription: string;
  /* The <h1> and the line under it. Everything else on the page is shared. */
  heading: React.ReactNode;
  subheading: React.ReactNode;
  /* Which form_type the sign-up is recorded under, so leads can be attributed
     to the surface that produced them. The nightly digest reports every type
     in SIGNUP_FORM_TYPES — add new ones there or they capture silently. */
  formType: SignupFormType;
  /* The print the offer card floats on. Defaults to the Golden Gate so the
     evergreen page is unchanged; a conference page should pass something from
     the city it's being read in. */
  image?: string;
  /* Where to send the attorney once the lead is saved, when claiming the
     offer takes a demo. Setting it also puts a line under the button saying
     so, because a form that submits and then moves you somewhere unannounced
     reads as a misfire.

     The lead is written before the redirect either way, so someone who books
     no demo is still captured and still reaches the digest. Leave it unset
     and the page shows its own confirmation instead. */
  demoPath?: string;
};

const PartnerSignupPage = ({
  metaTitle, metaDescription, heading, subheading, formType,
  image = "/golden-gate.jpg", demoPath,
}: PartnerSignupPageProps) => {
  usePageMeta(metaTitle, metaDescription);

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
      form_type: formType,
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
      console.error("Founding Partner sign-up failed:", insertError);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }
    // Only once the row is safely written. Redirecting first would lose the
    // lead on any failure, and the attorney would never know.
    //
    // A full page load, not the router: Cal.com's embed initialises once on
    // script load, so arriving at /request-access through a client-side
    // navigation renders the page with an empty space where the calendar
    // should be. Booking is the whole point of sending them there.
    if (demoPath) {
      // ?claim=1 tells the booking page this attorney came to claim the
      // offer rather than to look around, so it can label itself that way.
      window.location.assign(`${demoPath}?claim=1`);
      return;
    }
    setStatus("done");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />
      <main className="flex-grow overflow-x-clip pt-28 md:pt-32 lg:pb-28">
        <div className="container mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">

          {/* Form — left on desktop; first in the viewport from a QR code */}
          <section className="mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:max-w-none lg:text-left">
            <h1
              className="font-heading text-[2rem] font-light text-[#222222] sm:text-[2.5rem] lg:text-[2.25rem]"
              style={{ lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "balance" }}
            >
              {heading}
            </h1>
            {/* The cap keeps the line short while the column is the full page
                width; past lg the column is already narrow, so capping it
                again only forces an early break mid-sentence. */}
            <p className="mx-auto mt-4 max-w-md text-[16px] text-gray-500 md:text-[17px] lg:mx-0 lg:max-w-none" style={{ lineHeight: 1.6, textWrap: "balance" }}>
              {subheading}
            </p>

            {status === "done" ? (
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="font-heading text-2xl font-light text-[#222222]">You're on the list.</h2>
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
                  <SelectField label="Estate plans per year" value={form.plansPerYear} onChange={set("plansPerYear")} options={PLANS_PER_YEAR} placeholder="Select a range" />
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
                  {status === "sending" ? "Sending…" : CTA_LABEL}
                </Button>
              </form>
            )}
          </section>

          {/* Offer — the founder-note treatment from the homepage: a city
              print with a white card floating over it.
              Desktop: a rounded photo frame in the right column.
              Stacked (phones/tablets): the print breaks out of the page
              container and runs edge to edge down to the footer — no white
              gutters around the photo — with the card centred on top. */}
          <section className="relative mx-[calc(50%-50vw)] w-screen overflow-hidden lg:mx-0 lg:w-auto lg:rounded-3xl">
            <img
              src={image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 45%" }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.15)" }} />

            <div className="relative z-10 px-4 py-12 sm:px-8 sm:py-16 lg:p-8 xl:p-10">
              <div
                className="mx-auto w-full max-w-[560px] rounded-2xl bg-white px-6 py-7 sm:p-9 lg:max-w-none lg:px-10 lg:py-10"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
              >
                <ul>
                  {BENEFITS.map(({ gain, rest, body }) => (
                    <li key={gain} className="border-t border-gray-100 py-5 first:border-t-0 first:pt-0 last:pb-0">
                      <h3 className="font-heading text-[19px] font-normal text-[#222222] md:text-[21px]" style={{ lineHeight: 1.3 }}>
                        <span className="font-bold text-[#128F8B]">{gain}</span> {rest}
                      </h3>
                      <p className="mt-1.5 text-[14.5px] text-gray-500 md:text-[15px]" style={{ lineHeight: 1.6 }}>{body}</p>
                    </li>
                  ))}
                </ul>

                {/* Scroll-back CTA only matters when the form is off-screen
                    above; on desktop the form sits in the next column. */}
                <div className="mt-8 border-t border-gray-200 pt-8 text-center lg:hidden">
                  <Button
                    size="lg"
                    className="willow-btn h-12 w-full text-[15px] font-medium sm:w-auto sm:px-8"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    {CTA_LABEL}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnerSignupPage;
