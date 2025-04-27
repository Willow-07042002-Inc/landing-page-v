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
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in">
              <h1 
                className="text-4xl lg:text-6xl leading-tight mb-2 font-heading font-light" 
                style={{ color: '#222222' }}
              >
                We handle what<br />
                you'd rather ignore
              </h1>
              <p className="text-lg text-muted-foreground mb-2 md:mb-4">
                Create, sign, and store your will.<br />
                <span className="inline-block">All in one place.</span>
              </p>
              <div className="flex justify-center mb-2 md:mb-4">
                <a href="https://willow-test-deploy.vercel.app/coming-soon">
                  <Button size="lg" className="willow-btn px-8 py-6 text-lg">
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