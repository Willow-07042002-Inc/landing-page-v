import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CLIENT_REFERRAL_FORM_TYPE } from "@/lib/founding100";

/* For clients' close (Aaron, Nov 25): a client asks Willow to reach out to
   their attorney. The button opens a small window that asks for the
   attorney's name and email, nothing else. The row goes to form_submissions
   under its own form_type, which the nightly lead digest includes, so the
   attorney's details reach the team's inbox. As with the other site forms,
   there's no reading the row back (the publishable key can only insert), and
   no thank-you over a row that failed to save. */

const BUTTON = "press inline-flex h-11 items-center justify-center rounded-md bg-[#128F8B] px-6 text-[15px] font-medium text-white hover:bg-[#0C7370] disabled:opacity-60";

/* The line-based field the partner sign-up form uses. 16px text keeps iOS
   Safari from zooming in on focus. */
const Field = ({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) => (
  <label className="block text-left">
    <span className="mb-1.5 block text-[13px] font-medium text-gray-500">{label}</span>
    <input
      type={type}
      autoComplete={autoComplete}
      value={value}
      required
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-b border-[#D4DAE0] bg-transparent pb-2 text-[16px] text-[#222222] transition-colors focus:border-[#128F8B] focus:outline-none"
    />
  </label>
);

export const ReachOutButton = ({ label = "Reach out to my attorney" }: { label?: string }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (o: boolean) => {
    setOpen(o);
    // A fresh form the next time, once a referral has gone through
    if (!o && status === "done") {
      setName("");
      setEmail("");
      setStatus("idle");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    const { error: insertError } = await supabase.from("form_submissions").insert({
      form_type: CLIENT_REFERRAL_FORM_TYPE,
      contact_type: "attorney",
      name: name.trim(),
      email: email.trim(),
      message: "A client asked Willow to reach out to their attorney (For clients page).",
    });
    if (insertError) {
      console.error("Attorney referral failed:", insertError);
      setError("Something went wrong. Please try again.");
      setStatus("idle");
      return;
    }
    setStatus("done");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className={BUTTON}>
          {label}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#062D2C]/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-7 text-center shadow-[0_16px_56px_rgba(0,0,0,0.25)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-9"
          aria-describedby="referral-desc"
        >
          <Dialog.Close className="absolute right-4 top-4 rounded-sm text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138F8B]">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {status === "done" ? (
            <>
              <Dialog.Title className="font-heading text-[1.625rem] font-light text-[#222222]" style={{ lineHeight: 1.25 }}>
                Thank you.
              </Dialog.Title>
              <p id="referral-desc" className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-gray-600">
                We&rsquo;ll reach out to {name.trim() || "your attorney"} about Willow.
              </p>
              <Dialog.Close asChild>
                <button type="button" className={`${BUTTON} mt-7 w-full`}>
                  Done
                </button>
              </Dialog.Close>
            </>
          ) : (
            <form onSubmit={submit}>
              <Dialog.Title className="font-heading text-[1.625rem] font-light text-[#222222]" style={{ lineHeight: 1.25 }}>
                Who&rsquo;s your attorney?
              </Dialog.Title>
              <p id="referral-desc" className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-gray-600">
                We&rsquo;ll get in touch with them about Willow.
              </p>
              <div className="mt-7 space-y-6">
                <Field label="Their name" value={name} onChange={setName} autoComplete="off" />
                <Field label="Their email" type="email" value={email} onChange={setEmail} autoComplete="off" />
              </div>
              {error && (
                <p role="alert" className="mt-4 text-[14px] text-red-600">
                  {error}
                </p>
              )}
              <button type="submit" disabled={status === "sending"} className={`${BUTTON} mt-8 w-full`}>
                {status === "sending" ? "Sending…" : "Reach out to them"}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ReachOutButton;
