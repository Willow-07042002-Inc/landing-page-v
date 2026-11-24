import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "@/lib/consent";
import { ATTORNEY_LOGIN, CLIENT_LOGIN, DEMO_PATH, FOOTER_COLUMNS, type NavLink } from "@/content/siteMap";

/* Site footer, laid out like harvey.ai's: one closing line with Request a
   demo across the top (the page's demo ask lives here, not in a box above),
   a rule, then the logo on the left and the site map in columns (the same map
   the header menus use) with the two portals as the last column, then the
   disclaimer and copyright. Deep teal ground. */

const linkCls = "text-[14px] text-white/85 transition-colors hover:text-white";

const PORTALS: NavLink[] = [
  { label: "Attorney log in", href: ATTORNEY_LOGIN },
  { label: "Client log in", href: CLIENT_LOGIN },
];
const COLUMNS = [...FOOTER_COLUMNS, { title: "Log in", links: PORTALS }];

const FooterLink = ({ l }: { l: NavLink }) =>
  l.to ? (
    <Link to={l.to} className={linkCls}>
      {l.label}
    </Link>
  ) : (
    <a href={l.href} className={linkCls}>
      {l.label}
    </a>
  );

const Footer = () => (
  <footer className="bg-[#064544] text-white">
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-[1.625rem] font-light leading-snug text-white md:text-[1.875rem]" style={{ textWrap: "balance" }}>
          See Willow with your own practice.
        </p>
        <Link
          to={DEMO_PATH}
          className="press inline-flex h-12 flex-shrink-0 items-center self-start rounded-md bg-white px-5 text-[15px] font-medium text-[#064544] transition-colors hover:bg-[#E6F5F4] sm:self-auto"
        >
          Request a demo
        </Link>
      </div>

      <div className="mt-12 grid gap-12 border-t border-white/15 pt-14 md:mt-14 lg:grid-cols-[1fr_4fr]">
        <Link to="/" aria-label="Willow home" className="self-start">
          <img
            src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
            alt="Willow"
            className="h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)", WebkitFilter: "brightness(0) invert(1)" }}
          />
        </Link>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 font-sans text-[13px] font-normal text-white/50">{col.title}</h3>
              <ul className="space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink l={l} />
                  </li>
                ))}
                {col.title === "Company" && (
                  <li>
                    <button type="button" onClick={openCookieSettings} className={`${linkCls} text-left`}>
                      Cookie settings
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-14 border-t border-white/15 pt-7 text-[12.5px] leading-relaxed text-white/55">
        <p className="max-w-4xl">
          This website is operated by 07042002 Inc. The information provided on this website and/or communicated through any company
          representative, including the Willow application and associated services, is for informational purposes only and should not
          be considered legal advice. 07042002 Inc. is not a law firm, and the use of our services and/or contact with any company
          representative does not create an attorney-client relationship.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 07042002 Inc., doing business as Willow. All rights reserved.</p>
          <p className="font-heading italic text-white/70">We handle what you'd rather ignore.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
