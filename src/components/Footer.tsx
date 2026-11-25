import React from "react";
import { Link } from "react-router-dom";
import { openCookieSettings } from "@/lib/consent";
import { DEMO_PATH, FOOTER_COLUMNS, type NavLink } from "@/content/siteMap";

/* Site footer: one closing line with Request a demo across the top, as on
   harvey.ai (the page's demo ask lives here, not in a box above; Aaron,
   Nov 24), a rule, then the logo with one small Inter line under it (no
   log-in buttons: the header's Log in covers both portals; Aaron, Nov 24),
   the full site map (Platform, Resources, Company, Partners, Legal: the
   header menus' groups; Aaron, Nov 25), then the disclaimer, the copyright
   with the Privacy Policy and Cookie settings, and the site's line. A deep
   teal ground, #0B5755 (Aaron, Nov 25: #064544 read too dark, nearly
   black-green); the small text at 70% white keeps 4.5:1 or better on it. */

const linkCls = "text-[14px] text-white/75 transition-colors hover:text-white lg:whitespace-nowrap";

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
  <footer className="bg-[#0B5755] text-white">
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 md:px-8 md:pt-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-[1.625rem] font-light leading-snug text-white md:text-[1.875rem]" style={{ textWrap: "balance" }}>
          See Willow with your own practice.
        </p>
        <Link
          to={DEMO_PATH}
          className="press inline-flex h-12 flex-shrink-0 items-center self-start rounded-md bg-white px-5 text-[15px] font-medium text-[#0B5755] transition-colors hover:bg-[#E6F5F4] sm:self-auto"
        >
          Request a demo
        </Link>
      </div>

      <div className="mt-12 grid gap-12 border-t border-white/15 pt-14 md:mt-14 lg:grid-cols-[1fr_2.6fr]">
        <div className="max-w-sm">
          <img
            src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
            alt="Willow"
            className="h-11 w-auto"
            style={{ filter: "brightness(0) invert(1)", WebkitFilter: "brightness(0) invert(1)" }}
          />
          <p className="mt-5 font-sans text-[15px] leading-relaxed text-white/80" style={{ textWrap: "balance" }}>
            The estate planning platform for attorneys and the families they serve.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-10">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink l={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-14 border-t border-white/15 pt-7 text-[12.5px] leading-relaxed text-white/70">
        <p className="max-w-4xl">
          This website is operated by 07042002 Inc. The information provided on this website and/or communicated through any company
          representative, including the Willow application and associated services, is for informational purposes only and should not
          be considered legal advice. 07042002 Inc. is not a law firm, and the use of our services and/or contact with any company
          representative does not create an attorney-client relationship.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* The Privacy Policy stays linked from every page (Google's sign-in
              review checks the home page for it); Cookie settings reopens the
              consent banner. Both sit here so the Legal & partners column
              holds just its two pages (Aaron, Nov 25). */}
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} 07042002 Inc., doing business as Willow. All rights reserved.</span>
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <button type="button" onClick={openCookieSettings} className="transition-colors hover:text-white">
              Cookie settings
            </button>
          </p>
          <p className="font-heading italic text-white/70">Estate plans shouldn&rsquo;t live in binders.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
