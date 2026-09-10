import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";


/* Brand icons for the Resources menu — drawn on the Lucide 24-grid so they sit
   naturally beside the app's icon set */
const NewsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M4 5h13v14H6a2 2 0 0 1-2-2V5Z" />
    <path d="M17 9h2a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2" />
    <path d="M7.5 9h6M7.5 12.5h6M7.5 16h3.5" />
  </svg>
);

const LibraryIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M12 3.5 4 7.5h16L12 3.5Z" />
    <path d="M6 10.5V16M10 10.5V16M14 10.5V16M18 10.5V16" />
    <path d="M4.5 19h15" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isCreateWillPage = location.pathname === "/create-will";
  const isHomePage = location.pathname === "/";
  // Marketing chrome (tabs + compact bar) on every content page, including
  // nested ones like /legislation-by-state/new-york
  const isMarketingPage = ["/", "/attorneys", "/for-clients", "/news", "/terms", "/privacy", "/contact", "/investors", "/request-access", "/book"].includes(location.pathname)
    || location.pathname.startsWith("/legislation-by-state");
  const marketingTabs = [
    { label: "For Attorneys", href: "/" },
    { label: "For Clients", href: "/for-clients" },
  ];
  // Resources holds the content pages; rendered as a dropdown on desktop and
  // a labelled group in the mobile menu
  const resourceLinks = [
    { label: "Willow in the News", desc: "Coverage and announcements", href: "/news", Icon: NewsIcon },
    { label: "Legislation by State", desc: "E-signing law, state by state", href: "/legislation-by-state", Icon: LibraryIcon },
  ];
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const onResourcesPage = resourceLinks.some((l) => l.href === location.pathname);
  useEffect(() => {
    if (!resourcesOpen) return;
    const close = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [resourcesOpen]);
  const isClientsPage = location.pathname === "/clients";
  const isAboutUsPage = location.pathname === "/about-us";
  const isBookPage = location.pathname === "/book";
  const isRequestAccessPage = location.pathname === "/request-access";
  const isPitolPage = location.pathname === "/pitol";
  const alwaysSmallPages = ["/availability-map", "/terms", "/privacy", "/contact", "/investors", "/learn", "/book", "/request-access", "/pitol"];
  const isAlwaysSmallPage = alwaysSmallPages.includes(location.pathname);

  useEffect(() => {
    // Always keep About Us page in scrolled state
    if (isAboutUsPage) {
      setScrolled(true);
      setScrolledPastHero(true);
      return;
    }
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Check if hero button is out of view (works on all pages)
      const heroButton = document.querySelector('[data-hero-demo-button]');
      if (heroButton) {
        const rect = heroButton.getBoundingClientRect();
        const isButtonVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        const hasScrolledPastHero = !isButtonVisible && rect.bottom < 0;
        if (hasScrolledPastHero !== scrolledPastHero) {
          setScrolledPastHero(hasScrolledPastHero);
        }
      } else {
        // If no hero button found, use scroll position as fallback
        if (scrolledPastHero !== isScrolled) {
          setScrolledPastHero(isScrolled);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check on mount as well
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, scrolledPastHero, isAboutUsPage]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isMarketingPage ? 'bg-[#FCFCFD]' : 'bg-background/100'} ${isMarketingPage ? 'py-2.5 md:py-3 border-b border-border' : isAboutUsPage ? 'py-5 md:py-6 border-b border-border' : scrolled || isAlwaysSmallPage ? 'py-5 md:py-6 border-b border-border' : 'py-6 md:py-12'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-[5px] p-3"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg lg:hidden">
            <div className="flex flex-col p-4 gap-2">
              {isMarketingPage && marketingTabs.map((tab) =>
                tab.href ? (
                  <Link
                    key={tab.label}
                    to={tab.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-medium"
                  >
                    {tab.label}
                  </Link>
                ) : (
                  <a
                    key={tab.label}
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-medium"
                  >
                    {tab.label}
                  </a>
                )
              )}
              {isMarketingPage && (
                <>
                  <div className="px-3 py-2 font-medium text-gray-600">Resources</div>
                  {resourceLinks.map(({ label, href, Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded py-1.5 pl-7 pr-3 text-[15px] text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      {label}
                    </Link>
                  ))}
                </>
              )}
              {isClientsPage && (
                <Link 
                  to="/learn" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-medium"
                >
                  Learn
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Left side - marketing tabs (Desktop) */}
        <div className={`hidden lg:flex flex-1 gap-4 ${isHomePage ? 'items-center' : scrolled || isAlwaysSmallPage ? 'items-center' : 'items-end'} ${isCreateWillPage ? 'absolute left-4' : ''}`}>
          {isMarketingPage && (
            <div className="flex items-center gap-0.5">
              {marketingTabs.map((tab) =>
                tab.href ? (
                  <Link
                    key={tab.label}
                    to={tab.href}
                    className={`px-2 py-1 rounded font-medium text-sm whitespace-nowrap ${location.pathname === tab.href ? "text-willow" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
                  >
                    {tab.label}
                  </Link>
                ) : (
                  <a
                    key={tab.label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-medium text-sm whitespace-nowrap"
                  >
                    {tab.label}
                  </a>
                )
              )}
              <div ref={resourcesRef} className="relative" onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((o) => !o)}
                  aria-expanded={resourcesOpen}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-sm font-medium whitespace-nowrap ${onResourcesPage ? "text-willow" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  Resources
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
                </button>
                {resourcesOpen && (
                  <div className="absolute left-0 top-full z-50 w-60 pt-1.5">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white py-1.5" style={{ boxShadow: "0 8px 28px rgba(16,24,40,0.10)" }}>
                      {resourceLinks.map(({ label, href, Icon }) => (
                        <Link
                          key={href}
                          to={href}
                          onClick={() => setResourcesOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2 text-sm font-medium ${location.pathname === href ? "text-willow" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                          <Icon className={`h-4 w-4 ${location.pathname === href ? "text-willow" : "text-gray-400"}`} />
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {isClientsPage && (
            <Link 
              to="/learn" 
              className={`px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded font-medium ${isHomePage ? 'text-base md:text-lg' : scrolled || isAlwaysSmallPage ? 'text-base md:text-lg' : 'text-base mt-12 md:mt-8 lg:mt-8'}`}
            >
              Learn
            </Link>
          )}
        </div>
        
        {/* Centered logo - Shifts left on mobile when hero CTA is out of view */}
        <div className={`flex ${isHomePage || isAboutUsPage ? 'items-center' : scrolled || isAlwaysSmallPage ? 'items-center' : 'items-end'} transition-all duration-300 ${
          isCreateWillPage 
            ? 'absolute left-1/2 transform -translate-x-1/2 py-6' 
            : scrolledPastHero || isAlwaysSmallPage
              ? 'md:absolute md:left-1/2 md:transform md:-translate-x-1/2 absolute left-0 ml-[4.75rem] md:ml-0' 
              : 'absolute left-1/2 transform -translate-x-1/2'
        }`}>
          <Link to="/" className="flex items-center">
            {(scrolledPastHero || isAlwaysSmallPage) ? (
              <img
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
                alt="Willow Logo"
                className={`${isMarketingPage ? 'h-11 md:h-12' : 'h-11 md:h-20'}`}
              />
            ) : (
              <img
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png"
                alt="Willow Logo"
                className={`${isMarketingPage ? 'h-11 md:h-12' : isAboutUsPage ? 'h-16 md:h-20' : scrolled || isAlwaysSmallPage ? 'h-16 md:h-20' : 'h-16 md:h-20 mt-12 md:mt-8 lg:mt-8'}`}
              />
            )}
          </Link>
        </div>
        
        {/* Right side - Schedule a Demo button (only shows when hero CTA is out of view, not on booking pages) */}
        {!isBookPage && !isRequestAccessPage && (
          <div className="flex flex-1 justify-end items-center gap-1">
            <div className={`transition-opacity duration-300 ${scrolledPastHero || (isAlwaysSmallPage && !isBookPage && !isRequestAccessPage) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {!isCreateWillPage && (
                <Button
                  size="sm"
                  className="willow-btn px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium"
                  style={{
                    boxShadow: '0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)'
                  }}
                  onClick={() => navigate('/request-access')}
                >
                  {isPitolPage ? 'Request an invitation' : 'Book a Demo'}
                </Button>
              )}
            </div>
          </div>
        )}
        
        {isCreateWillPage && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2">
            <div className="rounded-full border-4 border-background overflow-hidden w-24 h-24">
              <img 
                src="/lovable-uploads/705cc112-2e95-4f02-8977-fed85638cb3f.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
