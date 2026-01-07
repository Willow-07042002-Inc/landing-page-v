import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ForLawyers = () => {
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
          }
        }
        @media (max-width: 449px) {
          .computer-center-hero {
            width: 120% !important;
            bottom: 40px !important;
          }
        }
      `}</style>
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen w-full relative overflow-hidden bg-[#F8FAFC] pt-[env(safe-area-inset-top)]">
        <div className="relative z-10 w-full min-h-screen flex flex-col justify-start items-center">
          <div className="container mx-auto px-4 pt-40">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-fade-in md:lg:mb-40">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 font-heading font-light text-[#222222]" style={{ lineHeight: '1.3' }}>
                  The estate planning<br className="hidden md:inline" /> platform <span className="text-[#138F8B]">built for today</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6 md:mb-8" style={{ lineHeight: '1.35' }}>
                  Deliver a modern estate-planning experience<br className="hidden sm:inline" /> your clients trust — and return to.
                </p>
                <div className="flex justify-center mb-4 md:mb-8">
                  <Button 
                    size="lg" 
                    className="willow-btn px-6 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7 text-base sm:text-lg md:text-xl"
                    onClick={() => window.open('https://calendly.com/aaronburlacoff-willow-inc/willow-lets-get-your-will-checked-off', '_blank')}
                    data-hero-demo-button
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coffee Cup - Bottom Left (above 700px only) */}
        <div className="absolute bottom-0 z-10 pointer-events-none hero-icon-700" style={{ left: '-150px', display: 'none' }}>
          <img 
            src="/Coffee Cup for Legal Hero.png"
            alt="Coffee cup"
            className="w-auto h-[320px] object-contain"
            style={{ objectPosition: 'bottom left' }}
          />
        </div>
        
        {/* Computer - Bottom Right (above 700px only) */}
        <div className="absolute bottom-0 z-10 pointer-events-none hero-icon-700" style={{ right: '-150px', display: 'none' }}>
          <img 
            src="/Legal Hero Computer.png"
            alt="Computer"
            className="w-auto h-[380px] object-contain"
            style={{ objectPosition: 'bottom right' }}
          />
        </div>
        
        {/* Computer - Centered (below 700px only) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none computer-center-hero" style={{ width: '80%' }}>
          <img 
            src="/Legal Hero Computer.png"
            alt="Computer"
            className="w-full h-auto object-contain"
            style={{ objectPosition: 'bottom center' }}
          />
        </div>
        
        {/* Curved Top Color Block */}
        <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden" style={{ height: '272px' }}>
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

      {/* Reviews Section */}
      <section className="py-12 md:py-16 bg-gray-100 -mt-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#222222]">
              Trusted by Estate Planning Attorneys
            </h2>
          </div>
          
          {/* Mobile: Horizontal scrolling carousel (visible below md breakpoint) */}
          <div className="block md:hidden overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            <div className="flex gap-6 px-4" style={{ width: 'max-content' }}>
              {/* Review cards */}
              <div className="bg-white rounded-lg p-6 shadow-md flex-shrink-0" style={{ 
                width: 'calc(100vw - 2rem)',
                minWidth: 'calc(100vw - 2rem)',
                maxWidth: 'calc(50vw - 1.5rem)',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/New headshot 2.png" alt="Sarah Whitmore" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">Sarah Whitmore</p>
                    <p className="text-xs text-gray-500">Estate Planning Attorney</p>
                  </div>
                </div>
                <p className="text-foreground text-sm leading-relaxed">"This is something the industry has needed for a while. It's exciting to see a team dedicated to building a modern estate planning solution that respects and enhances the work and expertise of lawyers."</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md flex-shrink-0" style={{ 
                width: 'calc(100vw - 2rem)',
                minWidth: 'calc(100vw - 2rem)',
                maxWidth: 'calc(50vw - 1.5rem)',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/New headshot 1.png" alt="Michael Delaney" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">Michael Delaney</p>
                    <p className="text-xs text-gray-500">Trust & Estate Lawyer</p>
                  </div>
                </div>
                <p className="text-foreground text-sm leading-relaxed">"This is what's going to set me apart from everyone else moving forward. I can deliver the best of both worlds: a simple, streamlined process backed by professional expertise."</p>
              </div>
            </div>
          </div>
          
          {/* Desktop: Grid layout - 2 wide cards (visible at md breakpoint and above) */}
          <div className="hidden md:grid grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Review cards */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/New headshot 2.png" alt="Sarah Johnson" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Estate Planning Attorney</p>
                </div>
              </div>
              <p className="text-foreground text-base leading-relaxed">"This is something the industry has needed for a while. It's exciting to see a team dedicated to building a modern estate planning solution that respects and enhances the work and expertise of lawyers."</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/New headshot 1.png" alt="Michael Chen" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Michael Chen</p>
                  <p className="text-xs text-gray-500">Trust & Estate Lawyer</p>
                </div>
              </div>
              <p className="text-foreground text-base leading-relaxed">"This is what's going to set me apart from everyone else moving forward. I can deliver the best of both worlds: a simple, streamlined process backed by professional expertise."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feature Sections */}
      <section className="bg-background">
        {/* Feature 1 */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pl-4 md:pl-8 lg:pl-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Keep the signing <span className="text-[#138F8B]">simple</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Finally — a platform that actually allows me to sign a will compliantly with my own state's laws.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pr-8 lg:pr-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative">
                  <img 
                    src="/lovable-uploads/Signing Screen Product Shot.png" 
                    alt="Willow digital signing and notarization" 
                    className="w-full h-full object-cover object-center"
                    style={{
                      transform: 'scale(1.02)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row-reverse">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pr-4 md:pr-8 lg:pr-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  <span className="text-[#138F8B]">Share access</span> with family
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Forget about safes - We'll make sure everything is secure and easily accessible for authorized family members.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pl-8 lg:pl-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative">
                  <img 
                    src="/lovable-uploads/Family Access Product Shot.png" 
                    alt="Willow safe storage with family access" 
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: 'center top',
                      transform: 'scale(1.15)',
                      transformOrigin: 'center top'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pl-4 md:pl-8 lg:pl-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  <span className="text-[#138F8B]">Summarize</span> everything
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Keep everything simple for your clients with clear document summaries.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pr-8 lg:pr-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative">
                  <img 
                    src="/lovable-uploads/Summary Poduct Shot.png" 
                    alt="Willow summary of plans" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row-reverse">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pr-4 md:pr-8 lg:pr-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Build <span className="text-[#138F8B]">lifetime relationships</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  As life moves forward, we'll suggest updates and make it simple for your clients to schedule their next conversation.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pl-8 lg:pl-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative">
                  <img 
                    src="/lovable-uploads/Update Notification Product Shot.png" 
                    alt="Willow dashboard showing proactive notification modal" 
                    className="w-full h-full object-cover object-center"
                    style={{
                      transform: 'scale(1.7)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pl-4 md:pl-8 lg:pl-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Connect to <span className="text-[#138F8B]">more leads</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  When another in their family is ready to get their plans in order, you'll be the first we recommend.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pr-8 lg:pr-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative">
                  <img 
                    src="/Product shot 5.png" 
                    alt="Connect to more leads product shot" 
                    className="w-full h-full object-cover"
                    style={{
                      transform: 'scale(1.3)',
                      transformOrigin: 'center top',
                      objectPosition: 'center top'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#138F8B' }}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-4xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-center mb-12 text-white">
            Common Questions
          </h2>
          
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                  How does Willow integrate with my existing practice?
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                  <p className="mb-4">Willow is designed to layer seamlessly into your existing workflow.</p>
                  <p className="mb-4">You remain the attorney of record and continue advising, drafting, and reviewing documents as you do today. Willow enhances the client experience by providing compliant electronic execution, secure long-term storage, simple document summaries, and controlled access for authorized family members.</p>
                  <p className="mb-4">When a client's situation changes—or when another family member needs a will—Willow routes them back to the attorney who already knows their family.</p>
                  <p>Clients can book time directly through your connected calendar, and both you and the client receive reminders along with a clear summary of relevant background and documents ahead of the conversation.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                  Is this compliant with state bar regulations?
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                  <p className="mb-4">Yes.</p>
                  <p>Willow operates only in states where electronic wills are legally recognized, and all execution and storage workflows are designed to align with applicable state law. Willow does not provide legal advice or independently draft legal language. Attorneys retain full control over document content, legal judgment, and client relationships.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                  How does this help me grow my practice?
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                  <p className="mb-4">Willow helps firms grow by making it easier to maintain long-term client relationships.</p>
                  <p>When documents are easy to understand, accessible to family, and monitored for updates, clients are more likely to keep plans up to date, return for future work, and refer family members.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                  What kind of support do you provide?
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                  <p className="mb-4">We provide ongoing support for both firms and their clients.</p>
                  <p>Our team helps onboard your firm, ensures the platform fits your workflow, and remains available as you use Willow. We also support clients with platform-related questions such as access, navigation, and document sharing, so you can spend time on what you do best.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b-0">
                <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                  How can I get started?
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                  <p className="mb-4">It starts with a short conversation.</p>
                  <p className="mb-4">We take time to understand your practice and jurisdiction to ensure your firm is a good fit. From there, we guide you through a brief onboarding call, walk through the platform, and answer any questions before you begin using Willow with clients.</p>
                  <p className="mb-6">No process overhaul—just a better way to deliver what you already do.</p>
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="willow-btn px-8 py-6 text-lg font-semibold"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Let's Get Started
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* First Five Clients CTA Section */}
      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-8 text-[#222222]">
                Your <span className="text-[#138F8B]">First Five Clients</span>, Covered
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience how Willow supports your client experience today<br />- and helps you build lasting relationships over time.
              </p>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="willow-btn px-10 py-7 text-lg md:text-xl font-medium"
                onClick={() => window.open('https://calendly.com/aaronburlacoff-willow-inc/willow-lets-get-your-will-checked-off', '_blank')}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow">
      </main>
      <Footer />
    </div>
  );
};

export default ForLawyers;

