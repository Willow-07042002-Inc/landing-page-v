import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center relative pt-20 pb-0 md:pb-0 md:[background-position:left_bottom] md:[background-size:42%] [background-position:center_bottom] [background-size:100%]"
      style={{
        backgroundImage: "url('/bg-hero.png')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="w-full mb-32 animate-fade-in md:mb-10">
            <h1 className="text-4xl lg:text-6xl leading-tight mb-4 md:mb-6 text-center font-heading font-light md:text-6xl" style={{
              color: '#222222'
            }}>
              We handle what<br />
              you'd rather ignore
            </h1>
            <p className="text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
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
    </section>
  );
};

export default Hero;