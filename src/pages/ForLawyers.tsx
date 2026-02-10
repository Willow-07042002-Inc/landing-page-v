import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<'practice' | 'compliance'>('practice');
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const practiceButtonRef = useRef<HTMLButtonElement | null>(null);
  const complianceButtonRef = useRef<HTMLButtonElement | null>(null);

  // This is now the homepage (/).

  // Reset accordion when topic changes
  useEffect(() => {
    setAccordionValue([]);
  }, [selectedTopic]);

  // Update indicator position and width
  useEffect(() => {
    const updateIndicator = () => {
      const selectedButton = selectedTopic === 'practice' ? practiceButtonRef.current : complianceButtonRef.current;
      const otherButton = selectedTopic === 'practice' ? complianceButtonRef.current : practiceButtonRef.current;
      
      if (selectedButton && otherButton) {
        const container = selectedButton.parentElement;
        if (container) {
          let left = 0;
          if (selectedTopic === 'compliance' && practiceButtonRef.current) {
            left = practiceButtonRef.current.offsetWidth;
          }
          setIndicatorStyle({
            left: left,
            width: selectedButton.offsetWidth
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selectedTopic]);

  // FAQ questions organized by topic
  const faqQuestions = [
    // Practice questions
    {
      id: 'practice-1',
      topic: 'practice' as const,
      question: "How can I get started?",
      answer: (
        <>
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
        </>
      )
    },
    {
      id: 'practice-2',
      topic: 'practice' as const,
      question: "Does Willow help create estate planning documents?",
      answer: (
        <>
          <p className="mb-4">You remain fully responsible for advising clients and drafting estate planning documents.</p>
          <p>Willow does not provide legal advice. Instead, we support the execution, storage, and long-term management of the documents you prepare—allowing you to focus your time on what you do best while we help elevate the client experience.</p>
        </>
      )
    },
    {
      id: 'practice-3',
      topic: 'practice' as const,
      question: "How does the signing ceremony work, and can I tailor it to my practice?",
      answer: (
        <>
          <p className="mb-4">Willow supports attorney-led digital execution that aligns with state requirements around witnessing, recordings, and notarization. You remain in control of the ceremony and can pause at any time or build in breaks to review materials with your client.</p>
          <p className="mb-4">For practices that prefer a more tailored approach, we can support custom execution flows built around existing regulations. To get started, simply book a demo with us. From there, we can discuss your current format and how best to build a signing experience that fits your style.</p>
          <p>Our goal is to make digital execution compliant and reliable—without forcing you into a one-size-fits-all format.</p>
        </>
      )
    },
    {
      id: 'practice-4',
      topic: 'practice' as const,
      question: "Can clients access their documents independently?",
      answer: (
        <>
          <p className="mb-4">Yes.</p>
          <p>Clients can securely access their documents through their account at any time.</p>
        </>
      )
    },
    {
      id: 'practice-5',
      topic: 'practice' as const,
      question: "Who else can access documents—only authorized individuals or the entire family?",
      answer: (
        <>
          <p className="mb-4">Access is fully controlled by the client.</p>
          <p>Only individuals the client explicitly authorizes—such as family members, executors, or fiduciaries—can view documents through their own secure accounts, each tied to the email address used to share access.</p>
          <p>Permissions can be granted or revoked at any time, ensuring access remains intentional and appropriate.</p>
        </>
      )
    },
    {
      id: 'practice-6',
      topic: 'practice' as const,
      question: "How does Willow support revisiting plans over time?",
      answer: (
        <>
          <p className="mb-4">As life moves forward, Willow helps surface natural moments when an update may be needed.</p>
          <p className="mb-4">For example, if a client has shared their will with a guardian who later moves to another state, Willow can bring that change to the attention of both the client and their lawyer—if the client has approved notifications being shared with their attorney.</p>
          <p className="mb-4">When a client is ready to revisit their decisions, Willow routes them back to their attorney.</p>
          <p>Clients can book time directly through your connected calendar, and both you and the client receive reminders along with a clear summary of relevant background and documents ahead of the conversation.</p>
        </>
      )
    },
    {
      id: 'practice-7',
      topic: 'practice' as const,
      question: "How does Willow support referrals through existing client relationships?",
      answer: (
        <>
          <p>When estate plans are shared with family members, Willow asks whether that family member has plans of their own.</p>
          <p>If they do need a plan, Willow guides them back to the lawyer who already knows their family.</p>
        </>
      )
    },
    {
      id: 'practice-8',
      topic: 'practice' as const,
      question: "What kind of support does Willow provide?",
      answer: (
        <>
          <p className="mb-4">We provide ongoing support for both firms and their clients.</p>
          <p>Our team helps onboard your firm, ensures the platform fits your workflow, and remains available as you use Willow. We also support clients with platform-related questions such as access, navigation, and document sharing—so you can spend time on what you do best.</p>
        </>
      )
    },
    // Compliance questions
    {
      id: 'compliance-1',
      topic: 'compliance' as const,
      question: "Are there estate planning lawyers on the Willow team?",
      answer: (
        <>
          <p className="mb-4">Yes.</p>
          <p>Our team includes estate planning attorneys with over 35 years of combined experience.</p>
          <p>They help shape our workflows, compliance standards, and long-term storage practices to ensure the platform aligns with how estate planning is practiced in the real world. Willow does not provide legal advice, and you remain the attorney of record.</p>
        </>
      )
    },
    {
      id: 'compliance-2',
      topic: 'compliance' as const,
      question: "Is Willow compliant with applicable state laws?",
      answer: (
        <>
          <p className="mb-4">Yes.</p>
          <p>Willow operates only in states where electronic wills are legally recognized, and all execution and storage workflows are designed to align with applicable state law.</p>
          <p>Willow operates only in states where electronic wills are legally recognized, and all execution and storage workflows are designed to align with applicable state law.</p>
        </>
      )
    },
    {
      id: 'compliance-3',
      topic: 'compliance' as const,
      question: "How are documents and recordings stored long term?",
      answer: (
        <>
          <p>Our storage is designed for long-term reliability, ensuring signed documents and required supporting materials are securely preserved over time.</p>
        </>
      )
    },
    {
      id: 'compliance-4',
      topic: 'compliance' as const,
      question: "What happens if Willow is no longer operating?",
      answer: (
        <>
          <p className="mb-4">Like any law practice planning for continuity, Willow maintains a formal succession plan in the unlikely event we no longer offer our services.</p>
          <p className="mb-4">In that situation, custodianship of each will and its associated records would be transferred in accordance with applicable state standards.</p>
          <p>Ultimately, the decision regarding who a will is transferred to remains with the client.</p>
          <p>Willow ensures clients are provided with clear options and information about the process so they can make an informed decision.</p>
        </>
      )
    }
  ];

  // Filter questions based on selected topic
  const filteredQuestions = faqQuestions.filter(q => q.topic === selectedTopic);

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
      `}</style>
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen w-full relative overflow-hidden bg-[#F8FAFC] pt-[env(safe-area-inset-top)]">
        <div className="relative z-20 w-full min-h-screen flex flex-col justify-start items-center">
          <div className="container mx-auto px-4 pt-32 md:pt-40">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-fade-in md:lg:mb-40">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-6xl mb-4 font-heading font-light text-[#222222]" style={{ lineHeight: '1.3' }}>
                  The <span className="text-[#138F8B]">digital</span> platform<br />built for estate planning
                </h1>
                <p className="text-base sm:text-lg md:text-2xl lg:text-2xl text-muted-foreground mb-6 md:mb-8" style={{ lineHeight: '1.35' }}>
                  Keep everything safe online, accessible to family,<br />easy to understand, and up to date.
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
                    Request Access
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
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none computer-center-hero flex items-end justify-center">
          <img 
            src="/Legal Hero Computer.png"
            alt="Computer"
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

      {/* Quote Section (from Pilot page) */}
      <section className="bg-gray-100 py-28 px-6 md:py-32 md:px-10 lg:py-40 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <blockquote className="text-center text-xl md:text-2xl lg:text-3xl text-gray-700 italic leading-relaxed">
            "Together, we're responsibly shaping how digital signatures are used in estate planning to create simpler, stress-free processes for families. Our approach removes unnecessary friction while maintaining the care, judgment, and standards your clients depend on."
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-8 md:mt-10">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              <img
                src="/Burlacoff Headshot.svg"
                alt="Aaron Burlacoff"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 25%', transform: 'scale(1.7)', transformOrigin: 'center center' }}
              />
            </div>
            <p className="text-lg md:text-xl text-gray-600">
              Aaron Burlacoff, Founder & CEO, Willow
            </p>
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Lead execution <span className="text-[#138F8B]">from anywhere</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Lead digital execution in line with state requirements—without changing how you practice.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pr-8 lg:pr-12 flex justify-center md:block">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-xl border border-gray-300 relative bg-gray-50">
                  <img 
                    src="/lovable-uploads/Signing Product Shot.png" 
                    alt="Willow digital signing and notarization" 
                    className="w-full h-full object-contain object-center"
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  <span className="text-[#138F8B]">Summarize</span> everything
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  We'll summarize your clients' estate plans so they have a clear understanding of their documents.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pl-8 lg:pl-12 flex justify-center md:block">
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

        {/* Feature 3 */}
        <div className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pl-4 md:pl-8 lg:pl-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Keep it accessible <span className="text-[#138F8B]">for family</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Forget about safes - securely grant and revoke online access for authorized family members and fiduciaries.
                </p>
              </div>
              
              {/* Product Shot Frame */}
              <div className="w-full md:w-1/2 group md:pr-8 lg:pr-12 flex justify-center md:block">
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

        {/* Feature 4 */}
        <div className="bg-gray-100 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 items-center md:flex-row-reverse">
              {/* Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 pr-4 md:pr-8 lg:pr-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                  Build <span className="text-[#138F8B]">lifetime relationships</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  As life moves forward, we'll point out when it may be a good time to revisit their decisions—and make it simple for clients to schedule their next conversation.
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
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

      {/* Reviews Section */}
      <section className="pt-20 md:pt-28 lg:pt-32 pb-28 md:pb-36 lg:pb-40 bg-background -mt-1">
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
                  <img src="/New headshot 2.png" alt="Katherine Rosenberg" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">Katherine Rosenberg</p>
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
                  <img src="/New headshot 1.png" alt="David Castellano" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm text-gray-900">David Castellano</p>
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
                <img src="/New headshot 2.png" alt="Katherine Rosenberg" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-gray-900">Katherine Rosenberg</p>
                  <p className="text-xs text-gray-500">Estate Planning Attorney</p>
                </div>
              </div>
              <p className="text-foreground text-base leading-relaxed">"This is something the industry has needed for a while. It's exciting to see a team dedicated to building a modern estate planning solution that respects and enhances the work and expertise of lawyers."</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/New headshot 1.png" alt="David Castellano" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-gray-900">David Castellano</p>
                  <p className="text-xs text-gray-500">Trust & Estate Lawyer</p>
                </div>
              </div>
              <p className="text-foreground text-base leading-relaxed">"This is what's going to set me apart from everyone else moving forward. I can deliver the best of both worlds: a simple, streamlined process backed by professional expertise."</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#138F8B' }}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-4xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-center mb-8 text-white">
            Common Questions
          </h2>
          
          {/* Topic Toggle Slider */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 inline-flex">
              <div className="flex relative">
                {/* Slider Background */}
                <div 
                  className="absolute top-0 bottom-0 bg-[#138F8B] rounded-lg transition-all duration-300 ease-in-out"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`
                  }}
                />
                {/* Practice Button */}
                <button
                  ref={practiceButtonRef}
                  onClick={() => setSelectedTopic('practice')}
                  className={`py-2 px-6 rounded-lg font-medium text-base md:text-lg transition-colors duration-300 relative z-10 whitespace-nowrap ${
                    selectedTopic === 'practice' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Your Practice
                </button>
                {/* Compliance Button */}
                <button
                  ref={complianceButtonRef}
                  onClick={() => setSelectedTopic('compliance')}
                  className={`py-2 px-6 rounded-lg font-medium text-base md:text-lg transition-colors duration-300 relative z-10 whitespace-nowrap ${
                    selectedTopic === 'compliance' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Compliance
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            <Accordion type="multiple" className="w-full" value={accordionValue} onValueChange={setAccordionValue}>
              {filteredQuestions.map((faq, index) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id} 
                  className={index === filteredQuestions.length - 1 ? 'border-b-0' : 'border-b border-gray-200'}
                >
                  <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-4 hover:no-underline text-[#222222]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:text-lg leading-relaxed text-gray-700 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* First Five Clients CTA Section */}
      <section className="bg-white pt-20 md:pt-28 lg:pt-32 pb-28 md:pb-36 lg:pb-40">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-8 text-[#222222]">
                Your <span className="text-[#138F8B]">First Five Clients</span>, Covered
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience how Willow supports your client experience today<br />- and helps you build lasting relationships over time.
              </p>
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                className="willow-btn px-10 py-7 text-lg md:text-xl font-medium"
                onClick={() => navigate('/request-access')}
              >
                Request Access
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

