import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

const ColoradoCallToAction = () => {
  useEffect(() => {
    // Check for URL parameter to auto-scroll to Colorado section
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToColorado = urlParams.get('colorado') === 'true';
    
    if (scrollToColorado) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const coloradoSection = document.getElementById('colorado');
        if (coloradoSection) {
          coloradoSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, []);

  return (
    <section id="colorado" className="relative min-h-screen md:min-h-[80vh] py-16 md:py-24 bg-white overflow-hidden flex flex-col justify-center">
      {/* Left mountains - adjusted for mobile spacing */}
      <div className="absolute bottom-0 left-0 w-[95vw] h-[24rem] md:h-[40rem] z-10 overflow-hidden">
        <img 
          src="/mountains-left.png" 
          alt="Left mountains" 
          className="w-full h-full object-contain object-left-bottom"
        />
      </div>
      
      {/* Right mountains - enlarged by 8rem height (twice gondola increase) - hidden on mobile */}
      <div className="absolute bottom-0 right-0 w-[95vw] h-[36rem] md:h-[40rem] z-10 overflow-hidden hidden md:block">
        <img 
          src="/mountains-right.png" 
          alt="Right mountains" 
          className="w-full h-full object-contain object-right-bottom"
        />
      </div>
      
      {/* Left gondola - hidden on mobile, visible on desktop */}
      <div className="absolute -top-14 -left-36 w-[40rem] h-[40rem] z-20 hidden md:block">
        <img 
          src="/gondola.png" 
          alt="Left gondola" 
          className="w-full h-full object-contain object-left-top"
        />
      </div>
      
      {/* Right gondola - micro-adjusted up a couple pixels - hidden on mobile */}
      <div className="absolute -top-9 md:-top-14 -right-28 md:-right-36 w-[32rem] h-[32rem] md:w-[40rem] md:h-[40rem] z-20 hidden md:block">
        <img 
          src="/gondola.png" 
          alt="Right gondola" 
          className="w-full h-full object-contain object-right-top scale-x-[-1]"
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-20 w-full flex flex-col justify-start md:justify-center items-center min-h-[60vh] pt-20 md:pt-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl mx-auto">
              {/* Main heading */}
              <h2 className="text-4xl md:text-5xl font-heading font-light text-gray-900 mb-12">
                This is about you, <br /> so tell us what you want <br /> us to handle.
              </h2>
              
              {/* Subheader */}
              <p className="text-lg md:text-xl text-gray-700 mb-16 max-w-2xl mx-auto">
                Be part of a group of parents building a simpler <br /> future for Colorado families.
              </p>
              
              {/* CTA Button */}
              <div className="flex justify-center">
                <a href="https://app.willow-inc.com/colorado-family" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    className="text-white font-semibold py-4 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    style={{
                      backgroundColor: '#00BCBA',
                      borderColor: '#00BCBA'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#009B9A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#00BCBA';
                    }}
                  >
                    LET'S DO THIS!
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColoradoCallToAction;