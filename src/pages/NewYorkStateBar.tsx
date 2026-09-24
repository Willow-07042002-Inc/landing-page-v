import { useState } from "react";
import PartnerSignupPage from "@/components/PartnerSignupPage";
import { NYSBA_FORM_TYPE } from "@/lib/founding100";

/* The New York State Bar Association conference page, served at /nysba —
   short enough to print on a QR code and read off a badge or a booth card.

   The header is the two marks side by side, which says who this page is for
   faster than a sentence can. It does not tell the attorney they'd be among
   the first to join: nobody standing at a booth wants to hear they're early,
   and a count dates the page the moment it stops being true.

   The offer itself is the standing one, untouched. Claiming it takes a demo,
   so submitting the form saves the lead and then hands the attorney to the
   booking page rather than stopping at a confirmation.

   Sign-ups are filed under their own form_type so conference leads can be
   counted against the sponsorship. */

/* The same wordmark the navbar and footer use. */
const WILLOW_LOGO = "/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png";

/* The Association's own 150 Years mark, as supplied. The fallback below still
   stands: if the file ever goes missing the heading reads as the name rather
   than a broken image in front of an attorney. */
const NYSBA_LOGO = "/nysba-logo.webp";

const NysbaMark = () => {
  const [failed, setFailed] = useState(false);
  if (failed) return <>New York State Bar Association</>;
  return (
    <img
      src={NYSBA_LOGO}
      alt="New York State Bar Association"
      onError={() => setFailed(true)}
      className="h-16 w-auto sm:h-24"
      /* The supplied file is navy on an opaque white rectangle, which reads as
         a visible box against this page's off-white. Multiply drops the white
         into the background and leaves the navy untouched — the page behind it
         is always light, so there's nothing for the blend to go wrong against.
         Swap this for a transparent PNG if the sponsor kit has one. */
      style={{ mixBlendMode: "multiply" }}
    />
  );
};

const NewYorkStateBar = () => (
  <PartnerSignupPage
    metaTitle="New York State Bar Association | Willow"
    metaDescription="Willow is sponsoring this week's New York State Bar Association conference. Here's what comes with becoming a Founding Partner."
    heading={
      <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
        <img src={WILLOW_LOGO} alt="Willow" className="h-14 w-auto sm:h-20" />
        <span aria-hidden className="text-[1.75rem] font-light text-gray-300 sm:text-[2.25rem]">&times;</span>
        <NysbaMark />
      </span>
    }
    /* The line is too long to sit on one row beside the form, so the only
       question is where it breaks. Non-breaking spaces hold "this week's
       conference —" together, which leaves the dash at the end of the first
       row and the payoff alone on the second. Left to itself it split after
       "week's" and opened the second row with a dangling dash. */
    subheading={"We're sponsoring this week's conference — here's what comes with it."}
    formType={NYSBA_FORM_TYPE}
    image="/nyc-skyline.jpg"
    demoPath="/request-access"
  />
);

export default NewYorkStateBar;
