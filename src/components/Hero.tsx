import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const app_url = import.meta.env.VITE_WILLOW_APP_URL || 'https://app.willow-inc.com';
  const app_landing_uri = import.meta.env.VITE_WILLOW_APP_LANDING_URI;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <section id="hero" className="min-h-screen w-full relative overflow-hidden bg-[#F8FAFC] pt-[env(safe-area-inset-top)]">
      {/* Logo fixed at top */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-5 md:py-6 bg-background/100 border-b border-border' : 'py-4 md:py-5 lg:py-6'}`}>
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
                <a 
                  href={`${app_url}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium"
                >
                  My Account
                </a>
              </div>
            </div>
          )}

          {/* Left side - Learn and For Lawyers links (Desktop) */}
          <div className={`hidden lg:flex flex-1 gap-4 items-center transition-all duration-300`}>
            <Link 
              to="/learn" 
              className={`transition-all duration-500 px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium text-base md:text-lg`}
            >
              Learn
            </Link>
            <Link 
              to="/for-lawyers" 
              className={`transition-all duration-500 px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium text-base md:text-lg`}
            >
              For Lawyers
            </Link>
            <Link 
              to="/giveback" 
              className={`transition-all duration-500 px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium text-base md:text-lg`}
            >
              Giveback
            </Link>
          </div>
          
          {/* Centered logo */}
          <div className={`flex ${scrolled ? 'items-center' : 'items-end'} transition-all duration-300 absolute left-1/2 transform -translate-x-1/2`}>
            <a href="/" className="flex items-end">
              <img 
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                alt="Willow Logo" 
                className={`transition-all duration-500 ${scrolled ? 'h-16 md:h-20' : 'h-16 sm:h-16 md:h-20 mt-12 md:mt-16 lg:mt-20'}`} 
              />
            </a>
          </div>
          
          {/* Right side - My Account button (Desktop) */}
          <div className={`hidden lg:flex flex-1 justify-end items-center transition-all duration-300`}>
            <a 
              href={`${app_url}/login`}
              className={`transition-all duration-500 px-3 py-1 text-gray-600 hover:text-willow hover:bg-gray-50 rounded font-medium text-base md:text-lg`}
            >
              My Account
            </a>
          </div>
          <div className="md:hidden flex-1"></div>
        </div>
      </header>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-start items-center">
        <div className="container mx-auto px-4 pt-40">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in md:lg:mb-40">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 font-heading font-light text-[#222222]" style={{ lineHeight: '1.3' }}>
                We handle what<br className="hidden md:inline" /> you'd rather ignore
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 md:mb-8" style={{ lineHeight: '1.35' }}>
                Create, sign, and store your will<br className="hidden sm:inline" /> — all in one place.
              </p>
              <div className="flex justify-center mb-4 md:mb-8">
                <a href={`${app_url}${app_landing_uri}`}>
                  <Button 
                    size="lg" 
                    className="willow-btn px-6 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7 text-base sm:text-lg md:text-xl"
                    style={{
                      boxShadow: '0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)'
                    }}
                  >
                    Make my Will
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image Layer */}
      <div 
        className="absolute top-20 md:top-24 lg:top-28 xl:top-32 left-0 right-0 bottom-0 w-full z-0 hidden md:block"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          backgroundPosition: "center bottom",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none"
        }}
      />
      <div 
        className="absolute inset-0 w-full h-full z-0 md:hidden"
        style={{
          backgroundImage: "url('/bg-hero-mobile.png')",
          backgroundPosition: "center bottom",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none"
        }}
      />
    </section>
  );
};

export default Hero;
