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

    // Listen for Cal.com height updates via postMessage
    const messageHandler = (event: MessageEvent) => {
      if (window.innerWidth < 768) {
        const container = document.querySelector('.cal-booking-container');
        const iframe = container?.querySelector('iframe');
        
        // Check if this is a Cal.com height message
        if (event.data && typeof event.data === 'object') {
          if (event.data.type === 'cal-iframe-height' || event.data.calHeight || event.data.height) {
            const height = event.data.height || event.data.calHeight || event.data.cal?.height;
            if (height && iframe && container) {
              iframe.style.height = `${height}px`;
              container.style.height = `${height}px`;
            }
          }
        }
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]">
      <Navbar />
      <main className="flex-grow bg-[#FCFCFD]">
        {/* Hero Section with Calendar */}
        <section className="bg-[#FCFCFD] pt-28 md:pt-32 pb-[100px] md:pb-12 hero-section">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl w-full">
            <div className="text-center mb-8 md:mb-10">
              <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Book a demo</div>
              <h1 className="mx-auto max-w-3xl font-heading text-2xl font-light text-[#222222] sm:text-3xl md:text-4xl" style={{ lineHeight: 1.25 }}>
                Explore how Willow can best support your <br className="hidden md:inline" />firm and simplify life for your clients.
              </h1>
            </div>

            {/* Calendar */}
            <div className="max-w-4xl mx-auto bg-[#FCFCFD] overflow-visible rounded-xl cal-booking-container" style={{ 
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
                  margin-bottom: 0 !important;
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

      </main>
      <Footer />
    </div>
  );
};

export default RequestAccess;

