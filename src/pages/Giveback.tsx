import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Giveback = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{
      color: '#222222'
    }}>
      <style>{`
        @media (min-width: 700px) {
          .hero-icon-700 {
            display: block !important;
          }
          .computer-center-hero {
            display: none !important;
          }
        }
        @media (max-width: 699px) {
          .hero-icon-700 {
            display: none !important;
          }
          .computer-center-hero {
            display: block !important;
            height: 50vh;
            max-height: 50vh;
          }
          .computer-center-hero img {
            height: 100%;
            width: auto;
            max-width: none;
          }
          .hero-curve-mobile {
            height: 50vh !important;
            max-height: 50vh !important;
          }
        }
        @media (max-width: 1299px) and (min-width: 700px) {
          .flower-hero {
            height: 58vh !important;
            max-height: 58vh !important;
          }
          .flower-hero img {
            height: 100% !important;
            width: auto !important;
          }
          .piggy-hero {
            height: 58vh !important;
            max-height: 58vh !important;
          }
          .piggy-hero img {
            height: 100% !important;
            width: auto !important;
          }
        }
      `}</style>
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen w-full relative overflow-hidden bg-[#F8FAFC] pt-[env(safe-area-inset-top)]">
        <div className="relative z-20 w-full min-h-screen flex flex-col justify-start items-center">
          <div className="container mx-auto px-4 pt-32 md:pt-40">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-fade-in md:lg:mb-40">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 font-heading font-light text-[#222222]" style={{ lineHeight: '1.3' }}>
                  Planting Seeds to <br />Help Communities <span className="text-[#138F8B]">Grow</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8" style={{ lineHeight: '1.35' }}>
                  Through nonprofit partnerships, Willow expands access to<br className="hidden sm:inline" /> estate planning and supports families where it matters most.
                </p>
                <div className="flex justify-center mb-4 md:mb-8">
                  <Button
                    size="lg"
                    className="willow-btn px-6 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7 text-base sm:text-lg md:text-xl"
                    style={{
                      boxShadow: '0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)'
                    }}
                    onClick={() => navigate('/request-access')}
                    data-hero-demo-button
                  >
                    Partner with us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flower - Bottom Left (above 700px only) */}
        <div className="absolute z-10 pointer-events-none hero-icon-700 flower-hero" style={{ left: '-280px', bottom: '-50px', display: 'none' }}>
          <img 
            src="/FlowerGivebackHero.png"
            alt="Flower"
            className="w-auto h-[500px] object-contain"
            style={{ objectPosition: 'bottom left' }}
          />
        </div>
        
        {/* Piggy Bank - Bottom Right (above 700px only) */}
        <div className="absolute z-10 pointer-events-none hero-icon-700 piggy-hero" style={{ right: '-150px', bottom: '-50px', display: 'none' }}>
          <img 
            src="/PiggyBank.png"
            alt="Piggy Bank"
            className="w-auto h-[450px] object-contain"
            style={{ objectPosition: 'bottom right' }}
          />
        </div>
        
        {/* Piggy Bank - Centered (below 700px only) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 pointer-events-none computer-center-hero flex items-end justify-center" style={{ bottom: '-50px' }}>
          <img 
            src="/PiggyBank.png"
            alt="Piggy Bank"
            className="object-contain"
            style={{ objectPosition: 'bottom center' }}
          />
        </div>
        
        {/* Curved Top Color Block */}
        <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden hero-curve-mobile" style={{ height: '272px' }}>
          <div className="w-full h-full flex justify-center">
            <img 
              src="/Legal Hero SVG.svg" 
              alt="" 
              style={{ 
                width: '100%',
                minWidth: '1440px',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center bottom'
              }}
            />
          </div>
        </div>
      </section>

      {/* Ways We Give Section */}
      <section className="bg-gray-100 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-center mb-[72px] text-[#222222]">
            Ways We Give
          </h2>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Community Workshops */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl relative mb-6">
                <img 
                  src="/workshop.jpg"
                  alt="Community Workshops"
                  className="w-full h-full object-cover object-center"
                  style={{ transform: 'scale(1.25) translateY(5px)' }}
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#222222] text-center">
                Community Workshops
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center max-w-md md:max-w-xs lg:max-w-md">
                Through partnerships with nonprofits, we host free workshops that expand access to estate planning and empower families with the tools they need to plan ahead.
              </p>
            </div>
            
            {/* Family Resources */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl relative mb-6">
                <img 
                  src="/Light.jpg"
                  alt="Family Resources"
                  className="w-full h-full object-cover object-center"
                  style={{ transform: 'scale(1.4) translateY(5px)' }}
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#222222] text-center">
                Family Resources
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-center max-w-md md:max-w-xs lg:max-w-md">
                We develop thoughtful, easy-to-understand resources that help families navigate life's transitions with confidence and support.
              </p>
            </div>
          </div>
          
          {/* Call to Action Button */}
          <div className="flex justify-center mt-12 md:mt-16">
            <Button 
              size="lg" 
              className="willow-btn px-8 py-6 text-lg md:text-xl font-medium"
              style={{
                boxShadow: '0 0 10px rgba(19, 143, 139, 0.3), 0 0 20px rgba(19, 143, 139, 0.15)'
              }}
              onClick={() => navigate('/request-access')}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-grow">
      </main>
      <Footer />
    </div>
  );
};

export default Giveback;

