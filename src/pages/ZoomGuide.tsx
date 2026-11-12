import React from "react";
import { LegalShell, usePageMeta, H2, P, UL, LI, B } from "@/components/LegalPage";

/* The Zoom-specific guide the Zoom App Marketplace requires (documentation and
   support URL for the "Willow for Attorneys" app): adding, using and removing
   the app, what it accesses, and what happens to the data. Keep in step with
   Privacy Policy 3.5 and apps/professionals/lib/calendar/zoom.ts in
   willow-platform. */

const ZoomGuide = () => {
  usePageMeta(
    "Willow and Zoom | Willow",
    "How estate planning attorneys add Zoom to Willow, use it for consultations, and remove it."
  );

  return (
    <LegalShell eyebrow="Help" title="Willow and Zoom" date="November 12, 2026">
      <P>
        Willow is a secure platform estate planning attorneys use to store, summarize and share their clients'
        estate plans and to schedule consultations. The Zoom integration, "Willow for Attorneys", lets an
        attorney hold consultations booked through their Willow booking page on Zoom. When someone books, Willow
        creates the Zoom meeting and adds the join link to the booking confirmation and the calendar invite.
      </P>

      <H2 id="requirements">Before you start</H2>
      <UL>
        <LI>A Willow attorney account. Willow sets up accounts for law firms; there is no self-serve sign-up.</LI>
        <LI>A Zoom account (any plan) that you can sign in to.</LI>
        <LI>A calendar connected in Willow (Google or Outlook), which is where Willow checks when you're free.</LI>
      </UL>

      <H2 id="adding">Adding the app</H2>
      <UL>
        <LI>Sign in to Willow at professionals.willow-inc.com.</LI>
        <LI>Open <B>Settings</B>, then <B>Connections</B>.</LI>
        <LI>Under video conferencing, choose <B>Zoom</B>.</LI>
        <LI>Sign in to Zoom if asked, review the permissions, and select <B>Allow</B>.</LI>
        <LI>You're returned to Willow, and Zoom shows as connected with your Zoom account email.</LI>
      </UL>

      <H2 id="using">Using the app</H2>
      <UL>
        <LI>
          In <B>Settings</B>, open <B>Meeting types</B>, choose a meeting type, and pick <B>Zoom</B> as where the
          meeting happens.
        </LI>
        <LI>
          When a client or prospective client books that meeting type on your Willow booking page, Willow creates a
          Zoom meeting on your account and includes the join link in the confirmation email and the calendar invite.
        </LI>
        <LI>
          Your availability comes only from the calendars you've connected. A meeting you create in Zoom outside
          Willow only affects your availability if it's on one of those calendars.
        </LI>
      </UL>

      <H2 id="data">What Willow accesses and stores</H2>
      <P>Willow asks Zoom for two permissions only:</P>
      <UL>
        <LI><B>View your Zoom user</B> (user:read): to see which Zoom account is connected and show its email to you.</LI>
        <LI><B>Create meetings</B> (meeting:write): to create the meeting for a booked consultation.</LI>
      </UL>
      <P>
        Willow stores your Zoom user ID, your Zoom account email, the sign-in tokens Zoom issues, and the join link of
        each meeting it created. Willow never reads your other meetings, recordings, chat or contacts, and never sends
        Zoom data to any AI provider. More detail is in section 3 of our{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </P>

      <H2 id="removing">Removing the app</H2>
      <UL>
        <LI>
          <B>From Willow:</B> open <B>Settings</B>, then <B>Connections</B>, and disconnect Zoom. Willow cancels its
          access with Zoom and deletes the stored Zoom sign-in.
        </LI>
        <LI>
          <B>From Zoom:</B> sign in to the Zoom App Marketplace, open <B>Manage</B>, then <B>Added Apps</B>, find
          "Willow for Attorneys" and select <B>Remove</B>. Zoom tells Willow, and Willow deletes the stored Zoom sign-in
          and turns the Zoom connection off.
        </LI>
        <LI>Meetings Willow already created stay in your Zoom account until you delete them there.</LI>
      </UL>

      <H2 id="support">Support</H2>
      <P>
        For help with the Zoom integration or anything else in Willow, email{" "}
        <a href="mailto:support@willow-inc.com" className="underline">support@willow-inc.com</a>.
      </P>
    </LegalShell>
  );
};

export default ZoomGuide;
