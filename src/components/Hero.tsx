import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-background/95 border-b border-border backdrop-blur-sm' : 'py-4 md:py-5 lg:py-6'}`}>
        <div className="container mx-auto px-4 flex items-center justify-center relative">
          <div className={`flex ${scrolled ? 'items-center' : 'items-end'} transition-all duration-300`}>
            <a href="/" className="flex items-end">
              <img 
                src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
                alt="Willow Logo" 
                className={`transition-all duration-500 ${scrolled ? 'h-12 sm:h-14 md:h-16' : 'h-14 sm:h-16 md:h-20 mt-6 md:mt-10 lg:mt-8'}`} 
              />
            </a>
          </div>
        </div>
      </header>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:justify-center items-center pb-20 md:pb-40 lg:pb-0">
        <div className="container mx-auto px-4 pt-28 md:pt-28 lg:pt-32">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in md:lg:mb-40">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 font-heading font-light text-[#222222]">
                We handle what<br />
                you'd rather ignore
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 md:mb-8">
                Create, sign, and store your will.<br />
                <span className="inline-block">All in one place.</span>
              </p>
              <div className="flex justify-center mb-4 md:mb-8">
                <a href="https://willow-test-deploy.vercel.app/coming-soon">
                  <Button 
                    size="lg" 
                    className="willow-btn px-6 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7 text-base sm:text-lg md:text-xl"
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
        className="absolute inset-0 w-full h-full z-0 hidden md:block"
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
