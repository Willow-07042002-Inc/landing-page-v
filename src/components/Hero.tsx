import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen w-full relative overflow-hidden">
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

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-fade-in">
              <h1 
                className="text-4xl lg:text-6xl leading-tight mb-4 md:mb-6 font-heading font-light" 
                style={{
                  color: '#222222'
                }}
              >
                We handle what<br />
                you'd rather ignore
              </h1>
              <p className="text-lg text-muted-foreground mb-6 md:mb-8">
                Create, sign, and store your will.<br />
                <span className="inline-block">All in one place.</span>
              </p>
              <div className="flex justify-center">
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
    </section>
  );
};

export default Hero;