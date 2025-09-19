import React from "react";
import { Button } from "@/components/ui/button";

const ColoradoCallToAction = () => {
  return (
    <section className="relative py-32 md:py-48 bg-white overflow-hidden">
      {/* Left mountains - enlarged by 8rem height (twice gondola increase) */}
      <div className="absolute bottom-0 left-0 w-[95vw] h-[36rem] md:h-[40rem] z-10 overflow-hidden">
        <img 
          src="/mountains-left.png" 
          alt="Left mountains" 
          className="w-full h-full object-contain object-left-bottom"
        />
      </div>
      
      {/* Right mountains - enlarged by 8rem height (twice gondola increase) */}
      <div className="absolute bottom-0 right-0 w-[95vw] h-[36rem] md:h-[40rem] z-10 overflow-hidden">
        <img 
          src="/mountains-right.png" 
          alt="Right mountains" 
          className="w-full h-full object-contain object-right-bottom"
        />
      </div>
      
      {/* Left gondola - moved slightly up and outward */}
      <div className="absolute -top-8 md:-top-12 -left-28 md:-left-36 w-[32rem] h-[32rem] md:w-[40rem] md:h-[40rem] z-20">
        <img 
          src="/gondola.png" 
          alt="Left gondola" 
          className="w-full h-full object-contain object-left-top"
        />
      </div>
      
      {/* Right gondola - moved slightly up and outward */}
      <div className="absolute -top-8 md:-top-12 -right-28 md:-right-36 w-[32rem] h-[32rem] md:w-[40rem] md:h-[40rem] z-20">
        <img 
          src="/gondola.png" 
          alt="Right gondola" 
          className="w-full h-full object-contain object-right-top scale-x-[-1]"
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-20 w-full flex flex-col justify-center items-center min-h-[60vh]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="max-w-4xl mx-auto">
              {/* Main heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-12">
                Let's do this Colorado!
              </h2>
              
              {/* Subheader */}
              <p className="text-lg md:text-xl text-gray-700 mb-16 max-w-2xl mx-auto">
                Be part of a group of parents building a simpler future for Colorado families.
              </p>
              
              {/* CTA Button */}
              <div className="flex justify-center">
                <a href="https://app.willow-inc.com/colorado-family" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-semibold py-4 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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