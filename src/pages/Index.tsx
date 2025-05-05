import React from "react";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Reviews from "@/components/Reviews";
import WillowPricing from "@/components/WillowPricing";
import Footer from "@/components/Footer";
import Partners from "@/components/partners";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <Reviews />
        <FeaturesSection />
        {/*<Partners />*/}
        <WillowPricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
