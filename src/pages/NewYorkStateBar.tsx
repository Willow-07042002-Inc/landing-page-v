import PartnerSignupPage from "@/components/PartnerSignupPage";
import { NYSBA_FORM_TYPE } from "@/lib/founding100";

/* The New York State Bar conference page, served at /nysba — short enough to
   print on a QR code and read off a badge or a booth card.

   The header says where we are and what's on offer, and stops. It does not
   tell the attorney they'd be among the first to join — nobody standing at a
   booth wants to hear they're early, and a count dates the page the moment it
   stops being true — and it doesn't oversell: the benefits card to the right
   is the pitch, so the header only has to hand off to it.

   The offer itself is the standing one, untouched — everything that differs
   from /founding-100 is in these four lines. Sign-ups are filed under their
   own form_type so conference leads can be counted against the sponsorship. */
const NewYorkStateBar = () => (
  <PartnerSignupPage
    metaTitle="New York State Bar | Willow"
    metaDescription="Willow is sponsoring this week's New York State Bar conference. Join our Founding Partner program."
    heading="Meet Willow at the New York State Bar"
    subheading="We're sponsoring this week's conference. Join our Founding Partner program — here's what comes with it."
    formType={NYSBA_FORM_TYPE}
    image="/nyc-skyline.jpg"
  />
);

export default NewYorkStateBar;
