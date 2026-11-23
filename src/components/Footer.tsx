import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "@/lib/consent";
import { ATTORNEY_LOGIN, CLIENT_LOGIN, DEMO_PATH, FOOTER_COLUMNS, type NavLink } from "@/content/siteMap";

/* Site footer: the brand block and the two portals on the left, then the full
   site map in three columns (the same map the header menus use), then the
   disclaimer and copyright. Deep teal ground. */

const linkCls = "text-[14px] text-white/75 transition-colors hover:text-white";

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
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
        <div className="max-w-sm">
          <img
            src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
            alt="Willow"
            className="h-11 w-auto"
            style={{ filter: "brightness(0) invert(1)", WebkitFilter: "brightness(0) invert(1)" }}
          />
          <p className="mt-5 font-heading text-[19px] leading-snug text-white">
            The estate planning platform for attorneys and the families they serve.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to={DEMO_PATH} className="press inline-flex h-10 items-center rounded-md bg-white px-4 text-[14px] font-semibold text-[#064544] hover:bg-[#E6F5F4]">
              Request a demo
            </Link>
            <a href={ATTORNEY_LOGIN} className="press inline-flex h-10 items-center rounded-md border border-white/30 px-4 text-[14px] font-medium text-white hover:border-white/60">
              Attorney log in
            </a>
            <a href={CLIENT_LOGIN} className="press inline-flex h-10 items-center rounded-md border border-white/30 px-4 text-[14px] font-medium text-white hover:border-white/60">
              Client log in
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">{col.title}</h3>
              <ul className="space-y-2.5">
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
