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
    <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
      <div className={`flex flex-col gap-6 md:gap-8 lg:gap-12 items-center ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Content */}
        <div className={`w-full md:w-1/2 flex flex-col items-start gap-4 md:gap-6 ${isReversed ? 'pr-4 md:pr-8 lg:pr-12' : 'pl-4 md:pl-8 lg:pl-12'}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold" style={{ lineHeight: '1.2' }}>
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
                  </>
                )}
              </React.Fragment>
            ))}
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed -mt-2 md:-mt-3">
            {descriptionParts.map((part, index) => (
              <React.Fragment key={index}>
                {part.text.includes('Hassle-free') ? (
                  <>
                    {part.text.split('Hassle-free')[0]}
                    <span className="whitespace-nowrap">Hassle-free</span>
                    {part.text.split('Hassle-free')[1]}
                  </>
                ) : (
                  part.text
                )}
                {part.lineBreak && (
                  <br />
                )}
              </React.Fragment>
            ))}
          </p>
          
          <a href="https://app.willow-inc.com/" >
              <button 
              className="text-base md:text-lg lg:text-xl xl:text-2xl px-8 md:px-12 lg:px-16 py-2 md:py-2.5 lg:py-3 bg-[#138F8B] hover:bg-[#37978E] text-white rounded-md font-medium transition-colors" 
            >
              {buttonText}
            </button>
          </a>
        </div>
        
        {/* Illustration with clipping effect and hover animation */}
        <div className="w-full md:w-1/2 group">
          <div className="overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative transition-transform duration-500 ">
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
        { text: "Sign ", highlighted: true },
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
        { text: "Covered", highlighted: true }
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
        <div key={index} className={`pt-12 md:pt-6 ${index === 1 ? "bg-gray-100" : ""} pb-0`}>
          <FeatureSection
            {...feature}
          />
        </div>
      ))}
    </section>
  );
};

export default FeatureSections;
