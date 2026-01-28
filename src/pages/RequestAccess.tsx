import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";

const RequestAccess = () => {
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
        <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] pt-24 md:pt-24">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl w-full">
            <div className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-[#222222] mb-8 leading-tight" style={{ lineHeight: '1.2' }}>
                  Let's Connect
                </h1>

              {/* Subheader */}
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore how Willow can best support your <br className="hidden md:inline" />firm and simplify life for your clients.
              </p>
            </div>

            {/* Calendar */}
            <div className="max-w-4xl mx-auto bg-[#F8FAFC] overflow-hidden rounded-xl cal-booking-container" style={{ 
              border: 'none' 
            }}>
              {/* Cal.com React Embed */}
              <Cal
                calLink="aaron-burlacoff-willow/request-access"
                style={{ width: "100%", height: "100%", overflow: "auto", margin: "0", padding: "0" }}
                config={{
                  layout: "month_view",
                  theme: "light"
                }}
              />
            </div>
            
            <style>{`
              .cal-booking-container {
                height: 500px;
                max-height: 60vh;
                min-height: 500px;
              }
              
              /* iPad - make calendar thinner */
              @media (min-width: 768px) and (max-width: 1024px) {
                .cal-booking-container {
                  max-width: 32rem !important;
                  height: 700px;
                  max-height: 75vh;
                  min-height: 700px;
                }
              }
              
              /* Tablet and smaller screens - increase height to accommodate stacked layout */
              @media (max-width: 1023px) {
                .cal-booking-container {
                  height: 700px;
                  max-height: 75vh;
                  min-height: 700px;
                }
              }
              
              /* Mobile screens - full height for better usability */
              @media (max-width: 767px) {
                .cal-booking-container {
                  height: 800px;
                  max-height: 85vh;
                  min-height: 600px;
                }
              }
              
              /* Very small mobile screens */
              @media (max-width: 480px) {
                .cal-booking-container {
                  height: 750px;
                  max-height: 90vh;
                  min-height: 550px;
                }
              }
            `}</style>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="pt-6 md:pt-8 pb-12 md:pb-16 bg-[#F8FAFC]">
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

export default RequestAccess;

