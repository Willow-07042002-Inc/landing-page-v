import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pitol = () => {
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
        /* Both icons on screen (1025px+): lamp = bonsai size (larger), bonsai = lamp size (smaller) */
        @media (min-width: 1025px) {
          .flower-hero,
          .pitol-lamp-hero {
            height: 65vh !important;
            max-height: 65vh !important;
          }
          .flower-hero img,
          .pitol-lamp-hero img {
            height: 100% !important;
            width: auto !important;
          }
          .pitol-lamp-hero {
            display: flex !important;
            align-items: flex-end !important;
            left: -280px !important;
          }
          .piggy-hero {
            height: 50vh !important;
            max-height: 50vh !important;
          }
          .piggy-hero img {
            height: 100% !important;
            width: auto !important;
          }
        }
        @media (max-width: 1024px) {
          .pitol-bonsai-hero,
          .pitol-mobile-bonsai {
            display: none !important;
          }
          .pitol-lamp-hero {
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            height: 58vh !important;
            max-height: 58vh !important;
          }
          .pitol-lamp-hero img {
            height: 100% !important;
            width: auto !important;
            max-width: none !important;
          }
        }
        /* When logo is "W" (below md / 768px), make lamp larger */
        @media (max-width: 768px) {
          .pitol-lamp-hero {
            height: 68vh !important;
            max-height: 68vh !important;
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 font-heading font-light text-[#222222]" style={{ lineHeight: '1.3' }}>
                  Founding Firms
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto" style={{ lineHeight: '1.35' }}>
                  A small group of estate planning attorneys<br className="hidden sm:inline" />focused on making life easy.
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
                    Request an invitation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Table lamp - Bottom Left (above 700px only) */}
        <div className="absolute z-10 pointer-events-none hero-icon-700 flower-hero pitol-lamp-hero" style={{ left: '-200px', bottom: '-50px', display: 'none' }}>
          <img 
            src="/Tablelamp.png"
            alt="Table lamp"
            className="w-auto h-[620px] object-contain"
            style={{ objectPosition: 'bottom left' }}
          />
        </div>
        
        {/* Bonsai - Bottom Right (above 700px only) */}
        <div className="absolute z-10 pointer-events-none hero-icon-700 piggy-hero pitol-bonsai-hero" style={{ right: '-150px', bottom: '-25px', display: 'none' }}>
          <img 
            src="/Bonsai.png"
            alt="Bonsai"
            className="w-auto h-[450px] object-contain"
            style={{ objectPosition: 'bottom right' }}
          />
        </div>
        
        {/* Bonsai - Centered (below 700px only; hidden on Pitol under 1024px so lamp is always the only icon) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 pointer-events-none computer-center-hero pitol-mobile-bonsai flex items-end justify-center" style={{ bottom: '-50px' }}>
          <img 
            src="/Bonsai.png"
            alt="Bonsai"
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

      {/* Quote Section */}
      <section className="bg-gray-100 py-28 px-6 md:py-32 md:px-10 lg:py-40 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <blockquote className="text-center text-xl md:text-2xl lg:text-3xl text-gray-700 italic leading-relaxed">
            "We're working with a select group of estate planning attorneys whose values align with ours. Our goal is straightforward: to learn what you and your clients would value most from a platform like this."
          </blockquote>
          <p className="text-center text-lg md:text-xl text-gray-600 mt-8 md:mt-10">
            — Aaron Burlacoff, Founder and CEO
          </p>
        </div>
      </section>

      <main className="flex-grow">
      </main>
      <Footer />
    </div>
  );
};

export default Pitol;
