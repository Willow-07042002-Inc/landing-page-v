import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isCreateWillPage = location.pathname === "/create-will";
  const isForLawyersPage = location.pathname === "/for-lawyers";
  const isGivebackPage = location.pathname === "/giveback";
  const isAboutUsPage = location.pathname === "/about-us";
  const isBookPage = location.pathname === "/book";
  const isRequestAccessPage = location.pathname === "/request-access";
  const alwaysSmallPages = ["/availability-map", "/terms", "/privacy", "/contact", "/learn", "/book", "/request-access"];
  const isAlwaysSmallPage = alwaysSmallPages.includes(location.pathname);
  
  // Check if user is marked as a lawyer (or on a booking page — those visitors are always lawyers)
  const isLawyer = sessionStorage.getItem('willow-user-type') === 'lawyer';
  const logoDestination = (isLawyer || isBookPage || isRequestAccessPage) ? "/for-lawyers" : "/";

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
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/100 ${isForLawyersPage || isGivebackPage || isAboutUsPage ? 'py-5 md:py-6 border-b border-border' : scrolled || isAlwaysSmallPage ? 'py-5 md:py-6 border-b border-border' : 'py-6 md:py-12'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg lg:hidden">
            <div className="flex flex-col p-4 gap-2">
              <Link 
                to="/learn" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium"
              >
                Learn
              </Link>
              <Link 
                to="/for-lawyers" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium"
              >
                For Lawyers
              </Link>
              <Link 
                to="/giveback" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium"
              >
                Giveback
              </Link>
            </div>
          </div>
        )}

        {/* Left side - Learn and For Lawyers links (Desktop) */}
        <div className={`hidden lg:flex flex-1 gap-4 ${isForLawyersPage || isGivebackPage ? 'items-center' : scrolled || isAlwaysSmallPage ? 'items-center' : 'items-end'} ${isCreateWillPage ? 'absolute left-4' : ''}`}>
          <Link 
            to="/learn" 
            className={`px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium ${isForLawyersPage || isGivebackPage ? 'text-base md:text-lg' : scrolled || isAlwaysSmallPage ? 'text-base md:text-lg' : 'text-base mt-12 md:mt-8 lg:mt-8'}`}
          >
            Learn
          </Link>
          <Link 
            to="/for-lawyers" 
            className={`px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium ${isForLawyersPage || isGivebackPage ? 'text-base md:text-lg' : scrolled || isAlwaysSmallPage ? 'text-base md:text-lg' : 'text-base mt-12 md:mt-8 lg:mt-8'}`}
          >
            For Lawyers
          </Link>
          <Link 
            to="/giveback" 
            className={`px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium ${isForLawyersPage || isGivebackPage ? 'text-base md:text-lg' : scrolled || isAlwaysSmallPage ? 'text-base md:text-lg' : 'text-base mt-12 md:mt-8 lg:mt-8'}`}
          >
            Giveback
          </Link>
        </div>
        
        {/* Centered logo - Shifts left on mobile when hero CTA is out of view */}
        <div className={`flex ${isForLawyersPage || isGivebackPage || isAboutUsPage ? 'items-center' : scrolled || isAlwaysSmallPage ? 'items-center' : 'items-end'} transition-all duration-300 ${
          isCreateWillPage 
            ? 'absolute left-1/2 transform -translate-x-1/2 py-6' 
            : scrolledPastHero || isAlwaysSmallPage
              ? 'md:absolute md:left-1/2 md:transform md:-translate-x-1/2 absolute left-0 ml-14 md:ml-0' 
              : 'absolute left-1/2 transform -translate-x-1/2'
        }`}>
          {isBookPage || isRequestAccessPage ? (
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("willow-user-type", "lawyer");
                navigate("/for-lawyers");
              }}
              className="flex items-center bg-transparent border-0 p-0 cursor-pointer"
              aria-label="Go to For Lawyers"
            >
              {(scrolledPastHero || isAlwaysSmallPage) ? (
                <>
                  <div className="md:hidden text-[#138F8B] flex items-center justify-center" style={{ fontFamily: 'Pacifico, cursive', height: '64px', fontSize: '2rem', lineHeight: '1', fontWeight: '400' }}>W</div>
                  <img 
                    src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                    alt="Willow Logo" 
                    className="hidden md:block h-16 md:h-20" 
                  />
                </>
              ) : (
                <img 
                  src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                  alt="Willow Logo" 
                  className={`${isForLawyersPage || isGivebackPage || isAboutUsPage ? 'h-16 md:h-20' : scrolled || isAlwaysSmallPage ? 'h-16 md:h-20' : 'h-16 md:h-20 mt-12 md:mt-8 lg:mt-8'}`} 
                />
              )}
            </button>
          ) : (
          <Link to={logoDestination} className="flex items-center">
            {(scrolledPastHero || isAlwaysSmallPage) ? (
              <>
                <div className="md:hidden text-[#138F8B] flex items-center justify-center" style={{ fontFamily: 'Pacifico, cursive', height: '64px', fontSize: '2rem', lineHeight: '1', fontWeight: '400' }}>W</div>
                <img 
                  src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                  alt="Willow Logo" 
                  className="hidden md:block h-16 md:h-20" 
                />
              </>
            ) : (
              <img 
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                alt="Willow Logo" 
                className={`${isForLawyersPage || isGivebackPage || isAboutUsPage ? 'h-16 md:h-20' : scrolled || isAlwaysSmallPage ? 'h-16 md:h-20' : 'h-16 md:h-20 mt-12 md:mt-8 lg:mt-8'}`} 
              />
            )}
          </Link>
          )}
        </div>
        
        {/* Right side - Schedule a Demo button (only shows when hero CTA is out of view, not on booking pages) */}
        {!isBookPage && !isRequestAccessPage && (
          <div className={`flex flex-1 justify-end items-center transition-opacity duration-300 ${scrolledPastHero || (isAlwaysSmallPage && !isBookPage && !isRequestAccessPage) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {!isCreateWillPage && (scrolledPastHero || (isAlwaysSmallPage && !isBookPage && !isRequestAccessPage)) && (
              <Button 
                size="sm"
                className="willow-btn px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium"
                style={{
                  boxShadow: '0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)'
                }}
                onClick={() => navigate('/request-access')}
              >
                Request Access
              </Button>
            )}
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
