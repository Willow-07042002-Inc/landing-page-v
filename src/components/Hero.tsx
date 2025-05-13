import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isIpadPro, setIsIpadPro] = useState(false);
  const [isIpadProPortrait, setIsIpadProPortrait] = useState(false);
  const [isIpadProLandscape, setIsIpadProLandscape] = useState(false);
  const [isIpadAir, setIsIpadAir] = useState(false);
  const [isIpadMini, setIsIpadMini] = useState(false);
  const [isIpadMiniPortrait, setIsIpadMiniPortrait] = useState(false);
  const [isIpadMiniLandscape, setIsIpadMiniLandscape] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check if device is iPad Pro or iPad Air dimension
    const checkIpadDimensions = () => {
      // iPad Pro dimensions check (both orientations)
      const isIpadProPortraitDimensions = 
        window.innerWidth >= 1024 && 
        window.innerWidth <= 1024 && 
        window.innerHeight >= 1366;
      
      const isIpadProLandscapeDimensions = 
        window.innerWidth >= 1366 && 
        window.innerHeight >= 1024 && 
        window.innerHeight <= 1024;
      
      // iPad Air dimensions check
      const isIpadAirDimensions = 
        window.innerWidth >= 800 && 
        window.innerWidth <= 840 && 
        window.innerHeight >= 1160 && 
        window.innerHeight <= 1200;
        
      // iPad Mini dimensions check (both orientations)
      const isIpadMiniPortraitDimensions = 
        window.innerWidth >= 750 && 
        window.innerWidth <= 790 && 
        window.innerHeight >= 1000 && 
        window.innerHeight <= 1050;
      
      const isIpadMiniLandscapeDimensions = 
        window.innerWidth >= 1000 && 
        window.innerWidth <= 1050 && 
        window.innerHeight >= 750 && 
        window.innerHeight <= 790;

      setIsIpadProPortrait(isIpadProPortraitDimensions);
      setIsIpadProLandscape(isIpadProLandscapeDimensions);
      setIsIpadPro(isIpadProPortraitDimensions || isIpadProLandscapeDimensions);
      setIsIpadAir(isIpadAirDimensions);
      setIsIpadMiniPortrait(isIpadMiniPortraitDimensions);
      setIsIpadMiniLandscape(isIpadMiniLandscapeDimensions);
      setIsIpadMini(isIpadMiniPortraitDimensions || isIpadMiniLandscapeDimensions);
    };

    // Initial check
    checkIpadDimensions();
    
    // Listen for resize and orientation events
    window.addEventListener("resize", checkIpadDimensions);
    window.addEventListener("orientationchange", checkIpadDimensions);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkIpadDimensions);
      window.removeEventListener("orientationchange", checkIpadDimensions);
    };
  }, [scrolled]);

  // Function to determine the margin top based on device
  const getMarginTop = () => {
    if (isIpadProPortrait) return { marginTop: '-20rem' };
    if (isIpadProLandscape) return { marginTop: '-10rem' };
    if (isIpadAir) return { marginTop: '-20rem' };
    if (isIpadMiniPortrait) return { marginTop: '-15rem' };
    if (isIpadMiniLandscape) return { marginTop: '-8rem' };
    return {};
  };

  // Function to determine heading text size based on device
  const getHeadingStyles = () => {
    const baseStyle = { color: '#222222' };
    
    if (isIpadPro) {
      return { 
        ...baseStyle,
        fontSize: '5rem',
        lineHeight: '1.1'
      };
    }
    
    if (isIpadAir) {
      return { 
        ...baseStyle,
        fontSize: '4rem',
        lineHeight: '1.1'
      };
    }
    
    if (isIpadMini) {
      return {
        ...baseStyle,
        fontSize: '3.5rem',
        lineHeight: '1.1'
      };
    }
    
    return baseStyle;
  };

  // Function to determine paragraph text size based on device
  const getParagraphStyles = () => {
    if (isIpadPro) {
      return { 
        fontSize: '1.75rem',
        lineHeight: '2.2rem'
      };
    }
    
    if (isIpadAir) {
      return { 
        fontSize: '1.5rem',
        lineHeight: '1.8rem'
      };
    }
    
    if (isIpadMini) {
      return {
        fontSize: '1.25rem',
        lineHeight: '1.6rem'
      };
    }
    
    return {};
  };

  // Function to determine button styles based on device
  const getButtonStyles = () => {
    if (isIpadPro) {
      return { 
        fontSize: '1.5rem',
        padding: '2rem 3rem'
      };
    }
    
    if (isIpadAir) {
      return { 
        fontSize: '1.3rem',
        padding: '1.75rem 2.5rem'
      };
    }
    
    if (isIpadMini) {
      return {
        fontSize: '1.15rem',
        padding: '1.5rem 2.25rem'
      };
    }
    
    return {};
  };

  return (
    <section id="hero" className="min-h-screen w-full relative overflow-hidden">
      {/* Logo fixa no topo */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/100 transition-all duration-300 ${scrolled ? 'py-4 border-b border-border' : 'py-6 md:py-12'}`}>
        <div className="container mx-auto px-4 flex items-center justify-center relative">
          <div className={`flex ${scrolled ? 'items-center' : 'items-end'} transition-all duration-300`}>
            <a href="/" className="flex items-end">
              <img 
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                alt="Willow Logo" 
                className={`transition-all duration-500 ${scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20 mt-12 md:mt-8 lg:mt-8'}`} 
              />
            </a>
          </div>
        </div>
      </header>
      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center pb-60 md:pb-0 pt-8 md:pt-0 md:mb-0">
        <div 
          className="container mx-auto px-4"
          style={getMarginTop()}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in">
              <h1 
                className="text-4xl lg:text-6xl leading-tight mb-2 font-heading font-light" 
                style={getHeadingStyles()}
              >
                We handle what<br />
                you'd rather ignore
              </h1>
              <p 
                className="text-lg text-muted-foreground mb-2 md:mb-4"
                style={getParagraphStyles()}
              >
                Create, sign, and store your will.<br />
                <span className="inline-block">All in one place.</span>
              </p>
              <div className="flex justify-center mb-2 md:mb-4">
                <a href="https://willow-test-deploy.vercel.app/coming-soon">
                  <Button 
                    size="lg" 
                    className="willow-btn px-8 py-6 text-lg"
                    style={getButtonStyles()}
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
        className="absolute inset-0 w-full h-full z-0"
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