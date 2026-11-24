import React from "react";
import { FileLock2, History, KeyRound, Lock, ScanText, Users } from "lucide-react";
import { WRAP, Eyebrow, SecondaryButton } from "@/components/site/blocks";

/* Security on the For attorneys page, set like the homepage FAQ: a ruled list
   on the left, the heading on the right. The rows borrow harvey.ai's security
   list (an icon and a name on each), and every row stays open. Willow holds no
   certifications, so the rows are its own commitments, each one the Security
   page already makes (checked against the product and the Privacy Policy,
   Nov 16, 2026). Icons stand bare. */

const CONTROLS = [
  {
    Icon: KeyRound,
    title: "Protected sign-in",
    body: "Attorneys, clients and the people they name confirm each sign-in with a one-time code sent to their email.",
  },
  {
    Icon: Lock,
    title: "Encrypted and kept in the United States",
    body: "Information is encrypted as it travels and where it’s stored, and Willow’s database, files and applications run in the United States.",
  },
  {
    Icon: Users,
    title: "Access the client controls",
    body: "Only the client, their attorney and the people the client names can see a document, and only when the client says so.",
  },
  {
    Icon: FileLock2,
    title: "Nothing released early",
    body: "Anything sealed until a passing stays sealed until the client’s attorney verifies it, usually from the death certificate.",
  },
  {
    Icon: History,
    title: "A record of every access",
    body: "Every view, download, share and release is logged, and the record is kept for seven years.",
  },
  {
    Icon: ScanText,
    title: "AI with firm limits",
    body: "AI reads a document only to draft a summary for you to review. Processing stays in the United States, and nothing is used to train AI.",
  },
];

const SecurityControls = () => (
  <section id="security" className="bg-[#F8FAFC] pb-16 md:pb-24">
    <div className={`${WRAP} max-w-6xl lg:px-10`}>
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <ul className="order-2 border-t border-gray-200 md:order-1 md:w-3/5">
          {CONTROLS.map(({ Icon, title, body }) => (
            <li key={title} className="flex gap-5 border-b border-gray-200 py-6">
              <Icon aria-hidden className="mt-px h-7 w-7 flex-shrink-0 text-[#222222]" strokeWidth={1.5} />
              <div className="min-w-0">
                <h3 className="text-[18px] font-medium leading-snug text-[#222222] md:text-[20px]" style={{ fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}>
                  {title}
                </h3>
                <p className="mt-1.5 max-w-xl text-[15.5px] leading-relaxed text-gray-600 md:text-[16px]" style={{ textWrap: "pretty" }}>
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="order-1 md:order-2 md:w-2/5 md:pl-6">
          <div className="md:sticky md:top-28">
            <Eyebrow>Security</Eyebrow>
            <h2 className="mt-3 font-heading text-[1.875rem] font-light text-[#222222] sm:text-4xl" style={{ lineHeight: 1.2, textWrap: "balance" }}>
              Built for the most private
              <span className="block italic text-[#138F8B]">documents a family has.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-gray-600 md:text-[17px]" style={{ textWrap: "pretty" }}>
              An estate plan holds a family’s finances, health and wishes. Willow is built so the right people see it at the right time, and no one else does.
            </p>
            <div className="mt-7">
              <SecondaryButton to="/security">More about security</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default SecurityControls;
