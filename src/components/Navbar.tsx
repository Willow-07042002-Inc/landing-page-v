import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { ATTORNEY_LOGIN, CLIENT_LOGIN, DEMO_PATH, NAV, type NavLink, type NavMenu } from "@/content/siteMap";

/* Site header, laid out like harvey.ai's (measured Nov 16, 2026): a 72px bar
   across the full width with 40px side padding, the logo on the left, the
   menus centred (14px, medium), and two small 32px buttons on the right, an
   outlined Log in with a chevron and the filled Request a demo.

   A menu opens a full-width panel under the bar: columns split by thin
   dividers, a quiet label over each, a title and one line under every link,
   and a featured card in the last column. The page behind dims and blurs.
   Phones and narrow windows get a ☰ that opens a full-screen sheet.

   Motion: the first panel eases in (180ms, strong ease-out); moving between
   menus while one is open swaps instantly; closing is faster than opening. */

const LOGO = "/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png";
export const HEADER_H = 72;
/* Side padding steps with harvey.ai's breakpoints (--hv-pad in index.css):
   28px, then 32 from 1025px, 36 from 1445px, 40 from 1730px */
const BAR_PAD = "px-[var(--hv-pad)]";

const MenuLink = ({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) => {
  const inner = (
    <>
      <span className="flex items-center gap-1.5 text-[14px] font-medium text-[#222222]">
        {link.label}
        {link.href && !link.href.startsWith("mailto:") && <ExternalLink className="h-3 w-3 text-gray-400" aria-hidden />}
        {link.badge && <span className="rounded-[3px] bg-[#E6F5F4] px-1 py-px text-[10px] font-semibold uppercase tracking-[0.06em] text-[#0C7370]">{link.badge}</span>}
        <ArrowRight
          aria-hidden
          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        />
      </span>
      {link.desc && <span className="mt-1 block text-[13px] leading-snug text-gray-500">{link.desc}</span>}
    </>
  );
  const cls = "group block py-2 focus-visible:outline-none";
  return link.to ? (
    <Link to={link.to} onClick={onNavigate} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={link.href} onClick={onNavigate} className={cls}>
      {inner}
    </a>
  );
};

const MegaPanel = ({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) => (
  <div className={`grid grid-cols-4 ${BAR_PAD}`}>
    {menu.columns!.map((col, i) => (
      <div key={col.title} className={`py-7 ${i === 0 ? "pr-10" : "border-l border-gray-200 px-10"}`}>
        <div className="mb-3 text-[13px] text-gray-500">{col.title}</div>
        <div className="flex flex-col gap-2">
          {col.links.map((l) => (
            <MenuLink key={l.label} link={l} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    ))}
    {menu.feature && (
      <div className="col-start-4 border-l border-gray-200 py-7 pl-10">
        <Link to={menu.feature.to} onClick={onNavigate} className="group block">
          <div className="aspect-[16/10] overflow-hidden rounded-md">
            <img src={menu.feature.image} alt="" aria-hidden className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
          </div>
          <div className="mt-3 text-[13px] text-gray-500">{menu.feature.eyebrow}</div>
          <div className="mt-1 text-[14px] font-medium leading-snug text-[#222222]">{menu.feature.title}</div>
          <div className="mt-1 text-[13px] leading-snug text-gray-500">{menu.feature.body}</div>
        </Link>
      </div>
    )}
  </div>
);

const LoginMenu = ({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, setOpen]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
        className="press flex h-8 items-center gap-1 rounded-[4px] border border-[#222222] py-[7px] pl-3 pr-[7px] text-[14px] font-medium text-[#222222] transition-colors duration-300 hover:bg-[#222222] hover:text-white"
      >
        Log in <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="menu-pop absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-md border border-gray-200 bg-[#FCFCFD] p-1.5"
          style={{ boxShadow: "0 12px 32px rgba(16,24,40,0.12)", transformOrigin: "top right" }}
        >
          {[
            { label: "Attorney portal", desc: "For attorneys and firm staff", href: ATTORNEY_LOGIN },
            { label: "Client portal", desc: "For clients and the people they've named", href: CLIENT_LOGIN },
          ].map((l) => (
            <a key={l.label} role="menuitem" href={l.href} className="block rounded px-3 py-2.5 hover:bg-[#222222]/5">
              <span className="block text-[14px] font-medium text-[#222222]">{l.label}</span>
              <span className="block text-[13px] text-gray-500">{l.desc}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileSheet = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex flex-col bg-[#FCFCFD] lg:hidden"
      style={{ top: `calc(${HEADER_H}px + env(safe-area-inset-top))` }}
      role="dialog"
      aria-label="Site menu"
    >
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {NAV.map((menu) =>
          menu.to ? (
            <Link key={menu.label} to={menu.to} onClick={onClose} className="flex min-h-[56px] items-center border-b border-gray-200 text-[17px] font-medium text-[#222222]">
              {menu.label}
            </Link>
          ) : (
            <div key={menu.label} className="border-b border-gray-200">
              <button
                type="button"
                aria-expanded={open === menu.label}
                onClick={() => setOpen(open === menu.label ? null : menu.label)}
                className="flex min-h-[56px] w-full items-center justify-between text-left text-[17px] font-medium text-[#222222]"
              >
                {menu.label}
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open === menu.label ? "rotate-180" : ""}`} />
              </button>
              {open === menu.label && (
                <div className="pb-4">
                  {menu.columns!.map((col) => (
                    <div key={col.title} className="mb-3">
                      <div className="mb-1 pt-1 text-[13px] text-gray-500">{col.title}</div>
                      {col.links.map((l) =>
                        l.to ? (
                          <Link key={l.label} to={l.to} onClick={onClose} className="flex min-h-[44px] items-center text-[15.5px] text-gray-700">
                            {l.label}
                          </Link>
                        ) : (
                          <a key={l.label} href={l.href} onClick={onClose} className="flex min-h-[44px] items-center text-[15.5px] text-gray-700">
                            {l.label}
                          </a>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
      <div className="grid gap-2.5 border-t border-gray-200 bg-white px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
        <Link to={DEMO_PATH} onClick={onClose} className="press flex h-12 items-center justify-center rounded-md bg-[#128F8B] text-[16px] font-medium text-white">
          Request a demo
        </Link>
        <div className="grid grid-cols-2 gap-2.5">
          <a href={ATTORNEY_LOGIN} className="press flex h-12 items-center justify-center rounded-md border border-[#222222] text-[14.5px] font-medium text-[#222222]">
            Attorney log in
          </a>
          <a href={CLIENT_LOGIN} className="press flex h-12 items-center justify-center rounded-md border border-[#222222] text-[14.5px] font-medium text-[#222222]">
            Client log in
          </a>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [panelShown, setPanelShown] = useState(false); // true once a panel has been open, so switching is instant
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Close everything on navigation
  useEffect(() => {
    setOpenMenu(null);
    setPanelShown(false);
    setMobileOpen(false);
    setLoginOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setPanelShown(false);
        setLoginOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setPanelShown(false);
    }, 140);
  };
  const openNow = (label: string) => {
    cancelClose();
    setPanelShown(openMenu !== null);
    setOpenMenu(label);
  };
  const closeAll = () => {
    cancelClose();
    setOpenMenu(null);
    setPanelShown(false);
  };

  const active = NAV.find((m) => m.label === openMenu && m.columns);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      onMouseLeave={scheduleClose}
    >
      {/* The bar's tint and blur live on their own layer (as on harvey.ai), so
          the fixed scrim below isn't trapped inside the header */}
      <div className={`absolute inset-0 backdrop-blur-[16px] transition-colors duration-200 ${active || mobileOpen ? "bg-[#FCFCFD]" : "bg-[#FCFCFD]/[0.72]"}`} aria-hidden />

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow">
        Skip to content
      </a>

      {/* As on harvey.ai: the menu sits 32px after the logo, and from 1445px it is
          centred in the bar; the buttons are pushed right */}
      <div className={`relative mx-auto flex h-[72px] max-w-[1920px] items-center ${BAR_PAD}`}>
        <Link to="/" className="flex shrink-0 items-center" aria-label="Willow home" onClick={closeAll}>
          <img src={LOGO} alt="Willow" className="h-10 w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-8 hidden h-full items-stretch gap-6 whitespace-nowrap lg:flex xl:gap-8 min-[1445px]:absolute min-[1445px]:inset-y-0 min-[1445px]:left-1/2 min-[1445px]:ml-0 min-[1445px]:-translate-x-1/2">
          {NAV.map((menu) => {
            const open = openMenu === menu.label;
            const dim = openMenu !== null && !open;
            const cls = `relative flex h-full items-center gap-1 text-[14px] font-medium transition-colors duration-200 ${dim ? "text-gray-500" : "text-[#222222]"} hover:text-[#222222]`;
            return menu.to ? (
              <Link key={menu.label} to={menu.to} onMouseEnter={scheduleClose} className={cls}>
                {menu.label}
              </Link>
            ) : (
              <button
                key={menu.label}
                type="button"
                aria-expanded={open}
                onMouseEnter={() => openNow(menu.label)}
                onClick={() => (open ? closeAll() : openNow(menu.label))}
                className={cls}
              >
                {menu.label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                {open && <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#222222]" aria-hidden />}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-4 whitespace-nowrap pl-6 lg:flex" onMouseEnter={scheduleClose}>
          <LoginMenu open={loginOpen} setOpen={setLoginOpen} />
          <Link
            to={DEMO_PATH}
            className="press flex h-8 items-center rounded-[4px] bg-[#128F8B] px-3 text-[14px] font-medium text-white transition-colors hover:bg-[#0C7370]"
            data-nav-demo
          >
            Request a demo
          </Link>
        </div>

        {/* Phones and narrow windows */}
        <div className="ml-auto flex items-center gap-2 whitespace-nowrap lg:hidden">
          <Link to={DEMO_PATH} className="press hidden h-8 items-center rounded-[4px] bg-[#128F8B] px-3 text-[14px] font-medium text-white sm:flex">
            Request a demo
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-gray-800 transition-transform duration-200 ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[6px] h-0.5 w-5 rounded bg-gray-800 transition-opacity duration-150 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[12px] h-0.5 w-5 rounded bg-gray-800 transition-transform duration-200 ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Desktop: the page dims and blurs behind an open panel */}
      {active && (
        <div
          className="fixed inset-x-0 bottom-0 hidden bg-[rgba(15,14,13,0.18)] backdrop-blur-[6px] lg:block"
          style={{ top: `calc(${HEADER_H}px + env(safe-area-inset-top))` }}
          onMouseEnter={scheduleClose}
          onClick={closeAll}
          aria-hidden
        />
      )}

      {/* Desktop panel */}
      {active && (
        <div
          className={`absolute inset-x-0 top-full hidden border-y border-gray-200 bg-[#FCFCFD] lg:block ${panelShown ? "" : "mega-enter"}`}
          onMouseEnter={cancelClose}
        >
          <MegaPanel menu={active} onNavigate={closeAll} />
        </div>
      )}

      {/* Portalled so it sits above everything and scrolls on its own */}
      {mobileOpen && createPortal(<MobileSheet onClose={() => setMobileOpen(false)} />, document.body)}
    </header>
  );
};

export default Navbar;
