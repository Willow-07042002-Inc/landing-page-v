import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { ATTORNEY_LOGIN, CLIENT_LOGIN, DEMO_PATH, NAV, type NavLink, type NavMenu } from "@/content/siteMap";

/* Site header. Desktop: logo, five menus (four open a full-width panel of
   columns with a one-line description under every link, plus a featured
   card), then Log in and Book a demo. Phones and narrow windows: a ☰ that
   opens a full-screen sheet with the same sections, collapsible, and the two
   actions pinned to the bottom.

   Motion follows a few rules: the first panel eases in (180ms, strong
   ease-out); moving between menus while one is open swaps instantly; closing
   is faster than opening; nothing animates for keyboard users beyond focus. */

const LOGO = "/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png";

const isActive = (pathname: string, menu: NavMenu) => {
  if (menu.to) return pathname === menu.to;
  return !!menu.columns?.some((c) => c.links.some((l) => l.to && (pathname === l.to || pathname.startsWith(`${l.to}/`))));
};

const MenuLink = ({ link, onNavigate, compact = false }: { link: NavLink; onNavigate: () => void; compact?: boolean }) => {
  const inner = (
    <>
      <span className="flex items-center gap-1.5 text-[14.5px] font-semibold text-[#1F2933] group-hover:text-[#0C7370]">
        {link.label}
        {link.href && !link.href.startsWith("mailto:") && <ExternalLink className="h-3 w-3 text-gray-400" aria-hidden />}
        {link.badge && <span className="rounded-full bg-[#E6F5F4] px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#0C7370]">{link.badge}</span>}
      </span>
      {link.desc && !compact && <span className="mt-0.5 block text-[13px] leading-snug text-gray-500">{link.desc}</span>}
    </>
  );
  const cls = "group -mx-3 block rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-[#F1F8F7] focus-visible:bg-[#F1F8F7] focus-visible:outline-none";
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
  <div className="mx-auto grid max-w-7xl grid-cols-[1fr_300px] gap-10 px-8 py-8">
    <div className={`grid gap-8 ${menu.columns!.length >= 3 ? "grid-cols-3" : menu.columns!.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
      {menu.columns!.map((col) => (
        <div key={col.title}>
          <div className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-gray-400">{col.title}</div>
          <div className="flex flex-col">
            {col.links.map((l) => (
              <MenuLink key={l.label} link={l} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
    {menu.feature && (
      <Link
        to={menu.feature.to}
        onClick={onNavigate}
        className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-xl"
      >
        <img src={menu.feature.image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,45,44,0.05) 20%, rgba(6,45,44,0.82) 100%)" }} />
        <div className="relative p-5 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">{menu.feature.eyebrow}</div>
          <div className="mt-1.5 font-heading text-[17px] font-bold leading-snug">{menu.feature.title}</div>
          <div className="mt-1.5 text-[13px] leading-snug text-white/85">{menu.feature.body}</div>
          <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold">
            Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
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
        className="press flex h-9 items-center gap-1 rounded-md px-3 text-[14px] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        Log in <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="menu-pop absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5"
          style={{ boxShadow: "0 12px 32px rgba(16,24,40,0.12)", transformOrigin: "top right" }}
        >
          {[
            { label: "Attorney portal", desc: "For attorneys and firm staff", href: ATTORNEY_LOGIN },
            { label: "Client portal", desc: "For clients and the people they've named", href: CLIENT_LOGIN },
          ].map((l) => (
            <a key={l.label} role="menuitem" href={l.href} className="block rounded-lg px-3 py-2.5 hover:bg-[#F1F8F7]">
              <span className="block text-[14px] font-semibold text-[#1F2933]">{l.label}</span>
              <span className="block text-[12.5px] text-gray-500">{l.desc}</span>
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
      style={{ top: "calc(64px + env(safe-area-inset-top))" }}
      role="dialog"
      aria-label="Site menu"
    >
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {NAV.map((menu) =>
          menu.to ? (
            <Link key={menu.label} to={menu.to} onClick={onClose} className="flex min-h-[56px] items-center border-b border-gray-200 text-[17px] font-semibold text-[#1F2933]">
              {menu.label}
            </Link>
          ) : (
            <div key={menu.label} className="border-b border-gray-200">
              <button
                type="button"
                aria-expanded={open === menu.label}
                onClick={() => setOpen(open === menu.label ? null : menu.label)}
                className="flex min-h-[56px] w-full items-center justify-between text-left text-[17px] font-semibold text-[#1F2933]"
              >
                {menu.label}
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open === menu.label ? "rotate-180" : ""}`} />
              </button>
              {open === menu.label && (
                <div className="pb-4">
                  {menu.columns!.map((col) => (
                    <div key={col.title} className="mb-3">
                      <div className="mb-1 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">{col.title}</div>
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
        <Link to={DEMO_PATH} onClick={onClose} className="press flex h-12 items-center justify-center rounded-lg bg-[#128F8B] text-[16px] font-semibold text-white">
          Book a demo
        </Link>
        <div className="grid grid-cols-2 gap-2.5">
          <a href={ATTORNEY_LOGIN} className="press flex h-12 items-center justify-center rounded-lg border border-gray-300 text-[14.5px] font-medium text-gray-800">
            Attorney log in
          </a>
          <a href={CLIENT_LOGIN} className="press flex h-12 items-center justify-center rounded-lg border border-gray-300 text-[14.5px] font-medium text-gray-800">
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
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close everything on navigation
  useEffect(() => {
    setOpenMenu(null);
    setPanelShown(false);
    setMobileOpen(false);
    setLoginOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 border-b bg-[#FCFCFD]/95 backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${
        scrolled || openMenu || mobileOpen ? "border-gray-200" : "border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      onMouseLeave={scheduleClose}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 md:px-8">
        <Link to="/" className="flex flex-shrink-0 items-center" aria-label="Willow home" onClick={closeAll}>
          <img src={LOGO} alt="Willow" className="h-10 w-auto md:h-11" />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-0.5 lg:flex">
          {NAV.map((menu) =>
            menu.to ? (
              <Link
                key={menu.label}
                to={menu.to}
                onMouseEnter={scheduleClose}
                className={`rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors ${
                  isActive(location.pathname, menu) ? "text-[#0C7370]" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {menu.label}
              </Link>
            ) : (
              <button
                key={menu.label}
                type="button"
                aria-expanded={openMenu === menu.label}
                onMouseEnter={() => openNow(menu.label)}
                onClick={() => (openMenu === menu.label ? closeAll() : openNow(menu.label))}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-[14.5px] font-medium transition-colors ${
                  openMenu === menu.label
                    ? "bg-gray-100 text-gray-900"
                    : isActive(location.pathname, menu)
                    ? "text-[#0C7370]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {menu.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === menu.label ? "rotate-180" : ""}`} />
              </button>
            )
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-1.5 lg:flex" onMouseEnter={scheduleClose}>
          <LoginMenu open={loginOpen} setOpen={setLoginOpen} />
          <Link
            to={DEMO_PATH}
            className="press flex h-9 items-center rounded-md bg-[#128F8B] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#0C7370]"
            data-nav-demo
          >
            Book a demo
          </Link>
        </div>

        {/* Phones and narrow windows */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link to={DEMO_PATH} className="press hidden h-9 items-center rounded-md bg-[#128F8B] px-3.5 text-[13.5px] font-semibold text-white sm:flex">
            Book a demo
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

      {/* Desktop mega panel */}
      {active && (
        <div
          className={`absolute inset-x-0 top-full hidden border-b border-gray-200 bg-white lg:block ${panelShown ? "" : "mega-enter"}`}
          style={{ boxShadow: "0 24px 48px -24px rgba(16,24,40,0.18)" }}
          onMouseEnter={cancelClose}
        >
          <MegaPanel menu={active} onNavigate={closeAll} />
        </div>
      )}

      {/* Portalled: the header's backdrop blur would otherwise trap a fixed sheet inside the bar */}
      {mobileOpen && createPortal(<MobileSheet onClose={() => setMobileOpen(false)} />, document.body)}
    </header>
  );
};

export default Navbar;
