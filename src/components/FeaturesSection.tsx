"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { scrollToPricing } from '@/lib/utils';

const FeatureSection = ({ 
  titleParts, 
  descriptionParts, 
  buttonText, 
  illustrationNumber,
  isReversed = false
}) => {
  return (
    <div className="container mx-auto px-12 ">
      <div className={`flex flex-col gap-8 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-6">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {titleParts.map((part, index) => (
              <React.Fragment key={index}>
                {part.highlighted ? (
                  <span className="text-[#138F8B] hover:text-[#37978E] dark:text-[#17C0A9]">{part.text}</span>
                ) : (
                  <span>{part.text}</span>
                )}
                {part.lineBreak && (
                  <>
                    <br />
                    <div className="mb-8"></div>
                  </>
                )}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
            {descriptionParts.map((part, index) => (
              <React.Fragment key={index}>
                {part.text}
                {part.lineBreak && (
                  <>
                    <br />
                    <div className="mb-8"></div>
                  </>
                )}
              </React.Fragment>
            ))}
          </p>
          
          <a href="https://willow-test-deploy.vercel.app/" >
              <button 
              className="text-2xl px-16 py-3 bg-[#138F8B] hover:bg-[#37978E] text-white rounded-md font-medium transition-colors" 
            >
              {buttonText}
            </button>
          </a>
        </div>
        
        {/* Illustration with clipping effect and hover animation */}
        <div className="w-full md:w-2/5 group">
          <div className="overflow-hidden h-[600px] relative transition-transform duration-500 group-hover:rotate-3">
            <div className="absolute inset-0 -bottom-1/4">
              <img 
                src={`/illustration-${illustrationNumber}.png`}
                alt={`Feature illustration ${illustrationNumber}`}
                className="w-full h-[calc(100%+25%)] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureSections = () => {
  const features = [
    {
      titleParts: [
        { text: "Create and ", highlighted: true },
        { text: "Sign ", highlighted: true, lineBreak: true },
        { text: "Your Will, ", highlighted: false },
        { text: "Fast", highlighted: true },
      ],
      descriptionParts: [
        { text: "Ten clicks. No printer. Hassle-free.", lineBreak: true },
      ],
      buttonText: "Make my will",
      illustrationNumber: 1,
      isReversed: false
    },
    {
      titleParts: [
        { text: "Simple, ", highlighted: false },
        { text: "Secure", highlighted: false, lineBreak: true },
        { text: "Family Access", highlighted: true }
      ],
      descriptionParts: [
        { text: "Ditch the kitchen drawer.", lineBreak: true },
        { text: "Grant seamless, online access." }
      ],
      buttonText: "Make my will",
      illustrationNumber: 2,
      isReversed: true
    },
    {
      titleParts: [
        { text: "Updates?", highlighted: true, lineBreak: true },
        { text: "We got you ", highlighted: false, lineBreak: true },
        { text: "covered", highlighted: true }
      ],
      descriptionParts: [
        { text: "Another child? Or a new home?", lineBreak: true },
        { text: "Enjoy life's next chapter— let us handle it.", },
      ],
      buttonText: "Make my will",
      illustrationNumber: 3,
      isReversed: false
    }
  ];

  return (
    <section className="bg-background">
      {features.map((feature, index) => (
        <div key={index} className={`${index === 0 ? "pt-0" : ""} ${index === 1 ? "bg-gray-100" : ""}`}>
          <FeatureSection
            {...feature}
          />
        </div>
      ))}
    </section>
  );
};

export default FeatureSections;