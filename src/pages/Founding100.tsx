import PartnerSignupPage from "@/components/PartnerSignupPage";
import { FOUNDING_100_FORM_TYPE } from "@/lib/founding100";

/* The evergreen Founding Partner page, linked from the footer. The offer, the
   form and the layout live in PartnerSignupPage — this file is only the
   header copy and the form_type the sign-up is filed under. */
const Founding100 = () => (
  <PartnerSignupPage
    metaTitle="Founding 100 | Willow"
    metaDescription="We're signing our first 100 Founding Partners — 20% off your first year, white-glove onboarding, and direct input on what we build next."
    heading="Become a Founding Partner"
    subheading="We're signing our first 100 Founding Partners."
    formType={FOUNDING_100_FORM_TYPE}
  />
);

export default Founding100;
