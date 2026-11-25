import React, { useState } from "react";
import { PageShell, usePageMeta } from "@/components/site/blocks";
import { supabase } from "@/lib/supabase";
import { CONTACT_FORM_TYPE } from "@/lib/founding100";

/* Contact (Aaron, Nov 25), set out like the New York State Bar page: the
   heading and a short form on the left; on the right the New York print
   with nothing over it (Aaron, Nov 25). Just a name, an email and a
   message. It
   saves to form_submissions under its own form_type, which the nightly lead
   digest includes, so every message reaches the team's inbox. No support
   address on the page (Aaron, Nov 25). As with the other site forms, no
   thank-you over a message that failed to save. */

const GLOW = "0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)";

/* The partner pages' line-based field: the same underline, 16px text (iOS
   Safari zooms in on anything smaller) and teal focus */
const FIELD = "w-full border-b border-[#D4DAE0] bg-transparent pb-2 text-[16px] text-[#222222] placeholder:text-gray-300 transition-colors focus:border-[#128F8B] focus:outline-none";
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
      <div className="overflow-x-clip pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="container mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
            {/* The form, left on desktop */}
            <section className="enter mx-auto w-full max-w-[520px] text-center lg:mx-0 lg:max-w-none lg:text-left">
              <h1 className="font-heading text-[2rem] font-light text-[#222222] sm:text-[2.5rem] lg:text-[2.25rem]" style={{ lineHeight: 1.15, letterSpacing: "-0.01em", textWrap: "balance" }}>
                Contact us
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[16px] text-gray-500 md:text-[17px] lg:mx-0 lg:max-w-none" style={{ lineHeight: 1.6, textWrap: "balance" }}>
                Feel free to reach out, or send us a note here.
              </p>

              {status === "done" ? (
                <div className="mt-10 border-t border-gray-200 pt-10" role="status">
                  <h2 className="font-heading text-2xl font-light text-[#222222]">Thank you.</h2>
                  <p className="mx-auto mt-3 max-w-sm text-[15px] text-gray-500 lg:mx-0" style={{ lineHeight: 1.6 }}>
                    We&rsquo;ve got your message and will be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-9 space-y-6 text-left">
                  <label className="block">
                    <Label>Name</Label>
                    <input required autoComplete="name" placeholder="Jane Whitfield" value={form.name} onChange={set("name")} className={FIELD} />
                  </label>
                  <label className="block">
                    <Label>Email</Label>
                    <input required type="email" inputMode="email" autoComplete="email" placeholder="jane@whitfieldlaw.com" value={form.email} onChange={set("email")} className={FIELD} />
                  </label>
                  <label className="block">
                    <Label>Message</Label>
                    <textarea required rows={4} placeholder="How can we help?" value={form.message} onChange={set("message")} className={`${FIELD} resize-none`} />
                  </label>
                  {error && (
                    <p role="alert" className="text-[14px] text-[#B4342E]">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="press inline-flex h-12 w-full items-center justify-center rounded-md bg-[#128F8B] px-6 text-[15px] font-medium text-white hover:bg-[#0C7370] disabled:opacity-60"
                    style={{ boxShadow: GLOW }}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </section>

            {/* The New York print on its own (Aaron, Nov 25: no product shot).
                Stacked (phones, tablets): it runs edge to edge, as the bar
                pages' print does. */}
            <section
              aria-hidden
              className="relative mx-[calc(50%-50vw)] h-[340px] w-screen overflow-hidden sm:h-[420px] lg:mx-0 lg:h-[560px] lg:w-auto lg:rounded-3xl"
            >
              <img src="/central-park.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "center 45%" }} />
              <div className="absolute inset-0" style={{ background: "rgba(248,250,252,0.15)" }} />
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ContactPage;
