import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OPEN_SETTINGS_EVENT, effectiveConsent, setConsent, type ConsentChoice } from "@/lib/consent";

/**
 * The analytics choice (Privacy Policy 2.6(c)–(d)). Shown until the visitor
 * picks, never when their browser sends Global Privacy Control (that's a
 * decline), and again whenever they open "Cookie settings" in the footer.
 * Accept and Reject are the same size and weight: declining is as easy as
 * agreeing.
 */
const CookieBanner = () => {
  const [open, setOpen] = useState(() => effectiveConsent() === null);
  const [current, setCurrent] = useState<ConsentChoice | null>(() => effectiveConsent());

  useEffect(() => {
    const reopen = () => {
      setCurrent(effectiveConsent());
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setCurrent(choice);
    setOpen(false);
  };

  const button =
    "h-10 flex-1 rounded-lg px-5 text-sm font-medium transition-colors sm:flex-none sm:min-w-[120px]";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie settings"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[720px] rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-[0_12px_32px_-8px_rgba(16,24,40,0.18)] sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <p className="font-sans text-[15px] font-semibold text-[#1F2933]">Cookies on willow-inc.com</p>
      <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-[#4B5563]">
        With your OK, we use Google Analytics and Microsoft Clarity to see how people use this site, such as the pages they
        visit and what they click. Anything you type into a form is masked. We don&rsquo;t use them for advertising. They
        only run if you accept, and you can change your mind any time with &ldquo;Cookie settings&rdquo; at the bottom of
        the page.{" "}
        <Link to="/privacy" className="font-medium text-[#128F8B] underline underline-offset-2">
          Privacy Policy
        </Link>
        {current ? (
          <span className="mt-1 block text-[12.5px] text-[#6B7280]">
            Right now analytics are {current === "granted" ? "on" : "off"}.
          </span>
        ) : null}
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`${button} border border-[#128F8B] bg-white text-[#0F7673] hover:bg-[#F0FAF9]`}
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className={`${button} border border-[#128F8B] bg-[#128F8B] text-white hover:bg-[#0F7673]`}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
