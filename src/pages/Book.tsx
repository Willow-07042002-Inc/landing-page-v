import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";

const Book = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        "theme": "light",
        "styles": { "branding": { "brandColor": "#138F8B" } },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
    })();

    // Add custom CSS to hide green circles and position meeting info on mobile
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide green availability indicator circles/dots */
      [data-testid*="indicator"],
      [class*="indicator"],
      .cal-availability-indicator,
      [class*="availability"] > span::before,
      [class*="available"]::before {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* On mobile, move meeting info to the right when stacked */
      @media (max-width: 767px) {
        /* Target Cal.com's event details section */
        [class*="cal-"] [class*="event-meta"],
        [class*="Cal"] [class*="event-meta"],
        [class*="cal-"] [class*="eventDetails"],
        [class*="Cal"] [class*="eventDetails"],
        [class*="cal-"] > div:first-child,
        [class*="Cal"] > div:first-child {
          text-align: right !important;
          align-items: flex-end !important;
          justify-content: flex-end !important;
        }
        
        /* Ensure flex containers align to right */
        [class*="cal-"] [class*="flex"],
        [class*="Cal"] [class*="flex"] {
          justify-content: flex-end !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-grow bg-[#F8FAFC]">
        {/* Hero Section with Calendar */}
        <section className="bg-[#F8FAFC] pt-24 md:pt-24 lg:pt-28 pb-[100px] md:pb-8 lg:pb-8 hero-section">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl w-full">
            <div className="text-center mb-4 lg:mb-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-[#222222] mb-3 md:mb-4 leading-tight" style={{ lineHeight: '1.2' }}>
                  You're invited
                </h1>

              {/* Subheader */}
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Take a moment to introduce yourself and <br className="hidden md:inline" />explore how we can simplify life for your clients.
              </p>
            </div>

            {/* Calendar */}
            <div className="max-w-4xl mx-auto bg-[#F8FAFC] overflow-visible rounded-xl cal-booking-container lg:-mt-3" style={{ 
              border: 'none' 
            }}>
              {/* Cal.com React Embed */}
              <Cal
                calLink="aaron-burlacoff-willow/15mindemo"
                style={{ width: "100%", height: "100%", overflow: "auto", margin: "0", padding: "0" }}
                config={{
                  layout: "month_view",
                  theme: "light"
                }}
              />
            </div>
            
            <style>{`
              /* Hide reviews below 768px – section removed, footer moves up */
              @media (max-width: 767px) {
                .reviews-section {
                  display: none !important;
                }
              }
              
              /* Hero section - dynamic height, 100px bottom padding on vertical layouts */
              .hero-section {
                min-height: auto !important;
                height: auto !important;
                display: block !important;
              }
              
              /* Ensure container wraps content tightly */
              .hero-section > div {
                margin-bottom: 0 !important;
                padding-bottom: 0 !important;
              }
              
              .cal-booking-container {
                height: 500px;
                max-height: 60vh;
                min-height: 500px;
                margin-bottom: 0 !important;
              }
              
              /* Tablet screens (768px - 1024px) - same height as larger screens */
              @media (min-width: 768px) and (max-width: 1024px) {
                .cal-booking-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 500px;
                  max-height: 60vh;
                  min-height: 500px;
                  overflow: visible;
                  margin-bottom: 0 !important;
                }
                
                .cal-booking-container iframe {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 500px !important;
                  overflow: visible !important;
                }
              }
              
              /* Below 768px - large height to accommodate stacked layout */
              @media (max-width: 767px) {
                .cal-booking-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 2000px;
                  max-height: none;
                  min-height: 2000px;
                  overflow: visible;
                  margin-bottom: 0 !important;
                }
                
                .cal-booking-container iframe {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 2000px !important;
                  overflow: visible !important;
                }
              }
              
              /* Mobile screens - large height to accommodate all content */
              @media (max-width: 640px) {
                .cal-booking-container {
                  min-width: 0 !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 2000px;
                  max-height: none;
                  min-height: 2000px;
                  overflow: visible;
                }
                
                .cal-booking-container iframe {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 2000px !important;
                  overflow: visible !important;
                }
              }
              
              /* Very small mobile screens */
              @media (max-width: 480px) {
                .cal-booking-container {
                  height: 1800px;
                  max-height: none;
                  min-height: 1800px;
                  overflow: visible;
                  margin-bottom: 0 !important;
                }
                
                .cal-booking-container iframe {
                  height: 1800px !important;
                  overflow: visible !important;
                }
              }
            `}</style>
          </div>
        </section>

        {/* Testimonials Section - Right under calendar (hidden below 768px) */}
        <section className="reviews-section pt-0 md:pt-6 lg:pt-6 pb-12 md:pb-16 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              <div className="p-6 text-center">
                <p className="text-gray-600 italic mb-3">
                  "Willow feels intentionally built for how attorneys work — and how clients actually live."
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  — David Castellano
                </p>
              </div>

              <div className="p-6 text-center">
                <p className="text-gray-600 italic mb-3">
                  "The story and team behind Willow are exactly what this industry needs"
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  — Katherine Rosenberg
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Book;

