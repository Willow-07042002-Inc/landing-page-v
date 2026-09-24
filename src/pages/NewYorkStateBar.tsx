import PartnerSignupPage from "@/components/PartnerSignupPage";
import { NYSBA_FORM_TYPE } from "@/lib/founding100";

/* The New York State Bar conference page, served at /nysba — short enough to
   print on a QR code and read off a badge or a booth card.

   Same Founding Partner offer as /founding-100, reached from the conference
   floor instead of the footer: only the header names the room you're standing
   in. Sign-ups are filed under their own form_type so conference leads can be
   counted against the sponsorship rather than folded into the evergreen page. */
const NewYorkStateBar = () => (
  <PartnerSignupPage
    metaTitle="New York State Bar | Willow"
    metaDescription="Willow is a proud sponsor of this week's New York State Bar conference. Become a Founding Partner — 20% off your first year, white-glove onboarding, and direct input on what we build next."
    heading="Meet Willow at the New York State Bar"
    subheading="We're proud to sponsor this week's conference — and we're signing our first 100 Founding Partners while we're here."
    formType={NYSBA_FORM_TYPE}
    image="/nyc-skyline.jpg"
  />
);

export default NewYorkStateBar;
