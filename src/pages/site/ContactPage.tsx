import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, WRAP, Eyebrow, usePageMeta, LEAD_CLS, LEAD_STYLE } from "@/components/site/blocks";
import { DEMO_PATH } from "@/content/siteMap";
import { supabase } from "@/lib/supabase";
import { CONTACT_FORM_TYPE } from "@/lib/founding100";

/* Contact (Aaron, Nov 25): one short form, name, email and a message, in
   place of the mailto the menus used to open. It saves to form_submissions
   under its own form_type, which the nightly lead digest includes, so a
   message reaches the team's inbox. No support address on the page (Aaron,
   Nov 25: on a marketing page it reads as a support queue). As with the
   other site forms, no thank-you over a message that failed to save. */

const FIELD = "w-full border-b border-[#D4DAE0] bg-transparent pb-2 text-[16px] text-[#222222] transition-colors focus:border-[#128F8B] focus:outline-none";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-1.5 block text-[13px] font-medium text-gray-500">{children}</span>
);

const ContactPage = () => {
  usePageMeta("Contact | Willow", "Get in touch with the Willow team.");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    const { error: insertError } = await supabase.from("form_submissions").insert({
      form_type: CONTACT_FORM_TYPE,
      contact_type: "website",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    if (insertError) {
      console.error("Contact form failed:", insertError);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }
    setStatus("done");
  };

  return (
    <PageShell>
      <section className="pb-24 pt-14 md:pb-32 md:pt-20">
        <div className={`${WRAP} enter max-w-2xl`}>
          <div className="text-center">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 font-heading text-[2rem] font-light text-[#222222] sm:text-4xl md:text-5xl" style={{ lineHeight: 1.2, textWrap: "balance" }}>
              Talk to our team
            </h1>
            <p className={`mx-auto mt-5 max-w-lg ${LEAD_CLS} text-gray-500`} style={LEAD_STYLE}>
              Send us a note and we&rsquo;ll get back to you.
            </p>
          </div>

          <div className="mt-10 rounded-2xl bg-white p-6 sm:p-10" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            {status === "done" ? (
              <div className="py-6 text-center" role="status">
                <div className="font-heading text-[1.625rem] font-light text-[#222222]">Thank you.</div>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-gray-600">
                  We&rsquo;ve got your message and will be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-7">
                <label className="block">
                  <Label>Name</Label>
                  <input required autoComplete="name" value={form.name} onChange={set("name")} className={FIELD} />
                </label>
                <label className="block">
                  <Label>Email</Label>
                  <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={FIELD} />
                </label>
                <label className="block">
                  <Label>Message</Label>
                  <textarea required rows={4} value={form.message} onChange={set("message")} className={`${FIELD} resize-none`} />
                </label>
                {error && (
                  <p role="alert" className="text-[14px] text-red-600">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="press inline-flex h-11 w-full items-center justify-center rounded-md bg-[#128F8B] px-6 text-[15px] font-medium text-white hover:bg-[#0C7370] disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>

          <p className="mt-8 text-center text-[15px] text-gray-500">
            Want to see Willow with your own practice?{" "}
            <Link to={DEMO_PATH} className="font-medium text-[#0C7370] underline decoration-[#0C7370]/30 underline-offset-2 hover:decoration-[#0C7370]">
              Request a demo
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default ContactPage;
