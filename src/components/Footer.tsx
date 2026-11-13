import React from "react";
import { Link, useLocation } from "react-router-dom";
import { openCookieSettings } from "@/lib/consent";

/* Site footer: logo on the left, links grouped into Company, Resources and
   Legal columns, then the disclaimer and copyright across the bottom.
   /about-us uses the light variant; every other page the teal one. */

type FooterLink = { label: string; to?: string; href?: string; onClick?: () => void };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Where we're live", to: "/availability" },
      { label: "Careers", to: "/careers" },
      { label: "Investor Relations", to: "/investors" },
      { label: "Founding 100", to: "/founding-100" },
      { label: "NY State Bar", to: "/nysba" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Legislation by state", to: "/legislation-by-state" },
      { label: "Connected services", to: "/connections" },
      { label: "Zoom guide", to: "/zoom" },
      { label: "Requesting documents", to: "/request-documents" },
      { label: "Contact us", href: "mailto:support@willow-inc.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Health Data Notice", to: "/health-data-notice" },
      { label: "Subprocessors", to: "/subprocessors" },
      { label: "Cookie settings", onClick: openCookieSettings },
    ],
  },
];

const Footer = () => {
  const location = useLocation();
  const light = location.pathname === "/about-us";

  const text = light ? "text-[#222222]" : "text-white";
  const muted = light ? "text-gray-600" : "text-white/80";
  const link = light ? "text-[#222222] hover:text-gray-600 hover:underline" : "text-white/90 hover:text-white hover:underline";
  const rule = light ? "border-gray-300" : "border-white/25";

  const renderLink = (l: FooterLink) => {
    const cls = `text-sm ${link} underline-offset-2`;
    if (l.onClick) {
      return (
        <button type="button" onClick={l.onClick} className={`${cls} text-left`}>
          {l.label}
        </button>
      );
    }
    if (l.href) {
      return (
        <a href={l.href} className={cls}>
          {l.label}
        </a>
      );
    }
    return (
      <Link to={l.to!} className={cls}>
        {l.label}
      </Link>
    );
  };

  return (
    <footer className={`pt-12 pb-8 ${text}`} style={{ backgroundColor: light ? "#F8FAFC" : "#138F8B" }}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <img
              src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
              alt="Willow Logo"
              className="h-12 md:h-14"
              style={
                light
                  ? {
                      filter:
                        "brightness(0) saturate(100%) invert(27%) sepia(90%) saturate(1500%) hue-rotate(150deg) brightness(1) contrast(1)",
                      WebkitFilter:
                        "brightness(0) saturate(100%) invert(27%) sepia(90%) saturate(1500%) hue-rotate(150deg) brightness(1) contrast(1)",
                    }
                  : { filter: "brightness(0) invert(1)", WebkitFilter: "brightness(0) invert(1)" }
              }
            />
            <p className={`mt-4 text-sm leading-relaxed ${muted}`}>The estate planning platform for attorneys and their clients.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className={`mb-4 text-xs font-semibold uppercase tracking-[0.12em] ${text}`}>{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>{renderLink(l)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={`mt-12 border-t pt-6 text-xs leading-relaxed ${rule} ${muted}`}>
          <p className="max-w-4xl">
            This website is operated by 07042002 Inc. The information provided on this website and/or communicated through any company
            representative, including the Willow application and associated services, is for informational purposes only and should not
            be considered legal advice. 07042002 Inc. is not a law firm, and the use of our services and/or contact with any company
            representative does not create an attorney-client relationship.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} 07042002 Inc., doing business as Willow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
